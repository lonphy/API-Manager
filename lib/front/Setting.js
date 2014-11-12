/**
 * 配置处理 localStorage 封装
 *
 * @type {Setting}
 * @author lonphy
 * @version 0.1
 */
(function (exports) {

    var _cache = {};

    function Setting() {
        var len = localStorage.length, i, k;
        for (i = 0; i < len; ++i) {
            k = localStorage.key(i);
            _cache[k] = localStorage.getItem(k);
        }
    }

    /**
     * 获取某个配置
     *
     * @param {String} name 配置名
     * @param {*} type 值类型
     * @returns {*}
     */
    Setting.prototype.get = function (name, type) {
        if (!name) return;
        var val = null;
        if (name in _cache && _cache.hasOwnProperty(name)) {
            val = _cache[name];
            switch (type) {
                case 'int':
                    val = parseInt(val);
                    break;
                case 'float':
                    val = parseFloat(val);
                    break;
                case 'bool':
                    val = !!val;
                    break;
                case 'obj':
                    val = JSON.parse(val);
                    break;
                case 'str':
                default:
            }
        }
        return val;
    };

    /**
     * 设置某个配置
     *
     * @param {String} name 配置名
     * @param {*} data 配置值
     * @return {Setting}
     */
    Setting.prototype.set = function (name, data) {
        _cache[name] = data || '';
        return this;
    };

    /**
     * 释放内存配置
     */
    Setting.prototype.free = function () {
        _cache = null;
    };

    /**
     * 保存内存中的配置
     */
    Setting.prototype.save = function () {
        var k, val;
        for (k in _cache) {
            if (_cache.hasOwnProperty(k)) {
                val = _cache[k];
                if (Array.isArray(val) || typeof val === 'object') {
                    val = JSON.stringify(val);
                }
                localStorage.setItem(k, val);
            }
        }
        return this;
    };

    exports.Setting =  new Setting;
})(L5);