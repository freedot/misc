// write by bill825
var sm = require('./sourcemap');
function print(s) {
    console.log(s);
}
exports.print = print;
function handleStack(stack) {
    var newstack = '';
    var stacks = stack.split('\n');
    for (var _i = 0; _i < stacks.length; _i++) {
        var frame = stacks[_i];
        frame = frame.trim();
        var groups = frame.match(/^at ([^\(]+)\s+\(([a-zA-Z]?:?[\w\\\/\.]+):(\d+):(\d+)\)/); // at method (filepath:lineno)
        if (groups == null) {
            newstack += frame + '\n';
            continue;
        }
        var method = groups[1];
        var file = groups[2].replace(/\.js$/, ''); // remove .js 
        var fullfile = file.indexOf('Assets') == 0 ? file : '' + file;
        var lineno = Number(groups[3]);
        var rt = sm.getSourceLine(fullfile + '.js', lineno);
        if (rt.line < 0) {
            newstack += frame + '\n';
            continue;
        }
        newstack += fullfile.replace(/\.dist\\/, '') + '.ts:' + rt.line + ':';
        newstack += groups[4];
        newstack += '(at ' + method + ')\n';
    }
    return newstack;
}
var ErrorHandler = (function () {
    function ErrorHandler() {
    }
    ErrorHandler.getAssertTag = function () {
        return ErrorHandler.assert_tag;
    };
    ErrorHandler.handle = function (result, err, stack) {
        var err_tag_pos = err.indexOf(ErrorHandler.assert_tag);
        stack = handleStack(stack);
        if (err_tag_pos < 0) {
            result.log(stack);
            return;
        }
        var stacks = stack.split('\n');
        for (var _i = 0; _i < stacks.length; _i++) {
            var frame = stacks[_i];
            frame = frame.trim();
            if (frame.match(/(\/|\\){1}tsunit\.ts:\d+/))
                continue;
            if (frame.match(/\.ts:\d+/)) {
                result.log(frame + " " + err.slice(err_tag_pos + ErrorHandler.assert_tag.length));
                return;
            }
        }
        result.log(stack);
    };
    ErrorHandler.ss_for_unity = true;
    ErrorHandler.assert_tag = '<<<unit_assert>>>';
    ErrorHandler.caseIndice = 0;
    return ErrorHandler;
})();
function areEqual(a, b, msg) {
    if (a === b)
        return;
    if (ErrorHandler.caseIndice == 0) {
        try {
            if (!msg)
                msg = 'assertion failed!';
            throw new Error(msg);
        }
        catch (e) {
            print(e.stack || e);
        }
    }
    else {
        if (!msg)
            msg = 'assertion failed!';
        throw new Error(ErrorHandler.getAssertTag() + msg);
    }
}
exports.areEqual = areEqual;
var Result = (function () {
    function Result() {
        this._runCount = 0;
        this._failedCount = 0;
        this._log = '';
    }
    Result.prototype.testStarted = function () {
        this._runCount++;
    };
    Result.prototype.testFailed = function () {
        this._failedCount++;
    };
    Result.prototype.summary = function () {
        return this._runCount + ' run, ' + this._failedCount + ' failed';
    };
    Result.prototype.getLog = function () {
        return this._log;
    };
    Result.prototype.log = function (s) {
        this._log += s;
        this._log += '\n';
    };
    return Result;
})();
exports.Result = Result;
var Case = (function () {
    function Case() {
    }
    Case.prototype.setUp = function () {
    };
    Case.prototype.run = function (result) {
        result = result || new Result();
        for (var fieldName in this) {
            if (typeof fieldName != 'string')
                continue;
            var sname = fieldName;
            if ((sname.indexOf('test_') == 0) && typeof this[sname] == 'function') {
                this.innerRun(result, sname);
            }
        }
    };
    Case.prototype.innerRun = function (result, name) {
        result = result || new Result();
        this.setUpRun(result, name);
        this.testRun(result, name);
        this.tearDownRun(result, name);
    };
    Case.prototype.setUpRun = function (result, name) {
        result.testStarted();
        try {
            ErrorHandler.caseIndice++;
            this.setUp();
        }
        catch (e) {
            ErrorHandler.handle(result, e.message, e.stack);
            result.testFailed();
        }
    };
    Case.prototype.testRun = function (result, name) {
        try {
            this[name](this);
        }
        catch (e) {
            ErrorHandler.handle(result, e.message, e.stack);
            result.testFailed();
        }
    };
    Case.prototype.tearDownRun = function (result, name) {
        try {
            ErrorHandler.caseIndice--;
            this.tearDown();
        }
        catch (e) {
            ErrorHandler.handle(result, e.message, e.stack);
            result.testFailed();
        }
    };
    Case.prototype.tearDown = function () {
    };
    return Case;
})();
exports.Case = Case;
var Suite = (function () {
    function Suite() {
        this._cases = new Array();
    }
    Suite.prototype.addCase = function (caseObject) {
        this._cases.push(caseObject);
    };
    Suite.prototype.run = function (result, needcases) {
        result = result || new Result();
        for (var _i = 0, _a = this._cases; _i < _a.length; _i++) {
            var caseObject = _a[_i];
            if (this.isNeedRun(caseObject, needcases)) {
                caseObject.run(result);
            }
        }
        return result;
    };
    Suite.prototype.isNeedRun = function (caseObject, needcases) {
        if (needcases == null || needcases.length == 0)
            return true;
        for (var _i = 0; _i < needcases.length; _i++) {
            var caseClass = needcases[_i];
            if (caseObject instanceof caseClass) {
                return true;
            }
        }
        return false;
    };
    return Suite;
})();
exports.Suite = Suite;
//# sourceMappingURL=tsunit.js.map