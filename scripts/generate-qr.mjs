// Genera public/qr.png a partir de una URL.
// Uso: node scripts/generate-qr.mjs "https://tu-url-final.com"
import QRCode from 'qrcode';
import { fileURLToPath } from 'url';
import path from 'path';

const url = process.argv[2];
if (!url) {
  console.error('Uso: node scripts/generate-qr.mjs <url>');
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '..', 'public', 'qr.png');

// Alto nivel de corrección de errores ('H') = más módulos redundantes,
// lo que le da a MindAR más textura/contraste para reconocer como marcador.
// width a 768 (en vez de 512): más píxeles = más puntos característicos
// para que MindAR trackee mejor el marcador.
await QRCode.toFile(outPath, url, {
  errorCorrectionLevel: 'H',
  margin: 2,
  width: 768,
  color: { dark: '#000000', light: '#ffffff' },
});

console.log('QR generado en', outPath, 'para la URL:', url);
