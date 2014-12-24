/**
 * Created by 弘树<tiehang.lth@alibaba-inc.com> on 14/12/24.
 *
 * FlexCombo 服务配置
 * https://npmjs.org/package/grunt-flexcombo
 *
 * 注意：urls 字段末尾不能有'/'
 */
module.exports = function (abcConfig) {
	return {
		// 源码调试服务
		demo: {
			options: {
				proxyport: '<%= abcpkg.proxyPort %>',               	// 本地反向代理端口
					target: 'src/',                                     // flex-combo 要代理的目录
					urls: '/<%= abcpkg.group %>/<%= abcpkg.name %>',    // flex-combo 要代理的匹配 url
					port: '<%= abcpkg.port %>',                         // 本地服务端口
					proxyHosts: [                                       // 本地反向代理需要代理的主机名
					'demo',
					'demo.com',
					'dev.waptest.taobao.com',
					'dev.wapa.taobao.com',
					'dev.m.taobao.com'
				],
					needHttps: false,								// 是否开启 HTTPS 请求监控，默认 false
					livereload: false,							// 是否自动刷新，默认 false，可配置为 true 或期望 livereload 服务工作的端口号
					startWeinre: abcConfig.isH5,   	// 是否自动启动 weinre（H5项目默认为 true）
					weinrePort: 8091,               // weinre 运行端口号
					proxy: {                                        // 代理配置
					interface: {                                    // 接口 mock 配置
						hosts: [/*'api.m.taobao.com', 'api.waptest.taobao.com', 'api.test.taobao.com'*/],   // 接口 mock 要代理的主机名
							script: 'proxy/interface.js'                // 接口 mock 的执行脚本路径
					},
					webpage: {
						urls: [/*/taobao\.com/*/],                  	// 页面代理需要代理的 url 模式（字符串/正则表达式）
							script: 'proxy/webpage.js'                  // 页面代理执行脚本路径
					}
				}
			}
		},
		// 线上代码调试服务
		online: {
			options: {
				// 无线H5项目调试，可打开host配置，用法参照
				// https://speakerdeck.com/lijing00333/grunt-flexcombo
				target: 'build/',
					proxyport: '<%= abcpkg.proxyPort %>', // 反向代理绑定当前主机的 proxyport 端口
					urls: '/<%= abcpkg.group %>/<%= abcpkg.name %>/<%= abcpkg.version %>',
					port: '<%= abcpkg.port %>',
					// 反向代理时本地虚机域名强制定向到本机
					htmlProxy: '<%= abcpkg.htmlProxy %>',
					// 本机虚机域名
					proxyHosts: [
					'demo',
					'demo.com',
					'h5.m.taobao.com',
					'dev.m.taobao.com',
					'm.trip.taobao.com'
				],
					livereload: false,							// 是否自动刷新，默认 false，可配置为 true 或期望 livereload 服务工作的端口号
					needHttps: false,								// 是否开启 HTTPS 请求监控，默认 false
					startWeinre: abcConfig.isH5,		// 是否自动启动 weinre（H5项目默认为 true）
					weinrePort: 8091,								// weinre 运行端口号
					proxy: {
					interface: {
						hosts: [/*'api.m.taobao.com', 'api.waptest.taobao.com', 'api.test.taobao.com'*/],
							script: 'proxy/interface.js'
					},
					webpage: {
						urls: [/*/taobao\.com/*/],
							script: 'proxy/webpage.js'
					}
				},
				hosts: {
					"g.assets.daily.taobao.net": "10.235.136.37"
				},
				filter: {
					'-min\\.js': '.js',
						// 访问 h5.m.taobao.com/trip/h5-trains/search/index.html
						// 将重定向到 ./build/pages/search/index.html
						// Example: '(.+)/trip/h5-car/\(.+\\.\)html':'$1/pages/$2html'
						'(.+)/trip/[^\/]+/\(.+\\.\)html': '$1/pages/$2html'
				}
			}
		},
		// 离线包调试模式
		offline: {
			options: {
				target: 'build_offline/',
					proxyport: '<%= abcpkg.proxyPort %>',
					urls: '/<%= abcpkg.group %>/<%= abcpkg.name %>',
					port: '<%= abcpkg.port %>',
					// 本机虚机域名
					proxyHosts: [
					'demo',
					'demo.com',
					'dev.waptest.taobao.com',
					'dev.wapa.taobao.com',
					'h5.m.taobao.com'
				],
					livereload: false,							// 是否自动刷新，默认 false，可配置为 true 或期望 livereload 服务工作的端口号
					needHttps: false,								// 是否开启 HTTPS 请求监控，默认 false
					startWeinre: abcConfig.isH5,		// 是否自动启动 weinre（H5项目默认为 true）
					weinrePort: 8091,								// weinre 运行端口号
					proxy: {
					interface: {
						hosts: [/*'api.m.taobao.com', 'api.waptest.taobao.com', 'api.test.taobao.com'*/],
							script: 'proxy/interface.js'
					},
					webpage: {
						urls: [/*/taobao\.com/*/],
							script: 'proxy/webpage.js'
					}
				},
				filter: {
					//实际执行匹配类似于这句，将visa替换为url中的目录名称
					//"(.+)/trip/visa/\(.+\\.\)(css|js)":"$1/pages/$2$3",
					"(.+)/trip/\(widgets|libs|mods\)/\(.+\\.\)(js|css|png|jpg|gif)": "$1/$2/$3$4",
						"(.+)/trip/[^\/]+/\(.+\\.\)(html|js|css|png|jpg|gif)": "$1/pages/$2$3"
				}
			}
		}
	}
};