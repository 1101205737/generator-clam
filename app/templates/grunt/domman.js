/**
 * Created by 弘树<tiehang.lth@alibaba-inc.com> on 14/12/24.
 * dom 操作插件集
 */
module.exports = {
	online: {
		options: {
			plugins: ['stat'],        						// 要启用的插件
			//orderHead: [],                				// 要首先调用的插件
			orderTail: ['stat']								// 最后调用的插件
		},
		files: [
			{
				expand: true,
				cwd: 'build/',
				dest: 'build/',
				src: ['**/*.html']
			}
		]

	},
	offline: {
		options: {
			plugins: ['tms', 'offline', 'stat', 'load'],        	// 要启用的插件
			//orderHead: [],                				              // 要首先调用的插件
			orderTail: ['stat']								                    // 最后调用的插件
		},
		files: [
			{
				expand: true,
				cwd: 'build_offline/',
				dest: 'build_offline/',
				src: ['**/*.html']
			}
		]

	}
};