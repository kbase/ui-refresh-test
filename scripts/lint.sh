#!/bin/bash

set -e
set -x

eslint .
stylelint **/*.scss
remark . --ext '.md,.mdx'
