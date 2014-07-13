/**
 * 文件下载模块
 */

"use strict";
if (!'importScripts' in self) {
    throw new Error('can\'t run in window mode');
}

importScripts('/install/lib/zip.js');


var donwload_data, xhr;

self.onmessage = function (e) {
    var cmd = e.data.cmd || '';

    switch (cmd) {
        case 'init':
            xhr_run(e.data.file);
            break;
        case 'unzip':
            postMessage({
                type: 'progress',
                loaded: 0,
                total: 100
            });
            var x = new JSUnzip(donwload_data);
            x.readEntries();
            donwload_data = x.entries;
            x = null;
            setTimeout(function () {
                postMessage({
                    type: 'progress',
                    loaded: 100,
                    total: 100
                });
            }, 3000);
            break;
        case 'save' :
            break;
        default :
            self.postMessage({code: -1, msg: 'unknow cmd'});
    }
};


function xhr_run(file_path) {

    xhr = new XMLHttpRequest();
    xhr.onprogress = xhr_progress;
    xhr.onreadystatechange = xhr_statechange;
    xhr.onerror = xhr_error;
    xhr.open("GET", file_path, true);
    xhr.send(null);
}


function xhr_progress(e) {
    postMessage({
        type: 'progress',
        loaded: e.loaded,
        total: e.totalSize
    });
}
function xhr_statechange(e) {
    if (this.readyState == this.DONE) {
        donwload_data = this.response;
        xhr = null;   //gc
        postMessage({
            type: 'load_done'
        });
    }
}

function xhr_error(e) {
    console.log(e);
    return false;
}