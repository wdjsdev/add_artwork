function hideSuperfluousPrepressLayers()
{
	var completedIndicator, infoLay, ppLay;
	for (var p = 0; p < layers.length; p++)
	{
		ppLay = getPPLay(layers[p]);
		if (!ppLay) continue;

		infoLay = findSpecificLayer(ppLay.parent.layers,"Information");
		if(!infoLay)
		{
			log.e("failed to find an information layer for " + ppLay.parent.name);
			continue;
		}

		completedIndicator = findSpecificLayer(infoLay.layers, "Prepress Completed", "imatch");

		if (!completedIndicator)
		{
			ppLay.visible = false;
		}

		completedIndicator = undefined;
	}

}