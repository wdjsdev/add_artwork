/*
	Component Name: find_active_artboard
	Author: William Dowling
	Creation Date: 21 June, 2017
	Description: 
		Determine the active artboard for a given mockup
	Arguments
		garment layer
	Return value
		success boolean

*/

function findActiveArtboard(currentWearer)
{
	//compare the bounds of a the first piece of art on the mockup layer
	//loop the artboards to find the artboard that contains the piece
	//set activeArtboardIndex to the container artboard
	var result = false;
	try
	{
		var piece = infoLay.pageItems["Order Number"];
	}
	catch(e)
	{
		errorList.push(currentWearer.name + " is missing the order number text.");
		return false;
	}
	var vB = piece.visibleBounds;
	var pB = {"left": vB[0], "top": vB[1], "right": vB[2], "bot": vB[3]};

	var buffer = 100;

	for(var ab=0;ab<artboards.length && !result;ab++)
	{
		var cur = artboards[ab].artboardRect;
		var thisAb = {"left": cur[0], "top": cur[1], "right":cur[2], "bot":cur[3]};
		log.l("thisAb = " + JSON.stringify(thisAb) + "::");
		log.l("pB = " + JSON.stringify(pB));
		if(!((pB.left < thisAb.left - buffer) || (pB.top > thisAb.top + buffer) || (pB.right > thisAb.right + buffer) || pB.bot < thisAb.bot - buffer))
		{
			log.l("Setting active artboard index to: " + ab);
			artboards.setActiveArtboardIndex(ab);
			result = true;
		}
	}

	if(!result)
	{
		errorList.push("Failed to find the artboard associated with " + currentWearer.name);
	}

	return result;
}