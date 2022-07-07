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
	// check to see which artboard the order number
	//text frame is contained within. 
	//set activeArtboardIndex to the container artboard
	var result = false;
	var destArtboard;

	var frames = afc(infoLay,"textFrames");
	frames.forEach(function(frame)
	{
		if(frame.name.match(/order|garment|descript|front|initial/i))
		{
			afc(app.activeDocument,"artboards").forEach(function(artboard,index)
			{
				if(destArtboard)
				{
					return;
				}
				if(isContainedWithinBuffer(frame,artboard,200))
				{
					destArtboard = artboard;
					app.activeDocument.artboards.setActiveArtboardIndex(index);
				}
			});
		}
	});

	// 

	if(!destArtboard)
	{
		artboards.setActiveArtboardIndex(0);
	}

	result = true;

	// var vB = orderNumberFrame.visibleBounds;
	// var pB = {"left": vB[0], "top": vB[1], "right": vB[2], "bot": vB[3]};

	// var buffer = 100;
	// debugger;
	// for(var ab=0;ab<artboards.length && !result;ab++)
	// {
	// 	var cur = artboards[ab].artboardRect;
	// 	var thisAb = {"left": cur[0], "top": cur[1], "right":cur[2], "bot":cur[3]};
	// 	log.l("thisAb = " + JSON.stringify(thisAb) + "::");
	// 	log.l("pB = " + JSON.stringify(pB));
	// 	if(!((pB.left < thisAb.left - buffer) || (pB.top > thisAb.top + buffer) || (pB.right > thisAb.right + buffer) || pB.bot < thisAb.bot - buffer))
	// 	{
	// 		log.l("Setting active artboard index to: " + ab);
	// 		artboards.setActiveArtboardIndex(ab);
	// 		result = true;
	// 	}
	// }

	// if(!result)
	// {
	// 	errorList.push("Failed to find the artboard associated with " + currentWearer.name);
	// }

	return result;
}