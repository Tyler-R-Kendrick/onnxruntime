# Build and Load: Custom ORT WebGPU/JSEP Artifact

## Build
From `js/web`:

```bash
npm ci
npm run build
```

The build emits JSEP artifacts in `js/web/dist/` including:
- `ort-wasm-simd-threaded.jsep.wasm`
- `ort-wasm-simd-threaded.jsep.mjs`

## Runtime override
Use `ort.env.wasm.wasmPaths` to point to custom JSEP assets so application code can switch between stock/custom artifacts by config only.

## Current status
This fork adds the **configuration and validation surface** for KV-compression options and transports normalized values through WebGPU EP options.
The fused compressed-KV attention hot path is intentionally staged for follow-up phases.
