/**
 * Created by 弘树<tiehang.lth@alibaba-inc.com> on 14/12/24.
 * 监听文件修改，实时构建任务
 */
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

module.exports = {
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
};