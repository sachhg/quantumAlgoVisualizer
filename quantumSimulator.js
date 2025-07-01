// Quantum Simulator for 2-qubit Grover's Algorithm
// Implements basic quantum operations and state management

export class Complex {
  constructor(real = 0, imag = 0) {
    this.real = real;
    this.imag = imag;
  }

  add(other) {
    return new Complex(this.real + other.real, this.imag + other.imag);
  }

  multiply(other) {
    if (typeof other === 'number') {
      return new Complex(this.real * other, this.imag * other);
    }
    return new Complex(
      this.real * other.real - this.imag * other.imag,
      this.real * other.imag + this.imag * other.real
    );
  }

  magnitude() {
    return Math.sqrt(this.real * this.real + this.imag * this.imag);
  }

  phase() {
    return Math.atan2(this.imag, this.real);
  }

  conjugate() {
    return new Complex(this.real, -this.imag);
  }

  toString() {
    if (this.imag >= 0) {
      return `${this.real.toFixed(3)} + ${this.imag.toFixed(3)}i`;
    }
    return `${this.real.toFixed(3)} - ${Math.abs(this.imag).toFixed(3)}i`;
  }
}

export class QuantumState {
  constructor(amplitudes = null) {
    // For 2 qubits, we have 4 basis states: |00⟩, |01⟩, |10⟩, |11⟩
    if (amplitudes) {
      this.amplitudes = amplitudes.map(amp => 
        amp instanceof Complex ? amp : new Complex(amp, 0)
      );
    } else {
      // Initialize to |00⟩ state
      this.amplitudes = [
        new Complex(1, 0), // |00⟩
        new Complex(0, 0), // |01⟩
        new Complex(0, 0), // |10⟩
        new Complex(0, 0)  // |11⟩
      ];
    }
  }

  // Get probability of measuring each basis state
  getProbabilities() {
    return this.amplitudes.map(amp => amp.magnitude() ** 2);
  }

  // Get the state of individual qubits for Bloch sphere visualization
  getQubitStates() {
    const qubit0 = this.getQubitState(0);
    const qubit1 = this.getQubitState(1);
    return [qubit0, qubit1];
  }

  getQubitState(qubitIndex) {
    if (qubitIndex === 0) {
      // Qubit 0 (rightmost): trace out qubit 1
      const alpha = this.amplitudes[0].add(this.amplitudes[1]); // |0⟩ component
      const beta = this.amplitudes[2].add(this.amplitudes[3]);  // |1⟩ component
      return { alpha, beta };
    } else {
      // Qubit 1 (leftmost): trace out qubit 0
      const alpha = this.amplitudes[0].add(this.amplitudes[2]); // |0⟩ component
      const beta = this.amplitudes[1].add(this.amplitudes[3]);  // |1⟩ component
      return { alpha, beta };
    }
  }

  // Convert qubit state to Bloch sphere coordinates
  getBlochCoordinates(qubitIndex) {
    const { alpha, beta } = this.getQubitState(qubitIndex);
    
    // Normalize
    const norm = Math.sqrt(alpha.magnitude() ** 2 + beta.magnitude() ** 2);
    if (norm === 0) return { x: 0, y: 0, z: 1 };
    
    const alphaNew = alpha.multiply(1 / norm);
    const betaNew = beta.multiply(1 / norm);
    
    // Bloch sphere coordinates
    const x = 2 * (alphaNew.conjugate().multiply(betaNew)).real;
    const y = 2 * (alphaNew.conjugate().multiply(betaNew)).imag;
    const z = alphaNew.magnitude() ** 2 - betaNew.magnitude() ** 2;
    
    return { x, y, z };
  }

  copy() {
    return new QuantumState(this.amplitudes.map(amp => new Complex(amp.real, amp.imag)));
  }
}

export class QuantumGate {
  constructor(matrix) {
    this.matrix = matrix;
  }

  // Apply gate to a quantum state
  apply(state, targetQubits = [0, 1]) {
    const newAmplitudes = new Array(4).fill(null).map(() => new Complex(0, 0));
    
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        newAmplitudes[i] = newAmplitudes[i].add(
          this.matrix[i][j].multiply(state.amplitudes[j])
        );
      }
    }
    
    return new QuantumState(newAmplitudes);
  }
}

