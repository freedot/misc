var dirwalker = require('./dirwalker');
function isExclude(path) {
    var excludes = [
        '/com/tsunit/',
        '/tools/',
        '/_'
    ];
    for (var _i = 0; _i < excludes.length; _i++) {
        var ex = excludes[_i];
        if (path.indexOf(ex) >= 0)
            return true;
    }
    return false;
}
function main() {
    var scripts = [];
    var list = dirwalker.walk('..', '.js');
    for (var _i = 0; _i < list.length; _i++) {
        var f = list[_i];
        if (isExclude(f))
            continue;
        console.log(f);
        scripts.push(f);
    }
}
main();
//# sourceMappingURL=createproj.js.map