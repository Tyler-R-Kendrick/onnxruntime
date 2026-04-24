// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import type { InferenceSession } from 'onnxruntime-common';

export type KvCompressionMode = 'perTokenSymmetric' | 'perGroupSymmetric';

export type WebGpuKvCompressionOptions = Pick<
  InferenceSession.WebGpuExecutionProviderOption,
  | 'kvCompressionEnabled'
  | 'kvCompressionMode'
  | 'kvCompressionBits'
  | 'kvCompressionGroupSize'
  | 'kvCompressionLayers'
  | 'kvCompressionDebug'
>;

export interface NormalizedKvCompressionConfig {
  enabled: boolean;
  mode: KvCompressionMode;
  bits: 2 | 3 | 4 | 8;
  groupSize: 32 | 64 | 128 | 256;
  layers: readonly number[];
  debug: boolean;
}

const DEFAULT_KV_COMPRESSION_CONFIG: NormalizedKvCompressionConfig = {
  enabled: false,
  mode: 'perGroupSymmetric',
  bits: 4,
  groupSize: 128,
  layers: [],
  debug: false,
};

const isValidBits = (value: number): value is 2 | 3 | 4 | 8 => value === 2 || value === 3 || value === 4 || value === 8;

const isValidGroupSize = (value: number): value is 32 | 64 | 128 | 256 =>
  value === 32 || value === 64 || value === 128 || value === 256;

export const normalizeKvCompressionConfig = (
  webgpuOptions: WebGpuKvCompressionOptions,
): NormalizedKvCompressionConfig => {
  const config: NormalizedKvCompressionConfig = { ...DEFAULT_KV_COMPRESSION_CONFIG, layers: [...DEFAULT_KV_COMPRESSION_CONFIG.layers] };

  if (webgpuOptions.kvCompressionEnabled !== undefined) {
    if (typeof webgpuOptions.kvCompressionEnabled !== 'boolean') {
      throw new Error(`kvCompressionEnabled must be a boolean: ${webgpuOptions.kvCompressionEnabled}`);
    }
    config.enabled = webgpuOptions.kvCompressionEnabled;
  }

  if (webgpuOptions.kvCompressionMode !== undefined) {
    if (
      webgpuOptions.kvCompressionMode !== 'perTokenSymmetric' &&
      webgpuOptions.kvCompressionMode !== 'perGroupSymmetric'
    ) {
      throw new Error(`kvCompressionMode must be 'perTokenSymmetric' or 'perGroupSymmetric': ${webgpuOptions.kvCompressionMode}`);
    }
    config.mode = webgpuOptions.kvCompressionMode;
  }

  if (webgpuOptions.kvCompressionBits !== undefined) {
    if (!Number.isInteger(webgpuOptions.kvCompressionBits) || !isValidBits(webgpuOptions.kvCompressionBits)) {
      throw new Error(`kvCompressionBits must be one of 2, 3, 4, 8: ${webgpuOptions.kvCompressionBits}`);
    }
    config.bits = webgpuOptions.kvCompressionBits;
  }

  if (webgpuOptions.kvCompressionGroupSize !== undefined) {
    if (
      !Number.isInteger(webgpuOptions.kvCompressionGroupSize) ||
      !isValidGroupSize(webgpuOptions.kvCompressionGroupSize)
    ) {
      throw new Error(`kvCompressionGroupSize must be one of 32, 64, 128, 256: ${webgpuOptions.kvCompressionGroupSize}`);
    }
    config.groupSize = webgpuOptions.kvCompressionGroupSize;
  }

  if (webgpuOptions.kvCompressionLayers !== undefined) {
    if (!Array.isArray(webgpuOptions.kvCompressionLayers)) {
      throw new Error('kvCompressionLayers must be an array of non-negative integers.');
    }

    const uniqueLayers = new Set<number>();
    for (const layer of webgpuOptions.kvCompressionLayers) {
      if (!Number.isInteger(layer) || layer < 0) {
        throw new Error(`kvCompressionLayers must contain only non-negative integers: ${layer}`);
      }
      uniqueLayers.add(layer);
    }

    config.layers = [...uniqueLayers].sort((a, b) => a - b);
  }

  if (webgpuOptions.kvCompressionDebug !== undefined) {
    if (typeof webgpuOptions.kvCompressionDebug !== 'boolean') {
      throw new Error(`kvCompressionDebug must be a boolean: ${webgpuOptions.kvCompressionDebug}`);
    }
    config.debug = webgpuOptions.kvCompressionDebug;
  }

  return config;
};
