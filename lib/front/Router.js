/**
 * 路由处理
 *
 * @author lonphy
 * @version 0.1
 */
(function (exports) {
    var hash, actions = [], params = {};

    function initRouter() {
        window.addEventListener("hashchange", function () {
            parseRequest();
            exports.Controller.get(actions[0])[actions[1]].call(null, params);
            return false;
        }, false);
    }

    function parseRequest() {
        actions = [];
        hash = location.hash || '#index';
        hash = hash.substr(1).split('?');

        actions = hash[0].split(".");
        actions[0] = actions[0] || 'index';
        actions[1] = actions[1] || 'list';

        params = {};
        if (!!hash[1]) {
            var queries = hash[1].split("&"), req;
            queries.forEach(function (item) {
                req = item.split('=');
                req[0] && (params[req[0]] = req[1]);
            });
        }
    }

    exports.Router = {
        init: initRouter,
        /**
         * 获取当前路由数据信息
         */
        get: function(){
            return {hash: hash,actions: actions,param:params}
        }
    };
})(L5);