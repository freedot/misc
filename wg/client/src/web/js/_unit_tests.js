var ut = require("./tools/tsunit/tsunit");
var heroinfopage = require("./hero/_heroinfopage");
var GlobalPub = require("./com/globalpub");
function main() {
    ut.print('****** unit tests ******');
    var suite = new ut.Suite();
    var g = new GlobalPub();
    suite.addCase(new heroinfopage.MyTestCase(g));
    var result = suite.run();
    ut.print(result.getLog());
    ut.print('------------------------');
    ut.print(result.summary());
    ut.print('************************');
}
main();
//# sourceMappingURL=_unit_tests.js.map