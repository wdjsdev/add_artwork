/*
	Component Name: add_art_functions
	Author: William Dowling
	Creation Date: 10 July, 2017
	Description: 
		A container for all of the artwork specific 'add art' functions.
	Arguments
		none
	Return value
		each function returns it's own values

*/


var addArt = {
	"Front Logo": function(logo, dest, name, sfl)
	{
		var result = true;
		log.h("Beginning execution of front logo function.");

		if (logo.width > 50)
		{
			//regular full chest logo
			result = regularLogo();
		}
		else
		{
			//smaller logo. prompt user for logo type
			//could be left/right chest or small center chest
			result = promptForLogoType();
		}


		///////Begin/////////
		///Logic Container///
		/////////////////////

		function regularLogo()
		{
			var result = true;
			var logoTop = logo.top;
			logoType = "regularLogo";

			//loop the prepress layers to add the art to the dest piece of each size
			var logoCopy;

			logoCopy = logo.duplicate();

			if (sfl)
			{
				smallestScale = getSmallestScale();
				var newWidth = logo.width - (smallestScale * 3.6);
				var scaleFactor = (newWidth / logo.width) * 100;
				logoCopy.resize(scaleFactor, scaleFactor, true, true, true, true, scaleFactor, Transformation.TOP);
			}
			else
			{
				smallestScale = 0;
			}

			result = addArt["Generic"](logoCopy, dest, name, sfl);

			logoCopy.remove();

			return result;
		}

		function sideChestLogo()
		{
			var result = true;
			//get the dest piece for the mockup size to measure the 
			//proportional placement
			var mockSizeDest = ppLay.layers[data.mockupSize].pageItems[data.mockupSize + " " + dest];
			var placement = getPlacement(logo, mockSizeDest);

			result = addArt["Generic"](logo, dest, name, null, placement);

			return result;
		}

		function promptForLogoType()
		{
			var result;

			/* beautify ignore:start */
			var w = new Window("dialog", curGarment.name);
				var txtGroup = w.add("group");
					txtGroup.orientation = "column";
					var garTxt = txtGroup.add("statictext",undefined, curGarment.name);
					var topTxt = txtGroup.add("statictext", undefined, "Regular Logo or Left/Right Chest?");

				var btnGroup = w.add("group");
					btnGroup.orientation = "column";
					var reg = btnGroup.add("button", undefined, "Regular Front Logo");
						reg.onClick = function()
						{
							if(!regularLogo())
							{
								result = false;
								errorList.push("Failed while adding the front logo to: " + curGarment.name);
								log.e("Failed while adding the front logo to: " + curGarment.name);
							}
							w.close();
						}
					var lrChest = btnGroup.add("button", undefined, "Left/Right Chest");
						lrChest.onClick = function()
						{
							logoType = "sideChest";
							if(!sideChestLogo())
							{
								result = false;
								errorList.push("Failed while adding the front logo to: " + curGarment.name);
								log.e("Failed while adding the front logo to: " + curGarment.name);
							}
							w.close();
						}
			w.show();
			/* beautify ignore:end */

			return result;
		}

		return result;
	},

	"Front Number": function(art, dest, name, scale)
	{
		var result = true;

		var centerNumber = false;
		var centerBuffer = 10;
		var artCenter = art.left + art.width / 2;
		var mockSizeDest = ppLay.layers[data.mockupSize].pageItems[data.mockupSize + " " + dest];
		var mockSizeDestCenter = mockSizeDest.left + mockSizeDest.width/2;

		var frontNumPlacement = {"vertSpace":undefined,"horzSpace":undefined,"counter":undefined,"inc":undefined,"center":undefined};
		var placement = null;

		//check whether this is a split front garment
		//like full button or full zip
		var splitFrontPat = /((front|left|right) ?){2}/ig;

		if(artCenter + centerBuffer > mockSizeDestCenter && artCenter - centerBuffer < mockSizeDestCenter && !splitFrontPat.test(dest))
		{
			centerNumber = true;
		}

		if (!logoType || logoType === "sideChest")
		{
			if(!centerNumber)
			{
				placement = getPlacement(art, mockSizeDest);
			}
			if(scale === false)
			{
				placement = null;
			}
			result = addArt["Generic"](art, dest, "Front Number", null, placement);
		}
		else
		{
			var logoCenter = (placedLogos[data.mockupSize].left + placedLogos[data.mockupSize].width / 2);
			var vertSpace = (placedLogos[data.mockupSize].top - placedLogos[data.mockupSize].height) - art.top;
			var horzSpace = art.left - logoCenter;
			frontNumPlacement.vertSpace = vertSpace;
			if(centerNumber)
			{
				frontNumPlacement.horzSpace = null;
			}
			else
			{
				frontNumPlacement.horzSpace = horzSpace;
			}
			frontNumPlacement.counter = smallestScale;
			frontNumPlacement.inc = -1;

			if (artCenter < logoCenter)
			{
				frontNumPlacement.inc = 1;
				frontNumPlacement.counter *= -1;
			}

			if(scale === false)
			{
				frontNumPlacement = null;
			}
			result = addArt["Generic"](art, dest, "Front Number", null, null, frontNumPlacement);
		}

		return result;
	},

	"Front Pocket": function(art,dest,name,scale)
	{
		$.writeln("pause");
		if(isContainedWithin(art,dest))
		{
			//art is totally on on the pocket.. move it around proportionally
			//but do it better than additional artwork does..;
		}
	},

	"Additional Art": function(art, dest, name, scale)
	{
		var result = true;
		var mockSizeDest = ppLay.layers[data.mockupSize].pageItems[data.mockupSize + " " + dest];
		var placement = getPlacement(art, mockSizeDest);
		result = addArt["Generic"](art, dest, name, scale, placement);
		return result;
	},

	//bag tag functions
	"BT_Logo": function(logo)
	{
		var localValid = true;
		try
		{
			for (var btl = 0; btl < ppLay.layers["Front"].groupItems.length; btl++)
			{
				var thisTag = ppLay.layers["Front"].groupItems[btl];
				if (addArt["Bag Tag Art"](logo, ("Front" + (btl + 1)), "Bag Tag Logo"))
				{
					localValid = true;
				}
				else
				{
					localValid = false;
				}
			}
		}
		catch (e)
		{
			alert(e);
		}
		return localValid
	},

	"BT_Player Name": function(name)
	{
		var localValid = true;
		try
		{
			for (var btl = 0; btl < ppLay.layers["Front"].groupItems.length; btl++)
			{
				var thisTag = ppLay.layers["Front"].groupItems[btl];
				if (addArt["Bag Tag Art"](name, ("Front" + (btl + 1)), "Bag Tag Name"))
				{
					localValid = true;
				}
				else
				{
					localValid = false;
				}
			}
		}
		catch (e)
		{
			alert(e);
		}
		return localValid
	},

	"BT_Player Number": function(number)
	{
		var localValid = true;
		try
		{
			for (var btl = 0; btl < ppLay.layers["Front"].groupItems.length; btl++)
			{
				var thisTag = ppLay.layers["Front"].groupItems[btl];
				if (addArt["Bag Tag Art"](number, ("Front" + (btl + 1)), "Bag Tag Number"))
				{
					localValid = true;
				}
				else
				{
					localValid = false;
				}
			}
		}
		catch (e)
		{
			alert(e);
		}
		return localValid
	},

	"Bag Tag Art": function(art, loc, name)
	{
		var dest = ppLay.layers["Front"].groupItems[loc];
		var artCopy = art.duplicate();
		artCopy.moveToBeginning(dest);
		artCopy.name = name;
		return true;
	},

	"Generic": function(art, loc, name, scale, placement, frontNumPlacement)
	{
		var result = true,
			ppLen = ppLay.layers.length,
			destLen,
			curSize,
			curLay,
			dest,
			lowName = name.toLowerCase(),
			artCopy,
			newWidth = art.width,
			widthIncrement = 3.6,
			newScale = 100,
			propScale,
			leftR,
			topR,
			artTop = art.top;

		if (scale === "proportional")
		{
			//get the dest piece for the mockup size
			var mockSizeDest = ppLay.layers[data.mockupSize].pageItems[data.mockupSize + " " + loc];
			propScale = art.width / mockSizeDest.width;
		}

		for (var g = 0; g < ppLen; g++)
		{
			curSize = ppLay.layers[g].name;
			curLay = ppLay.layers[g];
			destLen = curLay.pageItems.length;
			for(var d=0;d<destLen;d++)
			{
				// dest = curLay.groupItems[curSize + " " + loc];
				dest = curLay.pageItems[d];
				if(dest.name.substring(dest.name.indexOf(" ") + 1, dest.name.length) !== loc)
				{
					continue;
				}

				artCopy = art.duplicate();
				artCopy.name = curSize + " " + name;

				if (scale === "standard")
				{
					artCopy.resize(newScale, newScale, true, true, true, true, newScale);
					newWidth += widthIncrement;
					newScale = (newWidth / art.width) * 100;
				}
				else if (scale === "proportional")
				{
					newWidth = dest.width * propScale;
					newScale = (newWidth / artCopy.width) * 100;
					artCopy.resize(newScale, newScale, true, true, true, true, newScale);
				}

				if (placement)
				{
					leftR = (placement.left * dest.width);
					topR = (placement.top * dest.height);
					artCopy.left = (dest.left - artCopy.width / 2) + leftR;
					artCopy.top = (dest.top + artCopy.height / 2) - topR;
				}
				else if (frontNumPlacement)
				{
					if(frontNumPlacement.horzSpace)
					{
						artCopy.left = (placedLogos[curSize].left + placedLogos[curSize].width / 2) + (frontNumPlacement.horzSpace - (1.8 * frontNumPlacement.counter));
					}
					artCopy.top = placedLogos[curSize].top - (placedLogos[curSize].height + frontNumPlacement.vertSpace);
					frontNumPlacement.counter += frontNumPlacement.inc;
				}
				else
				{
					artCopy.top = artTop;
				}

				if (overflow(artCopy, dest) && lowName.indexOf("additional") === -1)
				{
					// artCopy = makeClipMask(artCopy, dest);
					makeClipMask(artCopy,dest);
				}
				else
				{
					artCopy.moveToBeginning(dest);
				}

				if (lowName.indexOf("additional") > -1)
				{
					artCopy.zOrder(ZOrderMethod.SENDTOBACK);
					artCopy.zOrder(ZOrderMethod.BRINGFORWARD);
				}
				else if (lowName.indexOf("front logo") > -1)
				{
					sendLogoInfo(artCopy, curSize);
				}
			}

		}
		return result;
	}
}