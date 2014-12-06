/**************************************************************
 * 共享线程控制
 *
 * 处理所有模型的加载，调用及数据库、文件操作，以消息的形式与客户端通讯
 *
 * @author lonphy
 * @version 0.1
 *
 **************************************************************/
if (!'importScripts' in self) {
    throw new Error('This model can used in Worker only.');
}

(function (exports) {
    "use strict";
    var _L5 = {};
    exports.L5 = _L5;
    _L5.import = function(url) {
        try {
            exports.importScripts.call(exports, url);
        }catch(e){
            console.error(e);
        }finally{
            console.log("线程请求资源："+url);
        }
    };

    // TODO: 项目路径自动获取

    // 导入应用配置信息
    _L5.import('/lib/conf.js');

    // 导入模型核心类
    _L5.import(_L5.CONFIG['root'] + 'back/Model.js');

    /**
     * 连接事件
     */
    exports.onconnect = function (e) {
        var port = e.ports[0];
        port.onmessage = handleMessage;
        port.start();
        console.log(e);
    };

    function handleMessage(e) {
        var that = this,
            data = e.data.data,
            _id = e.data._id,
            run = data['run'].split('.');
        try {
            var mod = _L5.Model.inited(run[0]),
                action = run[1];

            if (typeof(mod[action]) == 'function') { // 判断模型中对应的方法是否存在
                mod[action].call(mod, data.param)
                    .then(function (ret) {
                            that.postMessage({_id: _id, result: ret, error:null, request: data['run']});
                        }, function (e) {
                            console.error(e);
                            that.postMessage({_id: _id, result:null, error: e.message, request: data['run']});
                    });
            }
        } catch(e) {
            that.postMessage({_id: _id, result:null, error: e.message, request: data['run']});
        }
    }
})(self);