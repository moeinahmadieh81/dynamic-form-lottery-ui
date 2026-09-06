import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import type { PropsWithChildren } from 'react';

const cacheRtl = createCache({
  key: 'mui-rtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

export function RtlProvider({ children }: PropsWithChildren) {
  return <CacheProvider value={cacheRtl}>{children}</CacheProvider>;
}
