///<reference path="game/declare/GameEngine.d.ts"/>
import uts = require("./uts/uts");
import app = require("./game/app");
function main() {
    try {
        let gapp = new app();
        gapp.run();
    }
    catch (e) {
        uts.bugReport(e.stack || e);
    }
}
main();