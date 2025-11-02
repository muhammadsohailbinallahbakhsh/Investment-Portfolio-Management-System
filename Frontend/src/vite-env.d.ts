/// <reference types="vite/client" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
  // Add other variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
