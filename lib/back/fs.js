"use strict";

if (!'importScripts' in self) {
    throw new Error('can\'t run in window mode');
}
importScripts('/lib/core/Html5-api-fix.js');


/**
 * 文件系统处理
 */
(function (global) {
    // 100M
    var FILE_SYSTEM_SIZE = 3 * 1024 * 1024;

    var fs_, // filesystem
        cwd_;   // current work directory

    global.fs = {
        init: function () {
            fs_ = global.requestFileSystemSync(global.PERSISTENT, FILE_SYSTEM_SIZE);
            cwd_ = fs_.root;
        },

        /**
         * 进入某个目录
         * @param path
         */
        cd: function (path) {
        },
        /**
         * 获取当前工作路径
         * @returns {*}
         */
        cwd: function () {
            return cwd_;
        },

        /**
         * 创建目录
         * @param {string} path  目录名
         */
        mkdir: function (path) {
              var paths = path.split('/');

              // 以/开始的目录
              if (paths[0] == '') {
                    paths = paths.slice(1);
              }
              var dir = cwd_, i=0;
              while(paths[i]) {
                    dir = dir.getDirectory(paths[i++], {create: true, exclusive: false});
              }

              return true;
        },

        /**
         * 返回目录下的所有文件
         * @param path {string}
         */
        ls: function (path) {

        },

        /**
         * 创建一个空文件
         * @param file {string}
         */
        touch: function (file) {

        },
        rm: function (file) {

        },
        mete: function (file) {

        },
        put: function(name, content) {
              var file =  cwd_.getFile(name, {create:true, exclusive:false});
              if (content) {
              file.createWriter()
                          .write( new Blob([content], {type:"text/plain"}));
              }

        }
    };
})(self);
/**
 * 查询文件系统使用情况
 * 100M永久空间

 navigator.webkitPersistentStorage.queryUsageAndQuota(function(used, total){
    console.log("已使用空间：",used, "总计：",total);
},function(e){
    console.error(e);
});
 */