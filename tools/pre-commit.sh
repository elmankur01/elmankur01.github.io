#!/bin/bash
# Pre-commit hook for АвтоТема (https://avtotema-news.online)
# Automatically runs before every "git commit" to protect against leaks, syntax bugs, and SEO issues.

export PATH="$PATH:/opt/homebrew/bin:/usr/local/bin:$HOME/.nvm/versions/node/$(ls $HOME/.nvm/versions/node 2>/dev/null | tail -n 1)/bin"

echo "🔍 [Pre-Commit] Запуск обязательного аудита качества и безопасности..."

# 1. Проверка на утечки секретов и токенов
node .agents/skills/security-and-qa/scripts/security-scan.js
if [ $? -ne 0 ]; then
    echo "❌ [Pre-Commit ОШИБКА] Обнаружена критическая проблема безопасности! Коммит отменён."
    exit 1
fi

# 2. Проверка уникальности изображений (строгий запрет повторов фото)
node tools/check_duplicate_images.js
if [ $? -ne 0 ]; then
    echo "❌ [Pre-Commit ОШИБКА] Найдены повторяющиеся изображения! Коммит отменён."
    exit 1
fi

# 3. Проверка синтаксиса ключевых JS файлов
node -c script.js 2>/dev/null
if [ $? -ne 0 ]; then
    echo "❌ [Pre-Commit ОШИБКА] Синтаксическая ошибка в script.js! Коммит отменён."
    exit 1
fi

# 4. Базовый SEO аудит главной страницы
node .agents/skills/seo-auditor/scripts/audit-seo.js index.html >/dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "⚠️ [Pre-Commit ПРЕДУПРЕЖДЕНИЕ] Найдены замечания в SEO index.html, но коммит разрешён."
fi

echo "✅ [Pre-Commit] Все проверки успешно пройдены! Коммит создаётся."
exit 0
