/*
	Component Name: reveal_layers
	Author: William Dowling
	Creation Date: 21 June, 2017
	Description: 
		unlock and unhide necessary layers
	Arguments
		boolean
	Return value
		success boolean

*/

function revealLayers(curGarment)
{
	log.h("Beginning execution of revealLayers function.");
	var result = true;
	var curLay;
	try
	{
		curLay = "Prepress";
		curGarment.layers[curLay].locked = false;
		curGarment.layers[curLay].visible = true;

		curLay = "Artwork Layer";
		curGarment.layers[curLay].locked = false;
		curGarment.layers[curLay].visible = true;

		log.l("Successfully revealed necessary layers.");
	}
	catch(e)
	{
		log.e("Failed to unlock or unhide layer " + curLay + "\ne = " + e);
		errorList.push("Failed to unlock layer " + curLay + ". Either the layer doesn't exist or this is an MRAP error. Please restart illustrator and try again.");
		result = false;
	}
	return result;
}