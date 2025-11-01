import NextTheme from './next-theme-provider';
import QueryClient from './query-client-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextTheme>
      <QueryClient>{children}</QueryClient>
    </NextTheme>
  );
}
