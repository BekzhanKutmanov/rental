import type { ReactNode } from 'react';

import { withQuery } from './with-query';
import { withToast } from './with-toast';

export const withProviders = (component: () => ReactNode) =>
  withQuery(withToast(component));
