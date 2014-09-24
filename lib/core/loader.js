/**
 * 线程脚本模块加载器
 * @usage Loader.register();
 * @version 1.0
 * @author lonphy
 * @date 2014-07-04
 */
Object.defineProperty(self, "Loader", {
        value: (function () {
            var loadedModule = {},
                PATH = ROOT_PATH + L5_CONF.module.path;

            return {
                /**
                 * 供外部包注册模块
                 * @param name 模块名称
                 * @param type  模块类型
                 * @param obj   模块
                 */
                register: function (name, obj) {
                    if (!loadedModule[name]) {
                        loadedModule[name] = obj;
                        if (obj.autoInit && typeof(obj.init) == 'function') {
                            obj.init.call(null);
                        }
                    }
                },

                /**
                 * 获取模块
                 * @param name 模块名称
                 * @returns Object
                 */
                get: function (name) {
                    if (!loadedModule[name]) {
                        importScripts(PATH + name + '.js');
                    }
                    return loadedModule[name];
                }
            };
        })()
    }
);