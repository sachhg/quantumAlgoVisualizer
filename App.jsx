import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Play } from 'lucide-react';
import { Slider } from './components/ui/slider';
import CircuitDiagram from './components/CircuitDiagram';
import BlochSphere from './components/BlochSphere';
import { GroverAlgorithm } from './utils/quantumSimulator';
import './App.css';

function App() {
  const [grover] = useState(new GroverAlgorithm());
  const [currentStep, setCurrentStep] = useState(0);
  const [iterations, setIterations] = useState([1]);
  const [isRunning, setIsRunning] = useState(false);
  const [quantumState, setQuantumState] = useState(null);
  const [stepInfo, setStepInfo] = useState(null);

  // Initialize the algorithm
  useEffect(() => {
    runAlgorithm();
  }, [iterations]);

  const runAlgorithm = () => {
    grover.run(iterations[0]);
    setCurrentStep(0);
    updateCurrentState();
  };

  const updateCurrentState = () => {
    const state = grover.getCurrentState();
    const info = grover.getCurrentStep();
    setQuantumState(state);
    setStepInfo(info);
  };

  const nextStep = () => {
    if (grover.nextStep()) {
      setCurrentStep(prev => prev + 1);
      updateCurrentState();
    }
  };

  const prevStep = () => {
    if (grover.prevStep()) {
      setCurrentStep(prev => prev - 1);
      updateCurrentState();
    }
  };

  const resetAlgorithm = () => {
    grover.setStep(0);
    setCurrentStep(0);
    updateCurrentState();
  };

  const autoPlay = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    resetAlgorithm();
    
    const totalSteps = grover.getTotalSteps();
    for (let i = 0; i < totalSteps - 1; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (grover.nextStep()) {
        setCurrentStep(prev => prev + 1);
        updateCurrentState();
      }
    }
    
    setIsRunning(false);
  };

  const probabilities = quantumState ? quantumState.getProbabilities() : [1, 0, 0, 0];
  const totalSteps = grover.getTotalSteps();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Quantum Algorithm Visualizer
          </h1>
          <p className="text-lg text-gray-600">
            Interactive visualization of Grover's Algorithm on 2 qubits
          </p>
        </header>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Iteration Control */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">
                Iterations: {iterations[0]}
              </label>
              <div className="w-32">
                <Slider
                  value={iterations}
                  onValueChange={setIterations}
                  min={1}
                  max={3}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={resetAlgorithm}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                disabled={isRunning}
              >
                <RotateCcw size={16} />
                Reset
              </button>
              
              <button
                onClick={autoPlay}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                disabled={isRunning}
              >
                <Play size={16} />
                {isRunning ? 'Running...' : 'Auto Play'}
              </button>

              <button
                onClick={prevStep}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentStep === 0 || isRunning}
              >
                <ChevronLeft size={16} />
                Prev
              </button>

              <span className="px-4 py-2 bg-gray-100 rounded-lg font-medium">
                {currentStep + 1} / {totalSteps}
              </span>

              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentStep === totalSteps - 1 || isRunning}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Circuit Diagram */}
          <div className="xl:col-span-2">
            <CircuitDiagram step={currentStep} stepInfo={stepInfo} />
          </div>

          {/* Bloch Spheres */}
          <BlochSphere 
            quantumState={quantumState} 
            qubitIndex={0} 
            className="h-full"
          />
          <BlochSphere 
            quantumState={quantumState} 
            qubitIndex={1} 
            className="h-full"
          />
        </div>

        {/* State Probabilities */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">State Probabilities</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {['|00⟩', '|01⟩', '|10⟩', '|11⟩'].map((state, index) => (
              <div key={state} className="text-center">
                <div className="text-lg font-semibold text-gray-700 mb-2">{state}</div>
                <div className="bg-gray-200 rounded-full h-4 mb-2">
                  <div
                    className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${(probabilities[index] * 100).toFixed(1)}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600">
                  {(probabilities[index] * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Algorithm Info */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">About Grover's Algorithm</h3>
          <div className="prose text-gray-600">
            <p>
              Grover's algorithm is a quantum search algorithm that can search an unsorted database 
              quadratically faster than classical algorithms. For 2 qubits, it searches through 4 
              possible states to find a marked item (in this case, |11⟩).
            </p>
            <p className="mt-2">
              The algorithm consists of:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Superposition:</strong> Create equal superposition of all states</li>
              <li><strong>Oracle:</strong> Mark the target state by flipping its phase</li>
              <li><strong>Diffusion:</strong> Amplify the marked state's amplitude</li>
              <li><strong>Iteration:</strong> Repeat Oracle + Diffusion for optimal results</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

