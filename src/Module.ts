export default function main(params: any) {
  const apiUrl = params.__ow_headers['x-forwarded-url'].split('/').slice(0,7).join('/');
  const table = JSON.parse(params.table);

  console.log(`Found table ${table.name}`);

  const response = {
    module: {
      "xsd": "https://ibm.com/daas/module/1.0/module.xsd",
      "source": {
        "id": "ow-module",
        "srcUrl": {
          "sourceUrl": `${apiUrl}/sql/results?job_id=${params.job_id}`,
          "mimeType": "text/csv",
          "property": [
            {
              "name": "separator",
              "value": ","
            },
            {
              "name": "ColumnNamesLine",
              "value": "true"
            }
          ]
        }
      },
      "table": table,
      "label": table.name,
      "identifier": "ow-data"
    }
  };

  console.log(`Data source ${response.module.source.srcUrl.sourceUrl}`);

  return response;
}