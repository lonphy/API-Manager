/*******************************************************************************
 * 类型数据模型
 *
 * @author lonphy
 * @version 0.1
 ******************************************************************************/
(function ($) {
    "use strict";

    $.Model.define("Types", function (Model) {
        var storeName = "types";        // 存储对象名称
        /**
         * @type {Model}
         */
        var model = new Model(storeName);

        return {
            /**
             * 获取详细信息
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
            add: function (data) {return model.insert(data);}
        };
    });
})(L5);