
function valToColor( value )
{

	if(value < 0 || value > 1) return null;

	return Math.floor(value * 0xFF) << 16;

}
