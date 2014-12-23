/**
 * 本文件是 Gruntfile.js 默认模板，请根据需要和注释提示自行修改
 * 从这里获得最新版
 * https://github.com/jayli/generator-clam/blob/master/app/templates/Gruntfile_src.js
 * 文档地址:
 * http://cnpmjs.org/package/generator-clam
 */
var path = require('path'),
  clamUtil = require('clam-util'),
  exec = require('child_process').exec;

module.exports = function (grunt) {
  require('time-grunt')(grunt);

  // -------------------------------------------------------------
  // 智能载入模块
  // https://github.com/shootaroo/jit-grunt
  // -------------------------------------------------------------
  require('jit-grunt')(grunt);

  var task = grunt.task;

  var watch_files = [
    'src/**/*.js',
    'src/**/*.css',
    'src/**/*.less',
    'src/**/*.php',
    'src/**/*.html',
    'src/**/*.htm',
    'src/**/*.scss',
    '!src/**/node_modules/**/*',
    '!src/**/build/**/*'];

  // -------------------------------------------------------------
  // 任务配置
  // -------------------------------------------------------------

  // 如果 Gruntfile.js 编码为 gbk，打开此注释
  // grunt.file.defaultEncoding = 'gbk';

  // 默认 CDN 根域名
  var base = 'http://g.tbcdn.cn';
  var Gpkg = grunt.file.readJSON('abc.json');
  // 是否是 H5 项目
  var isH5 = Gpkg.isH5;
  grunt.initConfig({

    // 从 abc.json 中读取配置项
    abcpkg: grunt.file.readJSON('abc.json'),

    // 配置默认 git 分支
    currentBranch: 'master',

    // 对build目录进行清理
    clean: {
      build: {
        src: 'build/*'
      },
      offline: {
        src: 'build_offline/*'
      },
      offline_build: {
        src: [
          'build_offline/config.js',
          'build_offline/pages/**/*.css',
          '!build_offline/pages/**/*_combo.css'
        ]
      }
    },

    /**
     * KISSY 模块构建，文档：http://gitlab.alibaba-inc.com/trip-tools/grunt-kmb/tree/master
     */
    kmb: {
      options: {
        pkgName: '<%= abcpkg.name %>',                      // 包名，默认取项目名
        compress: true,                                     // 是否压缩
        comboRequire: false,                                // 是否合并依赖模块
        addModuleName: true,                                // 是否加上模块名
        depFilePath: 'build/map-min.js',                    // 依赖分析文件路径，如不需要设为 null
        alias: 'src/config.js',                             // 别名配置，为单个文件
        // alias: ['src/alias.js', 'mods/abc/alias.js']     // 别名配置，为多个文件
        // alias: {                                         // 别名配置，为键值对
        //
        //},
        ext: '-min'                                         // 构建出的文件后缀名
      },
      online: {
        options: {
          // 在这里指定自己的配置项覆盖上面的通用配置
        },
        files: [
          {
            cwd: 'src',
            src: ['**/*.js',
              '!widgets/base/**/*',
              '!**/*/Gruntfile.js',
              '!**/build/**/*'],
            dest: 'build/',
            expand: true
          }
        ]
      },
      offline: {
        options: {
          comboRequire: true,                                 // 是否合并依赖模块
          depFilePath: null,                                  // 依赖分析文件路径，如不需要设为 null
          ext: ''                                             // 构建出的文件后缀名
        },
        files: [
          {
            cwd: 'src',
            src: Gpkg.kmbOffline,
            dest: 'build_offline/',
            expand: true
          }
        ]
      }

    },

    // 静态合并HTML和抽取JS/CSS，解析juicer语法到vm/php
    // https://npmjs.org/package/grunt-combohtml
    combohtml: {
      main: {
        options: {
          encoding: 'utf8',
          replacement: {
            from: /src\//,
            to: 'build/'
          },
          // assetseParser: !isH5, // 参照TIP@2014-8-15
          // 本地文件引用替换为线上地址
          relative: base + '/<%= abcpkg.group %>/<%= abcpkg.name %>/<%= abcpkg.version %>/',
          combineAssets: true, // 配合relative使用,将页面中所有以CDN引用的JS/CSS文件名进行拼合
          // KISSY Modules Maps File 地址
          // comboMapFile: base + '/<%= abcpkg.group %>/<%= abcpkg.name %>/<%= abcpkg.version %>/map-min.js',
          tidy: false,  // 是否重新格式化HTML
          // TODO:改成True时juicerMock函数有bug
          mockFilter: true, // 是否过滤Demo中的JuicerMock
          comboJS: false, // 是否静态合并当前页面引用的本地js为一个文件
          comboCSS: false, // 是否静态合并当前页面引用的css为一个文件
          convert2vm: false,// 是否将juicer语法块转换为vm格式
          convert2php: false, // 是否将juicer语法块转换为php格式
          //htmlProxy: '<%= abcpkg.htmlProxy %>',      // htmlProxy 配置，用于产出线上页面区块替换为本地模块页面
          //htmlProxyDestDir: 'html-fragments',      // html 代理区块页面生成到的目标目录
          meta: {
            'pageid': '181on.<%= abcpkg.name%>/${path|regexp,"build/",""}'
          }

        },
        files: [
          {
            expand: true,
            cwd: 'src',
            src: ['pages/**/*.html', '!pages/**/*.tms.html'],
            dest: 'build/'
          }
        ]
      },
      offline: {
        options: {
          replacement: null,
          comboJS: true,
          comboCSS: true,
          convert2vm: false,
          convert2php: false,
          mockFilter: true, // 是否过滤Demo中的JuicerMock
          comboExt: '_combo',
          meta: {
            'pageid': '181off.<%= abcpkg.name%>/${path|regexp,"build_offline/",""}'
          }
        },
        files: [
          {
            expand: true,
            cwd: 'src',
            src: ['pages/**/*.html'],
            dest: 'build_offline/'
          }
        ]
      }
    },
    // 解析 Juicer 模板写的tms mock文件为TMS格式文件
    // https://npmjs.org/package/grunt-tms
    tms: {
      options: {
        DEFAULT_TITLE: '新默认标题',
        DEFAULT_GROUP: '新默认组',
        DEFAULT_ROW: 2,             // 对列表数据，默认行数，对应"defaultRow"属性
        DEFAULT_MAXROW: 6,          // 对列表数据，默认最大行数，对应"row"属性
        THRESHOLD_MULTISTRING: 2    // 判断为多行文本的阈值：字符串中包含2个以上的标点符号
      },
      main: {
        files: [
          {
            expand: true,
            cwd: 'build',
            // 对'*.tms'文件进行juicer2tms转换
            src: ['**/*.tms.html'],
            dest: 'build/',
            ext: '.tms'
          }
        ]
      }
    },
    // FlexCombo 服务配置
    // https://npmjs.org/package/grunt-flexcombo
    //
    // 注意：urls 字段末尾不能有'/'
    flexcombo: {
      // 源码调试服务
      demo: {
        options: {
          proxyport: '<%= abcpkg.proxyPort %>',               // 本地反向代理端口
          target: 'src/',                                     // flex-combo 要代理的目录
          urls: '/<%= abcpkg.group %>/<%= abcpkg.name %>',    // flex-combo 要代理的匹配 url
          port: '<%= abcpkg.port %>',                         // 本地服务端口
          proxyHosts: [                                       // 本地反向代理需要代理的主机名
            'demo',
            'demo.com',
            'dev.waptest.taobao.com',
            'dev.wapa.taobao.com',
            'dev.m.taobao.com'
          ],
          needHttps: false,				// 是否开启 HTTPS 请求监控，默认 false
          livereload: false,				// 是否自动刷新，默认 false，可配置为 true 或期望 livereload 服务工作的端口号
          startWeinre: isH5,              // 是否自动启动 weinre（H5项目默认为 true）
          weinrePort: 8091,               // weinre 运行端口号
          proxy: {                                            // 代理配置
            interface: {                                    // 接口 mock 配置
              hosts: [/*'api.m.taobao.com', 'api.waptest.taobao.com', 'api.test.taobao.com'*/],   // 接口 mock 要代理的主机名
              script: 'proxy/interface.js'                // 接口 mock 的执行脚本路径
            },
            webpage: {
              urls: [/*/taobao\.com/*/],                  // 页面代理需要代理的 url 模式（字符串/正则表达式）
              script: 'proxy/webpage.js'                  // 页面代理执行脚本路径
            }
          }
        }
      },
      // 线上代码调试服务
      online: {
        options: {
          // 无线H5项目调试，可打开host配置，用法参照
          // https://speakerdeck.com/lijing00333/grunt-flexcombo
          target: 'build/',
          proxyport: '<%= abcpkg.proxyPort %>', // 反向代理绑定当前主机的 proxyport 端口
          urls: '/<%= abcpkg.group %>/<%= abcpkg.name %>/<%= abcpkg.version %>',
          port: '<%= abcpkg.port %>',
          // 反向代理时本地虚机域名强制定向到本机
          htmlProxy: '<%= abcpkg.htmlProxy %>',
          // 本机虚机域名
          proxyHosts: [
            'demo',
            'demo.com',
            'h5.m.taobao.com',
            'dev.m.taobao.com',
            'm.trip.taobao.com'
          ],
          livereload: false,				// 是否自动刷新，默认 false，可配置为 true 或期望 livereload 服务工作的端口号
          needHttps: false,				// 是否开启 HTTPS 请求监控，默认 false
          startWeinre: isH5,				// 是否自动启动 weinre（H5项目默认为 true）
          weinrePort: 8091,				// weinre 运行端口号
          proxy: {
            interface: {
              hosts: [/*'api.m.taobao.com', 'api.waptest.taobao.com', 'api.test.taobao.com'*/],
              script: 'proxy/interface.js'
            },
            webpage: {
              urls: [/*/taobao\.com/*/],
              script: 'proxy/webpage.js'
            }
          },
          hosts: {
            "g.assets.daily.taobao.net": "10.235.136.37"
          },
          filter: {
            '-min\\.js': '.js',
            // 访问 h5.m.taobao.com/trip/h5-trains/search/index.html
            // 将重定向到 ./build/pages/search/index.html
            // Example: '(.+)/trip/h5-car/\(.+\\.\)html':'$1/pages/$2html'
            '(.+)/trip/[^\/]+/\(.+\\.\)html': '$1/pages/$2html'
          }
        }
      },
      // 离线包调试模式
      offline: {
        options: {
          target: 'build_offline/',
          proxyport: '<%= abcpkg.proxyPort %>',
          urls: '/<%= abcpkg.group %>/<%= abcpkg.name %>',
          port: '<%= abcpkg.port %>',
          // 本机虚机域名
          proxyHosts: [
            'demo',
            'demo.com',
            'dev.waptest.taobao.com',
            'dev.wapa.taobao.com',
            'h5.m.taobao.com'
          ],
          livereload: false,				// 是否自动刷新，默认 false，可配置为 true 或期望 livereload 服务工作的端口号
          needHttps: false,				// 是否开启 HTTPS 请求监控，默认 false
          startWeinre: isH5,				// 是否自动启动 weinre（H5项目默认为 true）
          weinrePort: 8091,				// weinre 运行端口号
          proxy: {
            interface: {
              hosts: ['api.m.taobao.com', 'api.waptest.taobao.com', 'api.test.taobao.com'],
              script: 'proxy/interface.js'
            },
            webpage: {
              urls: [/*/taobao\.com/*/],
              script: 'proxy/webpage.js'
            }
          },
          filter: {
            //实际执行匹配类似于这句，将visa替换为url中的目录名称
            //"(.+)/trip/visa/\(.+\\.\)(css|js)":"$1/pages/$2$3",
            "(.+)/trip/\(widgets|libs|mods\)/\(.+\\.\)(js|css|png|jpg|gif)": "$1/$2/$3$4",
            "(.+)/trip/[^\/]+/\(.+\\.\)(html|js|css|png|jpg|gif)": "$1/pages/$2$3",
          }
        }
      }
    },

    less: {
      options: {
        strictImports: true,
        relativeUrls: true  // 将从其他 less 文件中导入的 url() 中相对路径图片引用替换为相对当前 less 文件路径
      },
      dev: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['**/*.less', '!**/build/**/*.less'],
            dest: 'src/',
            ext: '.css'
          }
        ]
      },
      main: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['**/*.less', '!**/build/**/*.less'],
            dest: 'build/',
            ext: '.css'
          }
        ]
      },
      offline: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['**/*.less', '!widgets/**/*.less', '!**/build/**/*.less'],
            dest: 'build_offline/',
            ext: '.css'
          }
        ]
      }
    },

    sass: {
      dev: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['**/*.scss', '!**/build/**/*.scss'],
            dest: 'src/',
            ext: '.css'
          }
        ]
      },
      main: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['**/*.scss', '!**/build/**/*.scss'],
            dest: 'build/',
            ext: '.css'
          }
        ]
      },
      offline: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['**/*.scss', '!widgets/**/*.scss', '!**/build/**/*.scss'],
            dest: 'build_offline/',
            ext: '.css'
          }
        ]
      }
    },

    // 压缩JS
    uglify: {
      options: {
        banner: '/*! Generated by Clam: <%= abcpkg.name %> */\n',
        beautify: {
          ascii_only: true
        }
      },
      main: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['config.js'],
            dest: 'build/',
            ext: '-min.js'
          }
        ]
      },
      offline: {
        files: [
          {
            expand: true,
            cwd: 'build_offline/',
            src: ['**/*_combo.js'],
            dest: 'build_offline/'
          }
        ]
      }
    },

    // 压缩CSS
    cssmin: {
      main: {
        files: [
          {
            expand: true,
            cwd: 'build/',
            src: ['**/*.css', '!**/*-min.css', '!**/*.less.css', '!**/*.scss.css'],
            dest: 'build/',
            ext: '-min.css'
          }
        ]
      },
      offline: {
        files: [
          {
            expand: true,
            cwd: 'build_offline/',
            src: ['**/*.css', '!**/*-min.css'],
            dest: 'build_offline/'
          }
        ]
      }
    },

    // 监听JS、CSS、LESS文件的修改
    watch: {
      options: {
          livereload: true
      },
      'demo': {
        files: ['src/**/*.less', 'src/**/*.scss'],
        tasks: ['less:dev', 'sass:dev']
      },
      'online': {
        files: watch_files,
        tasks: ['build_online_debug']
      },
      'offline': {
        files: watch_files,
        tasks: ['build_offline_debug']
      }
    },

    // 发布命令
    exec: {
      tag: {
        command: 'git tag publish/<%= currentBranch %>'
      },
      publish: {
        command: 'git push origin publish/<%= currentBranch %>:publish/<%= currentBranch %>'
      },
      commit: {
        command: function (msg) {
          var command = 'git commit -m "' + grunt.config.get('currentBranch') + ' - ' + grunt.template.today("yyyy-mm-dd HH:MM:ss") + ' ' + msg + '"';
          return command;
        }
      },
      add: {
        command: 'git add . -A'
      },
      prepub: {
        command: 'git push origin daily/<%= currentBranch %>:daily/<%= currentBranch %>'
      },
      grunt_publish: {
        command: 'grunt default:publish'
      },
      grunt_prepub: {
        command: function (msg) {
          return 'grunt default:prepub:' + msg;
        }
      },
      new_branch: {
        command: 'git checkout -b daily/<%= currentBranch %>'
      },
      zip: {
        command: 'cd build_offline/; zip -P <%= abcpkg.zipPassWord %> -r9 ../build/<%= abcpkg.packageNameMd5 %>.zip *; cd ../'
      },
      build_alipay: {
        command: 'hpm build -V <%= currentBranch %>'
      }
    },

    // 将css文件中引用的本地图片上传CDN并替换url，默认不开启
    mytps: {
      options: {
        argv: "--inplace"
      },
      expand: true,
      cwd: 'src',
      all: ['**/*.css', '!**/node_modules/**/*.css', '!**/build/**/*.css']
    },

    // 得到本地资源列表
    cacheinfo: {
      options: {
        abc: "abc.json",
        src: "build_offline",
        dest: "build_offline/cache_info.json"
      }
    },
    // 拷贝文件
    copy: {
      main: {
        files: [
          {
            src: 'src/widgets/base/build/qa-seed-min.js',
            dest: 'build/widgets/base/qa-seed-min.js'
          },
          {
            cwd: 'src',
            src: ['**/*.css'],
            dest: 'build',
            expand: true
          }
        ]
      },
      debug: {
        files: [
          {
            cwd: 'src',
            src: ['widgets/base/qa-seed.js', 'config.js'],
            dest: 'build',
            expand: true
          }
        ]
      },
      offline: {
        files: [
          {
            src: 'src/widgets/base/build/qa-seed-wlog-tmsparser-min.js',
            dest: 'build_offline/widgets/base/qa-seed-wlog-tmsparser.js'
          },
          {
            src: 'src/widgets/mpi_css/mpi.css',
            dest: 'build_offline/widgets/mpi_css/mpi.css'
          },
          {
            src: 'src/config.js',
            dest: 'build_offline/config.js'
          }
        ]
      }
    },

    // dom 操作插件集
    domman: {
      online: {
        options: {
          plugins: ['stat'],        						// 要启用的插件
          //orderHead: [],                				// 要首先调用的插件
          orderTail: ['stat']								// 最后调用的插件
        },
        files: [
          {
            expand: true,
            cwd: 'build/',
            dest: 'build/',
            src: ['**/*.html']
          }
        ]

      },
      offline: {
        options: {
          plugins: ['tms', 'offline', 'stat', 'load'],        	// 要启用的插件
          //orderHead: [],                				              // 要首先调用的插件
          orderTail: ['stat']								                    // 最后调用的插件
        },
        files: [
          {
            expand: true,
            cwd: 'build_offline/',
            dest: 'build_offline/',
            src: ['**/*.html']
          }
        ]

      }
    },

    replace: {
      // 将资源文件引用域名替换为 g.assets.daily.taobao.net
      daily: {
        options: {
          variables: {
            'g.tbcdn.cn': 'http://g.assets.daily.taobao.net'
          },
          prefix: 'http://'
        },
        files: [
          {
            expand: true,
            cwd: 'build/',
            dest: 'build/',
            src: ['pages/**/*.html']
          }
        ]
      },
      // 替换 config 中的版本号 @@version
      main: {
        options: {
          variables: {
            'version': '<%= abcpkg.version %>'
          },
          prefix: '@@'
        },
        files: [
          {
            expand: true,
            cwd: 'build/',
            dest: 'build/',
            src: ['config.js', 'config-min.js', 'mods/**/*.js', 'pages/**/*.js']
          }
        ]
      },
      offline: {
        options: {
          variables: {
            'version': '<%= abcpkg.version %>'
          },
          prefix: '@@'
        },
        files: [
          {
            expand: true,
            cwd: 'build_offline/',
            dest: 'build_offline/',
            src: ['config.js', 'mods/**/*.js', 'pages/**/*.js']
          }
        ]
      }
    }

  });


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
      'less:main',
      'sass:main',
      'kmb:online',
      'copy:main',
      'tms',
      // 构建在线包
      'combohtml:main',
      'domman:online',
      'uglify:main',
      'replace:main',
      'cssmin:main'
    ];
    // TIP,2014-8-15：
    // 根据规范，H5项目应当把所有的assets都inline进来
    // 但由于awpp命令无法根据inline后的大文件计算正确的摘要值而导致发布失败
    // 暂时将这个逻辑去掉，根本原因是awpp计算token的bug
    /*
     if(isH5){
     actions = actions.concat([
     'inline-assets:main'
     ]);
     }
     */
    if (isH5) {
      actions = actions.concat([
        // 构建离线包
        'clean:offline',
        'kmb:offline',
        'copy:offline',
        'replace:offline',
        'less:offline',
        'sass:offline',
        'combohtml:offline',
        'domman:offline',
        'replace:offline',
        'uglify:offline',
        'cssmin:offline',
        'clean:offline_build',
        'cacheinfo',
        'exec:zip'
      ]);
    }
    task.run(actions);
  });

  // 默认构建任务
  grunt.registerTask('build', '构建', function (type) {

    if (!type) {
      task.run(['exec_build']);
    } else if (type == 'alipay') {

      var done = this.async();

      // 获取当前分支
      clamUtil.getBranchVersion(function (version) {
        grunt.log.write(('当前分支：' + version).green);
        grunt.config.set('currentBranch', version);

        console.log('请先确认本地已安装 hpm, 如未安装请先执行 `sudo tnpm install -g hpm` 安装');
        console.log('并确认 hpmfile.json 中 `appid`、`version`、`launchParams.url` 等参数配置无误');
        task.run(['exec:build_alipay']);
        done();
      });
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
