/// <reference types="chrome"/>
/// <reference types="webext-bridge"/>

declare module 'webext-bridge' {
  export interface ProtocolMap {
    'error:report': { data: any }
  }
}

declare global {
  namespace NodeJS {
    interface Global {
      __VERSION__: string
      __DISPLAY_NAME__: string
      __CHANGELOG__: string
      __GIT_COMMIT__: string
      __GITHUB_URL__: string
    }
  }

  interface Window {
    __VERSION__: string
    __DISPLAY_NAME__: string
    __CHANGELOG__: string
    __GIT_COMMIT__: string
    __GITHUB_URL__: string
  }
  
  interface ServiceWorkerGlobalScope {
    __VERSION__: string
    __DISPLAY_NAME__: string
    __CHANGELOG__: string
    __GIT_COMMIT__: string
    __GITHUB_URL__: string
    onerror: (message: any, source: string, lineno: number, colno: number, error: Error) => void
    onunhandledrejection: (event: PromiseRejectionEvent) => void
  }

  var globalThis: {
    __VERSION__: string
    __DISPLAY_NAME__: string
    __CHANGELOG__: string
    __GIT_COMMIT__: string
    __GITHUB_URL__: string
  } & typeof globalThis
  
  var self: ServiceWorkerGlobalScope
}

export {} 