# 🚀 Guía de Despliegue de Play Sib v2 en Vercel

## ✅ Estado del Proyecto

**✅ PROYECTO LISTO PARA DESPLIEGUE:**
- ✅ Build exitoso (`npm run build` completado)
- ✅ Configuración de Vercel (`vercel.json`) creada
- ✅ Base de datos SQLite funcionando
- ✅ Todas las funcionalidades principales operativas
- ✅ Rueda giratoria premium implementada

---

## 🌐 Método 1: Despliegue Web (Recomendado)

### **Paso 1: Accede a Vercel**
1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en "Sign Up" o "Login"
3. Conecta tu cuenta de GitHub

### **Paso 2: Importar Proyecto**
1. Haz clic en "Add New..." → "Project"
2. Selecciona tu repositorio `playsib`
3. Elige la carpeta `v2/` como directorio raíz
4. Vercel detectará automáticamente que es Next.js

### **Paso 3: Configurar Variables de Entorno**
En la sección "Environment Variables" agrega:
```
DATABASE_URL=file:./dev.db
PUSHER_APP_ID=(opcional - dejar vacío por ahora)
PUSHER_KEY=(opcional - dejar vacío por ahora)
PUSHER_SECRET=(opcional - dejar vacío por ahora)
PUSHER_CLUSTER=(opcional - dejar vacío por ahora)
NEXT_PUBLIC_PUSHER_KEY=(opcional - dejar vacío por ahora)
NEXT_PUBLIC_PUSHER_CLUSTER=(opcional - dejar vacío por ahora)
```

### **Paso 4: Desplegar**
1. Haz clic en "Deploy"
2. Espera 2-3 minutos
3. ¡Tu aplicación estará disponible en línea!

---

## 💻 Método 2: CLI de Vercel

Si prefieres la línea de comandos:

```bash
# 1. Instalar Vercel CLI globalmente
npm i -g vercel

# 2. Ir al directorio del proyecto
cd /Users/pablo/Documents/GitHub/playsib/v2

# 3. Login en Vercel
vercel login

# 4. Desplegar
vercel --prod

# 5. Seguir las instrucciones en pantalla
```

---

## 🎯 Configuración Adicional para Producción

### **Base de Datos (Opcional)**
Para producción, puedes configurar PostgreSQL:
1. Crea una base de datos en [Neon](https://neon.tech) o [PlanetScale](https://planetscale.com)
2. Actualiza `DATABASE_URL` en Vercel
3. Ejecuta las migraciones: `npx prisma db push`

### **Pusher (Para Duelos)**
Para habilitar el modo duelo:
1. Crea cuenta en [Pusher](https://pusher.com)
2. Obtén las credenciales
3. Actualiza las variables de entorno en Vercel

---

## 📊 Funcionalidades Desplegadas

**✅ COMPLETAMENTE FUNCIONAL:**
- 🎮 Juego individual con rueda premium
- 👤 Sistema de usuarios sin registro
- 🏆 Leaderboards globales y semanales
- 📝 Envío de nuevas preguntas
- 🔊 Sistema de sonidos
- 📱 Diseño responsive completo

**🔶 REQUIERE CONFIGURACIÓN:**
- ⚔️ Modo duelo (necesita Pusher)
- 🗄️ Base de datos persistente para producción

---

## 🎊 Resultado Esperado

Una vez desplegado tendrás:
- **URL pública**: `https://playsib-v2-tuusuario.vercel.app`
- **Juego completamente funcional** para audiencias globales
- **Performance optimizada** con Next.js y Vercel
- **SEO configurado** para máxima visibilidad

---

## 🛠️ Resolución de Problemas

### **Si el build falla:**
```bash
# Verificar que el build local funcione
npm run build

# Si hay errores, corregir y reintentar
```

### **Si falta la base de datos:**
```bash
# Ejecutar las migraciones
npx prisma db push
npx prisma db seed
```

### **Variables de entorno faltantes:**
- Verificar que todas las variables estén configuradas en Vercel
- Usar el archivo `.env.example` como referencia

---

## 🎯 ¡Listo para Lanzar!

**Play Sib v2** está completamente preparado para el despliegue en Vercel. 

**Características únicas:**
- 🎡 Rueda giratoria de calidad AAA
- 🎵 Sistema de sonidos inmersivo  
- 🎨 Diseño moderno y atractivo
- 📚 Contenido educativo sobre Tomsk, Siberia
- 🚀 Performance optimizada

**¡Tu juego de trivia estará disponible para el mundo entero en minutos!** 🌍✨
