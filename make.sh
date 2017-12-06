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
<<<<<<< HEAD
	./make.sh extension FixedColumns $DEBUG
=======
	./make.sh extension RowGroup $DEBUG
>>>>>>> a9a544bd227d0900d964f32ba7d1be918332b87d
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

# Copy JS
rsync -r js $OUT_DIR
js_compress $OUT_DIR/js/dataTables.fixedColumns.js
js_frameworks fixedColumns $OUT_DIR/js

# Copy and build examples
rsync -r examples $OUT_DIR
examples_process $OUT_DIR/examples

# Readme and license
cp Readme.md $OUT_DIR
cp License.txt $OUT_DIR

