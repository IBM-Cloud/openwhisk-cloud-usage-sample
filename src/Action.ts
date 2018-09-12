import * as openwhisk from 'openwhisk';

interface ActionParams {
  _invoke: string;
  _blocking?: boolean;
}

export default function main(params: ActionParams): Promise<any> {
  const ow = openwhisk();

  const { _invoke: name, _blocking: blocking = true} = params;

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
