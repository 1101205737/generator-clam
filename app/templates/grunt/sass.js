/**
 * Created by 弘树<tiehang.lth@alibaba-inc.com> on 14/12/24.
 */
module.exports = {
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
				dest: 'src/',
				ext: '.css'
			}
		]
	}
};