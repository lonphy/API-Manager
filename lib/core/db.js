/**
 * DAO
 * indexedDB 数据库基本操作封装
 * @author lonphy
 * @version 1.0
 */
(function (exports) {
    "use strict";
    var db = null,
        isInit = false;
    exports['db'] = {
        /**
         * 打开数据库
         * @param dbName 数据库名
         * @param dbVersion 数据库版本
         * @returns {Dao}
         */
        init: function (dbName, dbVersion) {
            if (!isInit) {
                dbVersion = dbVersion || 1;
                var req = indexedDB.open(dbName, dbVersion);
                req.onsuccess = function (e) {
                    db = req.result;
                };

                req.onerror = function (e) {
                    console.error(e);
                };

                req.onupgradeneeded = function (e) {
                    var _db = e.target.result;

                    // 清理存在的存储对象
                    if (_db.objectStoreNames.contains('project')) {
                        db.deleteObjectStore("project");
                    }
                    var storeProject = _db.createObjectStore("project", {keyPath: "_id", autoIncrement: true});
                }
            }
        },

        /**
         * 关闭数据库
         */
        close: function () {
            if (isInit) {
                db.close();
            }
        },

        /**
         * 获取一条记录
         * @param storeName 存储对象名称
         * @param id    记录ID
         * @param callback 回调
         */
        get: function (storeName, id, callback) {
            var trans = db.transaction([storeName]);
            trans.objectStore(storeName).get(id).onsuccess = function (e) {
                callback.call(this, e.target.result);
            };
        },

        /**
         * 批量获取数据
         * @param storeName 存储对象名称
         * @param callback 回调函数
         * @param condtion 检索条件
         */
        gets: function (storeName, callback, condtion) {
            var trans = db.transaction([storeName]), ret = [];
            trans.objectStore(storeName).openCursor().onsuccess = function (e) {
                var cursor = e.target.result;
                if (cursor) {
                    ret.push(cursor.value);
                    cursor.continue();
                } else {
                    callback.call(null, ret);
                }
            };
        },

        /**
         * 插入数据
         * @param storeName 存储对象名称
         * @param data 数据
         * @param callback 回调
         */
        insert: function (storeName, data, callback) {
            var store = db.transaction([storeName], 'readwrite').objectStore(storeName);
            var req = store.add(data);
            req.onsuccess = function (e) {
                callback && callback.call(null, true);
            };
        },

        /**
         * 更新数据
         * @param storeName 存储对象名称
         * @param id 记录ID
         * @param data 数据
         * @param callback 回调
         */
        update: function (storeName, id, data, callback) {
            var store = db.transaction([storeName], 'readwrite').objectStore(storeName);
            store.get(id).onsuccess = function (e) {
                var obj = e.target.result;
                for (var k in data) {
                    (k in obj) && (obj[k] = data[k]);
                }
                store.put(obj);
            };
        },

        /**
         * 删除
         * @param storeName
         * @param id
         * @param callback
         */
        del: function (storeName, id, callback) {
            var store = db.transaction([storeName], 'readwrite').objectStore(storeName);
            store.delete(id).onsuccess = function (e) {
                callback && callback.call(null, true);
            };
        }
    };
})($C);