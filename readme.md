## Docker scout CLI

### Overview

Command line tool for scouting docker images. Result are saving to scan_results directory by default. But it can be also
written to stdout or sent to Google Drive.

### Commands

- pkey - use to save pkey file from Google to authenticate.
- scout - use to scout docker images.

### Steps

- clone the repo
- cd into project root directory
- run `npm i`
- run `npm run build`
- run `node dist` to get program description
- run `node dist scout --help` to get scout command description
- run `node dist pkey --help` to get pkey command description
