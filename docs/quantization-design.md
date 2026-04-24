# Quantization Design Draft (Phase 3)

## Modes
- `perTokenSymmetric`
- `perGroupSymmetric`

## Tunables
- bit width: 2/3/4/8
- group size: 32/64/128/256

## Correctness targets
- bounded reconstruction error,
- stable attention score behavior,
- deterministic behavior for fixed inputs.

## Status
This patch introduces API-level tunables and strict validation only; math kernels are staged for next implementation phase.
