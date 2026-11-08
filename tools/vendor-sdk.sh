#!/bin/sh
# Rebuilds site/editor/vendor/anthropic.mjs, the browser bundle of the official Anthropic SDK.
# Usage: tools/vendor-sdk.sh 1.2.0
set -eu
V="${1:?SDK-Version angeben, z. B. 1.2.0}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
cd "$TMP"
npm init -y >/dev/null
npm i --no-audit --no-fund "@anthropic-ai/sdk@$V" esbuild@0.25.10 >/dev/null
echo 'export { default } from "@anthropic-ai/sdk";' > entry.mjs
./node_modules/.bin/esbuild entry.mjs --bundle --format=esm --platform=browser --minify --outfile=bundle.mjs
{ echo "// @anthropic-ai/sdk $V (MIT, Copyright Anthropic, PBC; see LICENSE-anthropic-sdk.txt), bundled with esbuild 0.25.10 by tools/vendor-sdk.sh"; cat bundle.mjs; } > "$ROOT/site/editor/vendor/anthropic.mjs"
cp node_modules/@anthropic-ai/sdk/LICENSE "$ROOT/site/editor/vendor/LICENSE-anthropic-sdk.txt"
rm -rf "$TMP"
echo "ok: site/editor/vendor/anthropic.mjs ($V)"
