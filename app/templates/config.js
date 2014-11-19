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
})();

/*
// KISSY 提供别名设置，但我们不推荐这样做，因为 KMC 不识别别名
KISSY.config({
    modules:{
        'zepto': {
            alias:['h5-car/widgets/libs/zepto']
        }
    }
});
*/