/*
	Component Name: get_dest
	Author: William Dowling
	Creation Date: 05 July, 2017
	Description: 
		loop the mockup size pieces to find the correct destination piece for the current art item
		if more than one match, display a prompt for the user to select the correct destination.
	Arguments
		mockSize = the mockup size
		art = the art object
	Return value
		the name of the correct destination piece minus the size
			i.e. if the artwork is within the bounds of the "XL Front", return value will be "Front"		

*/

function getDest(art,mockSize)
{
	log.h("Beginning execution of getDest function with arguments: ::art = " + art.parent.name + "::mockSize = " + mockSize);

	var result = [];
	var mockSizeLay = ppLay.layers[mockSize];
	var len = mockSizeLay.groupItems.length;

	for(var gd=0;gd<len;gd++)
	{
		var thisPiece = mockSizeLay.groupItems[gd];
		if(intersects(art,thisPiece))
		{
			//commented the replace method because it did not work for non-standard mockup sizes
			//for example "28x20" instead of the standard "XL"
			// result.push(thisPiece.name.replace(data.mockupSize + " ",""));
			// result.push(thisPiece.name.substring(data.mockupSize.length + 1, thisPiece.name.length));
			result.push(thisPiece.name.substring(thisPiece.name.indexOf(" ") + 1, thisPiece.name.length));
		}
	}

	if(result.length === 0)
	{
		log.e("This piece of art is not overlapping any shirt piece.");
		errorList.push("At least one piece of art on the " + art.parent.name + " layer is not overlapping any garment pieces.");
		result = false;
	}
	else if(result.length > 1)
	{
		var rlen = result.length;
		for(var lr=0;lr< rlen;lr++)
		{
			log.l("result[" + lr + "] = " + result[lr]);
		}

		log.l("Checking to see whether these multiple overlaps are acceptable.");
		//check whether the art SHOULD overlap two different pieces
		//look for identically named pieces, like Front Left Leg piece of varying inseam sizes
		if(samePieceNames(result))
		{
			result = [result[0]];
		}
		//look for multiple overlap between two different pieces
		//for example front left and front right for a full button or full zip
		else if(!properMultipleOverlap(result))
		{
			var userChoice = destPrompt(result,art);
			if(!userChoice)
			{
				errorList.push("You cancelled the dialog for " + art.parent.name + ". This artwork was skipped.");
				log.l("User cancelled destPrompt dialog for " + art.parent.name);
				result = null;
			}
			else
			{
				result = [userChoice];
			}
		}
	}

	return result;

}