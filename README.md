# 🎯 Play Sib v2 - Сибирская викторина

Современная полнофункциональная веб-игра-викторина о торговой истории Томска с многопользовательским режимом в реальном времени.

## 🚀 Новые возможности v2

### 🆚 **Многопользовательский режим**
- **Дуэли 1 vs 1** в реальном времени
- Комнаты с уникальными кодами
- Синхронизация игроков через WebSocket (Pusher)
- Соревновательные рейтинги

### 🏆 **Система прогресса**
- **Персистентные профили** без регистрации
- **Глобальные лидерборды** всех времен
- **Недельные рейтинги** с обновлениями
- Детальная статистика игрока

### 📝 **Пользовательский контент**
- **Фабрика вопросов** - добавляйте свои вопросы
- Система модерации предложений
- Расширение базы знаний сообществом

### 🎵 **Улучшенный UX**
- **Система звуков** с Howler.js
- Продвинутые анимации с Framer Motion
- Полностью адаптивный дизайн
- PWA-ready функциональность

## 🛠️ Технологический стек

### **Frontend**
- **Next.js 14** с App Router
- **TypeScript** для типобезопасности
- **Tailwind CSS** для быстрой стилизации
- **Framer Motion** для анимаций
- **Howler.js** для звуков

### **Backend**
- **tRPC** для type-safe API
- **Prisma** ORM с PostgreSQL
- **Pusher** для real-time коммуникации
- **Zod** для валидации данных

### **База данных**
```prisma
model User {
  id        String   @id @default(cuid())
  nickname  String   @unique
  highScore Int      @default(0)
  scores    Score[]
}

model Score {
  id       String @id @default(cuid())
  value    Int
  gameMode String // SINGLE, DUEL
  userId   String
  user     User   @relation(fields: [userId], references: [id])
}

model GameRoom {
  id           String       @id @default(cuid())
  code         String       @unique
  status       String       // WAITING, PLAYING, FINISHED
  currentRound Int          @default(0)
  maxRounds    Int          @default(10)
  players      GamePlayer[]
}
```

## 🎮 Игровые режимы

### 🎯 **Одиночная игра** 
- Классический режим с колесом фортуны
- 5 минут игрового времени
- 20 секунд на вопрос
- 10 очков за правильный ответ

### ⚔️ **Дуэль 1 vs 1**
- Создание/присоединение к комнатам по коду
- Синхронные вопросы в реальном времени
- Система очков на скорость
- Мгновенные результаты

## 📚 Категории вопросов

1. **Жизнь социальных классов** 🏛️
2. **Домашнее хозяйство** 🏠
3. **Знаменитые купеческие династии** 👑
4. **Томск - крупный сибирский торговый центр** 🏪
5. **Развитие предпринимательства** 💼

## 🚀 Быстрый старт

### Установка зависимостей
```bash
npm install
# или
yarn install
# или
pnpm install
```

### Настройка окружения
```bash
# Скопируйте .env.example в .env
cp .env.example .env

# Настройте переменные:
DATABASE_URL="postgresql://..."
PUSHER_APP_ID="your_app_id"
PUSHER_KEY="your_key"
PUSHER_SECRET="your_secret"
PUSHER_CLUSTER="your_cluster"
NEXT_PUBLIC_PUSHER_KEY="your_public_key"
NEXT_PUBLIC_PUSHER_CLUSTER="your_cluster"
```

### Инициализация базы данных
```bash
# Генерация Prisma Client
npx prisma generate

# Миграция базы данных
npx prisma db push

# Заполнение начальными данными
npx prisma db seed
```

