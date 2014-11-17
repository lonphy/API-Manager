/**
 * 视图管理
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

        this._listeners = {};
    }


    /**
     * 显示视图
     */
    View.prototype.show = function () {
        if (!this.isOpen) {
            this.context.classList.add('show');
            this.isOpen = true;
        }
    };

    /**
     * HTML赋值
     * @param contents
     */
    View.prototype.Render = function (content) {
        this.context.innerHTML = content;
    };

    /**
     * 取消显示
     */
    View.prototype.hide = function () {
        if (this.isOpen) {
            this.context.classList.remove('show');
            this.isOpen = false;
        }
    };

    /**
     * 显示加载动画
     * @param b
     */
    View.prototype.doLoading = function (b) {
        var cl = this.context.classList;
        b ? cl.add('loading') : cl.remove('loading');
    };

    /**
     * 获取视图上下文子级Node
     * @param resourceSelector
     * @return Node
     */
    View.prototype.get = function (resourceSelector) {
        if (!resourceSelector) {
            throw $.Error("ViewContext::get() Invalid resourceSelector.");
        }
        return this.context.querySelector(resourceSelector);
    };

    /**
     * 【私有】委托事件处理
     * @param evt
     */
    View.prototype._delegateHandle = function (evt) {
        // 只对当前框架,同一个元素只需执行一次
        evt.stopImmediatePropagation();
        // 阻止默认行为是必须的.
        evt.preventDefault();
        var handles = this._listeners[evt.type].slice(),
            i, len=handles.length,
            key,
            tar = evt.target,
            item;
        for (i = 0; i < len; ++i) {
            item = handles[i];
            key = item['k'];
            //TODO:兼容性处理
            if (tar.webkitMatchesSelector(key)) {
                // 不存在其他冒泡问题，直接插入系统消息队列执行。。
                $.Util.Defer(function () {
                    item['v'].call(tar, evt);
                });
            }
        }

    };

    /**
     * 视图事件处理
     * @param selector
     * @param handle
     * @constructor
     */
    View.prototype.Listen = function (selector, eventType, handle) {
        if (!this._listeners[eventType]) {
            this._listeners[eventType] = [];
            var that = this;
            this.context.addEventListener(eventType, function(evt){
                that._delegateHandle.call(that, evt);
            }, false);
        }
        var handles = this._listeners[eventType].slice(),
            wasBind = false,
            i,
            len=handles.length;

        for (i = 0; i < len; ++i) {
            if (handles[i]['k'] === selector) {
                wasBind = true;
                break;
            }
        }
        !wasBind && this._listeners[eventType].push({"k": selector, "v": handle});
        return this;
    };


    /**
     * 视图管理
     * @constructor ViewManager
     */
    function ViewManager() {
        this._views = {};
        this._container;
        this._currentShowViewID = '';
        this._data = {};    // 模板赋值容器
        this._currentTpl = null;    // 当前模板
        var _this = this;
        $.Ready(function () {
            _this._container = document.getElementById('views');
        });
    }

    ViewManager.prototype = {
        constructor: ViewManager,

        /**
         * 创建视图对象，会生成DOM，但不加入DOM树
         * @param {string} viewID 需要创建的视图ID
         * @return {null|View}
         */
        create: function (viewID) {
            var view = document.createElement('l5-view');
            view.id = viewID;
            return this.convert(view);
        },

        /**
         * 转换DOM元素L5-VIEW 为 View实例
         * @param viewDOM <l5-view />
         * @return {null | View}
         */
        convert: function (viewDOM) {
            if (viewDOM.tagName != 'L5-VIEW' || !viewDOM.id) {
                return null;
            }
            return new View(viewDOM);
        },

        /**
         * 添加视图到视图管理中
         * @param {View} view
         * @param {boolean} isNeedDraw 是否需要加入DOM树中
         * @return {ViewManager}
         */
        add: function (view, isNeedDraw) {
            if (isNeedDraw) {
                if (view.isOpen) {
                    view.hide();
                }
                this._container.appendChild(view.context);
            }

            this._views[view.id] = view;

            return this;
        },

        /**
         * 获取视图对象
         * @param {string} viewID 视图对象ID
         * @return {View}
         */
        getView: function (viewID) {
            viewID = viewID || this._currentShowViewID;
            var view = this._views[viewID];
            if (!view && viewID) {
                view = this.create(viewID);
                this.add(view, true);
            }
            return view;
        },

        /**
         * 显示视图对象
         * @param {string} viewID 视图对象名称
         * @return {ViewManager}
         */
        showView: function (viewID) {
            var view = this.getView(viewID);
            if (this._currentShowViewID !== viewID) {
                var oldView = this.getView();
                oldView && oldView.hide();
                view.show();
                this._currentShowViewID = viewID;
            }

            return this;
        },

        /**
         * 设置视图的Loading状态
         * @param {Boolean} b
         * @return {ViewManager}
         */
        setLoading: function (b) {
            var view = this.getView();
            view && view.doLoading(b);
            return this;
        },

        /**
         * 设置模板
         * @param tpl
         */
        setTpl: function (viewId, tpl, noLoading) {
            if (!viewId) return this;
            this.showView(viewId);
            if (!noLoading) {
                this.setLoading(true);
            }
            if (!tpl) return this;
            this._data = {};
            this._currentTpl = tpl;
            return this;
        },

        /**
         * 模板赋值
         * @param {String} key 名称
         * @param {*} data 数据
         * @return {ViewManager}
         */
        assign: function (key, data) {
            if (key) {
                this._data[key] = data;
            }
            return this;
        },

        /**
         * 显示视图
         * @param {String} viewId 视图ID
         * @param {String} tpl 模板名称, 选填
         * @return {ViewManager}
         */
        display: function (viewId, tpl) {
            if (viewId && tpl) {
                this.setTpl(viewId, tpl);
            }
            var t = tpl || this._currentTpl;
            if (!t) {
                throw $.Error("ViewManager::display() can't display empty template.");
            }
            var result = $.ViewManager.Template(t, this._data);
            var view = this.getView(viewId);
            view.Render(result);
            this.setLoading(false);
            return view;
        }
    };

    $.ViewManager = new ViewManager;
})(L5);