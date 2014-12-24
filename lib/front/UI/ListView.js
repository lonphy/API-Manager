/**
 * 列表视图控件
 *
 * @author lonphy
 * @version 0.1
 */
(function ($) {

    "use strict";

    function changeHandle(e) {
        var tar = e.target;
        var tarName = tar.tagName;
        if (tarName == "INPUT" || tarName == "SELECT") {
            var max = e.path.length, row=0;
            for (var i= 0, max = e.path.length; i<max;++i){
                if(e.path[i].tagName == "DD") {
                    row = e.path[i].dataset["idx"];
                    break;
                }
            }
            var obj = this.get(row);
            obj[tar.name] = tar.value;
            this.set(row, obj);
        }
    }

    function addRemoveHandle(e) {
        var tar = e.target;
        if (tar.tagName != "A") {
            return;
        }

        if(tar.textContent == "Add") {
            this.data.set("#"+this.lastIndex++, {});
            this.render();
        }else {
            var row = tar.dataset["idx"];
            this.data.delete(row);
            this.render();
        }
    }

    /**
     * 初始化列表视图控件
     */
    function ListView(options) {
        this.container = $(options['container']);
        this.rowTemplate = options['rowTpl'];
        this.parseMap(options['data']);
        this.header = options['header'];
        this.init();
        this.render();
    }

    ListView.prototype.parseMap = function(src) {
        var map = new Map();
        src = src || [];
        if (!Array.isArray(src)) {
            throw new TypeError("option.data must is type of Array.");
        }
        src.forEach(function(item, idx){
            map.set("#"+idx, item);
        });
        this.data = map;
        this.lastIndex = map.size;  // 记录最大序号
    };

    /**
     * 获取列表最终结果
     * @returns {Array.<T>|Array|*}
     * @constructor
     */
    ListView.prototype.GetResult = function() {
        var ret = [];
        this.data.forEach(function(item){
            item['key']&&ret.push(item);
        })
        return ret;
    };

    ListView.prototype.init = function() {
        this.container.addEventListener("change", changeHandle.bind(this.data), false);
        this.container.addEventListener("click", addRemoveHandle.bind(this), false);
    };

    ListView.prototype.render = function() {
        var data = this.data;
        var tpl = this.rowTemplate;
        var out = "";
        var header = "<dt>"+this.header+ "<span><a href='javascript:void(0);'>Add</a></span></dt>";


        data.forEach(function(item, idx){
            out += "<dd data-idx='"+idx+"'>\n\t";
            out += tpl.replace(/\$\{.*?}/g, function(val){
                        return item[val.slice(2,-1)]||"";
                });
            out += "<span><a href='javascript:void(0);' data-idx='"+idx+"'>x</a></span>\n</dd>\n";
        });
        this.container.innerHTML = header + out;
    };
    L5.UI.ListView = ListView;
})(L5);