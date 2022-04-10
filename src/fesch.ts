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

          let method;

          const acceptHeader = userOptions?.headers?.['Accept'];
          const contentType = response.headers.get('Content-Type');

          switch (true) {
            case acceptHeader === 'application/json':
            case contentType === 'application/json':
                method = 'json';
                break;

            case acceptHeader === 'application/octet-stream':
            case contentType === 'application/octet-stream':
              method = 'arrayBuffer';
              break;

            case acceptHeader === 'multipart/form-data':
            case contentType === 'multipart/form-data':
              method = 'formData';
              break;

            case acceptHeader?.startsWith('text/'):
            case contentType?.startsWith('text/'):
              method = 'text';
              break;

            default:
              throw Error('Unsupported response method')
          }

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
