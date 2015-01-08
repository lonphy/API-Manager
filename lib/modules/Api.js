/*******************************************************************************
 * 项目数据模型
 *
 * @author lonphy
 * @version 0.1
 ******************************************************************************/
(function ($) {
    "use strict";

    $.Model.define("Api", function (Model) {
        var storeName = "apis";        // 存储对象名称
        /**
         * @type {Model}
         */
        var model = new Model(storeName);

        return {
            /**
             * 获取项目详细信息
             *
             * @param {Object} cond 查询条件
             * @returns {Promise}
             */
            get: function (cond) {
                return  model.get(cond['id']);
            },
            gets: function (options) {
                return  model.getAll();
            },
            edit: function(data) {
                return model.update(data['id'], data);
            },
            add: function (data) {
                data['_time'] = Date.now();
                return model.insert(data);
            },
            'delete': function(id) {
                return model.del(id);
            }
        };
    });
})(L5);