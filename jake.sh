#!/bin/sh

[ ! -f node_modules ] && npm install
node_modules/.bin/jake $*
