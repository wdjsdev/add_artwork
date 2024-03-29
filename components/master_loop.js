/*
	Component Name: master_loop
	Author: William Dowling
	Creation Date: 15 June, 2017
	Description: 
		loop each converted template mockup selected by the user
		and perform the add_artwork functions to each mockup
	Arguments
		garments = array of layers that have been validated as converted templates
	Return value
		success boolean

*/

function masterLoop(garments)
{
	var result = true;
	var garLength = garments.length;
	log.h("Beginning of masterLoop function. Processing " + garLength + " garments.");

	var garCode,
		completedGarments = 0,
		regRag;

	//loop the garments layers array while result is true
	for(var ml=0;ml<garLength && result;ml++)
	{
		curGarment = garments[ml];

		try
		{
			var curLay = "Information";
			infoLay = curGarment.layers[curLay];
			curLay = "Prepress";
			ppLay = curGarment.layers[curLay];
			curLay = "Artwork Layer";
			artLay = curGarment.layers[curLay];
		}
		catch(e)
		{
			log.e("Failed to assign the layer: " + curLay + " to the global variable.");
			errorList.push("Failed to find the layer: " + curLay + " for the garment: " + curGarment.name);
			continue;
		}

		//check whether this garment has a completed indicator
		indicator = completedIndicator("check", curGarment);
		if(indicator === "noInfo")
		{
			log.l("Information layer missing. Skipping this garment.");
			errorList.push(curGarment.name + " has been skipped.");
			continue;
		}
		else if(indicator)
		{
			completedGarments++;
			log.l(curGarment.name + " has already been completed. Skipping this garment.");

			if(completedGarments === garLength)
			{
				errorList.push("Every garment in this master file has already been marked completed. Check the information layer.");
			}
			continue;
		}

		//removing this line in favor of an abstracted function
		//found in the utilities container
		// garCode = getGarmentCode(curGarment.name);

		//this is the abstracted garCode function found in utilities container
		garCode = getCode(curGarment.name);
		log.l("garCode evaluated to: " + garCode);

		////////////////////////
		////////ATTENTION://////
		//
		//		temporary block for bag tags. don't proceed
		//		any further if this is a bag tag. Eventually
		//		this will be removed when a solution is found.
		
		// if(garCode === "FD_106")
		// {
		// 	errorList.push("Sorry. You're on your own temporarily for bag tags.\nI hope to have that fixed ASAP.");
		// 	continue;
		// }
		//
		////////////////////////


		//check the library for data related to this garment code
		if(library[garCode])
		{
			data = library[garCode];
		}
		else if(library[garCode.replace('-','_')])
		{
			data = library[garCode.replace("-","_")];
		}
		else
		{
			errorList.push("Sorry. The garment: " + garCode + " is not in the database. Please let william know about this error.");
			log.e(garCode + " is not in the central_library.js file. Skipping this garment.");
			continue;
		}

		//check whether this garment uses variable inseam sizing.
		//if so, alert the user and skip this garment.
		// if(data.mockupSize.indexOf("I")>-1)
		// {
		// 	errorList.push("Sorry. The garment: " + garCode + " is not compatible with the current version of Add_Artwork.\nPlease use the Add_Artwork_Legacy.jsx script.");
		// 	continue;
		// }


		//get the artboard index of the current mockup
		if(!findActiveArtboard(curGarment))
		{
			log.e("Failed to find the current artboard for " + garments[ml].name);
			continue;
		}


		//make sure all necessary layers are unlocked and visible
		if(!revealLayers(curGarment))
		{
			log.l("Failed while trying to unlock/unhide the layers. Probably an mrap error.");
			result = false;
		}


		if(!loopArtLayers())
		{
			log.l("Failed while looping the art layers.");
			result = false;
		}

		//
		////disabled this in favor of using data in the existing
		////central library databatase rather than an outside database
		//
		//check for any special instructions for this garment
		// if(specialInstructions[garCode])
		// {
		// 	log.h("Beginning special instructions function for " + curGarment.name);
		// 	try
		// 	{
		// 		specialInstructions[garCode]("add artwork");
		// 	}
		// 	catch(e)
		// 	{
		// 		log.e("Failed to execute the special instructions for the garment: " + garCode + "::error message: " + e + ", on line: " + e.line);
		// 		result = false;
		// 	}
		// }

		if(data.rotate)
		{
			rotatePieces(data.rotate,ppLay);
		}

		if(!moveArtwork(data))
		{
			log.l("Failed while moving the pieces.");
			result = false;
		}

		if(!completedIndicator("add",curGarment))
		{
			log.l("Failed while adding the completed indicator.");
			result = false;
		}




	}

	return result;
}