var NullCaller = (function () {
    function NullCaller() {
    }
    NullCaller.prototype.invoke = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
    };
    return NullCaller;
})();
exports.NullCaller = NullCaller;
//# sourceMappingURL=caller.js.map