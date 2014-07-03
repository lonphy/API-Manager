"use strict";

// total connect client
var connect_count = 0;
var clients = {};
self.onconnect = function(e){
    var port = e.ports[0];
    clients['#'+connect_count] = port;
    port.onmessage =handle_Message;
};

function handle_Message(e) {
    console.log(e);
}