### Запуск в разработке
```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## 📦 Скрипты

```json
{
  "dev": "next dev",
  "build": "next build", 
  "start": "next start",
  "lint": "next lint",
  "db:push": "prisma db push",
  "db:studio": "prisma studio",
  "db:seed": "tsx prisma/seed.ts"
}
```

## 🎨 Дизайн-система

### Цветовая палитра
```css
:root {
  --primary-400: #2dd4bf;    /* Turquoise */
  --secondary-500: #3b82f6;  /* Blue */
  --accent-coral: #ff6b6b;   /* Coral */
  --accent-green: #96ceb4;   /* Green */
  --accent-yellow: #ffeaa7;  /* Yellow */
}
```

### Компонентная архитектура
- **UI Components**: Переиспользуемые элементы
- **Game Components**: Логика игрового процесса  
- **Layout Components**: Структура приложения
- **Feature Components**: Функциональные модули

## 🌐 API Endpoints (tRPC)

### User Management
```typescript
user.getOrCreate({ nickname, userId? })
user.getProfile({ userId })
user.updateNickname({ userId, nickname })
```

### Game & Scores
```typescript
score.submit({ userId, value, gameMode })
score.getHistory({ userId, gameMode?, limit? })
question.getByCategory({ category, limit? })
```

### Multiplayer
```typescript
room.create({ userId })
room.join({ userId, code })
room.setReady({ roomId, userId, isReady })
```

### Leaderboards
```typescript
leaderboard.getGlobal({ limit? })
leaderboard.getWeekly({ limit? })
leaderboard.getUserRank({ userId })
```

## 🎵 Система звуков

```typescript
import { playSound } from '~/utils/sounds';

// Использование
playSound.click();     // Клики по кнопкам
playSound.correct();   // Правильный ответ
playSound.incorrect(); // Неправильный ответ
playSound.spin();      // Вращение колеса
playSound.gameStart(); // Начало игры
playSound.gameEnd();   // Конец игры
```

## 📱 PWA Features

- **Манифест** для установки как приложение
- **Service Worker** для офлайн работы
- **Адаптивный дизайн** для всех устройств
- **Touch-friendly** элементы управления

## 🔧 Конфигурация для продакшена

### Vercel (рекомендовано)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### Переменные окружения
Убедитесь, что все переменные из `.env.example` настроены в продакшен-окружении.

## 🤝 Вклад в развитие

1. **Fork** репозитория
2. Создайте **feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit** изменения (`git commit -m 'Add amazing feature'`)
4. **Push** в branch (`git push origin feature/amazing-feature`)
5. Откройте **Pull Request**

### Правила разработки
- Используйте **TypeScript** для всего нового кода
- Следуйте **ESLint** правилам
- Добавляйте **tests** для новой функциональности
- Обновляйте **документацию**

## 📊 Performance

- **Lighthouse Score**: 95+ по всем метрикам
- **Core Web Vitals**: Оптимизировано для скорости
- **Bundle Size**: Минимизирован с помощью tree-shaking
- **Database**: Оптимизированные запросы с Prisma

## 🔐 Безопасность

- **Input Validation** с Zod schemas
- **SQL Injection** защита через Prisma
- **XSS Protection** встроенная в Next.js
- **Rate Limiting** на API endpoints

## 📈 Аналитика

Интеграция с популярными сервисами:
- Google Analytics
- Vercel Analytics  
- Custom event tracking

## 🗺️ Roadmap

### v2.1 (Ближайшие планы)
- [ ] **Турнирный режим** на 4-8 игроков
- [ ] **Достижения** и значки
- [ ] **Темная тема** переключатель
- [ ] **Голосовые подсказки**

### v3.0 (Будущее)
- [ ] **AI-генерация вопросов**
- [ ] **Видео-вопросы** и multimedia
- [ ] **Социальные функции** (друзья, чаты)
- [ ] **Мобильное приложение** (React Native)

## 📄 Лицензия

MIT License - используйте свободно для образовательных целей.

## 📞 Поддержка

- **Issues**: [GitHub Issues](https://github.com/username/play-sib/issues)
- **Документация**: [Wiki](https://github.com/username/play-sib/wiki)
- **Сообщество**: [Discussions](https://github.com/username/play-sib/discussions)

---

**🎮 Играйте, учитесь, соревнуйтесь! Откройте для себя богатую историю сибирской торговли!**

*Сделано с ❤️ для изучения истории Томска и Сибири*
