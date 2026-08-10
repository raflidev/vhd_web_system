// Deklarasi tipe untuk lib/mfcc.js (UMD, pure JS)
export function computeMFCC(
  samples: Float64Array | Float32Array | number[],
  sr: number,
  opts?: { nFft?: number; hop?: number; nMels?: number; nMfcc?: number; maxFrames?: number; topDb?: number }
): Float32Array;
export function buildMelBank(nFft: number, sr: number, nMels: number, fmin: number, fmax: number): Float64Array;
export function hannWindow(n: number): Float64Array;
export function fft(re: Float64Array, im: Float64Array): void;
export function dctOrtho(x: Float64Array, nCoeffs: number): Float64Array;
