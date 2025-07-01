import React from 'react';

const CircuitDiagram = ({ step, stepInfo }) => {
  const renderGate = (gate, x, y, width = 40, height = 30) => {
    return (
      <g key={`${gate}-${x}-${y}`}>
        <rect
          x={x - width/2}
          y={y - height/2}
          width={width}
          height={height}
          fill="white"
          stroke="#2563eb"
          strokeWidth="2"
          rx="4"
        />
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          fill="#2563eb"
        >
          {gate}
        </text>
      </g>
    );
  };

  const renderQubitLine = (y, label) => {
    return (
      <g key={`qubit-${label}`}>
        <line
          x1={50}
          y1={y}
          x2={550}
          y2={y}
          stroke="#374151"
          strokeWidth="2"
        />
        <text
          x={30}
          y={y + 5}
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          fill="#374151"
        >
          {label}
        </text>
      </g>
    );
  };

  const renderMeasurement = (x, y) => {
    return (
      <g key={`measure-${x}-${y}`}>
        <rect
          x={x - 25}
          y={y - 20}
          width={50}
          height={40}
          fill="white"
          stroke="#dc2626"
          strokeWidth="2"
          rx="4"
        />
        <path
          d={`M ${x - 15} ${y + 10} Q ${x} ${y - 10} ${x + 15} ${y + 10}`}
          stroke="#dc2626"
          strokeWidth="2"
          fill="none"
        />
        <line
          x1={x}
          y1={y - 10}
          x2={x + 10}
          y2={y}
          stroke="#dc2626"
          strokeWidth="2"
        />
      </g>
    );
  };

  const getCircuitForStep = (stepIndex) => {
    const qubit0Y = 100;
    const qubit1Y = 160;
    const gates = [];

    switch (stepIndex) {
      case 0: // Initial state
        return { gates: [], title: "Initial State |00⟩" };
      
      case 1: // Superposition
        gates.push(renderGate('H', 150, qubit0Y));
        gates.push(renderGate('H', 150, qubit1Y));
        return { gates, title: "Superposition: H ⊗ H" };
      
      case 2: // First Oracle
        gates.push(renderGate('H', 150, qubit0Y));
        gates.push(renderGate('H', 150, qubit1Y));
        gates.push(renderGate('Oracle', 250, qubit0Y + 30, 60, 60));
        return { gates, title: "Oracle: Mark |11⟩" };
      
      case 3: // First Diffusion
        gates.push(renderGate('H', 150, qubit0Y));
        gates.push(renderGate('H', 150, qubit1Y));
        gates.push(renderGate('Oracle', 250, qubit0Y + 30, 60, 60));
        gates.push(renderGate('Diff', 350, qubit0Y + 30, 60, 60));
        return { gates, title: "Diffusion: Amplitude Amplification" };
      
      case 4: // Second Oracle (if iterations > 1)
        gates.push(renderGate('H', 150, qubit0Y));
        gates.push(renderGate('H', 150, qubit1Y));
        gates.push(renderGate('Oracle', 250, qubit0Y + 30, 60, 60));
        gates.push(renderGate('Diff', 350, qubit0Y + 30, 60, 60));
        gates.push(renderGate('Oracle', 450, qubit0Y + 30, 60, 60));
        return { gates, title: "Oracle: Second Iteration" };
      
      case 5: // Second Diffusion (if iterations > 1)
        gates.push(renderGate('H', 150, qubit0Y));
        gates.push(renderGate('H', 150, qubit1Y));
        gates.push(renderGate('Oracle', 250, qubit0Y + 30, 60, 60));
        gates.push(renderGate('Diff', 350, qubit0Y + 30, 60, 60));
        gates.push(renderGate('Oracle', 450, qubit0Y + 30, 60, 60));
        gates.push(renderGate('Diff', 550, qubit0Y + 30, 60, 60));
        return { gates, title: "Diffusion: Second Iteration" };
      
      default:
        return { gates: [], title: "Circuit Diagram" };
    }
  };

  const { gates, title } = getCircuitForStep(step);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">{title}</h3>
      <div className="flex justify-center">
        <svg width="600" height="220" className="border border-gray-200 rounded">
          {/* Background */}
          <rect width="600" height="220" fill="#f9fafb" />
          
          {/* Qubit lines */}
          {renderQubitLine(100, '|q₁⟩')}
          {renderQubitLine(160, '|q₀⟩')}
          
          {/* Gates */}
          {gates}
          
          {/* Step indicator */}
          <text
            x={300}
            y={30}
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fill="#1f2937"
          >
            Step {step + 1}: {stepInfo?.name || 'Unknown'}
          </text>
          
          {/* Legend */}
          <g transform="translate(20, 190)">
            <text x={0} y={0} fontSize="12" fill="#6b7280">
              Legend: H = Hadamard, Oracle = Phase flip |11⟩, Diff = Diffusion
            </text>
          </g>
        </svg>
      </div>
      
      {/* Step description */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>{stepInfo?.name}:</strong> {stepInfo?.description}
        </p>
      </div>
    </div>
  );
};

export default CircuitDiagram;

