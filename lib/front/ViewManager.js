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
        this._data = {};    // 模板赋值容器
        this._template = null;    // 当前模板

        this._listeners = {};
    }

    /**
     * 视图赋值
     */
    View.prototype.assign = function (key, value) {
        if (key) {
            this._data[key] = value;
        }
        return this;
    };

    /**
     * 设置模板
     * @param tpl
     */
    View.prototype.setTpl = function (tpl) {
            if (!tpl) {
                throw $.Error("ViewManager::setTpl() : template name can't be empty.");
            }
            this._data = {};
            this._template = tpl;
            return this;
    };

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
     * 视图渲染
     * @param contents
     */
    View.prototype.Render = function (c) {
        this.context.innerHTML = c(this._template, this._data);
        this.doLoading(false);
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
        _create: function (viewID) {
            var view = document.createElement('l5-view');
            view.id = viewID;
            return this._convert(view);
        },

        /**
         * 转换DOM元素L5-VIEW 为 View实例
         * @param viewDOM <l5-view />
         * @return {null | View}
         */
        _convert: function (viewDOM) {
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
        _add: function (view, isNeedDraw) {
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
        _getView: function (viewID) {
            viewID = viewID || this._currentShowViewID;
            var view = this._views[viewID];
            if (!view && viewID) {
                view = this._create(viewID);
                this._add(view, true);
            }
            return view;
        },

        /**
         * 显示视图对象
         * @param {string} viewID 视图对象名称
         * @return {ViewManager}
         */
        _showView: function (viewID) {
            var view = this._getView(viewID);
            if (this._currentShowViewID !== viewID) {
                var oldView = this._getView();
                oldView && oldView.hide();
                view.show();
                view.doLoading(true);
                this._currentShowViewID = viewID;
            }

            return view;
        },

        /**
         * 打开视图
         */
        OpenView: function (viewId, tpl) {
            if (!viewId) {
                throw $.Error("ViewManager::CreateView() : View ID can't be empty.");
            }
            var view = this._showView(viewId);
            view.setTpl(tpl);
            return view;
        },

        Assign: function(key, data) {
            var view = this._getView();
            view.assign(key, data);
            return view;
        },

        /**
         * 显示视图
         * @param {String} viewId 视图ID
         * @param {String} tpl 模板名称, 选填
         * @return {ViewManager}
         */
        Display: function (viewId, tpl) {
            (viewId && tpl
                ? this.OpenView(viewId, tpl)
                : this._getView()
                )
                .Render($.ViewManager.Template);
            return this;
        }
    };

    $.ViewManager = new ViewManager;
})(L5);