(function(){
	if (! 'import' in document.createElement('link')) {
		console.err("your explorer not support import for link tag.");
	}
	
    var nav = document.querySelector('#tpl-nav').import;
    var el = nav.querySelector('#nav');

    document.body.appendChild(el.cloneNode(true));
})();