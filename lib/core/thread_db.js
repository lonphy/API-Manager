"use strict";
// 定义全局变量
Object.defineProperty(self, "ROOT_PATH", {
    value:  "/lib"
});

// 核心类容器
var $C = {};

// 导入应用配置信息
importScripts(self.ROOT_PATH + '/conf.js');

// 导入模块加载器
importScripts(self.ROOT_PATH + '/core/loader.js');

// 初始化核心模块
(function () {
    // 导入数据库基础类,并初始化
    importScripts(self.ROOT_PATH + '/core/Model.js');
    $C.Model.init(L5_CONF.db.name, L5_CONF.db.version);
})();


self.onconnect = function (e) {
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
        mod = Loader.get(run[0]),
        action = run[1];

    if (typeof(mod[action]) == 'function') {// 判断模型中对应的方法是否存在
            mod[action].call(mod, data.param)
                  .then(function (ret) {
                        that.postMessage({_id: _id, data: ret});
                  },function(e){
                        console.error(e.stack);
                  });
    }
}