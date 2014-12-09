/**
 * 共享线程客户端
 *
 * @author lonphy
 * @version 0.1
 */
(function (exports) {
    var _thread = null,
        worker,
        _callbacks = {};

    worker = new SharedWorker('/lib/back/sharedWorker.js');
    worker.onerror = function (e) {
        console.log(e);
    };

    _thread = worker.port;
    _thread.start();
    _thread.onmessage = function (msg) {
        console.log(msg.data);
        console.log(msg.data.result);
        var p = _callbacks[msg.data._id];
        var error = msg.data.error;
        if (error === null) {
            p.resolve(msg.data.result);
        } else {
            p.reject(new Error(error));
        }
        delete _callbacks[msg.data._id];
    };

    exports.Thread = {
        /**
         * 发送消息给服务线程
         * @param option 发送的数据
         * @param callback 回调
         * @param ctx 回调上下文
         * @return {Promise}
         */
        Send: function (option) {

            return new Promise(function(res, rej){
                var id = '#' + Date.now(); // 生成本次通讯ID
                // 记录对应回调
                _callbacks[id] = {resolve:res, reject:rej};
                _thread.postMessage({_id: id, data: option});
                console.log(option.run);
            }).catch(function(e){
                L5.UI.Dialog.showErr("出错了：" + e.message.replace("\n", "<br/>"));
            });
        }
    };
})(L5);