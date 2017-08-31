/*
	Component Name: Get_Garments
	Author: William Dowling
	Creation Date: 14 June, 2017
	Description: 
		Loop all the layers in the current document and search
		for layers that could be scriptable templates that
		might need artwork added. Verify the layer is a valid
		converted template. Push all valid layers to an array.

		Make a function call to the garmentPrompt component
		to display dialog asking the user which garment they wish to
		add artwork to.

		When the garment(s) have been determined, send the array of
		valid garments to the global garments array.
	Arguments
		layers = docRef.layers array
	Return value
		success boolean

*/

function getGarments(layers)
{
	log.h("Beginning of getGarments function.");
	var result = true;
	var validGarments = [];
	var selectedGarments = [];

	//loop each layer and determine whether it has the appropriate
	//converted template components such as Artwork Layer and Prepress
	//if true, push to validGarments array

	var layLength = layers.length;
	var thisLay, subLays, subLength,cont;
	for(var a=0;a<layLength;a++)
	{
		thisLay = layers[a];
		subLays = thisLay.layers;
		subLength = subLays.length;
		cont = true; //continuation variable. if this is false, a match has been found, exit sub layer loop

		//loop the sub layers to check for existence of proper sublayers
		for(var sl=0;sl<subLength && cont;sl++)
		{
			var thisSubLay = subLays[sl];
			if(thisSubLay.name.toLowerCase() === "prepress" && thisSubLay.layers.length > 0)
			{
				cont = false;
				validGarments.push(thisLay);
				log.l(thisLay.name + " is a valid garment.");
			}
		}
	}

	if(validGarments.length === 0)
	{
		log.l("No valid garments were found in the document.");
		errorList.push("No valid garments were found in the document.");
		result = false;
	}
	else if(validGarments.length === 1)
	{
		selectedGarments = validGarments;
	}
	else
	{
		selectedGarments = garmentPrompt(validGarments);
	}

	if(selectedGarments.length === 0)
	{
		log.l("User cancelled garmentPrompt.");
		result = false;
	}
	else
	{
		garments = selectedGarments;
	}

	return result;
}