# Benchmark Methodology (Planned)

Compare:
1. stock ORT WebGPU/JSEP,
2. forked runtime with KV compression disabled,
3. forked runtime with KV compression enabled.

Measure:
- first-token latency,
- steady-state decode throughput,
- cache/memory growth,
- output divergence.

## Reproducibility requirements
- fixed model artifact,
- fixed browser/GPU/driver metadata,
- fixed prompt + decode settings,
- machine-readable JSON output schema.
