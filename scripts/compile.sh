#!/bin/bash

echo "Compiling coffee script files..."
coffee --join deploy/assets/js/app/App.js --compile source/App source/Point source/AppView source/CircleView

#./scripts/compress.sh
#./scripts/docco.sh

echo "Done."