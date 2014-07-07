/**
 * 检查应用安装状态
 */
(function(){
	"use strict";
	var supports = {};
	
	// 检查必要的环境支持
	if ( window.Worker ) {
		supports['worker'] = true;
	}
	
	if ( window.SharedWorker ) {
		supports['sworker'] = true;
	}
	console.log(supports);
	
	var Setting = (function(){
		
		var _cache={};
		
		function Setting(){
			var len = localStorage.length,i,k;
			for(i=0;i<len;++i) {
				k =localStorage.key(i);
				_cache[k] = localStorage.getItem(k);
			}
		}
		
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
		
		Setting.prototype.set = function(name, data) {
			_cache[name] = data||'';
		};
		
		Setting.prototype.clear = function() {
			localStorage.clear();
			_cache = null;
		};
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
		};
		
		return new Setting;
	})();
	
	// 简单的持久存储
	var info = Setting.get('installed', 'bool');
	
	console.log(info);

	function install() {
		location.replace('/fs/index.html');
	}
	window.Setting = Setting;
})();