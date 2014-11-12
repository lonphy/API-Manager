/**
 * 全局配置信息
 */
(function(exports){
    Object.defineProperty(exports, "CONFIG", {
        value: {
            root: "/lib/", // 项目根目录

            db: {
                name: "l5-api",
                version: 3
            },
            module: {
                path: "modules/"
            }
        }
    });
})(L5);
