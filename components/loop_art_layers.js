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

	var mockupSizeLayer,mockupSizeDest;

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
					mockupSizeLayer = ppLay.layers[data.mockupSize];
				}
				catch(e)
				{
					errorList.push("Failed to find the mockup size prepress layer: " + data.mockupSize);
					log.e("File is missing the mockup size layer: " + data.mockupSize);
					result = false;
					return result;
				}

				try
				{
					mockupSizeDest = mockupSizeLayer.pageItems[data.mockupSize + " " + loc];
				}
				catch(e)
				{
					for(var i=0,iLen=mockupSizeLayer.pageItems.length;i<iLen && !mockupSizeDest ;i++)
					{
						if(mockupSizeLayer.pageItems[i].name.indexOf(loc)>-1)
						{
							mockupSizeDest = mockupSizeLayer.pageItems[i];
						}
					}
				}
				
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
					func = name = "Front Pocket";
					if(loc.name === "Front")
					{
						//check to see whether the artwork was contained within
						//the bounds of the pocket. if so, there's no need to
						//put it on the front (because it would be inside the pocket
						//and invisible)
						var lastLoc = artLocs[artLocs.length-1];
						if(isContainedWithin(art,lastLoc.loc))
						{
							continue;
						}

						art = lastLoc.art;
						loc = lastLoc.loc;
						name = lastLoc.name;
						scale = lastLoc.scale;
						dest = lastLoc.dest;
						placement = lastLoc.placement;
					}
					else
					{
						if(!isContainedWithin(art,mockupSizeDest))
						{
							//art needs to go on front and pocket
						}
						else
						{
							//art on pocket only

							placement = getPlacement(art,mockupSizeDest);
						}
					}
				}

				else if(lowLayName.indexOf("additional") > -1)
				{
					if(scale !== false)
					{
						scale = "proportional";
					}
					placement = getPlacement(art,mockupSizeDest);
					func = "Additional Art";
					name = layName;
				}


				else if(lowLayName.indexOf("hood") > -1)
				{
					if(scale !== false)
					{
						scale = "proportional";
						placement = getPlacement(art,mockupSizeDest)
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
		func = null;
		art = null;
		loc = null;
		name = null;
		scale = null;
		dest = null;
		placement = null;
		
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