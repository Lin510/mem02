// Local declaration so files inside `app/` can resolve stylesheet imports immediately.
// This helps editors/tsserver resolve `import './globals.scss'` (or `import './globals.css'`) in `app/layout.tsx`.

declare module "*.css";
declare module "*.scss";

export {};
