/*
	Component Name: find_active_artboard
	Author: William Dowling
	Creation Date: 21 June, 2017
	Description: 
		Determine the active artboard for a given mockup
	Arguments
		garment layer
	Return value
		nothing

*/

function setActiveArtboard ( curGarmentLayer )
{
	// check to see which artboard the order number
	//text frame is contained within. 
	//set activeArtboardIndex to the container artboard
	var result = 0;
	var destArtboard;
	var infoLay = findSpecificLayer( curGarmentLayer, "Information" );
	var frames = afc( infoLay, "textFrames" );
	frames.forEach( function ( frame )
	{
		if ( frame.name.match( /order|garment|descript|front|initial/i ) )
		{
			afc( app.activeDocument, "artboards" ).forEach( function ( artboard, index )
			{
				if ( destArtboard )
				{
					return;
				}
				if ( isContainedWithinBuffer( frame, artboard, 200 ) )
				{
					destArtboard = artboard;
					result = index;
				}
			} );
		}
	} );

	app.activeDocument.artboards.setActiveArtboardIndex( result );
}