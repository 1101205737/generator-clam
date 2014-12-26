/**
 * Created by 弘树<tiehang.lth@alibaba-inc.com> on 14/12/24.
 * 构建清理
 */
module.exports = {
	build: {
		src: 'build/*'
	},
	offline: {
		src: 'build_offline/*'
	},
	// 离线包构建完成打包前后的清理任务
	offline_build: {
		src: [
			'build_offline/config.js',
			'build_offline/mods/',

			// 只保留 pages 下的合并后的单个 *_combo.js
			'build_offline/pages/**/*.js',
			'!build_offline/pages/**/*_combo.js',

			// 只保留 pages 下的合并后的单个 *_combo.css
			'build_offline/pages/**/*.css',
			'!build_offline/pages/**/*_combo.css',

			// 移除 widgets/mpi_css
			'build_offline/widgets/mpi_css'
		]
	}
};