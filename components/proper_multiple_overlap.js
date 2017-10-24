/*
	Component Name: proper_multiple_overlap
	Author: William Dowling
	Creation Date: 06 July, 2017
	Description: 
			//check whether the art SHOULD overlap two different pieces
			//for example front left and front right for a full button or full zip
	Arguments
		pieces = array of two potential locations
	Return value
		boolean referring to whether the multiple overlap is acceptable

*/

function properMultipleOverlap(pieces)
{
	log.h("Beginning execution of properMultipleOverlap function");

	var result = false;
	var matches = 0;

	var properMulti = 
	[
		"Right Front",
		"Left Front",
		"Front",
		"Left Front Pocket",
		"Right Front Pocket",
		"Pocket",
		"Front1",
		"Front2",
		"Front3",
		"Front4"
	]

	var len = pieces.length;
	var len2 = properMulti.length;
	var piece1 = pieces[0];
	for(var x=0; x<len; x++)
	{
		if(x>0 && pieces[x] === piece1)
		{
			matches++;
			continue;
		}
		for(var y=0; y<len2; y++)
		{
			if(properMulti[y] === pieces[x])
			{
				matches++;
				break;
			}
		}
	}

	if(matches > 1)
	{
		result = true;
	}

	return result;

}