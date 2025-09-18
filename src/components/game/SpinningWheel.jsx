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
          duration: 0.25,
          ease: "easeInOut"
        }
      });
      
      // Determinar y notificar el segmento ganador
      const winningSegment = calculateWinningSegment(totalRotation);
      
      // Pequeña pausa antes de notificar para darle drama
      setTimeout(() => {
        setIsSpinning(false);
        onSpinComplete?.(winningSegment);
      }, 300);
      
    } catch (error) {
      console.error('Error durante la animación:', error);
      setIsSpinning(false);
    }
  }, [controls, isSpinning, disabled, onSpinComplete]);

  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        {/* Contenedor principal de la rueda */}
        <div className="relative">
          {/* SVG de la rueda */}
          <motion.svg
            width="300"
            height="300"
            viewBox="0 0 300 300"
            className="drop-shadow-2xl"
            animate={controls}
            initial={{ rotate: 0 }}
            style={{ originX: 0.5, originY: 0.5 }}
          >
            {/* Definiciones de gradientes */}
            <defs>
              {segments.map((segment, index) => (
                <linearGradient
                  key={`gradient-${index}`}
                  id={`gradient-${index}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor={segment.gradient[0]} />
                  <stop offset="100%" stopColor={segment.gradient[1]} />
                </linearGradient>
              ))}
              
              {/* Filtros para sombras y efectos */}
              <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2"/>
                <feOffset dx="1" dy="1" result="offset"/>
                <feFlood floodColor="#000000" floodOpacity="0.2"/>
                <feComposite in2="offset" operator="in"/>
                <feMerge>
                  <feMergeNode/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              
              <filter id="buttonShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.3"/>
              </filter>
            </defs>
            
            {/* Círculo exterior de la rueda (borde) */}
            <circle
              cx="150"
              cy="150"
              r="145"
              fill="#2C3E50"
              stroke="#34495E"
              strokeWidth="3"
            />
            
            {/* Segmentos de la rueda */}
            {segments.map((segment, index) => {
              const textPos = getTextPosition(index);
              
              return (
                <g key={segment.id}>
                  {/* Segmento principal */}
                  <path
                    d={generateSegmentPath(index, 140)}
                    fill={`url(#gradient-${index})`}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    filter="url(#innerShadow)"
                  />
                  
                  {/* Líneas divisorias entre segmentos */}
                  <path
                    d={generateSegmentPath(index, 140)}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    opacity="0.8"
                  />
                  
                  {/* Área para íconos (círculo blanco) */}
                  <circle
                    cx={getTextPosition(index, 80).x}
                    cy={getTextPosition(index, 80).y}
                    r="16"
                    fill="#FFFFFF"
                    opacity="0.9"
                  />
                  
                  {/* Texto del segmento */}
                  <text
                    x={textPos.x}
                    y={textPos.y + 30}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#FFFFFF"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="Arial, sans-serif"
                    transform={`rotate(${textPos.rotation}, ${textPos.x}, ${textPos.y + 30})`}
                  >
                    <tspan x={textPos.x} dy="0">{segment.label.split(' ').slice(0, 2).join(' ')}</tspan>
                    {segment.label.split(' ').length > 2 && (
                      <tspan x={textPos.x} dy="12">{segment.label.split(' ').slice(2).join(' ')}</tspan>
                    )}
                  </text>
                </g>
              );
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
