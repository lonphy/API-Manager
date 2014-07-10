/**
 * 应用安装
 */
(function(global){
	"use strict";
	
	/**
	 * 定义应用的安装状态
	 */
	var INSTALL_STATE = Object.create(null);
	Object.defineProperties(INSTALL_STATE, {
		NOT_RUN:				{value:0x0},				// 未开始
		CHECK_EVN:				{value:0x1},				// 检查支持环境
		LOAD_RES:				{value:0x2},				// 下载对应资源
		WRITE_TO_FILESYSTEM: 	{value:0x3},				// 写入文件系统
		MAP_PROC: 				{value:0x4},				// 应用映射处理
		DONE:					{value:0x5}					// 已安装
	});
	
	// 当前状态
	var state_ = INSTALL_STATE.NOT_RUN,is_busy = false;
	
	// DOM 缓存
	var handle_dom = {};
	
	var SETUP = {
		run: function() {
			this._init();
		},
		
		_next: function() {
			if (is_busy) {
				this.error('亲，请不要疯狂点击，我已经很努力了..');
			}
			is_busy = true;
			switch(state_) {
			case INSTALL_STATE.NOT_RUN:
				break;
			case INSTALL_STATE.CHECK_EVN:
				handle_dom['window'].classList.add('install');
				if(!L5.util.canInstall()) {
					this.error(L5.util.lastError());
				}else{
					handle_dom['local_install'].disabled = false;
				}
				break;
			case INSTALL_STATE.LOAD_RES:
				this.error('亲，请不要疯狂点击，我已经很努力了..');
				break;
			case INSTALL_STATE.WRITE_TO_FILESYSTEM:
				break;
			case INSTALL_STATE.MAP_PROC:
				break;
			case INSTALL_STATE.DONE:
				break;
			default:
			}
			is_busy = false;
		},
		_init: function() {
			handle_dom['local_install'] = document.querySelector('footer button.blue');
			handle_dom['window'] = document.getElementById('content');
			var that = this;
		    handle_dom['local_install'].addEventListener('click', function () {
		    	if ( !is_busy ) {
			    	if(state_ == INSTALL_STATE.NOT_RUN) {
			    		that._changeState(INSTALL_STATE.CHECK_EVN);
			    	}else if(state_ == INSTALL_STATE.CHECK_EVN) {
			    		that._changeState(INSTALL_STATE.LOAD_RES);
			    	}
		    	}
		    }, false);
		},
		_changeState: function(state) {
			state_ = state;
			this._next();
		},
		error: function(msg) {
			(new Dialog('dialog')).setMsg(msg).show();
		}
	};
	
	var PROC_CHECK_EVN = function() {

	};
	
	
	function Dialog(id) {
		if(!(Dialog.instance instanceof Dialog)) {
			this.dom = document.getElementById(id);
			this.title = '';
			this._msg = '';
			this.type = '';
			this.isShow = false;
			this.isDerty = false;
		}
		return Dialog.instance;
	}
	
	Dialog.prototype = {
		constructor: Dialog,
		setMsg: function(msg) {
			this._msg = msg || '';
			return this;
		},
		
		show: function() {
			this.isDerty && (this.dom.children('p').innerText = this._msg);
			!this.isShow && this.dom.classList.add('show');
			this.isShow = true;
		},
		
		close: function() {
			this.dom.children('p').innerText = '';
			this.isDerty = false;
			this.isShow && this.dom.classList.remove('show');
			this.isShow = false;
		}
	};
    global.SETUP = SETUP;
})(window);