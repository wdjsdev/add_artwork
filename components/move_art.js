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
	app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;
	var result = true;
	var coords = data.placement;
	var unnamedPieces = [];
	if(coords.Regular || coords.Raglan)
	{
		coords = data.placement[getRegRag()];
	}
	else if(!coords)
	{
		errorList.push("Could not find placment data for " + curGarment);
		return;
	}
	var ppLen = ppLay.layers.length;
	var pieceLen, curLay, curSize, curCoords, thisPiece;
	var curVb;

	for (var ma = 0; ma < ppLen && result; ma++)
	{
		curLay = ppLay.layers[ma];
		curSize = ppLay.layers[ma].name;
		pieceLen = curLay.groupItems.length;
		if(!coords[curSize])
		{
			errorList.push("Could not find placement data for " + curSize + ".");
			result = false;
			log.e("Failed to find placment data for " + curGarment + " : " + curSize + "::" + curGarment + ".placement = " + JSON.stringify(coords));
		}
		else
		{
			for (var p = 0; p < pieceLen; p++)
			{
				thisPiece = curLay.groupItems[p];
				if(thisPiece.name === "")
				{
					unnamedPieces.push(thisPiece);
					continue;
				}
				else if(!coords[curSize][thisPiece.name])
				{
					errorList.push("Could not find placement data for " + thisPiece.name + ".\nThis piece has been skipped.");
					continue;
				}
				curCoords = coords[curSize][thisPiece.name];
				curVb = getVisibleBounds(thisPiece);
				thisPiece.left = curCoords[0] - (curVb[0] - thisPiece.left);
				thisPiece.top = curCoords[1] + (thisPiece.top - curVb[1]);
				if(thisPiece.name.toLowerCase().indexOf("outside cowl")>-1 || thisPiece.name.toLowerCase().indexOf("outside yoke") > -1)
				{
					thisPiece.rotate(180);
				}
			}
		}
	}

	//if there are any unnamed pieces, make them selected and send an error message
	if(unnamedPieces.length > 0)
	{
		docRef.selection = null;
		var len = unnamedPieces.length;
		for(var x=0;x<len;x++)
		{
			unnamedPieces[x].selected = true;
		}
		errorList.push("There were " + len + " unnamed pieces on the prepress layer for " + curGarment);
		errorList.push("The unnamed pieces have been selected so you can see which ones need fixing.");
		log.e("There were " + len + " unnamed pieces on the prepress layer for " + curGarment);
		result = false;
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