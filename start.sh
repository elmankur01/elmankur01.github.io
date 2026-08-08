#!/bin/bash
echo "=================================="
echo "  AvtoTema - Local Dev Server     "
echo "=================================="
echo ""
echo "  http://localhost:4000"
echo ""
echo "  Press Ctrl+C to stop"
echo "=================================="
echo ""

npx live-server . --port=4000 --no-browser
