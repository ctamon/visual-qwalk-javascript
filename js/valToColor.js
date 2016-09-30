function valToColor( value )
{

	if(value < 0 || value > 1) return '#000000';

	var c = Math.floor(value * 255);

	if(c < 16) return '#0' + c.toString(16) + '0000';
	else return '#' + c.toString(16) + '0000';

}
