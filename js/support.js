(function(){
	if (! 'import' in document.createElement('link')) {
		console.err("your explorer not support import for link tag.");
	}
	
    var nav = document.querySelector('#tpl-nav').import;
    var el = nav.querySelector('#nav');

    document.body.appendChild(el.cloneNode(true));


/*
    var tdb = new SharedWorker('js/thread_db.js');
    console.log(tdb.port);
    tdb = tdb.port;
    tdb.start();
    tdb.postMessage({aa:11});
    tdb.onmessage = function(e) {
        console.log(e);
    }
    window.tdb = tdb;

    var API = {
        Control:{}
    };
    window.API = API || {};
*/

})();