///<reference path="./tsunit/fs.d.ts"/>
var fs = require('fs');
function _walk(path, ext, fileList) {
    var dirList = fs.readdirSync(path);
    dirList.forEach(function (item) {
        if (fs.statSync(path + '/' + item).isDirectory()) {
            _walk(path + '/' + item, ext, fileList);
        }
        else {
            var r = new RegExp(ext + '$');
            if (item.match(r))
                fileList.push(path + '/' + item);
        }
    });
}
function walk(path, ext) {
    var fileList = [];
    _walk(path, ext || '', fileList);
    return fileList;
}
exports.walk = walk;
//walk('E:/MyWork/wg/trunk/web/tss/.dist');
//console.log(fileList); 
//# sourceMappingURL=dirwalker.js.map