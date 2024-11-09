#!/bin/bash

if [[ `git status --porcelain` ]]; then
    git config user.name "github-actions[bot]"
    git config user.email "github-actions[bot]@users.noreply.github.com"
    git add codes-genshin.txt codes-hsr.txt codes-zzz.txt
    git commit -m "Update data from web scrape on $(date +'%Y-%m-%d')"
    git push "https://${GITHUB_TOKEN}@github.com/${{ github.repository }}.git" HEAD:${{ github.ref }}
else
    echo "No changes detected, skipping commit."
fi
