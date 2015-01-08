/**************************************************************
 * Model 模型核心类
 * @author lonphy
 * @version 0.1
 **************************************************************/
(function (exports) {
    "use strict";
    var db = null,
        isInit = false,
        loadedModule = {},
        MOD_DIR = exports.CONFIG['root'] + exports.CONFIG['module']['path'];

    /**
     * 查询模型
     * @param {String} storeName 存储对象名称
     * @constructor
     */
    function Model(storeName) {
        this._storeName = storeName || '';
        this._indexKey = '';       // 使用的索引
        this._rangeUpper = '';
        this._rangeUpperFlag = false;
        this._rangeLower = '';
        this._rangeLowerFlag = false;
        this._rangeOnly = '';

        this._sort = 'next';
    }

    Model.prototype = {
        constructor: Model,

        /**
         * 选定存贮对象
         * @param name 存储对象名字
         * @return Model
         */
        store: function (name) {
            return this._storeName=name, this;
        },

        /**
         * 设置需要使用的索引
         * @param name 索引名字
         * @return Model
         */
        idx: function (name) {
            return this._indexKey=name, this;
        },

        /**
         * 设置索引值范围上限
         * @param value 上限值
         * @param flag 是否包含上限 默认包含
         * @returns {Model}
         */
        upper: function (value, flag) {
            return this._rangeUpper=value,this._rangeUpperFlag =flag, this;
        },

        /**
         * 设置索引值范围下限
         * @param value 下限值
         * @param flag 是否包含下限 默认包含
         * @returns {Model}
         */
        lower: function (value, flag) {
            return this._rangeLower = value,this._rangeLowerFlag = flag, this;
        },

        /**
         * 设置索引值
         * @param value 值
         * @returns {Model}
         */
        only: function (value) { return this._rangeOnly=value, this },

        /**
         * 设置索引的范围
         * @param lower 下限值
         * @param upper 上限值
         * @param lower_flag 是否包含下限，默认包含
         * @param upper_flag 是否包含上限， 默认包含
         * @returns {Model}
         */
        range: function (lower, upper, lower_flag, upper_flag) {
            this._rangeLower = lower;
            this._rangeLowerFlag = lower_flag;
            this._rangeUpper = upper;
            this._rangeUpperFlag = upper_flag;
            return this;
        },
        order: function (sort) {
        },
        limit: function (offset, limit) {
        },
        get: function (id) {
            return new Promise(function (resolve, reject) {
                var trans = db.transaction([this._storeName]);
                var store = trans.objectStore(this._storeName);
                var request = store.get(id);
                request.onsuccess = function (e) { resolve(e.target.result) };
                request.onerror = function(e) {reject(e.target.error) };
            }.bind(this));
        },
        getAll: function () {
            return new Promise(function (resolve, reject) {
                var transaction = db.transaction([this._storeName]);  // open a read IDBTransaction
                var store = transaction.objectStore(this._storeName),index; // open IDBObjectStore
                this._indexKey && (index = store.index(this._indexKey)); // need use IDBIndex

                var range = null;
                if (this._rangeOnly) {
                    range = IDBKeyRange.only(this._rangeOnly);
                } else if (this._rangeLower && this._rangeUpper) {
                    range = IDBKeyRange.bound(this._rangeLower, this._rangeUpper, this._rangeLowerFlag, this._rangeUpperFlag);
                } else if (this._rangeLower) {
                    range = IDBKeyRange.lowerBound(this._rangeLower, this._rangeLowerFlag);
                } else if (this._rangeUpper) {
                    range = IDBKeyRange.upperBound(this._rangeUpper, this._rangeUpperFlag);
                }

                // 打开游标 IDBCursor
                var request = (store || index).openCursor(range, this._sort);
                var ret = [];

                request.onsuccess = function (e) {
                    var cursor = e.target.result;
                    if(!cursor){
                        resolve(ret);
                        return;
                    }
                    ret.push(cursor.value);
                    cursor.continue();
                };
                request.onerror = function(e) { reject(e.target.error) };
            }.bind(this));
        },

        insert: function (data) {
            return new Promise(function (resolve, reject) {
                var trans = db.transaction([this._storeName], 'readwrite');
                var store = trans.objectStore(this._storeName);
                var request = store.add(data);
                request.onsuccess = function (e) { resolve(e.target.result) };
                request.onerror = function(e) { reject(e.target.error) };
            }.bind(this));
        },

        update: function (id, data) {
            return new Promise(function (resovle, reject) {
                var trans = db.transaction([this._storeName], 'readwrite');
                var store = trans.objectStore(this._storeName);
                var getRequest = store.get(id);
                getRequest.onsuccess = function(e){
                    var obj = e.target.result, k;
                    if (!obj) {
                        reject("recode id "+id+" is not exists.");
                    }
                    // merge new obj to old obj
                    for (k in data) {
                        data.hasOwnProperty(k) && (obj[k]=data[k]);
                    }
                    console.log(obj);
                    var putRequest = store.put(obj);
                    putRequest.onsuccess = function(e) {resovle(true) };
                    putRequest.onerror = function(e) { reject(e.target.error); };

                };
                getRequest.onerror = function(e) { reject(e.target.error) };
            }.bind(this));
        },

        del: function (id) {
            return new Promise(function (resovle, reject) {
                var trans = db.transaction([this._storeName], 'readwrite');
                var store = trans.objectStore(this._storeName);
                var request = store.delete(id);
                request.onsuccess = function (e) { resovle(true) };
                request.onerror = function(e) { reject(e.target.error); }
            }.bind(this));
        }
    };


    Model.close = function () {
        isInit && db.close();
    };

    /**
     * 供外部包定义模块
     * @param name 模块名称
     * @param obj   模块
     */
    Model.define = function (name, obj) {
        if (!loadedModule[name]) {
            loadedModule[name] = obj.call && obj.call(null, Model);
        }
    };

    /**
     * 实例化模块
     * @param name 模块名称
     * @returns Object
     */
    Model.inited = function (name) {
        if(!name) {
            return null;
        }
        if (!loadedModule[name]) {
            exports.import(MOD_DIR + name + '.js');
        }
        if (!loadedModule[name]) {
            throw new Error("Module "+ name + " is not found. \n Please check "+ MOD_DIR + name + '.js');
        }
        return loadedModule[name];
    };

    /**
     * 模型初始化
     */
    (function () {
        if (isInit) return;
        var conf = exports.CONFIG['db'];
        var req = indexedDB.open(conf['name'], conf['version'] || 1);
        req.onsuccess = function (e) {
            db = e.target.result;
        };
        req.onerror = function (e) {
            console.error(e);
        };
        req.onupgradeneeded = function (e) {
            var _db = e.target.result;

            // 清理存在的存储对象
            //_db.objectStoreNames.contains('project')    && _db.deleteObjectStore("project");
            //_db.objectStoreNames.contains('apis')       && _db.deleteObjectStore("apis");
            //_db.objectStoreNames.contains('tasks')      && _db.deleteObjectStore("tasks");
            _db.objectStoreNames.contains('types')      && _db.deleteObjectStore("types");

            /*_db.createObjectStore("project", {keyPath: "id", autoIncrement: true})
                            .createIndex("idx_name", "name", {unique:true});
            _db.createObjectStore("apis", {keyPath: "id", autoIncrement: true});
            _db.createObjectStore("tasks", {keyPath: "id", autoIncrement: true});
            */
        };
    }());

    exports['Model'] = Model;
})(L5);