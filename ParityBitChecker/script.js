// Tab Switching Logic
document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach((content) => content.classList.remove('active'));

    // Add active class to the clicked tab and corresponding content
    tab.classList.add('active');
    document.getElementById(tab.getAttribute('data-tab')).classList.add('active');
  });
});

// Parity Bit Simulation
function simulateParity() {
  const data = document.getElementById('parity-input').value;
  if (!/^[01]+$/.test(data)) {
    alert('Enter valid binary data.');
    return;
  }
  const parityBit = data.split('').reduce((sum, bit) => sum + parseInt(bit), 0) % 2;
  const parityData = data + parityBit;
  const visualization = document.getElementById('parity-visualization');
  visualization.innerHTML = `
      <p>Original Data: <strong>${data}</strong></p>
      <p>Parity Bit: <strong>${parityBit}</strong></p>
      <p>Transmitted Data: <strong>${parityData}</strong></p>
    `;
}

// CRC Simulation
function simulateCRC() {
  const data = document.getElementById('crc-input').value;
  const polynomial = document.getElementById('crc-polynomial').value;

  if (!/^[01]+$/.test(data) || !/^[01]+$/.test(polynomial)) {
    alert('Enter valid binary data and polynomial.');
    return;
  }

  const dataBits = data + '0'.repeat(polynomial.length - 1);
  let remainder = dataBits;

  for (let i = 0; i <= dataBits.length - polynomial.length; i++) {
    if (remainder[i] === '1') {
      const segment = remainder.slice(i, i + polynomial.length);
      const xorResult = segment
        .split('')
        .map((bit, index) => (bit === polynomial[index] ? '0' : '1'))
        .join('');
      remainder =
        remainder.slice(0, i) +
        xorResult +
        remainder.slice(i + polynomial.length);
    }
  }

  const crc = remainder.slice(-polynomial.length + 1);
  const transmittedData = data + crc;

  const visualization = document.getElementById('crc-visualization');
  visualization.innerHTML = `
      <p>Original Data: <strong>${data}</strong></p>
      <p>Polynomial: <strong>${polynomial}</strong></p>
      <p>CRC: <strong>${crc}</strong></p>
      <p>Transmitted Data: <strong>${transmittedData}</strong></p>
    `;
}

// Checksum Simulation
function simulateChecksum() {
  const data = document.getElementById('checksum-input').value;

  if (!/^[01]+$/.test(data) || data.length % 8 !== 0) {
    alert('Enter valid binary data with a length that is a multiple of 8.');
    return;
  }

  const bytes = data.match(/.{1,8}/g).map((byte) => parseInt(byte, 2));
  let sum = bytes.reduce((acc, byte) => acc + byte, 0);

  console.log(bytes)
  console.log(sum)

  while (sum > 255) {
    const overflow = Math.floor(sum / 256);
    console.log(overflow)
    sum = (sum % 256) + overflow;
    console.log(sum)
  }

  const checksum = (~sum & 0xff).toString(2).padStart(8, '0');
  const visualization = document.getElementById('checksum-visualization');
  visualization.innerHTML = `
      <p>Original Data: <strong>${data}</strong></p>
      <p>Checksum: <strong>${checksum}</strong></p>
      <p>Transmitted Data: <strong>${data}${checksum}</strong></p>
    `;
}

// Hamming Code Simulation
function simulateHamming() {
  const data = document.getElementById('hamming-input').value;

  if (!/^[01]+$/.test(data)) {
    alert('Enter valid binary data.');
    return;
  }

  const dataBits = data.split('');
  let hammingCode = [];
  let parityPositions = 0;

  // Calculate number of parity bits required
  while (Math.pow(2, parityPositions) < (dataBits.length + parityPositions + 1)) {
    parityPositions++;
  }

  // Insert parity bits at the appropriate positions (powers of 2)
  let dataIndex = 0;
  for (let i = 1; i <= dataBits.length + parityPositions; i++) {
    if ((i & (i - 1)) === 0) {
      hammingCode.push('P'); // Insert parity bit placeholder
    } else {
      hammingCode.push(dataBits[dataIndex]); // Insert data bit
      dataIndex++;
    }
  }

  // Calculate the parity bits
  for (let i = 0; i < parityPositions; i++) {
    const parityIndex = Math.pow(2, i) - 1;
    let parityValue = 0;

    // Calculate parity for the bits covered by the current parity bit
    for (let j = parityIndex; j < hammingCode.length; j += 2 ** (i + 1)) {
      for (let k = j; k < j + 2 ** i && k < hammingCode.length; k++) {
        if (hammingCode[k] !== 'P') {
          parityValue ^= parseInt(hammingCode[k]);
        }
      }
    }

    // Set the parity value in the Hamming code
    hammingCode[parityIndex] = parityValue;
  }

  const visualization = document.getElementById('hamming-visualization');
  visualization.innerHTML = `
      <p>Original Data: <strong>${data}</strong></p>
      <p>Hamming Code: <strong>${hammingCode.join('')}</strong></p>
    `;
}

