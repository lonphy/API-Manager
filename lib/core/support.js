(function (global) {



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



    Object.defineProperties(global, {
        L5: {value: _L5, writable: false, enumerable: true, configurable: false}
    });
})(window);