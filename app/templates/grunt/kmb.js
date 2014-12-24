/**
 * Created by 弘树<tiehang.lth@alibaba-inc.com> on 14/12/24.
 *
 * KISSY 模块构建，文档：http://gitlab.alibaba-inc.com/trip-tools/grunt-kmb/tree/master
 * 自动将 require 里的 css 文件合并到当前 js 文件中
 * 离线包环境下将依赖的别名模块静态合并到当前模块
 * 注意：KMB 不会处理非 KISSY 模块的 js 文件，对于这些文件，请加入到下面的 copy 和 uglify 任务中完成构建
 *
 */
module.exports = function (abcConfig) {
	return {
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
					src: abcConfig.kmbOffline,                             // 只处理 abc.json 中指定的文件列表，按需构建
					dest: 'build_offline/',
					expand: true
				}
			]
		}

	}
};