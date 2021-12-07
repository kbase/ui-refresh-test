#!/bin/bash

set -e
set -x

eslint . --ext=json,js,jsx,ts,tsx --fix
stylelint --fix '**/*.scss'
