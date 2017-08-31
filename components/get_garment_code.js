/*
	Component Name: get_garment_code
	Author: William Dowling
	Creation Date: 16 June, 2017
	Description: 
		Extract the garment code from the given layer name
	Arguments
		layer name
	Return value
		garment code string

*/

function getGarmentCode(layName)
{
	log.h("Beginning function getGarmentCode for layer " + layName);
	var result;

	//////////////////
	//Legacy Version//
	////Do Not Use////
	//////////////////
		// var pat = /([a-z]{2}[-_][a-z0-9]*([_-][a-z]{0,2})?)[-_]/i;
		// var pat = /([a-z]{2}[-_][a-z0-9]*[_-]([0-9a-z]{0,2}([-_][a-z0-9]{3,4})?)?([-_][a-z]{2})?)[-_]/i;

	var pat = /(.*)([-_][\d]{3,}([-_][a-z])?)/i;
	result = layName.match(pat)[1];

	log.l("Garment code evaluated to: " + result);

	return result;
}