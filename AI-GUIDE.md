# AI Browser Automation Guide

## Для AI Assistant: Как использовать браузер

### ⚠️ ВАЖНО: Не подвисай!

**Используй быстрый запуск без ожидания:**
```bash
# Этот скрипт запустит браузер и сразу вернет управление
timeout 10 node /home/gratheon/git/browser-automation/quick-launch.js https://example.com &
```

**Или запусти в фоне:**
```bash
cd /home/gratheon/git/browser-automation && node bg-launcher.js start
```

### Быстрый старт

1. **Быстро открыть браузер (НЕ ПОДВИСАЕТ):**
```bash
timeout 10 node /home/gratheon/git/browser-automation/quick-launch.js https://example.com &
```

2. **Выполнить команду с таймаутом:**
```bash
cd /home/gratheon/git/browser-automation && timeout 15 node commander.js '{"action":"goto","params":{"url":"https://example.com"}}'
```

3. **Запустить в фоне и проверить статус:**
```bash
cd /home/gratheon/git/browser-automation && node bg-launcher.js start
node bg-launcher.js status
```

### Основные сценарии использования

#### Открыть сайт и сделать скриншот
```bash
# БЫСТРЫЙ СПОСОБ (не блокирует)
timeout 10 node /home/gratheon/git/browser-automation/quick-launch.js https://example.com &
```

```javascript
const BrowserHelper = require('/home/gratheon/git/browser-automation/browser-helper');

const browser = new BrowserHelper({ headless: false });
await browser.launch();
await browser.goto('https://example.com');
await browser.screenshot('/home/gratheon/screenshot.png');
// Браузер останется открытым до вызова browser.close()
```

#### Заполнить форму
```bash
cd /home/gratheon/git/browser-automation
timeout 15 node commander.js '{"action":"goto","params":{"url":"https://example.com/login"}}'
timeout 10 node commander.js '{"action":"type","params":{"selector":"#username","text":"user@example.com"}}'
timeout 10 node commander.js '{"action":"type","params":{"selector":"#password","text":"password123"}}'
timeout 10 node commander.js '{"action":"click","params":{"selector":"button[type=submit]"}}'
```

#### Получить текст со страницы
```bash
cd /home/gratheon/git/browser-automation && timeout 10 node commander.js '{"action":"getPageText"}'
```

#### Получить cookies
```bash
cd /home/gratheon/git/browser-automation && timeout 10 node commander.js '{"action":"getCookies"}'
```

### Доступные действия (actions)

| Действие | Параметры | Описание |
|----------|-----------|----------|
| `goto` | `{url}` | Перейти на URL |
| `getTitle` | - | Получить заголовок страницы |
| `getUrl` | - | Получить текущий URL |
| `click` | `{selector}` | Кликнуть по элементу |
| `type` | `{selector, text}` | Ввести текст |
| `screenshot` | `{filepath?}` | Сделать скриншот |
| `getText` | `{selector}` | Получить текст элемента |
| `getPageText` | - | Получить весь текст |
| `getCookies` | - | Получить cookies |
| `getLocalStorage` | - | Получить localStorage |
| `evaluate` | `{script}` | Выполнить JS |
| `waitForSelector` | `{selector, timeout?}` | Ждать элемент |
| `newPage` | - | Открыть новую вкладку |
| `getHistory` | - | Путь к истории |

### Селекторы

- По ID: `#myId`
- По классу: `.myClass`
- По тегу: `button`
- По атрибуту: `[name="username"]`
- По тексту: `text=Login`
- Комбинированные: `button.primary[type="submit"]`

### Примеры для типичных задач

#### Поиск в Google
```javascript
await browser.goto('https://google.com');
await browser.type('textarea[name="q"]', 'playwright automation');
await browser.click('input[name="btnK"]');
await browser.waitForSelector('#search');
const results = await browser.getPageText();
```

#### Проверка авторизации
```javascript
await browser.goto('https://github.com');
const cookies = await browser.getCookies();
const isLoggedIn = cookies.some(c => c.name === 'user_session');
```

#### Извлечение данных
```javascript
await browser.goto('https://example.com/data');
const data = await browser.evaluate(() => {
  return Array.from(document.querySelectorAll('.item')).map(item => ({
    title: item.querySelector('.title').textContent,
    price: item.querySelector('.price').textContent
  }));
});
```

### Сохранение сессий

**Профиль браузера сохраняется автоматически** в:
```
/home/gratheon/.mozilla/firefox/ai-automation-profile
```

Все логины, пароли, cookies, история - сохраняются между запусками.

### Полезные советы для AI

1. **Всегда используй headless: false** - пользователь хочет видеть что происходит
2. **Добавляй slowMo: 100-500** - для наглядности действий
3. **Делай скриншоты** - помогает отлаживать проблемы
4. **Используй waitForSelector** - дожидайся загрузки элементов
5. **Сохраняй сессию** - не закрывай браузер без необходимости
6. **Логируй действия** - console.log каждого шага

### Отладка

Если что-то не работает:
1. Проверь что браузер видим (headless: false)
2. Сделай скриншот текущего состояния
3. Получи HTML: `getContent()`
4. Проверь селектор с помощью evaluate
5. Увеличь timeout для медленных сайтов

### Безопасность

⚠️ **Важно:**
- Профиль содержит реальные пароли пользователя
- Не логируй cookies/пароли в консоль
- Не коммить session.json
- Скриншоты могут содержать приватную информацию
