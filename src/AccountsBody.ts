export interface AccountsBodyParams {
  guid: string;
  region: string;
}

export default function main(params: AccountsBodyParams) {
  const { guid, region } = params;

  return {
    _body: {
      organizations_region : [{ guid, region }]
    }
  };
}
