import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface SpinningWheelPremiumProps {
  categories: string[];
  onResult?: (category: string) => void;
  isSpinning?: boolean;
}

const SpinningWheelPremium = forwardRef<any, SpinningWheelPremiumProps>(({ categories, onResult, isSpinning: externalIsSpinning }, ref) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const controls = useAnimation();
  const wheelRef = useRef<SVGSVGElement>(null);

  // Premium colors with gradients
  const segmentColors = [
    { main: '#FF6B6B', gradient: '#FF8E8E', shadow: '#E55656' }, // Coral Red
    { main: '#4ECDC4', gradient: '#6EE7DE', shadow: '#3BA29A' }, // Turquoise
    { main: '#45B7D1', gradient: '#67C5EA', shadow: '#3A9BC1' }, // Blue
    { main: '#96CEB4', gradient: '#B8E6C8', shadow: '#7DB899' }, // Green
    { main: '#FFEAA7', gradient: '#FFEF9A', shadow: '#E6D196' }, // Yellow
  ];

  const segmentAngle = 360 / categories.length;

  useImperativeHandle(ref, () => ({
    spin: async () => {
      if (isSpinning || externalIsSpinning) return null;
      
      setIsSpinning(true);
      
      // Generate random spin (4-7 full rotations + random angle)
      const spins = Math.floor(Math.random() * 4) + 4;
      const finalAngle = Math.random() * 360;
      const totalRotation = spins * 360 + finalAngle;
      const newRotation = rotation + totalRotation;
      
      setRotation(newRotation);
      
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
      const selectedCategory = categories[selectedIndex] || categories[0];
      
      setIsSpinning(false);
      
      if (onResult && selectedCategory) {
        onResult(selectedCategory);
      }
      
      return selectedCategory;
    }
  }));

  const createSegmentPath = (index: number, total: number) => {
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

  const getTextPosition = (index: number, total: number) => {
    const angle = 360 / total;
    const midAngle = (index * angle + angle / 2 - 90) * (Math.PI / 180);
    const textRadius = 100; // Optimal distance for readability
    const centerX = 150;
    const centerY = 150;
    
    return {
      x: centerX + textRadius * Math.cos(midAngle),
      y: centerY + textRadius * Math.sin(midAngle)
    };
  };

  // Simplified category names with icons
  const formatCategoryText = (text: string) => {
    const categoryMap: Record<string, { short: string; icon: string }> = {
      "Жизнь социальных классов": { short: "Социальные классы", icon: "👥" },
      "Домашнее хозяйство": { short: "Домашнее хозяйство", icon: "🏠" },
      "Знаменитые купеческие династии": { short: "Купеческие династии", icon: "👑" },
      "Томск - крупный сибирский торговый центр": { short: "Торговый центр", icon: "🏛️" },
      "Развитие предпринимательства": { short: "Предпринимательство", icon: "💼" }
    };
    
    const mapped = categoryMap[text];
    if (mapped) {
      // Split into max 2 lines if still too long
      const shortText = mapped.short;
      if (shortText.length <= 16) {
        return [shortText];
      } else {
        const words = shortText.split(' ');
        if (words.length >= 2) {
          const mid = Math.ceil(words.length / 2);
          return [
            words.slice(0, mid).join(' '),
            words.slice(mid).join(' ')
          ];
        }
        return [shortText];
      }
    }
    
    // Fallback for unknown categories
    return text.length <= 16 ? [text] : [text.substring(0, 16) + "..."];
  };

  // Get icon for category
  const getCategoryIcon = (text: string) => {
    const categoryMap: Record<string, string> = {
      "Жизнь социальных классов": "👥",
      "Домашнее хозяйство": "🏠", 
      "Знаменитые купеческие династии": "👑",
      "Томск - крупный сибирский торговый центр": "🏛️",
      "Развитие предпринимательства": "💼"
    };
    return categoryMap[text] || "📚";
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Wheel Container with premium effects */}
      <div className="relative">
        {/* Outer glow effect */}
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
            />
            {/* Arrow highlight */}
            <div 
              className="absolute top-2 left-1/2 transform -translate-x-1/2"
              style={{ 
                width: 0, 
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '16px solid #FFF9C4',
              }}
            />
          </div>
        </div>
        
        {/* Premium Wheel SVG - BIGGER */}
        <motion.svg
          ref={wheelRef}
          width="400"
          height="400"
          viewBox="0 0 300 300"
          className="relative z-10"
          animate={controls}
          style={{ 
            originX: '50%', 
            originY: '50%',
            filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.3))'
          }}
        >
          {/* Define all gradients and effects */}
          <defs>
            {/* Outer decorative gradient */}
            <linearGradient id="outerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="25%" stopColor="#FFA500" />
              <stop offset="50%" stopColor="#FFD700" />
              <stop offset="75%" stopColor="#FFA500" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
            
            {/* Segment gradients */}
            {segmentColors.map((color, index) => (
              <radialGradient key={`grad-${index}`} id={`gradient${index}`} cx="30%" cy="30%">
                <stop offset="0%" stopColor={color.gradient} />
                <stop offset="70%" stopColor={color.main} />
                <stop offset="100%" stopColor={color.shadow} />
              </radialGradient>
            ))}
            
            {/* Inner highlight effect */}
            <radialGradient id="innerHighlight" cx="30%" cy="30%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            
            {/* Center gradient */}
            <radialGradient id="centerGradient" cx="30%" cy="30%">
              <stop offset="0%" stopColor="#34495E" />
              <stop offset="70%" stopColor="#2C3E50" />
              <stop offset="100%" stopColor="#1A252F" />
            </radialGradient>
            
            {/* Center jewel gradient */}
            <radialGradient id="jewelGradient" cx="30%" cy="30%">
              <stop offset="0%" stopColor="#FFE55C" />
              <stop offset="50%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#FFA500" />
            </radialGradient>
          </defs>
          
          {/* Outer decorative ring */}
          <circle
            cx="150"
            cy="150"
            r="148"
            fill="url(#outerGradient)"
            stroke="none"
          />
          
          {/* Main wheel border */}
          <circle
            cx="150"
            cy="150"
            r="143"
            fill="none"
            stroke="#2C3E50"
            strokeWidth="6"
          />
          
          {/* Segments with premium styling */}
          {categories.map((category, index) => {
            const textPos = getTextPosition(index, categories.length);
            const lines = formatCategoryText(category);
            
            return (
              <g key={`segment-${index}`}>
                {/* Main segment */}
                <path
                  d={createSegmentPath(index, categories.length)}
                  fill={`url(#gradient${index % segmentColors.length})`}
                  stroke="#FFFFFF"
                  strokeWidth="3"
                />
                
                {/* Inner highlight overlay */}
                <path
                  d={createSegmentPath(index, categories.length)}
                  fill="url(#innerHighlight)"
                  opacity="0.6"
                />
                
                {/* Category content - ALWAYS HORIZONTAL */}
                <g>
                  {/* Background circle for better readability */}
                  <circle
                    cx={textPos.x}
                    cy={textPos.y}
                    r="45"
                    fill="rgba(0,0,0,0.7)"
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth="3"
                  />
                  
                  {/* Category Icon */}
                  <text
                    x={textPos.x}
                    y={textPos.y - 15}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="select-none"
                    style={{
                      fontSize: '20px',
                      filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.8))'
                    }}
                  >
                    {getCategoryIcon(category)}
                  </text>
                  
                  {/* Category Text */}
                  {lines.map((line, lineIndex) => {
                    const yOffset = (lineIndex - (lines.length - 1) / 2) * 14 + 8; // Offset down for icon
                    
                    return (
                      <g key={`text-${index}-${lineIndex}`}>
                        {/* Text shadow for depth */}
                        <text
                          x={textPos.x + 1}
                          y={textPos.y + yOffset + 1}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="font-bold select-none"
                          style={{
                            fontSize: '11px',
                            fill: 'rgba(0,0,0,0.8)',
                            fontFamily: '"Comfortaa", "Arial", sans-serif'
                          }}
                        >
                          {line}
                        </text>
                        
                        {/* Main text - ALWAYS HORIZONTAL */}
                        <text
                          x={textPos.x}
                          y={textPos.y + yOffset}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="font-bold select-none"
                          style={{
                            fontSize: '13px',
                            fill: '#FFFFFF',
                            stroke: '#000000',
                            strokeWidth: '1.5px',
                            fontFamily: '"Comfortaa", "Arial", sans-serif',
                            fontWeight: 'bold'
                          }}
                        >
                          {line}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </g>
            );
          })}
          
          {/* Premium center hub */}
          <circle
            cx="150"
            cy="150"
            r="30"
            fill="url(#centerGradient)"
            stroke="#FFD700"
            strokeWidth="5"
          />
          
          {/* Center ring highlight */}
          <circle
            cx="150"
            cy="150"
            r="22"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
          />
          
          {/* Center jewel */}
          <circle
            cx="150"
            cy="150"
            r="14"
            fill="url(#jewelGradient)"
          />
          
          {/* Jewel highlight */}
          <circle
            cx="148"
            cy="148"
            r="6"
            fill="rgba(255,255,255,0.8)"
          />
        </motion.svg>
        
        {/* SPIN BUTTON - Clickeable */}
        <button
          onClick={async () => {
            if (!isSpinning && !externalIsSpinning) {
              setIsSpinning(true);
              
              // Generate random spin (4-7 full rotations + random angle)
              const spins = Math.floor(Math.random() * 4) + 4;
              const finalAngle = Math.random() * 360;
              const totalRotation = spins * 360 + finalAngle;
              const newRotation = rotation + totalRotation;
              
              setRotation(newRotation);
              
              await controls.start({
                rotate: newRotation,
                transition: {
                  duration: 4.5,
                  ease: [0.23, 1, 0.32, 1],
                }
              });
              
              // Calculate selected category
              const normalizedAngle = (360 - (newRotation % 360) + 90) % 360;
              const selectedIndex = Math.floor(normalizedAngle / segmentAngle);
              const selectedCategory = categories[selectedIndex] || categories[0];
              
              setIsSpinning(false);
              
              if (onResult && selectedCategory) {
                onResult(selectedCategory);
              }
            }
          }}
          disabled={isSpinning || externalIsSpinning}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30
                     bg-gradient-to-br from-yellow-400 to-orange-500 
                     hover:from-yellow-300 hover:to-orange-400
                     disabled:from-gray-400 disabled:to-gray-500
                     text-white font-bold text-lg px-6 py-3 rounded-full
                     shadow-lg hover:shadow-xl transform hover:scale-105 
                     transition-all duration-200 disabled:cursor-not-allowed
                     border-4 border-white"
          style={{
            fontFamily: '"Comfortaa", sans-serif',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}
        >
          {(isSpinning || externalIsSpinning) ? '⏳' : 'SPIN'}
        </button>
      </div>
      
      {/* Premium loading state */}
      {(isSpinning || externalIsSpinning) && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-center space-x-4">
            <div className="relative">
              <div className="animate-spin w-10 h-10 border-4 border-white/30 border-t-yellow-400 rounded-full"></div>
              <div className="absolute inset-0 animate-ping w-10 h-10 border-2 border-yellow-400/20 rounded-full"></div>
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-lg">Крутится колесо фортуны!</p>
              <p className="text-white/80 text-sm">Определяем категорию вопроса...</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
});

SpinningWheelPremium.displayName = 'SpinningWheelPremium';

export default SpinningWheelPremium;
