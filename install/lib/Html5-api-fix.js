/**
 * Created by lonphy on 2014/7/5.
 */


/** @param {window|}*/
(function (global) {
    if ('importScripts' in global) {
        global.requestFileSystemSync = global.requestFileSystemSync || global.webkitRequestFileSystemSync;
        global.resolveLocalFileSystemURLSync = global.resolveLocalFileSystemURLSync || global.webkitResolveLocalFileSystemURLSync;
    } else {
        global.requestFileSystem = global.requestFileSystem || global.webkitRequestFileSystem;
        global.resolveLocalFileSystemURL = global.resolveLocalFileSystemURL || global.webkitResolveLocalFileSystemURL;
    }


    /**
     * 定义对话框元素
     */
    var DialogPrototype = Object.create(HTMLElement.prototype);
    DialogPrototype.open = function () {

    };
    DialogPrototype.close = function () {
        this.style.display = 'none';
    }
    DialogPrototype.type = "normal";

    document.registerElement('api-dialog', {
        prototype: Object.create(HTMLElement.prototype, {
            open: {
                value: function () {
                    this.classList.add('show');
                }
            },
            close: {
                value: function () {
                	this.classList.remove('show');
                }
            },
            type: {
                get: function () {
                	if (this.attributes['type']) {
                		return this.attributes['type'].value;
                	}
                    return "normal";
                }
            },
            createdCallback: {
                value: function () {
                    var tpls = document.getElementById('dialogTpl').import;
                    console.log(tpls);
                    var tpl = tpls.getElementById(this.type.toLowerCase());
                    var clone = document.importNode(tpl.content, true);
                    this.createShadowRoot().appendChild(clone);
                }
            },
            attachedCallback: {
                value: function () {
                    console.log('insert');
                }
            },
            detachedCallback: {
                value: function () {
                    console.log('delete');
                }
            },
            attributeChangedCallback: {
                value: function (attrName, oldVal, newVal) {
                    console.log(attrName + ' changed from ' + oldVal + ' to ' + newVal);
                }
            }
        })
    });
})(this);
