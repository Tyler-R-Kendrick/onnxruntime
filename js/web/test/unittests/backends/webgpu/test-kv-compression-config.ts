// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { expect } from 'chai';
import { normalizeKvCompressionConfig, type WebGpuKvCompressionOptions } from '../../../../lib/wasm/jsep/webgpu/kv-compression-config';

const createWebGpuOptions = (overrides: WebGpuKvCompressionOptions = {}): WebGpuKvCompressionOptions => ({
  ...overrides,
});

describe('#UnitTest# - webgpu - kv compression config normalization', () => {
  it('returns defaults when options are omitted', () => {
    const normalized = normalizeKvCompressionConfig(createWebGpuOptions());
    expect(normalized).to.deep.equal({
      enabled: false,
      mode: 'perGroupSymmetric',
      bits: 4,
      groupSize: 128,
      layers: [],
      debug: false,
    });
  });

  it('normalizes valid values and deduplicates layer list', () => {
    const normalized = normalizeKvCompressionConfig(
      createWebGpuOptions({
        kvCompressionEnabled: true,
        kvCompressionMode: 'perTokenSymmetric',
        kvCompressionBits: 3,
        kvCompressionGroupSize: 64,
        kvCompressionLayers: [12, 1, 12, 4],
        kvCompressionDebug: true,
      }),
    );

    expect(normalized).to.deep.equal({
      enabled: true,
      mode: 'perTokenSymmetric',
      bits: 3,
      groupSize: 64,
      layers: [1, 4, 12],
      debug: true,
    });
  });

  it('throws for invalid bit width', () => {
    expect(() => normalizeKvCompressionConfig(createWebGpuOptions({ kvCompressionBits: 6 }))).to.throw(
      'kvCompressionBits must be one of 2, 3, 4, 8',
    );
  });

  it('throws for invalid layer index', () => {
    expect(() => normalizeKvCompressionConfig(createWebGpuOptions({ kvCompressionLayers: [0, -1] }))).to.throw(
      'kvCompressionLayers must contain only non-negative integers',
    );
  });
});
