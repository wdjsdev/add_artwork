/*
	Component Name: completed_indicator
	Author: William Dowling
	Creation Date: 15 June, 2017
	Description: 
		Add or check for the existence of a completed indicator for the specified garment.
	Arguments
		task = string representing what to do.
			possible values:
				"check" : look at the current layer to see whether the completed indicator exists
				"add" : add the completed indicator to the current garment layer
		layer = layer object
	Return value
		boolean
			If completed indicator is found or successfully added, return true
			If no completed indicator found, return false

*/

function completedIndicator(task,layer)
{
	log.h("Beginning completedIndicator function for " + layer.name + ".::Performing task: " + task + ".");
	var result = false;

	if(infoLay)
	{
		if(task === "add")
		{
			var indicator = infoLay.layers.add();
			indicator.name = "Prepress Completed";
			result = true;
			log.l("Successfully added the 'prepress completed' indicator");
		}
		else if(task === "check")
		{
			var len = infoLay.layers.length;
			for(var ci=0;ci<len && !result;ci++)
			{
				var thisLay = infoLay.layers[ci];
				if(thisLay.name.toLowerCase() === "prepress completed")
				{
					result = true;
					log.l("Prepress Complete indicator was found.")
				}
			}
			if(!result)
			{
				log.l("No Prepress Complete indicator found.");
			}
		}

	}

	return result;
}