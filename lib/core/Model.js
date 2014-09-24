/**
 * DAO
 * indexedDB 数据库基本操作封装
 * @author lonphy
 * @version 1.0
 */
(function (exports) {
      "use strict";
      var db = null, isInit = false;

      /**
       * 查询模型
       * @param {String} storeName 存储对象名称
       * @constructor
       */
      function Model(storeName){
            this._storeName = storeName || '';
            this._indexKey =  '';       // 使用的索引
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
            store: function(name) { this._storeName = name; return this;},

            /**
             * 设置需要使用的索引
             * @param name 索引名字
             * @return Model
             */
            idx: function(name) { this._indexKey = name; return this; },

            /**
             * 设置索引值范围上限
             * @param value 上限值
             * @param flag 是否包含上限 默认包含
             * @returns {Model}
             */
            upper: function(value, flag) { this._rangeUpper = value;this._rangeUpperFlag= flag;return this;},

            /**
             * 设置索引值范围下限
             * @param value 下限值
             * @param flag 是否包含下限 默认包含
             * @returns {Model}
             */
            lower: function(value, flag) { this._rangeLower = value;this._rangeLowerFlag= flag;return this;},

            /**
             * 设置索引值
             * @param value 值
             * @returns {Model}
             */
            only: function(value) { this._rangeOnly = value;return this;},

            /**
             * 设置索引的范围
             * @param lower 下限值
             * @param upper 上限值
             * @param lower_flag 是否包含下限，默认包含
             * @param upper_flag 是否包含上限， 默认包含
             * @returns {Model}
             */
            range: function(lower, upper, lower_flag, upper_flag) {
                  this._rangeLower = lower;
                  this._rangeLowerFlag = lower_flag;
                  this._rangeUpper = upper;
                  this._rangeUpperFlag = upper_flag;
                  return this;
            },
            order: function(sort) {},
            limit: function(offset, limit) {},
            get: function(id) {
                  var that = this;
                  return new Promise(function (resolve, reject) {
                        var trans = db.transaction([that._storeName]);
                        var store = trans.objectStore(that._storeName);
                        var request = store.get(id);
                        request.onsuccess = function (e) {
                              console.log(e);
                              resolve(e.target.result);
                        };
                        request.onerror = function (e) {
                              console.log(e);
                              reject(Error(e));
                        }
                  });
            },
            getAll: function() {
                  var that = this;
                  return new Promise(function(resolve, reject){

                        // 打开一个读取事务 IDBTransaction
                        var transaction = db.transaction([that._storeName]);

                        // 打开存储对象 IDBObjectStore
                        var store = transaction.objectStore(that._storeName);


                        // 使用索引 IDBIndex
                        if (that._indexKey) {
                              var index = store.index(that._indexKey);
                        }

                        // TODO:处理范围
                        var range = null;
                        if(that._rangeOnly) {
                              range = IDBKeyRange.only(that._rangeOnly);
                        } else if (that._rangeLower && that._rangeUpper) {
                              range = IDBKeyRange.bound(that._rangeLower, that._rangeUpper, that._rangeLowerFlag, that._rangeUpperFlag);
                        } else if (that._rangeLower) {
                              range = IDBKeyRange.lowerBound(that._rangeLower, that._rangeLowerFlag);
                        } else if (that._rangeUpper) {
                              range = IDBKeyRange.upperBound(that._rangeUpper, that._rangeUpperFlag);
                        }

                        // 打开游标 IDBCursor
                         var request = (store || index).openCursor(range, that._sort);

                        var ret =[];

                        request.onsuccess = function(e){
                              var cursor = e.target.result;
                              if (!cursor) {
                                    resolve(ret);
                              }else {
                                    ret.push(cursor.value);
                                    cursor.continue();
                              }
                        };
                        request.onerror =reject;
                  });
            },

            insert: function(data) {
                  var that = this;
                  return new Promise(function (resolve, reject) {
                        var trans = db.transaction([that._storeName], 'readwrite');
                        var store = trans.objectStore(that._storeName);
                        var request = store.add(data);
                        request.onsuccess = function (e) {
                              resolve(e);
                        };
                        request.onerror = reject;
                  });
            },

            update: function(id, data) {
                  var that = this;
                  return new Promise(function(resovle, reject){
                        var trans = db.transaction([that._storeName], 'readwrite');
                        var store = trans.objectStore(that._storeName);
                        var request = store.get(id);
                        request.onsuccess = function (e) {
                              var obj = e.target.result;
                              for (var k in data) {
                                    obj.hasOwnProperty(k) && (obj[k] = data[k]);
                              }
                              store.put(obj);
                        };
                        request.onerror = reject;
                  });
            },

            del: function(id) {
                  var that = this;
                  return new Promise(function(resovle, reject) {
                        var trans = db.transaction([that._storeName], 'readwrite');
                        var store = trans.objectStore(that._storeName);
                        var request = store.delete(id);
                        request.onsuccess = function (e) {
                              resovle(e);
                        };

                        request.onerror = reject;
                  });
            }
      };

      /**
       * 模型初始化
       * @param dbName
       * @param ver
       */
      Model.init = function(dbName, ver) {
            if (isInit) return;
            var req = indexedDB.open(dbName, ver || 1);
            console.dir(req);
            req.onsuccess = function (e) {
                  db = e.target.result;
            };
            req.onerror = function (e) {
                  console.error(e);
            };
            req.onupgradeneeded = function (e) {
                  var _db = e.target.result;

                  // 清理存在的存储对象
                  if (_db.objectStoreNames.contains('project')) {
                        _db.deleteObjectStore("project");
                  }
                  var projectStore = _db.createObjectStore("project", {keyPath: "_id", autoIncrement: true});
                  console.dir(projectStore.createIndex('idx_mul', ['date', 'name']));
            };
      };

      Model.close = function() {
            if (isInit) {
                  db.close();
            }
      };


      exports['Model'] = Model;
})($C);