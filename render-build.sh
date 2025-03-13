#!/usr/bin/env bash
# exit on errors
set -o errexit

# Instalacja zależności projektu
npm install
# npm run build # Uncomment if potrzebne

# Instalacja Google Chrome i brakujących zależności
#  apt-get update
#  apt-get install -y \
#   google-chrome-stable \
#   libasound2 \
#   libatk1.0-0 \
#   libcups2 \
#   libdbus-1-3 \
#   libx11-xcb1 \
#   libxcomposite1 \
#   libxdamage1 \
#   libxrandr2 \
#   libxss1 \
#   libxtst6 \
#   fonts-liberation \
#   libnss3 \
#   xdg-utils

# Debugowanie ścieżki Chrome
echo "Ścieżka Google Chrome:"
which google-chrome-stable

# Obsługa Puppeteer Cache
if [[ ! -d $PUPPETEER_CACHE_DIR ]]; then
  echo "...Copying Puppeteer Cache from Build Cache"
  cp -R $XDG_CACHE_HOME/puppeteer/ $PUPPETEER_CACHE_DIR
else
  echo "...Storing Puppeteer Cache in Build Cache"
  cp -R $PUPPETEER_CACHE_DIR $XDG_CACHE_HOME
fi
