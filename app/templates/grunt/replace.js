/**
 * Created by 弘树<tiehang.lth@alibaba-inc.com> on 14/12/24.
 */
module.exports = {
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
};