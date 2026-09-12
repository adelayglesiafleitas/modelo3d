// Compila public/qr.png como marcador de imagen de MindAR -> public/targets.mind
// Uso: node scripts/compile-target.mjs
import { OfflineCompiler } from 'mind-ar/src/image-target/offline-compiler.js';
import { loadImage } from 'canvas';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const qrPath = path.join(__dirname, '..', 'public', 'qr.png');
const outPath = path.join(__dirname, '..', 'public', 'targets.mind');

console.log('Cargando imagen QR...', qrPath);
const img = await loadImage(qrPath);

const compiler = new OfflineCompiler();
console.log('Compilando target (puede tardar unos segundos)...');
await compiler.compileImageTargets([img], (progress) => {
  process.stdout.write(`\rProgreso: ${progress.toFixed(1)}%   `);
});
console.log('\nCompilación completa.');

const buffer = compiler.exportData();
fs.writeFileSync(outPath, buffer);
console.log('Target guardado en', outPath, `(${buffer.length} bytes)`);
