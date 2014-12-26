/**
 * Created by 弘树<tiehang.lth@alibaba-inc.com> on 14/12/24.
 * exec
 * 命令行命令包装
 */
module.exports = function (abcConfig, grunt) {
	return {
		tag: {
			command: 'git tag publish/<%= currentBranch %>'
		},
		publish: {
			command: 'git push origin publish/<%= currentBranch %>:publish/<%= currentBranch %>'
		},
		commit: {
			command: function (msg) {
				var command = 'git commit -m "' + grunt.config.get('currentBranch') + ' - ' + grunt.template.today("yyyy-mm-dd HH:MM:ss") + ' ' + msg + '"';
				return command;
			}
		},
		add: {
			command: 'git add . -A'
		},
		prepub: {
			command: 'git push origin daily/<%= currentBranch %>:daily/<%= currentBranch %>'
		},
		grunt_publish: {
			command: 'grunt default:publish'
		},
		grunt_prepub: {
			command: function (msg) {
				return 'grunt default:prepub:' + msg;
			}
		},
		new_branch: {
			command: 'git checkout -b daily/<%= currentBranch %>'
		},
		zip: {
			command: 'cd build_offline/; zip -P <%= abcpkg.zipPassWord %> -r9 ../build/<%= abcpkg.packageNameMd5 %>.zip *; cd ../'
		}
	}
};