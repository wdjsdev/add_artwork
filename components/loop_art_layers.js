/*
	Component Name: loop_art_layers
	Author: William Dowling
	Creation Date: 30 June, 2017
	Description: 
		Loop the artwork layers and add the artwork to each destination piece
	Arguments
		
	Return value
		success boolean
*/

function loopArtLayers()
{
	var result = true;
	var len = artLay.layers.length;
	var curLay,destLen,success;

	var mockSizeLayer,mockSizeDest;


	var func,art,loc,name,scale,dest,placement,layName,lowLayName;
	var artLocs = [];


	var noScalePat = /(no[\s_]?scale)$|(_n[o]?)$|(n[o]?)$/i;
	for(var al=0;al < len && result;al++)
	{
		curLay = artLay.layers[al];
		layName = curLay.name;
		lowLayName = layName.toLowerCase();

		if(noScalePat.test(lowLayName))
		{
			scale = false;
		}
		
		len2 = curLay.pageItems.length;
		for(var ali=len2-1;ali>=0 && result;ali--)
		{
			art = curLay.pageItems[ali];
			
			//find the destination piece(s) for this art item
			dest = getDest(art,data.mockupSize);
			if(!dest)
			{
				continue;
			}

			destLen = dest.length;

			//loop each destination and add the art to the current destination piece.
			for(var cd=0;cd<destLen && result;cd++)
			{
				loc = dest[cd];

				try
				{
					mockSizeLayer = ppLay.layers[data.mockupSize];
				}
				catch(e)
				{
					errorList.push("Failed to find the mockup size prepress layer: " + data.mockupSize);
					log.e("File is missing the mockup size layer: " + data.mockupSize);
					result = false;
					return result;
				}

				
				mockSizeDest = findSpecificPageItem(mockSizeLayer,loc);
				
				if(lowLayName.indexOf("front logo") > -1)
				{
					if(scale !== false && data.scaleFrontLogo)
					{
						scale = "standard";
					}
					else if(!data.scaleFrontLogo)
					{
						scale = false;
					}
					func = "Front Logo";
					name = layName;
				}


				else if(lowLayName.indexOf("front number") > -1)
				{
					func = name = layName;
				}

				else if(lowLayName.indexOf("pocket") > -1)
				{
					func = name = "Pocket";
					if(loc === "Front")
					{
						//skip it... i think this should be handled
						// in the front pocket function 
						continue;
					}
					else
					{
						placement = getPlacement(art,mockSizeDest);
					}
					if(isContainedWithin(art,mockSizeDest) || noScalePat.test(layName))
					{
						scale = false;
					}
					else
					{
						scale = "proportional";
					}
				}

				else if(lowLayName.indexOf("additional") > -1)
				{
					if(scale !== false)
					{
						scale = "proportional";
					}
					placement = getPlacement(art,mockSizeDest);
					func = "Additional Art";
					name = layName;
				}


				else if(lowLayName.indexOf("hood") > -1)
				{
					if(scale !== false)
					{
						scale = "proportional";
						placement = getPlacement(art,mockSizeDest)
					}
					func = "Generic";
					name = curLay.name + " Art";
				}


				else if(lowLayName.indexOf("bt_")>-1)
				{
					func = curLay.name;
					name = curLay.name + " Art";
				}


				else
				{
					func = "Generic";
					name = curLay.name + " Art";
				}

				artLocs.push(
					{
						func:func,
						art:art,
						loc:loc,
						name:name,
						scale:scale,
						placement:placement
					});
			}
			
		}
		func = undefined;
		art = undefined;
		loc = undefined;
		name = undefined;
		scale = undefined;
		dest = undefined;
		placement = undefined;
		
	}

	//now that the correct dest has been established for each location,
	//loop the artLocs array and run the appropriate functions for each
	// for(var loc in artLocs)
	// {
	// 	var thisLoc = artLocs[loc];
	// 	success = addArt[thisLoc.func](thisLoc.art,thisLoc.loc,thisLoc.name,thisLoc.scale,thisLoc.placement);
	// }

	for(var loc=0,len = artLocs.length;loc<len && result;loc++)
	{
			var thisLoc = artLocs[loc];
			success = addArt[thisLoc.func](thisLoc.art,thisLoc.loc,thisLoc.name,thisLoc.scale,thisLoc.placement);
	}

	return result;
	
}