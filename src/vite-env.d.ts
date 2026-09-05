/// <reference types="vite/client" />
declare module '*.glb';
declare module '*.png';
declare module '*.svg' {
  const content: string;
  export default content;
}

