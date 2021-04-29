function revealPrepressLayersAndItems()
{
	var ppLay, ppLayers = [];
	for (var x = 0; x < docRef.layers.length; x++)
	{
		ppLay = getPPLay(docRef.layers[x]);
		if (!ppLay || !docRef.layers[x].visible || docRef.layers[x].locked) continue;

		ppLayers.push(ppLay);
	}

	for (var x = 0, curLay, curItem,curSizeLay; x < ppLayers.length; x++)
	{
		curLay = ppLayers[x];
		curLay.locked = false;
		curLay.visible = true;
		for(var p=0;p<curLay.layers.length;p++)
		{
			curSizeLay = curLay.layers[p];
			curSizeLay.locked = false;
			curSizeLay.visible = true;
			for (var y = 0; y < curSizeLay.pageItems.length; y++)
			{
				curItem = curSizeLay.pageItems[y];
				curItem.locked = false;
				curItem.hidden = false;
			}
		}
		
	}
}