import React from 'react';

export interface SyncRequestError<T> {
  handler: Promise<T>
  $$type: symbol
}

interface _ReactNode<T> {
  [key: string]: T[keyof T]
  default?: any 
}

export type PromiseFunction<T> = () => T

export type LazyReturn<T> = Promise<T> | PromiseFunction<T>

export type PromiseResolveType = {default: () => React.ReactNode} | _ReactNode<React.ReactNode>