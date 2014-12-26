/**
 * Created by 弘树<tiehang.lth@alibaba-inc.com> on 14/12/24.
 * 拷贝文件
 */
module.exports = {
	main: {
		files: [
			{
				src: 'src/widgets/base/build/qa-seed-min.js',
				dest: 'build/widgets/base/qa-seed-min.js'
			},
			{
				cwd: 'src',
				src: ['**/*.css', '!**/build/**/*.css'],
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
				src: 'src/config.js',
				dest: 'build_offline/config.js'
			},
			{
				src: 'src/widgets/mpi_css/mpi-min.css',
				dest: 'build_offline/widgets/mpi_css/mpi.css'
			}
		]
	}
};