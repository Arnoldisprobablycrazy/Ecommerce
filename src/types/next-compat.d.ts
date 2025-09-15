// src/types/next-compat.d.ts
import type { PageProps as NextPageProps } from 'next';

declare module 'next' {
  export interface PageProps<P = {}> {
    params: P;
    searchParams: { [key: string]: string | string[] | undefined };
  }
}