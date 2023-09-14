/*
	Component Name: move_artwork
	Author: William Dowling
	Creation Date: 18 July, 2017
	Description: 
		move all of the prepress pieces to the side of the artboard
	Arguments
		data = data object containing the placement coordinates
	Return value
		success boolean

*/

function moveArtwork ( data, ppLay )
{
	if ( ppLay.parent.name.match( /mbb/i ) ) { return true; }
	var garmentLabel = ppLay.parent.name;
	log.l( "moving artwork for " + garmentLabel );
	aaTimer.beginTask( "moveArtwork for " + garmentLabel );
	app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;
	var result = true;
	var coords = data.placement;
	var unnamedPieces = [];
	if ( coords.Regular || coords.Raglan )
	{
		coords = data.placement[ getRegRag() ];
	}
	else if ( !coords )
	{
		if ( !garmentLabel.match( /mbb/i ) )
		{
			errorList.push( "Could not find placment data for " + curGarment );
		}
		return;
	}
	var sizeLayers = afc( ppLay, "layers" );
	sizeLayers.forEach( function ( curSizeLay )
	{
		var curSize = curSizeLay.name;
		if ( !coords[ curSize ] )
		{
			errorList.push( "Could not find placement data for " + curSize + "." );
			return;
		}

		aaTimer.beginTask( "moving " + curSize );

		afc( curSizeLay, "groupItems" ).forEach( function ( curPiece )
		{
			if ( curPiece.name === "" )
			{
				unnamedPieces.push( curPiece );
				return;
			}
			else if ( !coords[ curSize ][ curPiece.name ] )
			{
				errorList.push( "Could not find placement data for " + curPiece.name + ".\nThis piece has been skipped." );
				return;
			}

			if ( data.rotate )
			{
				aaTimer.beginTask( "rotating " + curPiece.name );
				var curName = curPiece.name.replace( /[^\s]*\s/, "" );
				data.rotate.forEach( function ( curRot )
				{
					if ( curRot.pieces.indexOf( curName ) > -1 )
					{
						curPiece.rotate( curRot.angle );
					}
				} );
				aaTimer.endTask( "rotating " + curPiece.name );
			}

			aaTimer.beginTask( "moving " + curPiece.name );

			var curCoords = coords[ curSize ][ curPiece.name ];

			if ( curPiece.clipped )
			{
				var curPieceBoundsData = getBoundsData( curPiece );
				curPiece.left = curCoords[ 0 ] - ( curPieceBoundsData.clipped.left || 0 );
				curPiece.top = curCoords[ 1 ] + ( curPieceBoundsData.clipped.top || 0 );
			}
			else 
			{
				curPiece.position = curCoords;
				// curPiece.left = curCoords[ 0 ];
				// curPiece.top = curCoords[ 1 ];
			}

			aaTimer.endTask( "moving " + curPiece.name );
		} );

		aaTimer.endTask( "moving " + curSize );
	} );


	//if there are any unnamed pieces, make them selected and send an error message
	if ( unnamedPieces.length > 0 )
	{
		docRef.selection = null;
		var len = unnamedPieces.length;
		for ( var x = 0; x < len; x++ )
		{
			unnamedPieces[ x ].selected = true;
		}
		errorList.push( "There were " + len + " unnamed pieces on the prepress layer for " + curGarment );
		errorList.push( "The unnamed pieces have been selected so you can see which ones need fixing." );
		log.e( "There were " + len + " unnamed pieces on the prepress layer for " + curGarment );
		result = false;
	}

	aaTimer.endTask( "moveArtwork for " + garmentLabel );

	return result;


	////////////////////////
	////////ATTENTION://////
	//
	//		temporary prompt for regular raglan
	//		i am updating all of the slowpitch garments
	//		to use their number code that distinguishes
	//		between regular and raglan
	//		until those are cleared through the system
	//		get the reg or rag info from the information layer
	//		if that doesn't work, prompt the user
	//
	////////////////////////

	function getRegRag ()
	{
		var result;
		var infoLen = infoLay.layers.length;
		for ( var rr = 0; rr < infoLen; rr++ )
		{
			if ( infoLay.layers[ rr ].name.indexOf( "Raglan" ) > -1 )
			{
				result = "Raglan";
			}
			else if ( infoLay.layers[ rr ].name.indexOf( "Regular" ) > -1 )
			{
				result = "Regular";
			}
		}
		if ( !result )
		{
			result = regRagPrompt();
		}

		return result;
	}

	function regRagPrompt ()
	{
		var result;
		/* beautify ignore:start */
		var w = new Window( "dialog", "Regular or Raglan?" );
		var topTxt = w.add( "statictext", undefined, "Don't worry. This is temporary." );
		var btnGroup = w.add( "group" );
		var reg = btnGroup.add( "button", undefined, "Regular" );
		reg.onClick = function ()
		{
			result = "Regular";
			w.close();
		}
		var rag = btnGroup.add( "button", undefined, "Raglan" );
		rag.onClick = function ()
		{
			result = "Raglan";
			w.close();
		}

		w.show();
		/* beautify ignore:end */
		return result;
	}
}