/*
	Component Name: recolor_garment
	Author: William Dowling
	Creation Date: 3 February, 2021
	Description: loop the param blocks and apply the appearance
	of the param block to all items with a fill color swatch
	matching the name of the param block.

	locate param block called "paramcolor-c1", select all items
	with the fill color "C1" and apply the graphic style named "C1"

	repeat for all param blocks
		
	Arguments
		none
	Return value
		void

*/

function recolorGarment()
{

	resetGraphicStylesToParamBlocks(paramLay);
	var curBlock;
	for(var x=0;x<paramLay.pageItems.length;x++)
	{
		curBlock = paramLay.pageItems[x];
		if(/c[\d]{1,2}/i.test(curBlock.name))
		{
			processParamBlock(curBlock.name,curBlock);
		}
	}

	function processParamBlock(name,paramBlock)
	{
		name = name.replace("paramcolor-","");
		log.l("Attempting to recolor: " + name);
		//look for the graphic style
		var gs = findSpecificGraphicStyle(docRef,name);
		var placeholderSwatch = makeNewSpotColor(name);
		//select all items that match the fill color "name"
		
		if(docRef.selection && docRef.selection.length > 0)
		{
			docRef.selection = null;
		}
		docRef.defaultFillColor = placeholderSwatch.color;
		docRef.defaultStrokeColor = docRef.swatches["[None]"].color;
		app.executeMenuCommand("Find Fill Color menu item");

		function dig(curItem)
		{
			if(curItem.typename === "PathItem")
			{
				gs.applyTo(curItem);
			}
			else if(curItem.typename === "CompoundPathItem" && curItem.pathItems.length)
			{
				if(curItem.groupItems && curItem.groupItems.length)
				{
					for(var g=0,len=curItem.groupItems.length;g<len;g++)
					{
						dig(curItem.groupItems[g]);
					}
				}
				if(curItem.pathItems && curItem.pathItems.length)
				{
					gs.applyTo(curItem.pathItems[0]);
				}
			}
			else if(curItem.typename === "CompoundPathItem" && curItem.groupItems.length)
			{
				for(var g=0,len=curItem.groupItems.length;g<len;g++)
				{
					dig(curItem.groupItems[g]);
				}
			}
			else if(curItem.typename === "GroupItem")
			{
				for(var g=0,len=curItem.pageItems.length;g<len;g++)
				{
					dig(curItem.pageItems[g]);
				}
			}
		}

		
		if(gs)
		{
			var curSel,item;
			for(var cc=0,len=docRef.selection.length;cc<len;cc++)
			{
				dig(docRef.selection[cc]);
				item = undefined;
			}
			log.l("finished applying the graphic style: " + name + " to all selected pageItems.");
		}
		else
		{
			log.l("no graphic style existed for: " + name);
			log.l("using simple fill color: " + paramBlock.fillColor.name);
			docRef.defaultFillColor = paramBlock.fillColor;
		}
		
	}
}