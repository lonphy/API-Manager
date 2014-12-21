/**
 * 视图
 *
 * @author lonphy
 * @version 0.1
 */
(function ($) {
    "use strict";
    /**
     * 视图
     * @param {L5-VIEWElement} dom l5-view DOM元素
     * @constructor {View}
     */
    function View(dom) {
        if (!dom) return;
        if (dom.tagName !== 'L5-VIEW') return;
        if (!dom.id) return;

        this.id = dom.id;
        this.context = dom;
        this.isOpen = dom.classList.contains('show');
        this._listeners = new Map;
    }

    /**
     * 显示视图
     */
    View.prototype.Show = function () {
        if (!this.isOpen) {
            this.context.classList.add('show');
            this.isOpen = true;
        }
    };

    /**
     * 视图渲染
     * @param contents
     */
    View.prototype.Render = function (content) {
        this.context.innerHTML = content;
        this.DoLoading(false);
    };

    /**
     * 取消显示
     */
    View.prototype.Hide = function () {
        if (this.isOpen) {
            this.context.classList.remove('show');
            this.isOpen = false;
        }
    };

    /**
     * 显示加载动画
     * @param b
     */
    View.prototype.DoLoading = function (b) {
        var cl = this.context.classList;
        b ? cl.add('loading') : cl.remove('loading');
    };

    /**
     * 获取视图上下文子级Node
     * @param resourceSelector {String} CSS选择器
     * @return {Node}
     */
    View.prototype.Get = function (cssSelector) {
        if (!cssSelector) {
            throw $.Error("ViewContext::get() Invalid resourceSelector.");
        }
        return this.context.querySelector(cssSelector);
    };

    /**
     * 【私有】委托事件处理
     * @param evt {Event} 事件
     */
    View.prototype._delegateHandle = function (evt) {
        
        evt.stopImmediatePropagation(); // 只对当前框架,同一个元素只需执行一次
        evt.preventDefault(); // 阻止默认行为是必须的.
        var handles = this._listeners.get(evt.type);
        if (!handles) {
            return;
        }
        for (var item of handles.slice()) {
            if (evt.target.webkitMatchesSelector(item['k'])) { //TODO:兼容性处理
                // 不存在其他冒泡问题，直接插入系统消息队列执行。。
                $.Util.Defer(function () {
                    item['v'].call(evt.target, evt);
                });
            }
        }

    };

    /**
     * 视图事件处理
     * @param selector {String} DOM选择
     * @param eventType {String} 事件类型
     * @param handle {Function} 事件处理器
     * @return {View}
     */
    View.prototype.Listen = function (selector, eventType, handle) {
        if (!this._listeners.has(eventType)) {
            this._listeners.set(eventType, []);
            this.context.addEventListener(eventType, function(evt){
                this._delegateHandle.call(this, evt);
            }.bind(this), false);
        }

        var funcs = this._listeners.get(eventType);
        if (!funcs.slice().some(function(item){
                    return item['k'] === selector;
        })) {     // 没有绑定过，则放入处理容器
            funcs.push({"k": selector, "v": handle});
            this._listeners.set(eventType, funcs);
        }

        return this;
    };
    L5.UI.View = View;
})(L5);