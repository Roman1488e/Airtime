"use client";

import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const queryClient = new QueryClient();

export default function Providers({ children }: PropsWithChildren) {
  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-right"
      />
      </QueryClientProvider>
    </NuqsAdapter>
  );
}
