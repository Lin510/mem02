/// <reference types="next" />
/// <reference types="next/types/global" />

// Allow importing plain CSS/SCSS files in TypeScript files (side-effect imports)
// Keeps VSCode/tsserver from complaining about `import './globals.css'` in `app/layout.tsx`.

declare module "*.css";
declare module "*.scss";

export {};
