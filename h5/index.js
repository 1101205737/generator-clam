// 'use strict';
var util = require('util');
var path = require('path');
var ClamLogo = require('../app/logo').ClamLogo;
var yeoman = require('yeoman-generator');
var ABC = require('abc-generator');
var exec = require('child_process').exec;
var	rmdir = require('rmdir');
var gitConfig = require('git-config'),
	curGitUser = gitConfig.sync().user,
	curUserName = curGitUser.name,
	curUserEmail = curGitUser.email;

var AppGenerator = module.exports = function AppGenerator(args, options, config) {
	// yeoman.generators.Base.apply(this, arguments);
	ABC.UIBase.apply(this, arguments);
	this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

    this.on('end', function () {
		console.log(green('done!'));
    }.bind(this));

};

util.inherits(AppGenerator, ABC.UIBase);

AppGenerator.prototype.askFor = function askFor() {
	var cb = this.async();
	
	var modsPagesWidgets = false;

	try {
		abcJSON = require(path.resolve(process.cwd(), 'abc.json'));
	} catch (e) {
		console.log('abc.json not found');
		try {
			abcJSON = require(path.resolve(process.cwd(),'..', 'abc.json'));
		} catch(e){
			try {
				abcJSON = require(path.resolve(process.cwd(),'../../', 'abc.json'));
				modsPagesWidgets = path.basename(process.cwd());
			} catch(e){
				console.log('do nothing!');
				process.exit();
			}
		}
	}

    if (!abcJSON.author) {
        abcJSON.author = {
            name: '',
            email: ''
        }
    }

	if(!abcJSON.name){
		abcJSON.name = 'tmp';
	}

	if(!abcJSON.group){
		abcJSON.group = 'groupName';
	}

	if(!abcJSON.combohtml){
		abcJSON.combohtml = 'false';
	}

	if(!abcJSON.cssCompile){
		abcJSON.cssCompile = 'less';
	}

	this.modsPagesWidgets = modsPagesWidgets;
	this.projectName = abcJSON.name;
	this.combohtml = abcJSON.combohtml;
	this.cssCompile = abcJSON.cssCompile;
	this.fullfill = false;
	this.author = curUserName;
	this.email = curUserEmail;

    // welcome message
	console.log(ClamLogo(this));
	console.log('建议您在 src/pages 目录执行该命令！');

	var prompts = [{
			name: 'mojoName',
			message: 'Name of Page?',
			default: 'your-page-name',
			waring:''
		},
		{
			name: 'fullfill',
			message: 'add Base CSS & JS?',
			default: 'Y/n',
			waring:''

		}
	];

	// your-mojo-name => YourMojoName
	function parseName(name){
		return name.replace(/\b(\w)|(-\w)/g,function(m){
			return m.toUpperCase().replace('-','');
		});
	}

    this.prompt(prompts, function (err, props) {
        if (err) {
            return this.emit('error', err);
        }

		var _tname = props.mojoName;
		this.mojoName = this.modsPagesWidgets? this.modsPagesWidgets + '/' + props.mojoName : props.mojoName;// your-mod-name
		this.modName = parseName(_tname).replace(/^(~|-)/,'');//YourModName
		this.packageName = abcJSON.name;// package-name
		this.cssCompile = abcJSON.cssCompile;
        this.groupName = abcJSON.group;
		this.fullfill = (/^y/i).test(props.fullfill);
		//this.config = abcJSON.config;
		this.config = 'http://g.tbcdn.cn/'+this.groupName+'/'+this.packageName+'/'+abcJSON.version+'/config.js';
		this.projectName = parseName(this.packageName); //PackageName
		this.srcPath = this.modsPagesWidgets? '../../' : '../';

		if(this.fullfill){
			fullfill();
		}

        cb();
    }.bind(this));
};

AppGenerator.prototype.files = function files(){
	// 如果有mods/widgets/pages，就把前缀替换回来
	var mojoName = this.modsPagesWidgets? this.mojoName.replace(/^([^\/]+)\//i,'') : this.mojoName;
	this.mkdir(mojoName);
	this.mkdir(mojoName+'/img');
	var appendix = (this.combohtml === 'true'? '.html' : '.html');
	if(this.fullfill){
		this.template('index_fullfill.htm',mojoName + '/index'+appendix);
	} else {
		this.template('index.htm',mojoName + '/index'+appendix);
	}
    this.template('index.js',mojoName+'/index.js');
    this.template('mock.tms.htm',mojoName+'/mock.tms.html');
    this.template('index.less',mojoName+'/index.'+this.cssCompile);
};

// TODO
function fullfill(){
	var wp = path.resolve(process.cwd(), '../widgets/');
	var kp = path.resolve(process.cwd(), '../');
	setTimeout(function(){
		console.log('\n正在安装依赖资源文件, 稍等...');
	},500);
	exec('cd ' + wp + ';bower install mpi/base;bower install mpi/mpi_css;',
		function(err,stdout,stderr,cb){
			showLog(err,stdout,stderr,cb);
		});
}

function showLog(err,stdout,stderr,cb){
	if (err) {
		console.log(red(err));
		console.log(yellow('bower install failed!'));
	} else {
		console.log(stdout);
		console.log(green('done!'));
	}
}

function consoleColor(str,num){
	if (!num) {
		num = '32';
	}
	return "\033[" + num +"m" + str + "\033[0m"
}

function green(str){
	return consoleColor(str,32);
}

function yellow(str){
	return consoleColor(str,33);
}

function red(str){
	return consoleColor(str,31);
}

function blue(str){
	return consoleColor(str,34);
}
