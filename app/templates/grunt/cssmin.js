/**
 * Created by 弘树<tiehang.lth@alibaba-inc.com> on 14/12/24.
 * 压缩CSS
 */
module.exports = {
	main: {
		files: [
			{
				expand: true,
				cwd: 'build/',
				src: [
					'**/*.css',
					'!**/*-min.css',
					'!**/*.less.css',
					'!**/*.scss.css',
					'!**/widgets/mpi_css/**/*'
				],
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
};