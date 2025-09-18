import React, { useState, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';

/**
 * SpinningWheel - Componente de rueda giratoria de alta calidad
 * 
 * Un componente SVG completamente vectorial con animaciones físicas realistas
 * diseñado para ser el elemento central de un juego de trivia infantil.
 */
const SpinningWheel = ({ onSpinComplete, disabled = false }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const controls = useAnimation();

  // Configuración de los 5 segmentos de la rueda
  const segments = [
    {
      id: 'social-classes',
      label: 'Vida de las clases sociales',
      color: '#FF6B9D', // Rosa vibrante
      gradient: ['#FF6B9D', '#FF8FA3']
    },
    {
      id: 'domestic-economy',
      label: 'Economía doméstica', 
      color: '#4ECDC4', // Turquesa
      gradient: ['#4ECDC4', '#6EDDD6']
    },
    {
      id: 'merchant-dynasties',
      label: 'Dinastías de comerciantes famosas',
      color: '#45B7D1', // Azul cielo
      gradient: ['#45B7D1', '#65C7E1']
    },
    {
      id: 'tomsk',
      label: 'Tomsk',
      color: '#96CEB4', // Verde menta
      gradient: ['#96CEB4', '#A6DEC4']
    },
    {
      id: 'entrepreneurship',
      label: 'Desarrollo del emprendimiento',
      color: '#FFEAA7', // Amarillo dorado
      gradient: ['#FFEAA7', '#FFE4B5']
    }
  ];

  // Ángulo por segmento (360° / 5 segmentos = 72°)
  const segmentAngle = 72;
  
  /**
   * Genera el path SVG para un segmento de la rueda
   * @param {number} index - Índice del segmento (0-4)
   * @param {number} radius - Radio de la rueda
   * @returns {string} Path SVG del segmento
   */
  const generateSegmentPath = (index, radius = 140) => {
    const startAngle = (index * segmentAngle - 90) * (Math.PI / 180); // -90 para empezar desde arriba
    const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
    
    const x1 = 150 + radius * Math.cos(startAngle);
    const y1 = 150 + radius * Math.sin(startAngle);
    const x2 = 150 + radius * Math.cos(endAngle);
    const y2 = 150 + radius * Math.sin(endAngle);
    
    // Crear el arco SVG
    const largeArcFlag = segmentAngle > 180 ? 1 : 0;
    
    return `M 150 150 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  /**
   * Calcula la posición del texto en cada segmento
   * @param {number} index - Índice del segmento
   * @param {number} radius - Radio para posicionar el texto
   * @returns {Object} Coordenadas x, y y rotación del texto
   */
  const getTextPosition = (index, radius = 100) => {
    const angle = (index * segmentAngle + segmentAngle / 2 - 90) * (Math.PI / 180);
    const x = 150 + radius * Math.cos(angle);
    const y = 150 + radius * Math.sin(angle);
    const rotation = index * segmentAngle + segmentAngle / 2;
    
    return { x, y, rotation };
  };

  /**
   * Determina qué segmento ganó basado en la rotación final
   * @param {number} finalRotation - Rotación final en grados
   * @returns {Object} Segmento ganador
   */
  const calculateWinningSegment = (finalRotation) => {
    // Normalizar la rotación a 0-360°
    const normalizedRotation = ((finalRotation % 360) + 360) % 360;
    
    // El puntero está en la parte superior (0°), calcular qué segmento está debajo
    // Como los segmentos empiezan desde arriba, necesitamos ajustar
    const segmentIndex = Math.floor(((360 - normalizedRotation + segmentAngle / 2) % 360) / segmentAngle);
    
    return segments[segmentIndex];
  };

  /**
   * Maneja el evento de giro de la rueda con animación física realista
   */
  const handleSpin = useCallback(async () => {
    if (isSpinning || disabled) return;
    
    setIsSpinning(true);
    
    // Generar rotación aleatoria (múltiples vueltas + ángulo aleatorio)
    const minSpins = 4; // Mínimo 4 vueltas completas
    const maxSpins = 7; // Máximo 7 vueltas completas
    const spins = minSpins + Math.random() * (maxSpins - minSpins);
    const finalAngle = Math.random() * 360;
    const totalRotation = spins * 360 + finalAngle;
    
    try {
      // FASE 1: Anticipación (pequeño movimiento hacia atrás)
      await controls.start({
        rotate: -15,
        transition: {
          duration: 0.2,
          ease: "easeOut"
        }
      });
      
      // FASE 2: Giro principal con desaceleración suave
      await controls.start({
        rotate: totalRotation,
        transition: {
          duration: 3.5,
          ease: [0.23, 1, 0.32, 1], // Curva de ease personalizada para desaceleración natural
        }
      });
      
      // FASE 3: Rebote sutil al final (sobregiro y corrección)
      const overshoot = totalRotation + 8;
      await controls.start({
        rotate: overshoot,
        transition: {
          duration: 0.15,
          ease: "easeOut"
        }
      });
      
      // FASE 4: Corrección final al punto exacto
      await controls.start({
        rotate: totalRotation,
        transition: {
      
      await controls.start({
        rotate: newRotation,
        transition: {
          duration: 4.5,
          ease: [0.23, 1, 0.32, 1], // Smooth realistic deceleration
        }
      });
      
      // Calculate which segment was selected (accounting for pointer at top)
      const normalizedAngle = (360 - (newRotation % 360) + 90) % 360;
      const selectedIndex = Math.floor(normalizedAngle / segmentAngle);
      const selectedCategory = categories[selectedIndex];
      
      setIsSpinning(false);
      
      if (onResult) {
        onResult(selectedCategory);
      }
      
      return selectedCategory;
    }
  }));

  const createSegmentPath = (index, total) => {
    const angle = 360 / total;
    const startAngle = index * angle - 90; // Start from top
    const endAngle = (index + 1) * angle - 90;
    
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const radius = 140;
    const centerX = 150;
    const centerY = 150;
    
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  const getTextPosition = (index, total) => {
    const angle = 360 / total;
    const midAngle = (index * angle + angle / 2 - 90) * (Math.PI / 180);
    const textRadius = 100; // Increased for better readability
    const centerX = 150;
    const centerY = 150;
    
    return {
      x: centerX + textRadius * Math.cos(midAngle),
      y: centerY + textRadius * Math.sin(midAngle),
      angle: (index * angle + angle / 2 - 90)
    };
  };

  // Break long text into multiple lines
  const formatCategoryText = (text) => {
    if (text.length <= 20) return [text];
    
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
      if ((currentLine + ' ' + word).length <= 20) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    
    return lines.slice(0, 2); // Max 2 lines
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Wheel Container with glow effect */}
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 opacity-20 blur-xl scale-110 animate-pulse"></div>
        
        {/* Premium Pointer/Arrow */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 z-20">
          <div className="relative">
            {/* Arrow shadow */}
            <div 
              className="absolute top-1 left-1/2 transform -translate-x-1/2"
              style={{ 
                width: 0, 
                height: 0,
                borderLeft: '18px solid transparent',
                borderRight: '18px solid transparent',
                borderTop: '36px solid rgba(0,0,0,0.3)',
                filter: 'blur(2px)'
              }}
            />
            {/* Main arrow */}
            <div 
              className="relative"
              style={{ 
                width: 0, 
                height: 0,
                borderLeft: '16px solid transparent',
                borderRight: '16px solid transparent',
                borderTop: '34px solid #FFD700',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
              }}
            })}
            
            {/* Centro de la rueda */}
            <circle
              cx="150"
              cy="150"
              r="35"
              fill="#2C3E50"
              stroke="#FFFFFF"
              strokeWidth="4"
              filter="url(#buttonShadow)"
            />
          </motion.svg>
          
          {/* Puntero superior fijo */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
            <svg width="30" height="40" viewBox="0 0 30 40">
              <defs>
                <linearGradient id="pointerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#FFA500" />
                </linearGradient>
              </defs>
              <path
                d="M15 0 L25 20 L20 25 L15 30 L10 25 L5 20 Z"
                fill="url(#pointerGradient)"
                stroke="#FFFFFF"
                strokeWidth="2"
                filter="drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
              />
            </svg>
          </div>
          
          {/* Botón central de GIRAR */}
          <motion.button
            onClick={handleSpin}
            disabled={isSpinning || disabled}
            className={`
              absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
              w-16 h-16 rounded-full font-bold text-white text-sm
              transition-all duration-200 z-10
              ${isSpinning || disabled 
                ? 'bg-gray-500 cursor-not-allowed opacity-70' 
                : 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 cursor-pointer shadow-lg hover:shadow-xl'
              }
            `}
            whileHover={!isSpinning && !disabled ? { scale: 1.05 } : {}}
            whileTap={!isSpinning && !disabled ? { scale: 0.95 } : {}}
            animate={isSpinning ? {
              boxShadow: [
                "0 0 0 0 rgba(239, 68, 68, 0.7)",
                "0 0 0 20px rgba(239, 68, 68, 0)",
                "0 0 0 0 rgba(239, 68, 68, 0)"
              ]
            } : {}}
            transition={isSpinning ? {
              duration: 2,
              repeat: Infinity
            } : {}}
          >
            {isSpinning ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              'GIRAR'
            )}
          </motion.button>
        </div>
        
        {/* Efectos de partículas cuando está girando */}
        {isSpinning && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  left: `${50 + 40 * Math.cos(i * Math.PI / 4)}%`,
                  top: `${50 + 40 * Math.sin(i * Math.PI / 4)}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpinningWheel;
