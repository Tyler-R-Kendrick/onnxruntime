# TurboQuant KV Compression Seam Analysis (ORT WebGPU/JSEP)

## Scope
This document captures the smallest maintainable integration seam in ORT Web for a TurboQuant-capable KV-cache path.

## Candidate seams
1. **JS per-token interception (`present.*` tensors)**
   - Rejected: violates hot-path and GPU-residency constraints.
2. **WebGPU op implementation seam (`js/web/lib/wasm/jsep/webgpu/ops/*`)**
   - Candidate: closest location to attention execution and tensor lifetime control.
3. **Session option plumbing (`js/common/lib/inference-session.ts`, `js/web/lib/wasm/session-options.ts`)**
   - Candidate: needed to gate/parameterize feature behavior.
4. **WASM/JSEP bridge (`js/web/lib/wasm/jsep/init.ts`)**
   - Candidate: useful for observability and backend-level capability checks.

## Selected seam
Primary seam: **WebGPU attention/operator path + EP option plumbing**.

Rationale:
- keeps compute and cache management in WebGPU/JSEP hot path,
- minimizes public API churn,
- allows explicit feature-gated fallback to baseline behavior.

## Deferred/rejected seams
- Global runtime interception in JS: rejected due to CPU readback risk and per-token JS loops.
- Monolithic patch spanning all providers: rejected to keep fork focused and maintainable.

## Files/modules to touch in phased implementation
- `js/common/lib/inference-session.ts` (public config surface)
- `js/web/lib/wasm/session-options.ts` (option transport)
- `js/web/lib/wasm/jsep/webgpu/ops/attention.ts` and/or `group-query-attention.ts` (read path)
- `js/web/lib/wasm/jsep/webgpu/gpu-data-manager.ts` (cache ownership/lifetime)
- `js/web/lib/wasm/jsep/init.ts` (debug telemetry hooks)
