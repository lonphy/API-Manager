/**
 * 检查应用安装状态
 */
(function(){
	"use strict";
    var L5 = {};

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
         * 检查是否满足本地安装的条件
         * @returns {boolean}
         */
        canInstall: function () {
            var support = ['Storage', 'aWorker', 'SharedWorker', 'indexedDB', 'requestFileSystem'];
            for (var i = 0, l = support.length; i < l; ++i) {
                if (!L5.util.isNativeFun(window[support[i]])) {
                    this._errorMsg = support[i] + "not support!";
                    return false;
                }
            }
            return true;
        },

        /**
         * 获取最后一次错误消息
         * @returns {string}
         */
        lastError: function () {
            return this._errorMsg;
        },

        goInstall: function () {
            if (location.pathname.split('/').pop().split('.').shift() !== 'install') {
                location.replace('/install/install.html');
            }
        }
    };


    /**
     * @type {Setting}
     */
    L5.Setting = (function () {
		
		var _cache={};

        /**
         * 全局设置类
         * @constructor
         */
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
        Setting.prototype.free = function () {
			_cache = null;
		};

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
    !L5.Setting.get('installed', 'bool') && L5.util.goInstall();

    window.L5 = L5;
})();