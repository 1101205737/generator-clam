/**
 * Created by 弘树<tiehang.lth@alibaba-inc.com> on 14/12/24.
 * less
 */
module.exports = {
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
				dest: 'src/',
				ext: '.css'
			}
		]
	}
};