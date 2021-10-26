#!/bin/bash

set -e
set -x

eslint . --ext=json,js,jsx,ts,tsx --max-warnings=0
stylelint **/*.scss
remark . --ext '.md,.mdx' --frail
