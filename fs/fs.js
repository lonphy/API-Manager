importScripts('lib/Html5-api-fix.js');

// 100M
var FILE_SYSTEM_SIZE = 3*1024*1024;
var fs_,cwd_;



// 打开文件系统
fs_ = requestFileSystemSync(self.PERSISTENT, FILE_SYSTEM_SIZE);
cwd_ = fs_.root;
console.log('------------------------------------------------------------');
console.log("FileSystem Name is:",fs_.name);
console.log("root Path is:", fs_.root.fullPath);
console.log("vister url is:", fs_.root.toURL());
console.log('------------------------------------------------------------');

/**
 * 查询文件系统使用情况
 * 100M永久空间
 */
navigator.webkitPersistentStorage.queryUsageAndQuota(function(used, total){
    console.log("已使用空间：",used, "总计：",total);
},function(e){
    console.error(e);
});
