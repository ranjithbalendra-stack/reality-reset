import { cp, mkdir, rm } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await Promise.all([
	...['index.html', 'style.css', 'app.js'].map((file) => cp(file, `dist/${file}`)),
	cp('src', 'dist/src', { recursive: true })
]);
console.log('Production build written to dist/');