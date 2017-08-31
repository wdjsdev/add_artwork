/*
	Component Name: overflow
	Author: William Dowling
	Creation Date: 11 July, 2017
	Description: 
		Check whether the artwork extends beyond the edge of the dest
		for example a full button logo
	Arguments
		art = art object
		dest = dest object
	Return value
		boolean

*/

function overflow(art,dest) {
	var result = false;
	var a = {
		l: art.left,
		r: art.left + art.width,
		t: art.top,
		b: art.top - art.height
	};
	var db = {
		l: dest.left,
		r: dest.left + dest.width,
		t: dest.top,
		b: dest.top - dest.height
	}
	if (a.l < db.l || a.r > db.r || a.t > db.t || a.b < db.b)
		result = true;
	return result;
}