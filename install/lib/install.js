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
            UNZIP: 0x2,				                      // 解压资源
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
                  }
            }, false);
            handle_dom['progress'] = document.querySelector('#view progress');
            handle_dom['msg'] = document.querySelector('#view p');
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
                        handle_dom['local_install'].disabled = true;
                        handle_dom['window'].classList.add('install');
                        loadRes();
                        break;
                  case INSTALL_STATE.UNZIP:
                        handle_dom['msg'].innerText = '开始解压。。';
                        install_run.postMessage({cmd: "unzip"});
                        break;
                  case INSTALL_STATE.MAP_PROC:
                        break;
                  case INSTALL_STATE.DONE:
                        handle_dom['msg'].innerText = '恭喜您，安装完毕';
                        handle_dom['local_install'].innerText = "立即运行";
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
            navigator.webkitPersistentStorage.requestQuota(100 * 1024 * 1024, function (grantedBytes) {
                  install_run = new Worker('lib/download.js');
                  install_run.onmessage = message_proc;
                  asyncCall(function () {
                        install_run.postMessage({cmd: "init", file: "/install/apier.zip"});
                  }, 1000);
            }, function (e) {
                  console.log('Error', e);
            });
      };

      var message_proc = function (e) {
            var data = e.data;
            switch (data.type) {
                  case 'progress.unzip':
                        handle_dom['msg'].innerText = '正在解压：' + data.msg;
                  case 'progress.load':
                        handle_dom['progress'].max = data.total;
                        handle_dom['progress'].value = data.loaded;
                        break;
                  case 'load_done' :
                        changeState(INSTALL_STATE.UNZIP);
                        break;
                  case 'all_done' :
                        changeState(INSTALL_STATE.DONE);
                        break;
                  default:
                        console.log(data);
            }
      };

      global.SETUP = {run: run};
})(window);