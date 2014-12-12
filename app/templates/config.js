(function(){
    KISSY.config('tag', null);
  	KISSY.Config.version = '@@version';

    // 通过URL注入版本：url?version=0.1.2
    var getVersion = function(){
		var m = window.location.href.match(/[\?&]version=(\d+\.\d+\.\d+)/i);
		if(m && m[1]){
			return m[1];
		} else {
			return '@@version';
		}
	};

	var debug = false,
		publish,
		daily,
    	host = window.location.host;

	if(location.search.indexOf('ks-debug') >= 0){
		debug = true;
	}

	// 开发环境
    if (host.match(/^(dev\.|demo)/ig)) {
        debug = true;
    }

	// 线上环境
    if ((host.match(/m.taobao.com/igm) || host.match(/m.trip.taobao.com/igm)) &&
        debug !== true) {
        publish = true;
    }

	// 日常 和 预发环境
    if ((host.match(/wapa.taobao.com/igm) || host.match(/waptest.taobao.com/igm)) &&
        debug !== true) {
        daily = true;
    }

	// 离线包模式 A
	if(!(window.location.protocol.match(/http:/) || 
			window.location.protocol.match(/https:/))){
		debug = true;
	}

	// 离线包模式 B
	if (window._$isOffline$_ || (window.MT_CONFIG && window.MT_CONFIG.offline)) {
        debug = true;
        publish = true;
        daily = false;
    }

	KISSY.Config.debug = debug;
	KISSY.Config.publish = publish;
	KISSY.Config.daily = daily;

	if (debug) {
			KISSY.config({
					combine:false,
					packages:[
						{
							name:"<%= packageName %>",
							path:"<%= srcPath %>",
							charset:"utf-8",
							ignorePackageNameInUri:true,
							debug:true
						}
					]
			});
	} else {
			var srcHost = KISSY.Config.daily ?
					'g.assets.daily.taobao.net' :
					'g.tbcdn.cn';
			KISSY.config({
					combine:true,
					packages: [
							{
									name: '<%= packageName %>',
									path: 'http://' + srcHost +'/<%= groupName %>/<%= packageName %>/' + getVersion(),
									ignorePackageNameInUri: true
							}
					]
			});
	}

	/**
	 * grunt-kmb 支持别名配置，你可以：
	 * 	1. 将别名配置写在 config.js 里，同时配置到 kmb 任务的配置项里
	 * 	2. 将别名配置放在单独的 alias.js 里，页面引用该 js，并在 kmb 任务的配置项里加入该 alias.js 文件路径
	 */
	/*
	 KISSY.config('modules', {
	 		'calendar': {
	 				alias: ['h5-test/widgets/calendar/']
			}
	 });
	 */

})();