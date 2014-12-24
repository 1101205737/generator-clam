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
	offline_build: {
		src: [
			'build_offline/config.js',
			'build_offline/mods/',
			'build_offline/pages/**/*.css',
			'!build_offline/pages/**/*_combo.css'
		]
	}
};