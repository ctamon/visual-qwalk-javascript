del combined.js
del lib_combined.js

type .\js\*.js >> .\combined.js

type .\lib\cytoscape.js >> .\lib_combined.js
type .\lib\Numeric.js >> .\lib_combined.js

REM type .\lib\complex.js >> .\lib_combined.js
REM type .\lib\math.js >> .\lib_combined.js
