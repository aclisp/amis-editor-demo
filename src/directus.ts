import {createDirectus, staticToken, rest} from '@directus/sdk';
import type {HttpMethod} from '@directus/sdk';
import type {FetcherConfig} from 'amis-core/lib/factory';
import type {fetcherResult} from 'amis-core/lib/types';

export const DIRECTUS_URL_PREFIX = 'directus:';
const client = createDirectus('http://127.0.0.1:8055')
  .with(staticToken('vtRAG8cdQ5VRT8fIxe_8uzCJjufer3PU'))
  .with(rest());

export async function request(config: FetcherConfig): Promise<fetcherResult> {
  console.debug('directus.request:config=%o', config);

  let result: fetcherResult = {status: 200, headers: {}};
  try {
    const data = await client.request(() => {
      return {
        path: config.url.substring(DIRECTUS_URL_PREFIX.length),
        method: config.method?.toUpperCase() as HttpMethod,
        params: config.data?.query,
        body: config.data?.body,
        headers: config.config?.headers
      };
    });
    if (Array.isArray(data)) {
      result = {
        status: 200,
        data: {data: {rows: data}, status: 0, msg: ''},
        headers: {}
      };
    } else {
      result = {
        status: 200,
        data: {data: data as any, status: 0, msg: ''},
        headers: {}
      };
    }
  } catch (error: any) {
    result = {
      status: 500,
      data: {data: error, status: 500, msg: String(error)},
      headers: {}
    };
  }

  console.debug('directus.request:result=%o', result);
  return result;
}
