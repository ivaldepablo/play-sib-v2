import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface ModernSpinWheelProps {
  categories: string[];
  onResult?: (category: string) => void;
  isSpinning?: boolean;
  onSpinStart?: () => void;
}

const ModernSpinWheel = forwardRef<any, ModernSpinWheelProps>(({ categories, onResult, isSpinning: externalIsSpinning, onSpinStart }, ref) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const controls = useAnimation();

  // Modern bright colors like the reference
  const segmentColors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Turquoise
    '#45B7D1', // Blue
    '#96CEB4', // Green
    '#FFEAA7', // Yellow
    '#DDA0DD', // Plum
    '#98D8C8', // Mint
    '#F7DC6F', // Light Yellow
  ];

  // Category icons - simple and clear
  const categoryIcons: Record<string, string> = {
    "Жизнь социальных классов": "👥",
    "Домашнее хозяйство": "🏠",
    "Знаменитые купеческие династии": "👑",
    "Томск - крупный сибирский торговый центр": "🏛️",
    "Развитие предпринимательства": "💼"
  };

  const segmentAngle = 360 / categories.length;

  useImperativeHandle(ref, () => ({
    spin: async () => {
      if (isSpinning || externalIsSpinning) return null;
      return await handleSpin();
    }
  }));

  const handleSpin = async () => {
    if (isSpinning || externalIsSpinning) return;
    
    setIsSpinning(true);
    
    // Call onSpinStart callback if provided
    if (onSpinStart) {
      onSpinStart();
    }
    
    // Generate random spin (5-8 full rotations + random angle)
    const spins = Math.floor(Math.random() * 4) + 5;
    const finalAngle = Math.random() * 360;
    const totalRotation = spins * 360 + finalAngle;
    const newRotation = rotation + totalRotation;
    
    setRotation(newRotation);
    
    await controls.start({
      rotate: newRotation,
      transition: {
        duration: 4,
        ease: [0.23, 1, 0.32, 1],
      }
    });
    
    // Calculate selected category (accounting for pointer at top)
    const normalizedAngle = (360 - (newRotation % 360) + 90) % 360;
    const selectedIndex = Math.floor(normalizedAngle / segmentAngle);
    const selectedCategory = categories[selectedIndex] || categories[0];
    
    setIsSpinning(false);
    
    // Call the result callback
    if (onResult && selectedCategory) {
      setTimeout(() => {
        onResult(selectedCategory);
      }, 500); // Small delay for better UX
    }
    
    return selectedCategory;
  };

  const createSegmentPath = (index: number, total: number) => {
    const angle = 360 / total;
    const startAngle = index * angle - 90;
    const endAngle = (index + 1) * angle - 90;
    
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const radius = 180;
    const centerX = 200;
    const centerY = 200;
    
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  const getIconPosition = (index: number, total: number) => {
    const angle = 360 / total;
    const midAngle = (index * angle + angle / 2 - 90) * (Math.PI / 180);
    const iconRadius = 130;
    const centerX = 200;
    const centerY = 200;
    
    return {
      x: centerX + iconRadius * Math.cos(midAngle),
      y: centerY + iconRadius * Math.sin(midAngle)
    };
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Modern Wheel Container */}
      <div className="relative">
        {/* Outer glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-20 blur-2xl scale-110 animate-pulse"></div>
        
        {/* Pointer - Modern triangle */}
        <div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 z-20"
          style={{ 
            width: 0, 
            height: 0,
            borderLeft: '20px solid transparent',
            borderRight: '20px solid transparent',
            borderTop: '40px solid #FFD700',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
          }}
        />
        
        {/* Modern Wheel SVG */}
        <motion.svg
          width="480"
          height="480"
          viewBox="0 0 400 400"
          className="relative z-10"
          animate={controls}
          style={{ 
            originX: '50%', 
            originY: '50%',
            filter: 'drop-shadow(0 10px 40px rgba(0,0,0,0.3))'
          }}
        >
          {/* Outer ring */}
          <circle
            cx="200"
            cy="200"
            r="190"
            fill="none"
            stroke="#E0E0E0"
            strokeWidth="8"
          />
          
          {/* Inner ring */}
          <circle
            cx="200"
            cy="200"
            r="185"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="4"
          />
          
          {/* Segments */}
          {categories.map((category, index) => {
            const iconPos = getIconPosition(index, categories.length);
            const color = segmentColors[index % segmentColors.length];
            
            return (
              <g key={`segment-${index}`}>
                {/* Segment */}
                <path
                  d={createSegmentPath(index, categories.length)}
                  fill={color}
                  stroke="#FFFFFF"
                  strokeWidth="4"
                />
                
                {/* Icon */}
                <text
                  x={iconPos.x}
                  y={iconPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="select-none"
                  style={{
                    fontSize: '48px',
                    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
                  }}
                >
                  {categoryIcons[category] || '📚'}
                </text>
              </g>
            );
          })}
          
          {/* Center circle */}
          <circle
            cx="200"
            cy="200"
            r="50"
            fill="#FFFFFF"
            stroke="#E0E0E0"
            strokeWidth="4"
          />
        </motion.svg>
        
        {/* Modern SPIN button */}
        <button
          onClick={handleSpin}
          disabled={isSpinning || externalIsSpinning}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30
                     bg-gradient-to-br from-orange-400 to-red-500 
                     hover:from-orange-300 hover:to-red-400
                     disabled:from-gray-400 disabled:to-gray-500
                     text-white font-bold text-xl px-8 py-4 rounded-full
                     shadow-xl hover:shadow-2xl transform hover:scale-105 
                     transition-all duration-200 disabled:cursor-not-allowed
                     border-4 border-white"
          style={{
            fontFamily: '"Comfortaa", sans-serif',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            minWidth: '100px',
            minHeight: '60px'
          }}
        >
          {(isSpinning || externalIsSpinning) ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
            </div>
          ) : (
            'SPIN'
          )}
        </button>
      </div>
      
      {/* Status indicator */}
      {(isSpinning || externalIsSpinning) && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
        >
          <p className="text-white font-bold text-lg">Выбираем категорию...</p>
        </motion.div>
      )}
    </div>
  );
});

ModernSpinWheel.displayName = 'ModernSpinWheel';

export default ModernSpinWheel;
