#!/bin/bash

# Path to the JSON file
json_file="./playwright-traces/test-traces.json"

# Function to check jq version
check_jq_version() {
    jq_version=$(jq --version | cut -d- -f2)
    major_version=$(echo "$jq_version" | cut -d. -f1)
    minor_version=$(echo "$jq_version" | cut -d. -f2)

    if [ "$major_version" -eq 1 ] && [ "$minor_version" -ge 6 ]; then
		echo "jq version: $jq_version"
        return 0  # jq 1.6 or higher
    else
        return 1  # Unsupported jq version
    fi
}

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "jq is not installed. Please install jq first."
    exit 1
fi

# Check jq version
if ! check_jq_version; then
    echo "Unsupported jq version. Please use jq 1.6 or higher."
    exit 1
fi

# Read the JSON file
cat "$json_file" | jq .

jq -r '.[] | "\(.id) \(.trace)"' "$json_file" | while read id trace_file; do
    if [ -f "$trace_file" ]; then
        # Create the directory for the trace file
        output_dir="./traces/$id"
        mkdir -p "$output_dir"

        # Unzip the trace file into the directory
        unzip -o "$trace_file" -d "$output_dir" > /dev/null 2>&1 && echo "Unzipped $trace_file to $output_dir/"
    else
        echo "Trace file not found: $trace_file"
    fi
done

for dir in ./traces/*; do
	if [ -d "$dir" ]; then
	artifact_name=$(basename "$dir")
	echo "Uploading artifact: $artifact_name"
	# Upload each trace/{id} as an artifact using actions/upload-artifact
	- name: Upload $artifact_name
		uses: actions/upload-artifact@v3
		with:
			name: "$artifact_name"
			path: "$dir"
	fi
done
