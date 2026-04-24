# KV Format Draft (Phase 2 Design)

## Intended layout
- Quantized payload buffer (GPU-resident)
- Per-block scale metadata
- Append-only indexing per layer/head

## Invariants
- deterministic append order,
- monotonic token index growth,
- layer/head isolation,
- explicit reset/dispose lifecycle.

## Status
Design scaffold complete; binary layout implementation is deferred pending attention-path seam patching.
