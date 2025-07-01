# Quantum Algorithm Visualizer

Quantum Algorithm Visualizer is a lightweight React app I coded to explore Grover’s two-qubit search algorithm. Explore each gate, watch the Bloch spheres animate, and see probability distributions update in real time.

## What You’ll See

* **Step-by-step Circuit**: Clear SVG diagrams for each stage—superposition, oracle, diffusion, and more.
* **Interactive Bloch Spheres**: Rotate and inspect two qubits as their states evolve.
* **Real-time Probabilities**: Gauge how likely each basis state is at every step.
* **Controls You’ll Love**:

  * **Prev/Next** buttons to jump through stages
  * **Slider** to pick 1–3 Grover iterations
  * **Auto Play** for a hands-free walkthrough
  * **Reset** to restart from |00⟩

## Why It’s Cool

Grover’s algorithm searches an unsorted database in $O(\sqrt{N})$ time. On two qubits, it finds a marked state out of four, and this demo shows exactly how amplitude amplification works.

## Quickstart

1. **Clone** this repo:

   ```bash
   git clone https://github.com/your-user/quantum-visualizer.git
   cd quantum-visualizer
   ```
2. **Install** dependencies:

   ```bash
   npm install
   ```
3. **Run** in development mode:

   ```bash
   npm run dev
   ```

## Stack Used

* **React (18.x)** with hooks for UI state
* **Vite** for lightning-fast builds and HMR
* **Three.js** + **@react-three/fiber** for 3D Bloch spheres
* **Tailwind CSS** for quick, responsive styling
* **Lucide React** icons
