import sin from '@stdlib/math/base/special/sin';
import cos from '@stdlib/math/base/special/cos';
import tan from '@stdlib/math/base/special/tan';
import floor from '@stdlib/math/base/special/floor';
import cabs from '@stdlib/math/base/special/cabs';
import add from '@stdlib/complex/float64/base/add'
import Complex128 from '@stdlib/complex/float64/ctor';
import Complex128Array from '@stdlib/array/complex128';
import PI from '@stdlib/constants/float64/pi'
import Float64Array from '@stdlib/array/float64'

function dft(x) {
  const N = x.length;
  const X = new Complex128Array(N);
  for (let k = 0; k < N; k++) {
    let sum = new Complex128(0,0);
    for (let n = 0; n < N; n++) {
      const theta = -2 * PI * k * n / N;
      const w = new Complex128( cos(theta)*x[n], sin(theta)*x[n] );
      sum = add( sum, w );
    }
    X[k] = sum;
  }
  return X;
}

const N = 1000;  
const T = 10;    
const t = new Float64Array(N);    
const signal = new Float64Array(N);

for (let i = 0; i < N; i++) {
  const time = i * T / (N - 1);
  t[i]=(time);
  signal[i]= sin(2 * PI * 1 * time) + 0.5 * tan(2 * PI * 2 * time);
}

const X = dft(signal);

const dt = T / (N - 1);
const freqs = new Float64Array(N);
for (let k = 0; k < N; k++) {
  freqs[k]=(k / (N * dt));
}

const halfN = floor(N / 2);
const amplitudes = new Float64Array(halfN);
for (let k = 0; k < halfN; k++) {
  amplitudes[k]=(cabs(X[k]));
}

const timeTrace = {
  x: t,
  y: signal,
  mode: 'lines',
  name: 'Signal'
};

const timeLayout = {
  title: 'Time Domain Signal',
  xaxis: { title: 'Time (s)' },
  yaxis: { title: 'Amplitude' }
};

Plotly.newPlot('timeDomain', [timeTrace], timeLayout);

const freqTrace = {
  x: freqs.slice(0, halfN),
  y: amplitudes,
  mode: 'lines',
  name: 'Amplitude Spectrum'
};

const freqLayout = {
  title: 'Frequency Domain (Amplitude Spectrum)',
  xaxis: { title: 'Frequency (Hz)' },
  yaxis: { title: 'Amplitude' }
};

Plotly.newPlot('frequencyDomain', [freqTrace], freqLayout);
