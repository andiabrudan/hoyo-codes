#!/bin/bash

if [[ `git status --porcelain codes-genshin.txt codes-hsr.txt codes-zzz.txt` ]]; then
    git status
    git config --local user.name "github-actions[bot]"
    git config --local user.email "github-actions[bot]@users.noreply.github.com"
    git add codes-genshin.txt codes-hsr.txt codes-zzz.txt
    git commit -m "Update data from web scrape on $(date +'%Y-%m-%d')"
    git push "https://${ACCESS_TOKEN}@github.com/${REPO}.git"
else
    echo "No changes detected, skipping commit."
fi
