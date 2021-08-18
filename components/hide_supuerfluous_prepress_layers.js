function hideSuperfluousPrepressLayers(garments)
{

	for (var p = 0; p < layers.length; p++)
	{
		var ppLay = getPPLay(layers[p]);
		if (!ppLay || garments[ppLay.parent.name]) continue;

		ppLay.visible = false;

	}

}