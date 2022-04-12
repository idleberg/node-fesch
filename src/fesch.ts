/*! fesch | MIT License | https://github.com/idleberg/node-fesch */

import { PorridgeDB } from 'web-porridge';

export const Fesch = (options: Fesch.Options) => {
  if (!Number.isInteger(options?.expires)) {
    throw TypeError(`Expiry value must be of type integer`);
  }

  const Store = new PorridgeDB({
    db: options?.db || 'fesch',
    name: options?.name || '(default cache)'
  });

  return (
    {
      fetch: async (input: RequestInfo, userOptions?: RequestInit) => {
        const href = typeof input === 'string'
          ? new URL(String(input)).href
          : input.url;

        const value = await Store.getItem(href);

        if (value !== null && !(await Store.didExpire(href))) {
          return value;
        }

        try {
          const response = await window.fetch(input, userOptions);

          const acceptHeader = userOptions?.headers?.['Accept']?.trim()?.toLowerCase() || '';
          const contentType = response.headers.get('Content-Type')?.trim()?.toLowerCase() || '';

          const method = getMethod(acceptHeader, contentType);
          const item = await response[method]();

          await Store.setItem(href, item, {
            expires: Date.now() + options.expires
          });

          return item;
        } catch (error) {
          throw Error(error);
        }
      }
    }
  )
}

function getMethod(acceptHeader: string, contentType: string): string {
  switch (true) {
    case acceptHeader.trim()?.startsWith('application/json'):
    case contentType.trim()?.startsWith('application/json'):
        return 'json';

    case acceptHeader.trim()?.startsWith('application/octet-stream'):
    case contentType.trim()?.startsWith('application/octet-stream'):
      return 'arrayBuffer';

    case acceptHeader.trim()?.startsWith('multipart/form-data'):
    case contentType.trim()?.startsWith('multipart/form-data'):
      return 'formData';

    case acceptHeader?.trim()?.startsWith('text/'):
    case contentType?.trim()?.startsWith('text/'):
      return 'text';

    default:
      throw Error('Could not determine response method')
  }
}
