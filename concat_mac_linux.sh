rm combined.js
rm lib_combined.js

cat ./js/*.js >> combined.js

cat ./lib/cytoscape.js >> lib_combined.js
cat ./lib/Numeric.js >> lib_combined.js

# cat ./lib/complex.js >> lib_combined.js
#cat ./lib/math.js >> lib_combined.js
