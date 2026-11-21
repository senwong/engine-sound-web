#!/usr/bin/env bash
set -euo pipefail

export PATH="$HOME/.cargo/bin:$PATH"
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "[1/3] Checking .esc presets..."
mkdir -p "$ROOT_DIR/engine-wasm/presets"
if [ -d "$ROOT_DIR/upstream" ]; then
  cp "$ROOT_DIR/upstream/src/default.esc" "$ROOT_DIR/engine-wasm/presets/"
  cp "$ROOT_DIR/upstream"/example*.esc "$ROOT_DIR/engine-wasm/presets/"
fi

echo "[2/3] Building Rust DSP core -> wasm32-unknown-unknown (release)..."
cd "$ROOT_DIR/engine-wasm"
cargo build --target wasm32-unknown-unknown --release

echo "[3/3] Copying engine_dsp.wasm to web/..."
cp "$ROOT_DIR/engine-wasm/target/wasm32-unknown-unknown/release/engine_wasm.wasm" \
   "$ROOT_DIR/web/engine_dsp.wasm"

ls -lh "$ROOT_DIR/web/engine_dsp.wasm"
echo "Done! Run: cd web && python3 -m http.server 8080"
