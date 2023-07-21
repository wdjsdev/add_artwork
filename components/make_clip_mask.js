/*
	Component Name: make_clip_mask
	Author: William Dowling
	Creation Date: 10 July, 2017
	Description: 
		make a clipping mask out of the bottom most path in the dest piece
*/

function makeClipMask ( destPiece )
{
	var lp = findBackgroundPath( destPiece );
	if ( !lp )
	{
		var bounds = getVisibleBounds( destPiece );
		lp = destPiece.pathItems.rectangle( bounds[ 1 ], bounds[ 0 ], bounds[ 2 ] - bounds[ 0 ], bounds[ 1 ] - bounds[ 3 ] );
		lp.name = "geometric_bounds_clip_mask";
		lp.stroked = lp.filled = false;
	}
	clipMask = lp.duplicate( destPiece, ElementPlacement.PLACEATBEGINNING );
	clipMask.stroked = clipMask.filled = false;

	if ( clipMask.typename.match( /compoundpath/i ) )
	{
		clipMask = clipMask.pathItems[ 0 ];
	}
	clipMask.clipping = true;
	clipMask.name = "clip mask";
	clipMask.moveToBeginning( destPiece );
	destPiece.clipped = true;
}