import { cpSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildDossier } from './vendor/makefun-game.ts';

// The entry is a deterministic static snapshot: no browser state or generated timestamps enter it.
// The game remains plain files, so the browser can open it from any static server.
const root = process.cwd();
const output = resolve(process.env.MAKEFUN_OUTPUT_DIR || '/output');
mkdirSync(output, { recursive: true });
cpSync(resolve(root, 'game'), resolve(output, 'game'), { recursive: true, force: true });
cpSync(resolve(root, 'screenshots'), resolve(output, 'screenshots'), { recursive: true, force: true });

const requiredFiles = [
  'game/index.html',
  'game/src/main.js',
  'game/src/data/dialogue.js',
  'game/src/data/radioShows.js',
  'game/src/data/cityGuide.js',
  'screenshots/1-chase.jpg',
  'screenshots/2-driving.jpg',
  'screenshots/3-onfoot.jpg',
  'screenshots/4-mission.jpg',
];
for (const relativePath of requiredFiles) {
  const source = resolve(root, relativePath);
  const destination = resolve(output, relativePath);
  if (statSync(source).size === 0 || statSync(destination).size === 0) {
    throw new Error(`Required entry file is empty: ${relativePath}`);
  }
}

function sourceBytes(directory) {
  return readdirSync(directory, { withFileTypes: true }).reduce((total, entry) => {
    const file = resolve(directory, entry.name);
    if (entry.isDirectory()) return total + (entry.name === 'vendor' ? 0 : sourceBytes(file));
    if (!/\.(html|js|mjs|css|glsl|vert|frag|wgsl|json)$/i.test(entry.name)) return total;
    if (/\.min\.(js|mjs|css)$/i.test(entry.name)) return total;
    return total + statSync(file).size;
  }, 0);
}

const gameSourceBytes = sourceBytes(resolve(root, 'game'));
if (gameSourceBytes < 140000 || gameSourceBytes > 155000) {
  throw new Error(`Game source must stay within the density band: ${gameSourceBytes} bytes`);
}

const dossier = buildDossier(output, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
const dossierBytes = Buffer.byteLength(dossier);
if (dossierBytes > 1572864) throw new Error(`Dossier exceeds 1.5 MiB: ${dossierBytes}`);
writeFileSync(resolve(output, 'dossier.json'), dossier);
process.stdout.write(`Built ${output} · game source ${gameSourceBytes} bytes · dossier ${dossierBytes} bytes · text cap 163840 bytes\n`);
