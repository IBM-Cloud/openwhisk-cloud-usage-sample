"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function main(params) {
    const spec = JSON.parse(params.spec);
    spec.dataSources.sources[0].module.source.srcUrl.sourceUrl = `https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/${params.apiGatewayId}/sql/results?job_id=${params.job_id}`;
    const response = {
        spec
    };
    return response;
}
exports.default = main;
