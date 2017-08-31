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

	var func,art,loc,name,scale,dest,placement;
	var artLocs = [];


	var noScalePat = /(no[\s_]?scale)$|(_n[o]?)$|(n[o]?)$/i;
	for(var al=0;al < len;al++)
	{
		curLay = artLay.layers[al];
		layName = curLay.name.toLowerCase();

		if(noScalePat.test(layName))
		{
			scale = false;
		}
		
		len2 = curLay.pageItems.length;
		for(var ali=len2-1;ali>=0;ali--)
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
			for(var cd=0;cd<destLen;cd++)
			{
				loc = dest[cd];
				
				if(layName.indexOf("front logo") > -1)
				{
					if(scale !== false && data.scaleFrontLogo)
					{
						scale = "standard";
					}
					else if(!data.scaleFrontLogo)
					{
						scale = false;
					}
					func = name = "Front Logo";
				}


				else if(layName.indexOf("front number") > -1)
				{
					func = name = "Front Number";
				}


				else if(layName.indexOf("additional") > -1)
				{
					if(scale !== false)
					{
						scale = "proportional";
					}
					func = name = "Additional Art";
				}


				else if(layName.indexOf("hood") > -1)
				{
					if(scale !== false)
					{
						scale = "proportional";
						placement = getPlacement(art,ppLay.layers[data.mockupSize].pageItems[data.mockupSize + " " + loc])
					}
					func = "Generic";
					name = curLay.name + " Art";
				}


				else if(layName.indexOf("bt_")>-1)
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
		
	}

	//now that the correct dest has been established for each location,
	//loop the artLocs array and run the appropriate functions for each
	for(var loc in artLocs)
	{
		var thisLoc = artLocs[loc];
		success = addArt[thisLoc.func](thisLoc.art,thisLoc.loc,thisLoc.name,thisLoc.scale,thisLoc.placement);
	}

	return result;
	
}