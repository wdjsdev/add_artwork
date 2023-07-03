/*
	Component Name: get_dest
	Author: William Dowling
	Creation Date: 05 July, 2017
	Description: 
		loop the mockup size pieces to find the correct destination piece for the current art item
		if more than one match, display a prompt for the user to select the correct destination.
	Arguments
		mockSize = the mockup size
		art = the art object
	Return value
		the name of the correct destination piece minus the size
			i.e. if the artwork is within the bounds of the "XL Front", return value will be "Front"		

*/

function getDest ( args )
{
	var curGarLay = args.curGarLay;
	var ppLay = findSpecificLayer( curGarLay, "Prepress" );
	var art = args.curArtItem;
	var artBounds = getBoundsData( art );
	var mockSize = args.mockupSize;
	log.h( "Beginning execution of getDest function with arguments: ::art = " + art.parent.name + "::mockSize = " + mockSize );

	var overlappingPieceNames = [];
	var mockSizeLay = findSpecificLayer( ppLay, mockSize );
	if ( !mockSizeLay )
	{
		var parentLayer = ppLay.parent.name;
		errorList.push( "Failed to find a size layer matching the mockup size: " + mockSize );
		return overlappingPieceNames;
	}

	var curSizePieces = afc( mockSizeLay, "groupItems" );
	curSizePieces.forEach( function ( curPiece )
	{
		if ( curPiece.name.match( /collar|cuff|placket|placard|binding|waist|welt|facing/i ) )
		{
			return;
		}
		var curPieceBounds = getBoundsData( curPiece );

		//if the centerpoint of the art is within the bounds of the current piece
		//add the piece name to the overlappingPieceNames array
		if ( !( artBounds.hc < curPieceBounds.left || artBounds.hc > curPieceBounds.right || artBounds.vc > curPieceBounds.top || artBounds.vc < curPieceBounds.bottom ) )
		{
			overlappingPieceNames.push( curPiece.name.replace( /[^\s]*\s/, "" ) );
		}
	} )

	if ( overlappingPieceNames.length === 0 )
	{
		log.e( "This piece of art is not overlapping any shirt piece." );
		errorList.push( "At least one piece of art on the " + art.parent.name + " layer is not overlapping any garment pieces." );
		overlappingPieceNames = false;
	}
	else if ( overlappingPieceNames.length > 1 )
	{
		var rlen = overlappingPieceNames.length;
		for ( var lr = 0; lr < rlen; lr++ )
		{
			log.l( "overlappingPieceNames[" + lr + "] = " + overlappingPieceNames[ lr ] );
		}

		log.l( "Checking to see whether these multiple overlaps are acceptable." );
		//check whether the art SHOULD overlap two different pieces
		//look for identically named pieces, like Front Left Leg piece of varying inseam sizes
		// if(samePieceNames(overlappingPieceNames))
		// {
		// 	overlappingPieceNames = [overlappingPieceNames[0]];
		// }

		//get unique entries of overlappingPieceNames array
		overlappingPieceNames = getUnique( overlappingPieceNames );
		log.l( "unique dests = " + overlappingPieceNames.join( ", " ) );


		//look for multiple overlap between two different pieces
		//for example front left and front right for a full button or full zip
		if ( overlappingPieceNames.length > 1 && !properMultipleOverlap( overlappingPieceNames ) )
		{
			var destPromptArgs = { "pieceNames": overlappingPieceNames, "art": art, "curGarLayName": curGarLay.name };
			var userChoice = destPrompt( destPromptArgs );
			if ( !userChoice )
			{
				errorList.push( "You cancelled the dialog for " + art.parent.name + ". This artwork was skipped." );
				log.l( "User cancelled destPrompt dialog for " + art.parent.name );
				overlappingPieceNames = null;
			}
			else
			{
				overlappingPieceNames = [ userChoice ];
			}
		}
	}

	return overlappingPieceNames;

}