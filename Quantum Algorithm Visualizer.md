# Quantum Algorithm Visualizer

An interactive web application that visualizes Grover's quantum search algorithm on 2 qubits. This MVP demonstrates quantum circuit diagrams, Bloch sphere animations, and step-by-step algorithm execution.

## Features

- **Grover's Algorithm Implementation**: Complete 2-qubit Grover's algorithm simulation
- **Circuit Diagram Visualization**: Step-by-step quantum circuit rendering
- **Bloch Sphere Animation**: Real-time 3D visualization of qubit states
- **Interactive Controls**: Navigate through algorithm steps with Prev/Next buttons
- **Iteration Control**: Adjust the number of Grover iterations (1-3) with a slider
- **Auto-Play Mode**: Automatic step-through with timing
- **State Probabilities**: Real-time probability distribution display
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **React 19**: Modern functional components with hooks
- **Vite**: Fast build tool and development server
- **Three.js**: 3D graphics for Bloch sphere visualization
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Useful helpers for Three.js
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Modern icon library

## Installation

1. **Clone or download the project**
   ```bash
   cd quantum-visualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the URL shown in your terminal)

## Usage

1. **Iteration Control**: Use the slider to set the number of Grover iterations (1-3)
2. **Navigation**: Use Prev/Next buttons to step through the algorithm
3. **Auto-Play**: Click "Auto Play" to automatically run through all steps
4. **Reset**: Click "Reset" to return to the initial state
5. **3D Interaction**: Click and drag on the Bloch spheres to rotate the view

## Algorithm Steps

1. **Initial State**: Start with |00⟩
2. **Superposition**: Apply Hadamard gates to create equal superposition
3. **Oracle**: Mark the target state |11⟩ by flipping its phase
4. **Diffusion**: Amplify the marked state using the diffusion operator
5. **Iteration**: Repeat Oracle + Diffusion for optimal results

## Project Structure

```
src/
├── components/
│   ├── BlochSphere.jsx      # 3D Bloch sphere visualization
│   ├── CircuitDiagram.jsx   # Quantum circuit diagram
│   └── ui/                  # UI components (slider, etc.)
├── utils/
│   └── quantumSimulator.js  # Quantum simulation engine
├── App.jsx                  # Main application component
├── App.css                  # Styling and animations
└── main.jsx                 # Application entry point
```

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## Browser Compatibility

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Notes

- The 3D Bloch spheres use WebGL for optimal performance
- Quantum state calculations are optimized for real-time updates
- Responsive design ensures good performance on mobile devices

## Educational Value

This visualizer helps understand:
- Quantum superposition and entanglement
- How quantum gates affect qubit states
- The geometric representation of qubits on the Bloch sphere
- The mechanics of Grover's search algorithm
- Quantum amplitude amplification techniques

## License

MIT License - feel free to use this for educational purposes.

## Contributing

This is an MVP implementation. Potential improvements:
- Support for more qubits
- Additional quantum algorithms
- More detailed quantum gate animations
- Export functionality for educational materials
- Interactive quantum gate placement

