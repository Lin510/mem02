/// <reference types="next" />
/// <reference types="next/types/global" />

// Allow importing plain CSS/SCSS files in TypeScript files (side-effect imports)
// Keeps VSCode/tsserver from complaining about side-effect imports such as
// `import './globals.scss'` (or `import './globals.css'`) in `app/layout.tsx`.

declare module "*.css" {
	const content: string;
	export default content;
}

declare module "*.scss" {
	const content: string;
	export default content;
}
