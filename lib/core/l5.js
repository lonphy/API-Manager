/*******************************************************************************
 * L5 MVC框架核心类
 * 
 * 暂时只支持webkit核心
 * 
 * @author lonphy
 * @version 0.1
 ******************************************************************************/
(function(){
  "use strict";

	/**
	 * CSS动画修正
	 */
	window.onwebkitanimationend = function(e){
		e.animationName=='hide' && e.target.classList.remove('show');
	};
	  
	var L5;

	/**
	* L5 核心分发
	*/
	L5 = function(selector){
		switch( typeof selector) {
			case 'string': // ID选择器
				return document.getElementById(selector);

			case 'function': // DOM Ready 函数
				return L5.ready(selector);
		}
	};
	  
	// DOM 加载处理
	L5.ready = (function() {
		var domReady =[];
		domReady.isReady = false;
		domReady.handle = function() {
			window.removeEventListener('DOMContentLoaded', domReady.handle, false);
			L5.ready = function(fn){ typeof fn==='function' && fn.call(null) };
			domReady.slice() // use slice function canbe faster?
				.forEach(function(func){ func.call(null) });

			domReady.isReady = true;
			domReady = null;			// GC?
		};
		window.addEventListener('DOMContentLoaded',domReady.handle,false);

		return function(fn){
			return typeof fn === 'function' && (
					domReady.isReady
						? fn.call(null)
						: domReady.push(fn)
					);
		};
	}());

	// 
	L5.util = {

		/**
		 * 判断是否是原生函数对象
		 * 
		 * @param {function} obj 需要判断的对象
		 * @returns {boolean}
		 */
		isNativeFun: function(func){
			return typeof fn === 'function' &&
						Function.toString.call(fn).replace(fn.name, '') === "function () { [native code] }";
		},

		error: function(msg){ alert(msg) },

		_errorMsg: "",

		/**
		 * 获取最后一次错误消息
		 * 
		 * @returns {string}
		 */
		lastError: function(){ return this._errorMsg }
	};


	/**
	 * APP 配置处理 localStorage 封装
	 * 
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
		 * 
		 * @param {String} name 配置名
		 * @param {*} type 值类型
		 * @returns {*}
		 */
		Setting.prototype.get = function(name, type) {
			if(!name) return;
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
		 * 
		 * @param {String} name 配置名
		 * @param {*} data 配置值
		 * @return {Setting}
		 */
		Setting.prototype.set = function(name, data) {
			_cache[name] = data||'';
			return this;
		};

		/**
		 * 释放内存配置
		 */
		Setting.prototype.free = function () {_cache = null;};

		/**
		 * 保存内存中的配置
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
                L5.Controller.get(this.actions[0])[this.actions[1]].call(null, this.params);
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
            // 调用回调，并压入上下文
            run && run[1] && run[1].call(run[0] || null, msg.data.data);
            delete _callbacks[msg.data._id];
        }

        function WorkerErrorHandler(e){ console.error(e);}


        function run() {
            var work = new SharedWorker('/lib/core/sharedWorker.js');
            work.onerror = WorkerErrorHandler;
            var port = work.port;
            port.start();
            port.onmessage = MessageProc;
            _thread = port;
        }

        run.prototype = {
            constructor: run,

            /**
            * 发送消息给服务线程
            * 
            * @param option
            */
            send: function (option, callback, ctx) {
                var id = '#' + Date.now(); // 生成本次通讯ID

                // 记录对应回调
                _callbacks[id] = [ctx, callback];
                _thread.postMessage({_id: id, data: option});
            }
        };

        Object.defineProperty($, 'run', {value: new run});
    })(L5);


    /**
    * 控制器核心
    */
    (function($){
        var _controllers = {}; // 存储所有已加载的控制器

        // 控制器
        $.Controller = {

            /**
            * 声明控制器
            * 
            * @param {String} name 控制器类名[大写开头]
            * @param {Function} func 控制器执行体函数
            * @return void
            */
            define: function(name, func){ _controllers[name] = func.call(null, $.run) },

            // 载入全部模型
            loadAll: function(){
                var all = [];
                __config__["controller"]["list"].forEach(function(file){
                    all.push($.Loader.loadController(file))
                });

                Promise.all(all).then(function(result){
                    result.forEach(function(m){ eval(m) })
                }).catch(function(e){
                    console.error(e)
                });
            },

            // 获取模型实例
            get : function(name){ return _controllers[name] }
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
                        resolve(xhr.response);
                    } else {
                        reject(url +"is not found");
                    }
                };
                xhr.onerror = reject;
                xhr.ontimeout = reject;
                xhr.send(null);
            });
        }

        var Loader = {};
        Loader.loadController = function(name) {
            var file = __config__["controller"]["path"] + name + '.js';
            return load(file);
        };

        $.Loader = Loader;
    }(L5));

    L5.go = function(){

        // 直接打到首页去
        if (!!location.hash) {
            location.assign("/apier.html");
        }
        this.Controller.loadAll();
    };
})();