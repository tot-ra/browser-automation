# Browser Automation для AI

Этот модуль позволяет мне автоматизировать Firefox с сохранением сессий, паролей и истории.

**Расположение:** `/home/gratheon/git/browser-automation/`

## 🖥️ Работа с VNC

**Браузер автоматически запускается на VNC дисплее :1 (порт 5901)**

### Подключение через VNC
1. Подключитесь к VNC серверу на порту **5901**
2. Запустите любой скрипт браузера
3. Вы увидите окно Firefox в VNC просмотрщике

### ⚡ Быстрый запуск (для AI - не подвисает!)
```bash
# Открыть браузер и сразу вернуть управление
timeout 10 node /home/gratheon/git/browser-automation/quick-launch.js https://google.com &

# Или запустить в фоновом режиме
cd /home/gratheon/git/browser-automation && node bg-launcher.js start
```

### Быстрый тест VNC
```bash
# Полный визуальный тест с автоматической демонстрацией
cd /home/gratheon/git/browser-automation
DISPLAY=:1 node vnc-test.js

# Или через npm
npm run vnc-test
```

### Запуск браузера для VNC
```bash
# Через npm (DISPLAY уже настроен)
cd /home/gratheon/git/browser-automation
npm run browser
npm run test

# Или напрямую
DISPLAY=:1 node example.js
DISPLAY=:1 node commander.js
```

### Проверка VNC
```bash
# Проверить что VNC запущен на порту 5901
netstat -tlnp | grep 5901

# Проверить процесс VNC
ps aux | grep vnc

# Проверить текущий DISPLAY
echo $DISPLAY
```

## Установка

```bash
cd /home/gratheon/git/browser-automation
npm install
npx playwright install firefox
```

## Использование

### 1. Быстрый запуск (рекомендуется для AI)
```bash
# Не блокирует терминал
timeout 10 node quick-launch.js https://example.com &
```

### 2. Фоновый режим
```bash
# Запустить
node bg-launcher.js start

# Проверить статус
node bg-launcher.js status

# Остановить
node bg-launcher.js stop
```

### 3. Простой пример (может подвиснуть)
```bash
timeout 30 node example.js
```

### 2. Командный интерфейс
```bash
# Запустить браузер
node browser-automation/commander.js

# Выполнить команду
node browser-automation/commander.js '{"action":"goto","params":{"url":"https://google.com"}}'
node browser-automation/commander.js '{"action":"screenshot"}'
node browser-automation/commander.js '{"action":"getTitle"}'
```

### 3. Программное использование
```javascript
const BrowserHelper = require('./browser-automation/browser-helper');

const browser = new BrowserHelper({
  headless: false, // видимый режим
  slowMo: 100 // замедление для наглядности
});

await browser.launch();
await browser.goto('https://example.com');
const title = await browser.getTitle();
await browser.screenshot('/path/to/screenshot.png');
```

## Доступные команды

- `goto` - перейти на URL
- `getTitle` - получить заголовок страницы
- `getUrl` - получить текущий URL
- `click` - кликнуть по элементу
- `type` - ввести текст
- `screenshot` - сделать скриншот
- `getText` - получить текст элемента
- `getPageText` - получить весь текст страницы
- `getCookies` - получить cookies
- `getLocalStorage` - получить localStorage
- `evaluate` - выполнить JavaScript
- `waitForSelector` - ждать появления элемента
- `newPage` - открыть новую вкладку
- `getHistory` - получить историю браузера

## Профиль Firefox

Браузер использует отдельный профиль, расположенный в:
- Linux: `~/.mozilla/firefox/ai-automation-profile`
- macOS: `~/Library/Application Support/Firefox/Profiles/ai-automation-profile`
- Windows: `%APPDATA%/Mozilla/Firefox/Profiles/ai-automation-profile`

Все логины, пароли, cookies и история сохраняются между запусками.

## Сессии

Информация о сессии сохраняется в `browser-automation/session.json`:
```json
{
  "profilePath": "/path/to/profile",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "active": true
}
```

## Безопасность

⚠️ **Важно**: Профиль содержит ваши пароли и cookie. Убедитесь, что:
- Директория `browser-automation/` не попадает в публичные репозитории
- У вас настроен `.gitignore` для исключения `session.json` и скриншотов
- Профиль защищен правами доступа на файловой системе
