#!/bin/bash
# 本地建構並預覽 Docusaurus 網站

echo "Building the site..."
yarn build

echo "Starting local static server..."
# 使用 python http.server 預覽 build 目錄
python3 -m http.server --directory build 8080 &

echo "Site is available at http://localhost:8080"
