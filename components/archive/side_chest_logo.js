/*
	Component Name: side_chest_logo
	Author: William Dowling
	Creation Date: 11 July, 2017
	Description: 
		Gather the necessary data for a left/right chest logo
		including its relative placement and pass that data
		to the addArt["Generic"] function
	Arguments
		none
	Return value
		success boolean

*/

function sideChestLogo()
{
	var result = true;
	//get the dest piece for the mockup size to measure the 
	//proportional placement
	var mockSizeDest = ppLay.layers[data.mockupSize].pageItems[data.mockupSize + " " + dest];
	var placement = getPlacement(logo,mockSizeDest);

	result = addArt["Generic"](logo,dest,"Front Logo", null, placement);

	return result;
}