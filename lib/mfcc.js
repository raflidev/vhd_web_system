/*
 * mfcc.js — MFCC extraction in pure JavaScript, replicating the exact
 * librosa pipeline used by vhd_model (fastapi/main.py):
 *
 *   librosa.load(sr=22050, res_type='kaiser_fast')
 *   librosa.feature.mfcc(y, sr=22050, n_mfcc=13)   [defaults: n_fft=2048,
 *     hop_length=512, win_length=2048, window='hann' (periodic),
 *     center=True pad_mode='constant', n_mels=128, fmin=0, fmax=sr/2,
 *     htk=False, norm='slaney', power=2.0, dct_type=2, norm='ortho']
 *   pad/truncate to 100 frames, transpose -> (100, 13)
 *
 * UMD: works as <script> (window.VHD), CommonJS (require), and ESM import.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else if (typeof define === "function" && define.amd) {
    define([], factory);
  } else {
    root.VHD = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* ── Hann window, PERIODIC (scipy get_window fftbins=True: w=0.5-0.5*cos(2πn/N)) ── */
  function hannWindow(n) {
    const w = new Float64Array(n);
    for (let i = 0; i < n; i++) w[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / n);
    return w;
  }

  /* ── Radix-2 iterative FFT, in-place on (re, im) ── */
  function fft(re, im) {
    const n = re.length;
    for (let i = 1, j = 0; i < n; i++) {
      let bit = n >> 1;
      for (; j & bit; bit >>= 1) j ^= bit;
      j ^= bit;
      if (i < j) {
        let t = re[i]; re[i] = re[j]; re[j] = t;
        t = im[i]; im[i] = im[j]; im[j] = t;
      }
    }
    for (let len = 2; len <= n; len <<= 1) {
      const ang = (-2 * Math.PI) / len;
      const wRe = Math.cos(ang), wIm = Math.sin(ang);
      for (let i = 0; i < n; i += len) {
        let curRe = 1, curIm = 0;
        const half = len >> 1;
        for (let k = 0; k < half; k++) {
          const a = i + k, b = i + k + half;
          const vRe = re[b] * curRe - im[b] * curIm;
          const vIm = re[b] * curIm + im[b] * curRe;
          const uRe = re[a], uIm = im[a];
          re[a] = uRe + vRe; im[a] = uIm + vIm;
          re[b] = uRe - vRe; im[b] = uIm - vIm;
          const nRe = curRe * wRe - curIm * wIm;
          curIm = curRe * wIm + curIm * wRe;
          curRe = nRe;
        }
      }
    }
  }

  /* ── Mel filterbank, librosa filters.mel: htk=False, norm='slaney' ── */
  // Slaney-style mel scale (librosa hz_to_mel/mel_to_hz, htk=False):
  // linear below 1000 Hz (200/3 mel per Hz), log above.
  function hz2mel(f) {
    const fSp = 200 / 3;
    const minLogHz = 1000;
    const minLogMel = minLogHz / fSp; // 15
    const logstep = Math.log(6.4) / 27;
    let mels = f / fSp;
    if (f >= minLogHz) mels = minLogMel + Math.log(f / minLogHz) / logstep;
    return mels;
  }
  function mel2hz(m) {
    const fSp = 200 / 3;
    const minLogHz = 1000;
    const minLogMel = minLogHz / fSp;
    const logstep = Math.log(6.4) / 27;
    let f = fSp * m;
    if (m >= minLogMel) f = minLogHz * Math.exp(logstep * (m - minLogMel));
    return f;
  }
  function buildMelBank(nFft, sr, nMels, fmin, fmax) {
    const nBins = nFft / 2 + 1;
    // librosa mel_frequencies: mel points converted BACK to Hz (piecewise Slaney)
    const m0 = hz2mel(fmin), m1 = hz2mel(fmax);
    const melPts = new Float64Array(nMels + 2);
    for (let i = 0; i < nMels + 2; i++) {
      melPts[i] = mel2hz(m0 + ((m1 - m0) * i) / (nMels + 1));
    }
    const w = new Float64Array(nMels * nBins);
    for (let m = 0; m < nMels; m++) {
      const lower = melPts[m], center = melPts[m + 1], upper = melPts[m + 2];
      const enorm = 2.0 / (upper - lower);
      const row = m * nBins;
      for (let b = 0; b < nBins; b++) {
        const hz = (b * sr) / nFft; // fftfrequencies in Hz
        let v;
        if (hz <= lower || hz >= upper) v = 0;
        else if (hz <= center) v = (hz - lower) / (center - lower);
        else v = (upper - hz) / (upper - center);
        w[row + b] = v * enorm;
      }
    }
    return w;
  }

  /* ── DCT-II orthonormal (scipy.fft.dct type=2, norm='ortho') ── */
  function dctOrtho(x, nCoeffs) {
    const N = x.length;
    const out = new Float64Array(nCoeffs);
    for (let k = 0; k < nCoeffs; k++) {
      let s = 0;
      for (let n = 0; n < N; n++) {
        s += x[n] * Math.cos((Math.PI * k * (2 * n + 1)) / (2 * N));
      }
      out[k] = s * (k === 0 ? Math.sqrt(1 / N) : Math.sqrt(2 / N));
    }
    return out;
  }

  /**
   * computeMFCC(samples, sr) -> Float32Array(100 * 13), row-major (100 frames x 13 coeffs)
   * Mirrors: pad/truncate to 100 frames, transpose, NO batch dim.
   */
  function computeMFCC(samples, sr, opts) {
    const o = opts || {};
    const nFft = o.nFft || 2048;
    const hop = o.hop || 512;
    const nMels = o.nMels || 128;
    const nMfcc = o.nMfcc || 13;
    const maxFrames = o.maxFrames || 100;

    const win = hannWindow(nFft);
    const bank = buildMelBank(nFft, sr, nMels, 0, sr / 2);
    const nBins = nFft / 2 + 1;

    // center=True, pad_mode='constant' -> zero pad nFft/2 on each side
    const n = samples.length;
    const padded = new Float64Array(n + nFft);
    padded.set(samples, nFft / 2);

    const nFrames = 1 + Math.floor((padded.length - nFft) / hop);
    const re = new Float64Array(nFft), im = new Float64Array(nFft);
    const melE = new Float64Array(nMels);
    const logFrames = []; // log-mel energies per frame (before top_db clip)

    for (let f = 0; f < nFrames; f++) {
      const off = f * hop;
      for (let i = 0; i < nFft; i++) {
        re[i] = padded[off + i] * win[i];
        im[i] = 0;
      }
      fft(re, im);
      const logRow = new Float64Array(nMels);
      for (let b = 0; b < nMels; b++) {
        let e = 0;
        const row = b * nBins;
        for (let k = 0; k < nBins; k++) {
          const s = re[k] * re[k] + im[k] * im[k];
          e += bank[row + k] * s;
        }
        logRow[b] = 10 * Math.log10(Math.max(e, 1e-10)); // power_to_db amin
      }
      logFrames.push(logRow);
    }

    // power_to_db top_db=80 (librosa default): clip at global max - 80
    let gmax = -Infinity;
    for (let f = 0; f < logFrames.length; f++) {
      for (let b = 0; b < nMels; b++) {
        if (logFrames[f][b] > gmax) gmax = logFrames[f][b];
      }
    }
    const floor = gmax - (o.topDb === undefined ? 80 : o.topDb);

    // DCT-II orthonormal per frame, keep first nMfcc coeffs
    const frames = [];
    for (let f = 0; f < logFrames.length; f++) {
      const row = logFrames[f];
      for (let b = 0; b < nMels; b++) {
        if (row[b] < floor) row[b] = floor;
      }
      frames.push(dctOrtho(row, nMfcc));
    }

    const out = new Float32Array(maxFrames * nMfcc);
    for (let f = 0; f < maxFrames; f++) {
      if (f < frames.length) out.set(frames[f], f * nMfcc);
    }
    return out;
  }

  return { computeMFCC, buildMelBank, hannWindow, fft, dctOrtho };
});
