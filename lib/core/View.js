/***************************************************************
 * 视图、视图管理
 *
 * @author lonphy
 * @email dev@lonphy.com
 * @version 1.0
 * @url http://project.lonphy.com/apier
 *
 ****************************************************************/
(function($){

      /**
       * 视图
       * @param {L5-VIEWElement} dom l5-view DOM元素
       * @constructor {View}
       **/
      function View(dom) {
            if (!dom) return;
            if (dom.tagName !== 'L5-VIEW') return;
            if (!dom.id) return;

            this.id = dom.id;
            this.dom = dom;
            this.isOpen = dom.classList.contains('show');
      }

      View.prototype = {
            constructor:View,

            /**
             * 显示视图
             */
            show: function(){
                  if(!this.isOpen) {
                        this.dom.classList.add('show');
                        this.isOpen = true;
                  }
            },

            /**
             * 取消显示
             */
            hide: function(){
                  if(this.isOpen) {
                        this.dom.classList.remove('show');
                        this.isOpen = false;
                  }
            },

            doLoading: function(b) {
                  var cl = this.dom.classList;
                  b?cl.add('loading') : cl.remove('loading');
            }
      };

      /**
       * 视图管理
       * @constructor ViewManager
       */
      function ViewManager() {
            this._views = {};
            this._container;
            this._currentShowViewID ='';
            var _this = this;
            L5.ready(function(){
                  _this._container = document.querySelector('#views');
                  var views = _this._container.getElementsByTagName('l5-view');
                  Array.prototype.forEach.call(views, function(dom){
                        var view =  _this.convert(dom);
                        view && _this.add(view, false);
                  });
            });
      }

      ViewManager.prototype = {
            constructor: ViewManager,

            /**
             * 创建视图对象，会生成DOM，但不加入DOM树
             * @param {string} viewID 需要创建的视图ID
             * @returns {null|View}
             */
            create: function(viewID) {
                  var view =  document.createElement('l5-view');
                  view.id = viewID;
                  view.innerText = viewID;
                  return this.convert(view);
            },

            /**
             * 转换DOM元素L5-VIEW 为 View实例
             * @param viewDOM <l5-view />
             * @returns {null | View}
             */
            convert: function(viewDOM) {
                  if (viewDOM.tagName != 'L5-VIEW' || !viewDOM.id) {
                        return null;
                  }
                  return new View(viewDOM);
            },

            /**
             * 添加视图到视图管理中
             * @param {View} view
             * @param {boolean} isNeedDraw 是否需要加入DOM树中
             * @returns {ViewManager}
             */
            add: function(view, isNeedDraw) {
                  if (isNeedDraw) {
                        if (view.isOpen) {
                              view.hide();
                        }
                        this._container.appendChild(view.dom);
                  }

                  this._views[view.id] = view;

                  return this;
            },

            /**
             * 获取视图对象
             * @param {string} viewID 视图对象ID
             * @returns {View}
             */
            get: function(viewID) {
                  var view = this._views[viewID];
                  if (!view && viewID) {
                        view = this.create(viewID);
                        this.add(view,true);
                  }
                  return view;
            },

            /**
             * 显示视图对象
             * @param {string} viewID 视图对象名称
             * @returns {ViewManager}
             */
            showView: function(viewID) {
                  var view = this.get(viewID);
                  if ( this._currentShowViewID !== viewID) {
                        var oldView = this.get(this._currentShowViewID);
                        oldView && oldView.hide();
                        view.show();
                        this._currentShowViewID = viewID;
                  }

                  return this;
            },

            /**
             * 设置视图的Loading状态
             * @param b
             * @returns {ViewManager}
             */
            setLoading: function(b) {
                  var view = this.get(this._currentShowViewID);
                  view && view.doLoading(b);
                  return this;
            }
      };

      /**
       * @type {ViewManager}
       */
      $.ViewManager = new ViewManager();
}(L5));