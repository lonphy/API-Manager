"use strict";

/**
 * 处理私有前缀
 */
(function (global) {
    if ('importScripts' in global) {
        global.requestFileSystemSync = global.requestFileSystemSync || global.webkitRequestFileSystemSync;
        global.resolveLocalFileSystemURLSync = global.resolveLocalFileSystemURLSync || global.webkitResolveLocalFileSystemURLSync;
    } else {
        global.requestFileSystem = global.requestFileSystem || global.webkitRequestFileSystem;
        global.resolveLocalFileSystemURL = global.resolveLocalFileSystemURL || global.webkitResolveLocalFileSystemURL;
    }
})(self);


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
         * @param name {string} 目录名
         */
        mkdir: function (name) {

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

        }
    };
    var _fs = function () {

    };
    _fs.FILE_SYSTEM_SIZE = 3 * 1024 * 1024
    _fs.prototype = {
        constructor: _fs,

        init: function () {

        }
    };
})(self);

console.log('------------------------------------------------------------');
console.log("FileSystem Name is:",fs_.name);
console.log("root Path is:", fs_.root.fullPath);
console.log("vister url is:", fs_.root.toURL());
console.log('------------------------------------------------------------');

/**
 * 查询文件系统使用情况
 * 100M永久空间
 */
navigator.webkitPersistentStorage.queryUsageAndQuota(function(used, total){
    console.log("已使用空间：",used, "总计：",total);
},function(e){
    console.error(e);
});
