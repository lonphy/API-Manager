"use strict";
self.onconnect = function(e){
    var port = e.ports[0];
    port.onmessage =handle_Message;
};

function handle_Message(e) {
	this.postMessage({_id:e.data._id, data:"this msg from sharedWorker."});
}