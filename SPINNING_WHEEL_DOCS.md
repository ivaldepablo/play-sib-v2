# 🎡 SpinningWheel - Componente de Rueda Giratoria de Alta Calidad

## 🎯 Descripción

El componente `SpinningWheel` es una rueda giratoria completamente vectorial SVG diseñada para ser el elemento central del juego de trivia Play Sib v2. Implementa animaciones físicas realistas y un diseño visual "juicy" perfecto para audiencias infantiles.

## 🎨 Características Visuales

### **Tecnología Gráfica**
- **100% SVG**: Gráficos vectoriales escalables para máxima nitidez
- **Gradientes dinámicos**: Cada segmento tiene degradados personalizados
- **Sombras interiores**: Efectos de profundidad y volumen
- **Puntero dorado**: Indicador visual atractivo con gradiente
- **Efectos de partículas**: Animaciones durante el giro

### **Paleta de Colores**
- **Rosa Vibrante**: `#FF6B9D` → `#FF8FA3` (Vida de clases sociales)
- **Turquesa**: `#4ECDC4` → `#6EDDD6` (Economía doméstica)  
- **Azul Cielo**: `#45B7D1` → `#65C7E1` (Dinastías comerciantes)
- **Verde Menta**: `#96CEB4` → `#A6DEC4` (Tomsk)
- **Amarillo Dorado**: `#FFEAA7` → `#FFE4B5` (Emprendimiento)

## ⚙️ Características Técnicas

### **Animación Física Realista**
```javascript
// Secuencia de animación en 4 fases:
1. Anticipación: Movimiento hacia atrás (-15°, 0.2s)
2. Giro principal: Desaceleración suave (3.5s)
3. Sobregiro: Rebote sutil (+8°, 0.15s)  
4. Corrección: Posición final (0.25s)
```

### **Cálculo Preciso del Ganador**
- Normalización de rotación a 0-360°
- Mapeo preciso con el puntero superior
- Determinación del segmento bajo el puntero

### **Estados Visuales**
- **Reposo**: Botón "GIRAR" con gradiente rojo
- **Girando**: Spinner animado con efecto de pulso
- **Partículas**: 8 puntos dorados durante la animación
- **Deshabilitado**: Estado gris con cursor no permitido

## 🔧 API del Componente

```tsx
interface SpinningWheelProps {
  onSpinComplete: (winningSegment: WinningSegment) => void;
  disabled?: boolean;
}

interface WinningSegment {
  id: string;           // ID único del segmento
  label: string;        // Texto completo en ruso
  color: string;        // Color principal
  gradient: string[];   // Array de colores del gradiente
}
```

## 🎮 Integración con el Juego

### **Mapeo de Categorías**
```javascript
const CATEGORY_MAPPING = {
  "social-classes": "Жизнь социальных классов",
  "domestic-economy": "Домашнее хозяйство", 
  "merchant-dynasties": "Знаменитые купеческие династии",
  "tomsk": "Томск",
  "entrepreneurship": "Развитие предпринимательства"
};
```

### **Flujo de Ejecución**
1. Usuario hace clic en botón "GIRAR"
2. Animación física de 4+ segundos
3. Cálculo del segmento ganador
4. Callback `onSpinComplete` con resultado
5. Continúa el flujo del juego

## 🎨 Detalles de Diseño

### **Geometría SVG**
- **Dimensiones**: 300x300px viewport
- **Radio de rueda**: 140px  
- **Centro**: (150, 150)
- **Ángulo por segmento**: 72° (360°/5)
- **Botón central**: 35px radio

### **Tipografía**
- **Fuente**: Arial, sans-serif (fallback seguro)
- **Tamaño**: 11px, bold
- **Color**: Blanco con drop-shadow
- **Rotación**: Alineada con cada segmento

### **Espacios para Íconos**
- **Círculos blancos**: 16px radio, 90% opacidad
- **Posición**: 80px del centro en cada segmento
- **Preparados para futuros íconos temáticos**

## 🚀 Rendimiento

### **Optimizaciones**
- **SVG incrustado**: Sin requests HTTP adicionales
- **Framer Motion**: Animaciones de 60 FPS
- **useCallback**: Previene re-renders innecesarios
- **CSS Transform**: Animación por GPU

### **Compatibilidad**
- ✅ Todos los navegadores modernos
- ✅ Dispositivos móviles y tablets  
- ✅ Pantallas de alta densidad (Retina)
- ✅ Accesibilidad con teclado

## 🔊 Integración de Sonido

```javascript
// Se reproduce automáticamente:
playSound.correct() // Al completar el giro
```

## 🎯 Casos de Uso

### **Juego Individual**
- Selección aleatoria de categorías
- Experiencia visual impactante
- Feedback inmediato y satisfactorio

### **Modo Espectáculo**  
- Elemento central llamativo
- Animación que mantiene el interés
- Resultados dramáticos y emocionantes

## 📱 Responsive Design

- **Mobile**: Escala perfectamente en pantallas pequeñas
- **Tablet**: Aprovecha el espacio adicional
- **Desktop**: Máxima fidelidad visual
- **Touch**: Optimizado para interacción táctil

---

## 🎨 **Resultado Final**

Una rueda giratoria que combina:
- **Diseño "Juicy"**: Colores vibrantes y animaciones satisfactorias
- **Física Realista**: Movimiento natural y creíble  
- **Calidad Premium**: Gráficos vectoriales nítidos
- **UX Excelente**: Feedback visual y sonoro inmediato
- **Performance**: Animaciones fluidas de 60 FPS

**El elemento visual más impresionante de Play Sib v2** 🎡✨
