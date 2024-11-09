#!/bin/bash

declare -A script_pids

deno run --allow-read --allow-net --allow-write ./scrapers/GI-Fandom.ts GI-Fandom-results.txt &
script_pids["GI-Fandom.ts"]=$!
deno run --allow-read --allow-net --allow-write ./scrapers/hashblen.ts GI-hashblen-results.txt HSR-hashblen-results.txt ZZZ-hashblen-results.txt &
script_pids["hashblen.ts"]=$!

# Array to store exit codes
exit_codes=()
# Array to store temporary error log files for each background job
error_files=()

# Wait for each background job, capture error output, and store exit codes
for script_name in "${!script_pids[@]}"; do
  pid="${script_pids[$script_name]}"
  error_file=$(mktemp)
  error_files+=("$error_file")
  wait "$pid" 2> "$error_file"
  exit_codes+=($?)
done

# Check each exit code, print error messages, and exit with a failure if any job failed
index=0
for script_name in "${!script_pids[@]}"; do
  if [ "${exit_codes[$index]}" -ne 0 ]; then
    echo "Error: Script '$script_name' failed with exit code ${exit_codes[$index]}"
    echo "Error output:"
    cat "${error_files[$index]}"
    exit "${exit_codes[$index]}"
  fi
  index=$((index + 1))
done

echo "All scripts completed successfully."
