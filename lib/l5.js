/**
 * 检查应用安装状态
 */
(function(){
	"use strict";

      /**
       * CSS动画修正
       */
      window.onwebkitanimationend = function(e){
            e.animationName =='hide' && e. target.classList.remove('show') ;
      };

    var L5 = {};

      /****************************************************
       * DOM 加载处理
       ****************************************************/
      L5.ready = (function() {
            var domReady =[];
            domReady.isReady = false;
            domReady.handel = function() {
                  window.removeEventListener('DOMContentLoaded', domReady.handle, false);
                  delete  L5.ready;
                  L5.ready = function(fn){typeof fn === 'function' &&fn()};
                  domReady.forEach(function(func){
                        func.call(null);
                  });
                  domReady.isReady = true;
                  domReady = null;
            };
            window.addEventListener('DOMContentLoaded',domReady.handel,false);
            return function(fn){
                  return typeof fn === 'function' && (domReady.isReady ? fn():domReady.push(fn));
             }
      }());

    L5.util = {

        /**
         * 判断是否是原生支持对象
         * @param {function} fn
         * @returns {boolean}
         */
        isNativeFun: function (fn) {
            return typeof fn === 'function' && Function.toString.call(fn).replace(fn.name, '') === "function () { [native code] }";
        },

        error: function (msg) {
            alert(msg);
        },

        _errorMsg: "",

        /**
         * 获取最后一次错误消息
         * @returns {string}
         */
        lastError: function () {
            return this._errorMsg;
        }
    };


    /**
     * APP 配置处理
     * localStorage 封装
     * @type {Setting}
     */
    L5.Setting = (function () {
		
		var _cache={};

		function Setting(){
			var len = localStorage.length,i,k;
			for(i=0;i<len;++i) {
				k =localStorage.key(i);
				_cache[k] = localStorage.getItem(k);
			}
		}

        /**
         * 获取某个配置
         * @param name 配置名
         * @param type 值类型
         * @returns {*}
         */
		Setting.prototype.get = function(name, type) {
			if(!name) {
				throw new Error('first parameter[name] is empty.');
			}
			var val = null;
			if (name in _cache && _cache.hasOwnProperty(name)) {
				val = _cache[name];
				switch(type) {
				case 'int':
					val = parseInt(val);
					break;
				case 'float':
					val = parseFloat(val);
					break;
				case 'bool':
					val = !!val;
					break;
				case 'obj':
					val = JSON.parse(val);
					break;
				case 'str':
					default:
				}
			}
			return val;
		};

        /**
         * 设置某个配置
         * @param name 配置名
         * @param data 配置值
         */
		Setting.prototype.set = function(name, data) {
			_cache[name] = data||'';
                  return this;
		};

        /**
         * 释放配置类
         */
        Setting.prototype.free = function () {_cache = null;};

        /**
         * 保存配置
         */
		Setting.prototype.save = function() {
			var k, val;
			for(k in _cache) {
				if (_cache.hasOwnProperty(k)) {
					val = _cache[k];
					if( Array.isArray(val) || typeof val === 'object') {
						val = JSON.stringify(val);
					}
					localStorage.setItem(k, val);
				}
			}
            return this;
		};
		
		return new Setting;
	})();

    // 如果没有安装，则跳到安装页
   // !L5.Setting.get('installed', 'bool') && L5.util.goInstall();
    
    /**
     * 全局对话框类
     */
    L5.Dialog = (function(){
    	var instance={};
    	
    	return {
    		show: function(msg, type) {
    			if(!instance[type]) {
                    instance[type] = document.createElement('l5-dialog');
    				instance[type].setAttribute('type', type);
    				document.body.appendChild(instance[type]);
    			}
    			instance[type].textContent = msg || '';
    			instance[type].open();
    		}
    	};
    })();
    window.L5 = L5;

      /**
       * 路由处理
       */
      (function(exports){
            function Router() {
                  this.hash = location.hash;
                  this.actions = [];
                  this.params = {};

                  var that = this;
                  window.addEventListener("hashchange", function(){
                        return that.hashChangeHandle();
                  }, false);
            }

            Router.prototype = {
                  parseRequest: function(){
                        this.actions = [];

                        var hash = location.hash || '#index';
                        hash = hash.substr(1).split('?');

                        var actions = hash[0].split(".");
                        this.actions[0] = actions[0] || 'index';
                        this.actions[1] = actions[1] || 'list';

                        var params = {};
                        if (!!hash[1]) {
                              var queries = hash[1].split("&"), req;
                              queries.forEach(function(item){
                                    req = item.split('=');
                                    req[0] && (params[req[0]] = req[1]);
                              });
                        }

                        this.params = params;
                  },
                  hashChangeHandle: function(){
                        this.parseRequest();
                        L5.Module.get(this.actions[0])[this.actions[1]].call(null, this.params);
                        return false;
                  }
            };
            new Router();
      })(L5);



      /**
       * 共享线程处理
       */
      (function ($) {
            var _thread = null;
            var _callbacks = {};

            function MessageProc(msg) {
                  var run = _callbacks[msg.data._id];
                  if (run) {
                        // 调用回调，并压入上下文
                        run[1] && run[1].call(run[0] || null, msg.data.data);
                  }
                  delete _callbacks[msg.data._id];
            }


            function run() {
                  var work = new SharedWorker('/lib/thread_db.js');
                  var port = work.port;
                  port.start();
                  port.onmessage = MessageProc;
                  _thread = port;
            }

            run.prototype = {
                  constructor: run,

                  /**
                   * 发送消息给服务线程
                   * @param option
                   */
                  send: function (option, callback, ctx) {
                        // 生成本次通讯ID
                        var id = '#' + Date.now();

                        // 记录对应回调
                        _callbacks[id] = [ctx, callback];
                        _thread.postMessage({_id: id, data: option});
                  }
            };

            Object.defineProperty($, 'run', {value: new run});
      })(L5);


      /**
       * ViewModule核心
       */
      (function($){
            // 存储所有已加载的视图模型
            var modules = {};

            // 模型包
            $.Module = {

                  // 定义模型
                  define: function(name, f){
                        modules[name] = f.call(null, $.run);
                  },

                  // 载入全部模型
                  loadAll: function(){
                        var all = [];
                        __config__["moduleView"]["list"].forEach(function(file){
                              all.push($.Loader.loadModuleView(file));
                        });

                        Promise.all(all).then(function(result){
                              result.forEach(function(m){
                                    eval(m);
                              });
                        }).catch(function(e){
                              console.error(e);
                        });
                  },

                  // 获取模型实例
                  get : function(name){
                        return modules[name];
                  }
            };
      }(L5));


      /**
       * 加载模块
       */
      (function($){
            var load = function(url) {
                  return new Promise(function(resolve, reject){
                        var xhr = new XMLHttpRequest();
                        xhr.open("get",url);
                        xhr.onloadend = function() {
                              if (xhr.status == 200) {
                                    resolve(xhr.response)
                              } else {
                                    reject(url +"is not found");
                              }
                        };
                        xhr.onerror = reject;
                        xhr.ontimeout = reject;
                        xhr.send(null);
                  });
            }

            var Loader = {}
            Loader.loadModuleView = function(name) {
                  var file = __config__["moduleView"]["path"] + name + '.js';
                  return load(file);
            };

            $.Loader = Loader;
      }(L5));

      L5.go = function(){

            // 直接打到首页去
            if (!!location.hash) {
                  location.assign("/apier.html");
            }
            this.Module.loadAll();
      };
})();