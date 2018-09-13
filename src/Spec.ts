export default function main(params: any) {
  const apiUrl = params.__ow_headers['x-forwarded-url'].split('/').slice(0,7).join('/');

  const spec = JSON.parse(params.spec);

  spec.dataSources.sources[0].module.source.srcUrl.sourceUrl = `${apiUrl}/sql/results?job_id=${params.job_id}`;

  const response = {
    spec
  };

  return response;
}