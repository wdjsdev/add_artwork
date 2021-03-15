/*
	Component Name: set_prepress_layers_visibility
	Author: William Dowling
	Creation Date: 15 March, 2020
	Description: 
		for each garment layer in the document,
		find the prepress layer and set visibility
	Arguments
		array of garment layers
	Return value
		void

*/

function setPrepressLayersVisibility(garmentLayers,bool)
{
	var ppLay;
	for(var x=0;x<garmentLayers.length;x++)
	{
		ppLay = getPPLay(garmentLayers[x]);
		if(ppLay)
		{
			ppLay.locked = false;
			ppLay.visible = bool;
		}
	}
}