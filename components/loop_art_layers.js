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

function loopArtLayers ( curGarLay, data )
{
	var result = true;

	var curPpLay = findSpecificLayer( curGarLay, "Prepress" );
	if ( !curPpLay )
	{
		errorList.push( "Failed to find the prepress layer for " + curGarLay.name );
		log.e( "File is missing the prepress layer for " + curGarLay.name );
		result = false;
		return result;
	}

	var mockSizeLayer = findSpecificLayer( curPpLay.layers, data.mockupSize + "", "imatch" );
	if ( !mockSizeLayer )
	{
		errorList.push( "Failed to find the mockup size prepress layer: " + data.mockupSize + " for " + curGarLay.name );
		log.e( "File is missing the mockup size layer: " + data.mockupSize + " for " + curGarLay.name );
		result = false;
		return result;
	}

	var masterArtLay = findSpecificLayer( curGarLay, "Artwork", "any" );
	var artLayers = afc( masterArtLay, "layers" );
	artLayers.forEach( function ( curArtLay )
	{
		var curArtItems = afc( curArtLay, "pageItems" );

		curArtItems.forEach( function ( curArtItem )
		{
			var getDestArgs = { "curGarLay": curGarLay, "curArtItem": curArtItem, "mockupSize": data.mockupSize };
			var destItems = getDest( getDestArgs );
			if ( !destItems.length ) { return; };

			destItems.forEach( function ( curDest )
			{
				addArt( { "data": data, "curGarmentLay": curGarLay, "srcArt": curArtItem, "destPieceName": curDest } )
			} )
		} );
	} );
	return result;
}