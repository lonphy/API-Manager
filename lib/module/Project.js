/**
 * 项目数据模型
 */
Loader.register("Project", (function () {

    var storeName = "project";        // 存储对象名称

    return {
        autoInit: false,
          /**
           * 获取项目详细信息
           * @param {Object} cond 查询条件
           * @returns {Promise}
           */
        get: function (cond) {
              return new Promise(function(resolve, reject){
                    if (cond['id']) {
                          $C.db.get(storeName, cond['id']).then(resolve, reject);
                    }
                    reject(Error("无效的查询条件"));
              });
        },
        add: function (data, callback) {
            $C.db.insert(storeName, data).then(callback);
        }
    };
})());