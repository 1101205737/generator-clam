/**
 * Created by 弘树<tiehang.lth@alibaba-inc.com> on 14/12/24.
 * 静态合并HTML和抽取JS/CSS，解析juicer语法到vm/php
 * https://npmjs.org/package/grunt-combohtml
 */
var base = 'http://g.tbcdn.cn';

module.exports = {
	options: {
		encoding: 'utf8',
		replacement: {
			from: /src\//,
			to: 'build/'
		},
		// KISSY Modules Maps File 地址
		// comboMapFile:base + '/<%= abcpkg.group %>/<%= abcpkg.name %>/<%= abcpkg.version %>/map-min.js',
		tidy: false,  // 是否重新格式化HTML
		mockFilter: true, // 是否过滤Demo中的JuicerMock
		comboJS: false, // 是否静态合并当前页面引用的本地js为一个文件
		comboCSS: false, // 是否静态合并当前页面引用的css为一个文件
		convert2vm: false,// 是否将juicer语法块转换为vm格式
		convert2php: false, // 是否将juicer语法块转换为php格式
		comboExt: '_combo' // 静态合并后的js和css后缀
		//htmlProxy: '<%= abcpkg.htmlProxy %>',      // htmlProxy 配置，用于产出线上页面区块替换为本地模块页面
		//htmlProxyDestDir: 'html-fragments'      // html 代理区块页面生成到的目标目录
	},
	main: {
		options: {
			// assetseParser: !isH5, // 参照TIP@2014-8-15
			// 本地文件引用替换为线上地址
			relative: base + '/<%= abcpkg.group %>/<%= abcpkg.name %>/<%= abcpkg.version %>/',
			combineAssets: true, // 配合relative使用,将页面中所有以CDN引用的JS/CSS文件名进行拼合
			// KISSY Modules Maps File 地址
			comboMapFile: base + '/<%= abcpkg.group %>/<%= abcpkg.name %>/<%= abcpkg.version %>/map-min.js',
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
			replacement: {
				from: /src\//,
				to: 'build_offline/'
			},
			comboJS: true,
			comboCSS: true,
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
};