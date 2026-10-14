#!/bin/bash
# Installs git hooks into .git/hooks/
HOOK_DIR=".git/hooks"

if [ ! -d "$HOOK_DIR" ]; then
    mkdir -p "$HOOK_DIR"
fi

cp tools/pre-commit.sh "$HOOK_DIR/pre-commit"
chmod +x "$HOOK_DIR/pre-commit"
chmod +x tools/pre-commit.sh

echo "✅ Git pre-commit hook успешно установлен в $HOOK_DIR/pre-commit"
