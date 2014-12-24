/**
 * Created by 弘树<tiehang.lth@alibaba-inc.com> on 14/12/24.
 * 解析 Juicer 模板写的tms mock文件为TMS格式文件
 * https://npmjs.org/package/grunt-tms
 */
module.exports = {
	options: {
		DEFAULT_TITLE: '新默认标题',
		DEFAULT_GROUP: '新默认组',
		DEFAULT_ROW: 2,             // 对列表数据，默认行数，对应"defaultRow"属性
		DEFAULT_MAXROW: 6,          // 对列表数据，默认最大行数，对应"row"属性
		THRESHOLD_MULTISTRING: 2    // 判断为多行文本的阈值：字符串中包含2个以上的标点符号
	},
	main: {
		files: [
			{
				expand: true,
				cwd: 'build',
				// 对'*.tms'文件进行juicer2tms转换
				src: ['**/*.tms.html'],
				dest: 'build/',
				ext: '.tms'
			}
		]
	}
};