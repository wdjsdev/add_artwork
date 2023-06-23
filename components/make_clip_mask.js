/*
	Component Name: make_clip_mask
	Author: William Dowling
	Creation Date: 10 July, 2017
	Description: 
		make a clipping mask out of the largest path in the dest piece 
*/

function makeClipMask ( destPiece )
{
	var lp = findLargestPath( destPiece );
	clipMask = lp.duplicate( destPiece, ElementPlacement.PLACEATBEGINNING );
	if ( clipMask.typename.match( /compoundpath/i ) )
	{
		clipMask = clipMask.pathItems[ 0 ];
	}
	clipMask.clipping = true;
	clipMask.name = "clip mask";
	clipMask.moveToBeginning( destPiece );
	destPiece.clipped = true;
}