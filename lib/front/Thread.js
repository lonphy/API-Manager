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
        var run = _callbacks[msg.data._id];
        // 调用回调，并压入上下文
        run && run[1] && run[1].call(run[0] || null, msg.data.data);
        delete _callbacks[msg.data._id];
    };

    exports.Thread = {
        /**
         * 发送消息给服务线程
         * @param option 发送的数据
         * @param callback 回调
         * @param ctx 回调上下文
         * @return void
         */
        Send: function (option, callback, ctx) {
            var id = '#' + Date.now(); // 生成本次通讯ID

            // 记录对应回调
            _callbacks[id] = [ctx, callback];
            _thread.postMessage({_id: id, data: option});
        }
    };
})(L5);