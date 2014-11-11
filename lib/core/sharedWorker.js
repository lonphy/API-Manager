/**************************************************************
 * 共享线程控制
 * 
 * 处理所有模型的加载，调用及数据库、文件操作，以消息的形式与客户端通讯
 * 
 * @author lonphy
 * @version 0.1
 * 
 **************************************************************/
"use strict";
if (!'importScripts' in self) {
    throw new Error('This model can used in Worker only.');
}

(function(exports){
	
	var _L5 = {};
	exports.L5 = _L5;
	
	// TODO: 项目路径自动获取
	
	// 导入应用配置信息
	importScripts('/lib/conf.js');
	
	// 导入模型核心类
	importScripts(_L5.CONF['root'] + 'core/Model.js');
	
    /**
     * 连接事件
     */
    exports.onconnect = function (e) {
        var port = e.ports[0];
        port.onmessage = handle_Message;
        port.start();
    };

    function handle_Message(e) {
        this.postMessage('hello');
        var that = this,
              data = e.data.data,
              _id = e.data._id,
              run = data['run'].split('.'),
              mod = _L5.Model.get(run[0]),
	        action = run[1];

        if ( typeof(mod[action]) == 'function' ) { // 判断模型中对应的方法是否存在
            mod[action].call(mod, data.param)
                .then(function (ret) {
                    that.postMessage({_id: _id, data: ret});
                },function(e){console.error(e.stack)});
        }
    }
})(self);