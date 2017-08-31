/*
	Component Name: move_artwork
	Author: William Dowling
	Creation Date: 18 July, 2017
	Description: 
		move all of the prepress pieces to the side of the artboard
	Arguments
		data = data object containing the placement coordinates
	Return value
		success boolean

*/

function moveArtwork(data)
{
	var result = true;
	var coords = data.placement;
	if(coords.Regular)
	{
		coords = data.placement[getRegRag()];
	}
	var ppLen = ppLay.layers.length;
	var pieceLen, curLay, curSize, curCoords, thisPiece;

	for (var ma = 0; ma < ppLen; ma++)
	{
		curLay = ppLay.layers[ma];
		curSize = ppLay.layers[ma].name;
		pieceLen = curLay.groupItems.length;
		for (var p = 0; p < pieceLen; p++)
		{
			thisPiece = curLay.groupItems[p];
			curCoords = coords[curSize][thisPiece.name];
			thisPiece.left = curCoords[0];
			thisPiece.top = curCoords[1];
			if(thisPiece.name.toLowerCase().indexOf("outside cowl")>-1 || thisPiece.name.toLowerCase().indexOf("outside yoke") > -1)
			{
				thisPiece.rotate(180);
			}
		}
	}
	return result;


	////////////////////////
	////////ATTENTION://////
	//
	//		temporary prompt for regular raglan
	//		i am updating all of the slowpitch garments
	//		to use their number code that distinguishes
	//		between regular and raglan
	//		until those are cleared through the system
	//		get the reg or rag info from the information layer
	//		if that doesn't work, prompt the user
	//
	////////////////////////

	function getRegRag()
	{
		var result;
		var infoLen = infoLay.layers.length;
		for (var rr = 0; rr < infoLen; rr++)
		{
			if (infoLay.layers[rr].name.indexOf("Raglan") > -1)
			{
				result = "Raglan";
			}
			else if (infoLay.layers[rr].name.indexOf("Regular") > -1)
			{
				result = "Regular";
			}
		}
		if (!result)
		{
			result = regRagPrompt();
		}

		return result;
	}

	function regRagPrompt()
	{
		var result;
		/* beautify ignore:start */
		var w = new Window("dialog", "Regular or Raglan?");
			var topTxt = w.add("statictext",undefined,"Don't worry. This is temporary.");
			var btnGroup = w.add("group");
				var reg = btnGroup.add("button", undefined, "Regular");
					reg.onClick = function()
					{
						result = "Regular";
						w.close();
					}
				var rag = btnGroup.add("button", undefined, "Raglan");
					rag.onClick = function()
					{
						result = "Raglan";
						w.close();
					}

		w.show();
		/* beautify ignore:end */
		return result;
	}
}