/**
 * 控制器核心
 *
 * @author lonphy
 * @version 0.1
 */
(function (exports) {
    var _controllers = {}; // 存储所有已加载的控制器

    function load(url) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open("get", url);
            xhr.onloadend = function () {
                if (xhr.status == 200) {
                    resolve(xhr.response);
                } else {
                    reject(url + "is not found");
                }
            };
            xhr.onerror = reject;
            xhr.ontimeout = reject;
            xhr.send(null);
        });
    }

    function loadController(name) {
        var file = __config__["controller"]["path"] + name + '.js';
        return load(file);
    };

    // 控制器
    exports.Controller = {

        /**
         * 声明控制器
         *
         * @param {String} name 控制器类名[大写开头]
         * @param {Function} func 控制器执行体函数
         * @return void
         */
        define: function (name, func) {
            _controllers[name] = func.call(null, exports.Thread);
        },

        // 控制器初始化
        init: function () {
            var all = [];
            __config__["controller"]["list"].forEach(function (file) {
                all.push(loadController(file))
            });

            Promise.all(all).then(function (result) {
                result.forEach(function (m) {
                    eval(m)
                })
            }).catch(function (e) {
                    console.error(e)
                });
        },

        // 获取模型实例
        get: function (name) {
            return _controllers[name]
        }
    };
}(L5));