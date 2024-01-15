#!/bin/sh

DT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/../.."
if [ "$1" = "debug" ]; then
	DEBUG="debug"
else
	OUT_DIR=$1
	DEBUG=$2
fi

# If not run from DataTables build script, redirect to there
if [ -z "$DT_BUILD" ]; then
	cd $DT_DIR/build
	./make.sh extension FixedColumns $DEBUG
	cd -
	exit
fi

# Change into script's own dir
cd $(dirname $0)

DT_SRC=$(dirname $(dirname $(pwd)))
DT_BUILT="${DT_SRC}/built/DataTables"
. $DT_SRC/build/include.sh

# Copy CSS
rsync -r css $OUT_DIR
css_frameworks fixedColumns $OUT_DIR/css

if [ ! -d "node_modules" ]; then
    npm install
fi

# Copy images
#rsync -r images $OUT_DIR

node_modules/typescript/bin/tsc

# Copy JS
HEADER="$(head -n 3 src/index.ts)"

rsync -r src/*.js $OUT_DIR/js
js_frameworks fixedColumns $OUT_DIR/js "jquery datatables.net-FW datatables.net-fixedcolumns"

OUT=$OUT_DIR ./node_modules/rollup/dist/bin/rollup \
    --banner "$HEADER" \
    --config rollup.config.js

rm src/*.d.ts
rm src/*.js

# Copy Types
if [ -d $OUT_DIR/types ]; then
	rm -r $OUT_DIR/types		
fi
mkdir $OUT_DIR/types

cp types/* $OUT_DIR/types

js_wrap $OUT_DIR/js/dataTables.fixedColumns.js "jquery datatables.net"

# Copy and build examples
rsync -r examples $OUT_DIR
examples_process $OUT_DIR/examples

# Readme and license
cp Readme.md $OUT_DIR
cp License.txt $OUT_DIR

