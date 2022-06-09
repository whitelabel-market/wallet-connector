/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'eth-provider'

declare module '*.svg' {
    const content: any
    export default content
}
