"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function main(params) {
    const { guid, region } = params;
    return {
        _body: {
            organizations_region: [{ guid, region }]
        }
    };
}
exports.default = main;
