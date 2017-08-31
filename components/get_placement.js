/*
	Component Name: get_placement
	Author: William Dowling
	Creation Date: 11 July, 2017
	Description: 
		get the relative placement of a piece of artwork and it's destination piece
		i.e. the center of the art should always be dest.left + n% of dest.width
		this function gets the relative placement to be used for all other sizes
	Arguments
		art = art object
		dest = dest object
	Return value
		an object containing the left and top positions relative to the dest

*/


function getPlacement(art, dest) {
	var result = {};
	result.left = ((art.left + art.width / 2) - dest.left) / dest.width;
	result.top = (dest.top - (art.top + art.height / 2)) / dest.height;
	return result;
}