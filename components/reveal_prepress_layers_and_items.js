function revealPrepressLayersAndItems ( garmentLayer )
{
	var womensSizingPat = /w[xsml234]/i;
	afc( garmentLayer, "layers" ).forEach( function ( curLay, index )
	{
		if ( curLay.name.match( /prepress|artwork/i ) )
		{
			curLay.locked = false;
			curLay.visible = true;
			afc( curLay, "layers" ).forEach( function ( curSubLay, index )
			{
				curSubLay.name = curSubLay.name.match( womensSizingPat ) ? curSubLay.name.replace( /^w/i, "" ) : curSubLay.name;
				curSubLay.locked = false;
				curSubLay.visible = true;
				afc( curSubLay, "pageItems" ).forEach( function ( curItem, index )
				{
					curItem.name = curItem.name.match( womensSizingPat ) ? curItem.name.replace( /^w/i, "" ) : curItem.name;
					curItem.locked = curItem.hidden = false;
				} )
			} )
		}
	} );
}