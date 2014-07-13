Loader.register("test", (function () {

    var storeName = "project";        // 存储对象名称

    return {
        autoInit: false,
        get: function (cond, callback) {
            if (cond['id']) {
                $C.db.get(storeName, cond['id'], callback);
            }
        },
        insert: function (data, callback) {
            $C.db.insert(storeName, data, callback);
        }
    };
})());