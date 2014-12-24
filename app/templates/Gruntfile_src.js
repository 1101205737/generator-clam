/**
 * 本文件是 Gruntfile.js 默认模板，请根据需要和注释提示自行修改
 * 从这里获得最新版
 * https://github.com/jayli/generator-clam/blob/master/app/templates/Gruntfile_src.js
 * 文档地址:
 * http://cnpmjs.org/package/generator-clam
 */
var path = require('path'),
  clamUtil = require('clam-util'),
  fs = require('fs'),
  GRUNT_TASK_DIR = 'grunt',
  exec = require('child_process').exec;

/**
 * 从 grunt/*.js 中加载各个 grunt 任务配置
 * @param abcConfig {Object} abc.json 配置
 * @returns {Object}
 */
function loadGruntConfig (abcConfig) {
  var retObj = {};
  fs.readdirSync(GRUNT_TASK_DIR).forEach(function (taskConfigFile){
    var taskName = taskConfigFile.split('.')[0];
    var taskExport = require('./' + path.join(GRUNT_TASK_DIR, taskConfigFile));
    retObj[taskName] = (typeof taskExport == 'function') ? taskExport(abcConfig) : taskExport;
  });
  return retObj;
}

module.exports = function (grunt) {
  require('time-grunt')(grunt);

  // -------------------------------------------------------------
  // 智能载入模块
  // https://github.com/shootaroo/jit-grunt
  // -------------------------------------------------------------
  require('jit-grunt')(grunt);

  var task = grunt.task;

  // -------------------------------------------------------------
  // 任务配置
  // -------------------------------------------------------------

  // 如果 Gruntfile.js 编码为 gbk，打开此注释
  // grunt.file.defaultEncoding = 'gbk';

  var abcConfig = require('./abc.json');
  var isH5 = abcConfig.isH5;
  var gruntConfig = loadGruntConfig(abcConfig);
  gruntConfig.abcpkg = abcConfig;
  gruntConfig.currentBranch = 'master';

  grunt.initConfig(gruntConfig);

  // -------------------------------------------------------------
  // 注册Grunt子命令
  // -------------------------------------------------------------

  // 预发布
  grunt.registerTask('prepub', 'clam pre publish...', function (msg) {
    var done = this.async();
    clamUtil.getBranchVersion(function (version) {
      grunt.log.write(('当前分支：' + version).green);
      grunt.config.set('currentBranch', version);
      task.run(['exec_build']);
      // 预发替换到 daily
      task.run(['replace:daily']);
      task.run(['exec:add', 'exec:commit:' + msg]);
      task.run(['exec:prepub']);
      done();
    });
  });

  // 正式发布
  grunt.registerTask('publish', 'clam 正式发布', function (msg) {
    var done = this.async();
    clamUtil.getBranchVersion(function (version) {
      grunt.log.write(('当前分支：' + version).green);
      grunt.config.set('currentBranch', version);
      task.run(['exec_build']);
      task.run(['exec:add', 'exec:commit:' + msg]);
      task.run(['exec:prepub']);
      task.run(['exec:tag', 'exec:publish']);
      done();
    });
  });

  // 启动 demo 调试时的本地服务
  grunt.registerTask('demo', '开启Demo调试模式', function () {
    task.run(['flexcombo:demo', 'watch:demo']);
  });


  // 启动 online 调试时的本地服务
  grunt.registerTask('online', '开启debug模式', function () {

    task.run(['build_online_debug', 'flexcombo:online', 'watch:online']);
  });

  grunt.registerTask('build_online_debug', '执行在线调试构建', function () {
	  
    var configMap = {
      compress: false,                  // 不压缩代码，方便调试，加速构建
      ext: '',                          // 调试时 flexcombo 会找非 -min 代码
      depFilePath: 'build/map.js'       // 同上
    };
    Object.keys(configMap).forEach(function(key){
      grunt.config.set('kmb.online.options.' + key, configMap[key]);
    });
	
    task.run([
      'copy:debug',
      'copy:main',
      'less:main',
      'sass:main',
      'kmb:online',
      // 构建在线包
      'combohtml:main',
      'uglify:main',
      'replace:main',
      'cssmin:main'
    ]);
  });


  // 启动Offline调试时的本地服务
  grunt.registerTask('offline', '开启offline离线包调试模式', function () {

    task.run(['build_offline_debug', 'flexcombo:offline', 'watch:offline']);
  });

  grunt.registerTask('build_offline_debug', '执行离线调试构建', function () {

    // 离线包调试模式，不压缩代码，加快构建
    grunt.config.set('kmb.offline.options.compress', false);
	
    task.run([
      // 构建离线包
      'copy:offline',
      'replace:offline',
      'kmb:offline',
      'less:offline',
      'sass:offline',
      'combohtml:offline',
      'domman:offline',
      //'uglify:offline',
      'cssmin:offline',
      'cacheinfo',
      'exec:zip'
    ]);
  });


  // 替换build里的http://g.tbcdn.cn的引用为daily的引用
  grunt.registerTask('daily', '替换域名引用到daily', function () {
    task.run(['replace:daily']);
  });


  // 默认构建流程
  grunt.registerTask('exec_build', '执行构建脚本', function () {
    var actions = [
      // 构建准备流程
      'clean:build',
      //'tms',
      // 构建在线包
      'copy:main',
      'less:main',
      'sass:main',
      'kmb:online',
      'combohtml:main',
      'domman:online',
      'uglify:main',
      'replace:main',
      'cssmin:main'
    ];
    if (isH5) {
      actions = actions.concat([
        // 构建离线包
        'clean:offline',
        'copy:offline',
        'less:offline',
        'sass:offline',
        'kmb:offline',
        'replace:offline',
        'combohtml:offline',
        'domman:offline',
        'uglify:offline',
        'cssmin:offline',
        'replace:offline',
        'clean:offline_build',
        'cacheinfo',
        'exec:zip'
      ]);
    }
    task.run(actions);
  });

  // 默认构建任务
  grunt.registerTask('build', '默认构建流程', function (type) {

    if (!type) {
      task.run(['exec_build']);
    }

  });

  // 压缩离线包
  grunt.registerTask('zip', ['exec:zip']);

  grunt.registerTask('newbranch', '获取当前最大版本号,创建新的分支', function (type, msg) {
    var done = this.async();
    exec('git branch -a & git tag', function (err, stdout, stderr, cb) {
      var versions = stdout.match(/\d+\.\d+\.\d+/ig),
        r = clamUtil.getBiggestVersion(versions);
      if (!r || !versions) {
        r = '0.1.0';
      } else {
        r[2]++;
        r = r.join('.');
      }
      grunt.log.write(('新分支：daily/' + r).green);
      grunt.config.set('currentBranch', r);
      task.run(['exec:new_branch']);
      // 回写入 abc.json 的 version
      try {
        abcJSON = require(path.resolve(process.cwd(), 'abc.json'));
        abcJSON.version = r;
        clamUtil.fs.writeJSONFile("abc.json", abcJSON, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("update abc.json.");
          }
        });
      } catch (e) {
        console.log('未找到abc.json');
      }
      done();
    });
  });

  // -------------------------------------------------------------
  // 注册Grunt主流程
  // -------------------------------------------------------------

  return grunt.registerTask('default', 'Clam 默认流程', function (type, msg) {

    var done = this.async();

    // 获取当前分支
    clamUtil.getBranchVersion(function (version) {
      grunt.log.write(('当前分支：' + version).green);
      grunt.config.set('currentBranch', version);
      done();
    });

    // 构建和发布任务
    if (!type) {
      task.run(['build']);
    }
  });

};
