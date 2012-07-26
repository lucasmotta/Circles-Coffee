#!/bin/bash

echo "Compiling coffee script files..."
coffee --join deploy/assets/js/app/App.js --compile source/App source/Point source/AbstractCircle source/AppView source/CircleView source/CircleTouchView

#./scripts/compress.sh
#./scripts/docco.sh

echo "Done."