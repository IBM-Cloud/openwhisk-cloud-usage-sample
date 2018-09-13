"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const openwhisk = require("openwhisk");
function main(params) {
    const ow = openwhisk();
    const { _invoke: name, _blocking: blocking = true } = params;
    // remove the _invoke and _blocking so that downstream actions can set these
    delete params._invoke;
    delete params._blocking;
    return ow.actions.invoke({
        name,
        blocking,
        result: true,
        params
    });
}
exports.default = main;
