/**
 * Created by lonphy on 2014/7/5.
 */


/**
 * @param {window|}
 */
(function (global) {
    if ('importScripts' in global) {
        global.requestFileSystemSync = global.requestFileSystemSync || global.webkitRequestFileSystemSync;
        global.resolveLocalFileSystemURLSync = global.resolveLocalFileSystemURLSync || global.webkitResolveLocalFileSystemURLSync;
    } else {
        global.requestFileSystem = global.requestFileSystem || global.webkitRequestFileSystem;
        global.resolveLocalFileSystemURL = global.resolveLocalFileSystemURL || global.webkitResolveLocalFileSystemURL;
    }

})(this);
