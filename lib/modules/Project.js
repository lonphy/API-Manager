/*******************************************************************************
 * 项目数据模型
 * 
 * @author lonphy
 * @version 0.1
 ******************************************************************************/
(function(col, $){
    col.define("Project", function () {
        var storeName = "project";        // 存储对象名称
        /**
		 * @type {Model}
		 */
        var model;

        return {
            autoInit: true,
            init: function() {
                model = new col.Model(storeName);
            },
            /**
		 * 获取项目详细信息
		 * 
		 * @param {Object}
		 *              cond 查询条件
		 * @returns {Promise}
		 */
            get: function (cond) {
                return new Promise(function(resolve, reject){
                    console.log(cond);
                    if (cond['_id']) {
                        model.get(cond['id']).then(resolve, reject);
                    }else {
                        reject(Error("无效的查询条件"));
                    }
                });
             },
             gets: function(options) {
                 return new Promise(function(resolve, reject){
                      model.store(storeName).getAll().then(resolve, reject);
                 });
             },
             add: function (data, callback) {
                  model.insert(storeName, data).then(callback);
             }
        };
});
})(L5.Model, L5);