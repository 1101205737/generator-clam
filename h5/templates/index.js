/**
 * @fileoverview <%= projectName %> - <%= modName %>.
 * @author <%=author %><<%=email %>>.
 */
/**
 * KISSY.use('<%= packageName %>/<%= mojoName %>/index',function(S,<%= modName %>){
 *		new <%= modName %>();
 * });
 */
KISSY.add(function (S, Base, Node) {

	"use strict";

	// grunt-kmb 暂不支持 CMD 规范构建
	//var Node = require('node');
	//var Base = require('base');

    var $ = Node.all;

	var <%= modName %> = Base.extend({
		initializer:function(){
			var self = this;

			// 从这里开始写你的代码
			alert('ok');
		}
	},{
		ATTRS: {
			A:{
				value:'abc'
			}
		}
	});

	return <%= modName %>;
	
}, {
	requires: ['base', 'node']
});
