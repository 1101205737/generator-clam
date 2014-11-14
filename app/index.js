// 'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var clamUtil = require('clam-util');
var ClamLogo = require('./logo').ClamLogo;
var ABC = require('abc-generator');
var crypto = require('crypto');
var md5 = crypto.createHash('md5');
var gitConfig = require('git-config'),
	curGitUser = gitConfig.sync().user,
	curUserName = curGitUser.name,
	curUserEmail = curGitUser.email;

var ClamGenerator = module.exports = function ClamGenerator(args, options, config) {
	ABC.UIBase.apply(this, arguments);
	this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

	this.on('error', function () {
	});
	this.on('end', function () {
		var cb = this.async();
		var that = this;
		this.prompt([
			{
				name   : 'npm_install',
				message: 'Install node_modules for grunt now?',
				default: 'N/y',
				warning: ''
			}
		], function (err, props) {

			if (err) {
				return this.emit('error', err);
			}

			this.npm_install = (/^y/i).test(props.npm_install);
			if (this.npm_install) {
				this.npmInstall('', {}, function (err) {

					if (err) {
						return console.log('\n' + yellow('please run "sudo npm install"\n'));
					}

					console.log(green('\n\nnpm was installed successful. \n\n'));
				});
			} else {
				console.log(yellow('\n\nplease run "npm install" or "tnpm install" before grunt\n'));
				console.log(green('\ndone!\n'));
			}
		}.bind(this));


	}.bind(this));
};

util.inherits(ClamGenerator, ABC.UIBase);

ClamGenerator.prototype.askFor = function askFor() {
	var cb = this.async();

	// welcome message
	console.log(ClamLogo(this));

	var abcJSON = {};
	try {
		abcJSON = require(path.resolve(process.cwd(), 'abc.json'));
	} catch (e) {

	}
	if (!abcJSON.author) {
		abcJSON.author = {
			name : '',
			email: ''
		}
	}
	if (!abcJSON.name) {
		abcJSON.name = 'tmp';
	}

	// have Yeoman greet the user.
	// console.log(this.yeoman);
	var folderName = path.basename(process.cwd());

	// your-mojo-name => YourMojoName
	function parseMojoName(name) {
		return name.replace(/\b(\w)|(-\w)/g, function (m) {
			return m.toUpperCase().replace('-', '');
		});
	}

	var prompts = [
		{
			name   : 'projectName',
			message: 'Name of Project?',
			default: folderName,
			warning: ''
		},
		{
			name   : 'projectDesc',
			message: 'Description of Project?',
			default: folderName,
			warning: ''
		},
		{
			name   : 'isH5',
			message: 'is A H5 Project?',
			default: 'Y/n',
			warning: ''
		},
		{
			name   : 'srcDir',
			message: 'create "src" directory?',
			default: 'Y/n',
			warning: ''
		},
		{
			name   : 'author',
			message: 'Author Name(花名):',
			default: abcJSON.author.name || curUserName,
			warning: ''
		},
		{
			name   : 'email',
			message: 'Author Email:',
			default: abcJSON.author.email || curUserEmail,
			warning: ''
		},
		{
			name   : 'groupName',
			message: 'Group Name:',
			default: 'trip',
			warning: ''
		},
		{
			name   : 'port',
			message: 'FlexCombo Server Port:',
			default: '8081',
			warning: ''
		},
		{
			name   : 'proxyPort',
			message: 'HTTP Proxy Server Port:',
			default: '8080',
			warning: ''
		},
		{
			name   : 'cssCompile',
			message: 'scss/less?',
			default: 'scss',
			warning: ''
		},
		{
			name   : 'version',
			message: 'Version:',
			default: '0.1.0',
			warning: ''
		},
		{
			name   : 'aplipayAppid',
			message: 'Alipay Appid:',
			default: '',
			warning: ''
		}
	];

	/*
	 * projectName：驼峰名称,比如 ProjectName
	 * packageName：原目录名称，比如 project-name
	 **/
	this.prompt(prompts, function (err, props) {
		if (err) {
			return this.emit('error', err);
		}

		this.packageName = props.projectName;// project-name
		this.dirName = clamUtil.awppDirName(props.projectName);
		md5.update(this.packageName);
		this.packageNameMd5 = md5.digest('hex');;
		this.projectName = parseMojoName(this.packageName); //ProjectName
		this.packageDesc = props.packageDesc;
		this.author = props.author;
		this.email = props.email;
		this.isH5 = (/^y/i).test(props.isH5) ? 'true':'false';
		this.port = props.port;
		this.proxyPort = props.proxyPort;
		this.version = props.version;
		this.groupName = props.groupName;
		//this.config = 'http://g.tbcdn.cn/'+this.groupName+'/'+this.packageName+'/'+this.version+'/config.js';
		this.srcDir = (/^y/i).test(props.srcDir);
		this.cssCompile = (props.cssCompile === 'less')? 'less':'scss';
		this.combohtml = true;
		this.srcPath = '../';
		this.currentBranch = 'master';

		// alipay config
		this.aplipayAppid = props.aplipayAppid;
		this.aplipayVersion = props.version;

		if (this.srcDir) {
			this.prompt([
				{
					name   : 'modsPagesWidgets',
					message: 'Create "src/mods[widgets|pages]"?',
					default: 'Y/n',
					warning: ''
				}
			], function (err, props) {

				if (err) {
					return this.emit('error', err);
				}

				this.modsPagesWidgets = (/^y/i).test(props.modsPagesWidgets);
				if (this.modsPagesWidgets) {
					this.srcPath = '../../';
				}
				cb();
			}.bind(this));
		} else {
			cb();
		}

	}.bind(this));
};

ClamGenerator.prototype.gruntfile = function gruntfile() {
	if (this.srcDir) {
		this.copy('Gruntfile_src.js', 'Gruntfile.js');
	} else {
		this.copy('Gruntfile.js');
	}
};

ClamGenerator.prototype.packageJSON = function packageJSON() {
	this.template('_package.json', 'package.json');
};

ClamGenerator.prototype.git = function git() {
	this.copy('_gitignore', '.gitignore');
};

ClamGenerator.prototype.app = function app() {
	var that = this;
	if (this.srcDir) {
		this.mkdir('src');
		if (this.modsPagesWidgets) {
			that.mkdir('src/pages');
			that.mkdir('src/mods');
			that.mkdir('src/widgets');
		}
		this.template('config.js', 'src/config.js');
		this.template('map.js', 'src/map.js');
	} else {
		/*
		 this.template('index.js');
		 this.template('index.css');
		 this.template('index.html');
		 */
		this.template('config.js');
	}
	this.template('README.md');
	this.template('make.sh');
	this.template('hpmfile.json');
	this.mkdir('doc');
	this.mkdir('build');

	// proxy template
	this.mkdir('proxy');
	this.template('proxy/interface.js', 'proxy/interface.js');
	this.template('proxy/webpage.js', 'proxy/webpage.js');

	this.template('abc.json');
	this.copy('bowerrc', '.bowerrc');
	this.copy('htmlhintrc', '.htmlhintrc');
};

function consoleColor(str, num) {
	if (!num) {
		num = '32';
	}
	return "\033[" + num + "m" + str + "\033[0m"
}

function green(str) {
	return consoleColor(str, 32);
}

function yellow(str) {
	return consoleColor(str, 33);
}

function red(str) {
	return consoleColor(str, 31);
}

function blue(str) {
	return consoleColor(str, 34);
}
