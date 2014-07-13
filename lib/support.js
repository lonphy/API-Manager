(function (global) {
    if (!'import' in document.createElement('link')) {
        console.err("your explorer not support import for link tag.");
    }

    var nav = document.querySelector('#tpl-nav').import;
    var el = nav.querySelector('#nav');

    document.body.appendChild(el.cloneNode(true));


    /*

     */
    var address = {};
    address['addr'] = global.location.pathname;
    address['view'] = address['addr'].substring(1, address['addr'].indexOf('.html'));

    var _L5 = {
        Controls: {},
        util: {
            /**
             * 检查对应页面是否有权限加载该模块
             * @param module 模块名
             * @param actions 允许的动作列表
             * @return boolean
             */
            checkView: function (module, actions) {
                actions = Array.isArray(actions) ? actions : ['list', 'add', 'edit', 'del'];
                var rights = [module.name];
                actions.forEach(function (act) {
                    rights.push(module.name + '_' + act);
                });
                return rights.indexOf(address.view) >= 0;
            }
        }
    };

    /**
     * 共享线程处理
     */
    (function (exports) {
        var _thread = null;
        var _callbacks = {};

        function MessageProc(msg) {
            var run = _callbacks[msg.data._id];
            if (run) {
                // 调用回调，并压入上下文
                run[1] && run[1].call(run[0] || null, msg.data.data);
            }
            delete _callbacks[msg.data._id];
        }


        function run() {
            var work = new SharedWorker('js/thread_db.js');
            var port = work.port;
            port.start();
            port.onmessage = MessageProc;
            _thread = port;
        }

        run.prototype = {
            constructor: run,

            /**
             * 发送消息给服务线程
             * @param option
             */
            send: function (option, callback, ctx) {
                // 生成本次通讯ID
                var id = '#' + Date.now();

                // 记录对应回调
                _callbacks[id] = [ctx, callback];
                _thread.postMessage({_id: id, data: option});
            }
        };

        Object.defineProperty(exports, 'run', {value: new run});
    })(_L5);


    Object.defineProperties(global, {
        L5: {value: _L5, writable: false, enumerable: true, configurable: false}
    });
})(window);