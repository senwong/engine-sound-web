#!/usr/bin/env node
import { createHash } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const webDir = join(root, 'web');

function shortHash(file) {
  const buf = readFileSync(join(webDir, file));
  return createHash('sha256').update(buf).digest('hex').slice(0, 8);
}

// 1. Stamp sub-assets referenced inside main.js first (so main.js hash reflects them)
const clustersHash = shortHash('clusters.js');
const workletHash = shortHash('engine-worklet.js');
const wasmHash = shortHash('engine_dsp.wasm');

const mainPath = join(webDir, 'main.js');
let mainSrc = readFileSync(mainPath, 'utf8');
mainSrc = mainSrc
  .replace(/\.\/clusters\.js(\?v=[a-zA-Z0-9_-]+)?/g, `./clusters.js?v=${clustersHash}`)
  .replace(/engine-worklet\.js(\?v=[a-zA-Z0-9_-]+)?/g, `engine-worklet.js?v=${workletHash}`)
  .replace(/engine_dsp\.wasm(\?v=[a-zA-Z0-9_-]+)?/g, `engine_dsp.wasm?v=${wasmHash}`);
writeFileSync(mainPath, mainSrc, 'utf8');

// 2. Now hash style.css and updated main.js, and stamp index.html
const cssHash = shortHash('style.css');
const mainHash = shortHash('main.js');

const htmlPath = join(webDir, 'index.html');
let htmlSrc = readFileSync(htmlPath, 'utf8');
htmlSrc = htmlSrc
  .replace(/style\.css(\?v=[a-zA-Z0-9_-]+)?/g, `style.css?v=${cssHash}`)
  .replace(/main\.js(\?v=[a-zA-Z0-9_-]+)?/g, `main.js?v=${mainHash}`);
writeFileSync(htmlPath, htmlSrc, 'utf8');

console.log(
  `Stamped asset hashes: style=${cssHash} clusters=${clustersHash} main=${mainHash} worklet=${workletHash} wasm=${wasmHash}`
);
