// Prépare les photos d'un lieu de l'atlas : 1600 px au plus sur le côté long, WebP,
// AUCUNE métadonnée (ni position GPS, ni appareil, ni date). Rangement : atlas/photos/<id-du-lieu>/.
// Usage : node tools/atlas-photos.mjs <dossier-des-originaux> <id-du-lieu>
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [source, id] = process.argv.slice(2);
if (!source || !id) {
  console.error('Usage : node tools/atlas-photos.mjs <dossier-des-originaux> <id-du-lieu>');
  process.exit(1);
}
const { destinations } = JSON.parse(await fs.readFile(path.join(racine, 'atlas/data/destinations.json'), 'utf8'));
if (!destinations.some(l => l.id === id)) {
  console.error(`Lieu inconnu : « ${id} ». Identifiants possibles : ${destinations.map(l => l.id).join(', ')}`);
  process.exit(1);
}
// HEIC n'est pas lu par sharp : exporter d'abord ces photos en JPEG.
const originaux = (await fs.readdir(source)).filter(f => /\.(jpe?g|png|webp|tiff?|avif)$/i.test(f)).sort();
if (!originaux.length) {
  console.error(`Aucune image JPEG, PNG, WebP, TIFF ou AVIF dans ${source}.`);
  process.exit(1);
}

const sortie = path.join(racine, 'atlas/photos', id);
await fs.mkdir(sortie, { recursive: true });
const pris = new Set(), entrees = [];
for (const f of originaux) {
  const base = path.parse(f).name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'photo';
  let nom = `${base}.webp`;
  for (let i = 2; pris.has(nom); i++) nom = `${base}-${i}.webp`;
  pris.add(nom);
  const cible = path.join(sortie, nom);
  // rotate() redresse l'image selon son orientation EXIF avant que celle-ci ne disparaisse ;
  // sans withMetadata(), sharp n'écrit aucune métadonnée dans le fichier produit.
  await sharp(path.join(source, f))
    .rotate()
    .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(cible);
  const m = await sharp(cible).metadata();
  if (m.exif || m.xmp || m.iptc || m.icc) { // garde-fou : rien ne doit subsister
    await fs.rm(cible);
    throw new Error(`Métadonnées encore présentes dans ${nom} : fichier supprimé, rien n'est publié.`);
  }
  entrees.push({ fichier: `${id}/${nom}`, alt: '', legende: '' });
  console.log(`${f} → atlas/photos/${id}/${nom} (${m.width} × ${m.height}, sans métadonnées)`);
}
console.log(`\nÀ coller dans « photos » du lieu « ${id} » (écrire chaque texte alternatif, il est obligatoire) :`);
console.log(JSON.stringify(entrees, null, 2));