// Quantum Gates
export const Gates = {
  // Hadamard gate on qubit 0
  H0: new QuantumGate([
    [new Complex(1/Math.sqrt(2), 0), new Complex(1/Math.sqrt(2), 0), new Complex(0, 0), new Complex(0, 0)],
    [new Complex(1/Math.sqrt(2), 0), new Complex(-1/Math.sqrt(2), 0), new Complex(0, 0), new Complex(0, 0)],
    [new Complex(0, 0), new Complex(0, 0), new Complex(1/Math.sqrt(2), 0), new Complex(1/Math.sqrt(2), 0)],
    [new Complex(0, 0), new Complex(0, 0), new Complex(1/Math.sqrt(2), 0), new Complex(-1/Math.sqrt(2), 0)]
  ]),

  // Hadamard gate on qubit 1
  H1: new QuantumGate([
    [new Complex(1/Math.sqrt(2), 0), new Complex(0, 0), new Complex(1/Math.sqrt(2), 0), new Complex(0, 0)],
    [new Complex(0, 0), new Complex(1/Math.sqrt(2), 0), new Complex(0, 0), new Complex(1/Math.sqrt(2), 0)],
    [new Complex(1/Math.sqrt(2), 0), new Complex(0, 0), new Complex(-1/Math.sqrt(2), 0), new Complex(0, 0)],
    [new Complex(0, 0), new Complex(1/Math.sqrt(2), 0), new Complex(0, 0), new Complex(-1/Math.sqrt(2), 0)]
  ]),

  // Oracle that flips the phase of |11⟩ state
  Oracle: new QuantumGate([
    [new Complex(1, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0)],
    [new Complex(0, 0), new Complex(1, 0), new Complex(0, 0), new Complex(0, 0)],
    [new Complex(0, 0), new Complex(0, 0), new Complex(1, 0), new Complex(0, 0)],
    [new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(-1, 0)]
  ]),

  // Diffusion operator (inversion about average)
  Diffusion: new QuantumGate([
    [new Complex(-0.5, 0), new Complex(0.5, 0), new Complex(0.5, 0), new Complex(0.5, 0)],
    [new Complex(0.5, 0), new Complex(-0.5, 0), new Complex(0.5, 0), new Complex(0.5, 0)],
    [new Complex(0.5, 0), new Complex(0.5, 0), new Complex(-0.5, 0), new Complex(0.5, 0)],
    [new Complex(0.5, 0), new Complex(0.5, 0), new Complex(0.5, 0), new Complex(-0.5, 0)]
  ])
};

export class GroverAlgorithm {
  constructor() {
    this.reset();
  }

  reset() {
    this.states = [];
    this.steps = [];
    this.currentStep = 0;
    this.iterations = 1;
  }

  // Run Grover's algorithm with specified number of iterations
  run(iterations = 1) {
    this.reset();
    this.iterations = iterations;
    
    // Step 0: Initial state |00⟩
    let state = new QuantumState();
    this.states.push(state.copy());
    this.steps.push({ name: 'Initial', description: 'Start with |00⟩ state' });

    // Step 1: Apply Hadamard to both qubits (superposition)
    state = Gates.H1.apply(state);
    state = Gates.H0.apply(state);
    this.states.push(state.copy());
    this.steps.push({ name: 'Superposition', description: 'Apply H gates to create equal superposition' });

    // Grover iterations
    for (let i = 0; i < iterations; i++) {
      // Step 2 + 2*i: Apply Oracle
      state = Gates.Oracle.apply(state);
      this.states.push(state.copy());
      this.steps.push({ name: `Oracle ${i + 1}`, description: `Oracle marks the target state |11⟩` });

      // Step 3 + 2*i: Apply Diffusion
      state = Gates.Diffusion.apply(state);
      this.states.push(state.copy());
      this.steps.push({ name: `Diffusion ${i + 1}`, description: 'Diffusion operator amplifies marked state' });
    }

    return this.states;
  }

  getCurrentState() {
    return this.states[this.currentStep] || new QuantumState();
  }

  getCurrentStep() {
    return this.steps[this.currentStep] || { name: 'Initial', description: 'Start with |00⟩ state' };
  }

  nextStep() {
    if (this.currentStep < this.states.length - 1) {
      this.currentStep++;
      return true;
    }
    return false;
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      return true;
    }
    return false;
  }

  setStep(step) {
    if (step >= 0 && step < this.states.length) {
      this.currentStep = step;
      return true;
    }
    return false;
  }

  getTotalSteps() {
    return this.states.length;
  }
}

