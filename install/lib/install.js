/**
 * 应用安装
 */
(function (global) {
    "use strict";

    /**
     * 定义应用的安装状态
     */
    var INSTALL_STATE = {
        NOT_RUN: 0x0,	                              // 未开始
        LOAD_RES: 0x1,				              // 下载对应资源
        WRITE_TO_FILESYSTEM: 0x2,				// 写入文件系统
        MAP_PROC: 0x3,				              // 应用映射处理
        DONE: 0x4					                      // 已安装
    };
    var asyncCall = function (fn, time) {
        time = parseInt(time) || 0;
        setTimeout(fn, time);
    };

    // 当前状态
    var install_run,        // 线程
        state_ = INSTALL_STATE.NOT_RUN, // 当前状态
        is_busy = false,        // 是否在执行某个任务
        handle_dom = {};    // DOM缓存

    /**
     * 开始运行
     */
    var run = function () {
        handle_dom['local_install'] = document.querySelector('footer button.blue');
        handle_dom['window'] = document.getElementById('content');
        handle_dom['local_install'].addEventListener('click', function () {
            if (!is_busy) {
                if (state_ == INSTALL_STATE.NOT_RUN) {
                    changeState(INSTALL_STATE.LOAD_RES);
                }
                else if (state_ == INSTALL_STATE.LOAD_RES) {
                    changeState(INSTALL_STATE.WRITE_TO_FILESYSTEM);
                }
                else if (state_ == INSTALL_STATE.WRITE_TO_FILESYSTEM) {
                    changeState(INSTALL_STATE.MAP_PROC);
                }
                else {
                    changeState(INSTALL_STATE.DONE);
                }
            }
        }, false);
        handle_dom['progress'] = document.querySelector('#view progress');
    };

    var changeState = function (state) {
        handle_dom['local_install'].disabled = false;
        state_ = state;
        if (is_busy) {
            err('亲，请不要疯狂点击，我已经很努力了..');
        }
        is_busy = true;
        switch (state) {
            case INSTALL_STATE.NOT_RUN:
                break;
            case INSTALL_STATE.LOAD_RES:
                handle_dom['window'].classList.add('install');
                loadRes();
                break;
            case INSTALL_STATE.WRITE_TO_FILESYSTEM:
                install_run.postMessage({cmd: "unzip"});
                break;
            case INSTALL_STATE.MAP_PROC:
                break;
            case INSTALL_STATE.DONE:
                break;
            default:
        }
        is_busy = false;
    };
    var err = function (msg) {
        global.L5.Dialog.show(msg, 'error');
    };

    /**
     * 载入资源
     */
    var loadRes = function () {
        install_run = new Worker('lib/download.js');
        install_run.onmessage = message_proc;
        asyncCall(function () {
            install_run.postMessage({cmd: "init", file: "/install/apier.zip"});
        }, 1000);
    };

    var message_proc = function (e) {
        var data = e.data;
        switch (data.type) {
            case 'progress':
                handle_dom['progress'].max = data.total;
                handle_dom['progress'].value = data.loaded;
                break;
            case 'load_done' :
                changeState(INSTALL_STATE.WRITE_TO_FILESYSTEM);
                break;
            default:
                console.log(data);
        }
        console.log(data);
    };

    global.SETUP = {run: run};
})(window);