function revealPrepressLayersAndItems ( garmentLayer )
{
	afc( garmentLayer, "layers" ).forEach( function ( curLay, index )
	{
		if ( curLay.name.match( /prepress|artwork/i ) )
		{
			curLay.locked = false;
			curLay.visible = true;
			afc( curLay, "layers" ).forEach( function ( curSubLay, index )
			{
				curSubLay.locked = false;
				curSubLay.visible = true;
				afc( curSubLay, "pageItems" ).forEach( function ( curItem, index )
				{
					curItem.locked = curItem.hidden = false;
				} )
			} )
		}
	} );
}