rm combined.js
rm lib_combined.js

cat js/*.js >> combined.js

cat lib/math.js >> lib_combined.js
cat lib/cytoscape.js >> lib_combined.js
cat lib/numeric.js >> lib_combined.js
