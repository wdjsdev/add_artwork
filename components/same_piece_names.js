/*
	Component Name: same_piece_names
	Author: William Dowling
	Creation Date: 17 November, 2017
	Description: 
		check whether two or more pieces have the exact same
		name apart from the size. This will usually happen
		in variable inseam garments where a single prepress
		layer may have multiple similar pieces. for example:
			44Wx32I Left Front Leg
			42Wx32I Left Front Leg
			etc...
	Arguments
		array of strings
	Return value
		boolean
			if all the results are the same except for the size, return true		

*/

function samePieceNames(pieces)
{
	var result = true;
	var len = pieces.length;
	var counter = 1;
	var piece1 = stripSize(pieces[0]);
	for(var x=1;x<len;x++)
	{
		if(stripSize(pieces[x]) === piece1)
		{
			counter++;
		}
	}
	if(counter < len)
	{
		result = false;
	}
	return result;
}

function stripSize(piece)
{
	return piece.substring(piece.indexOf(" ")+1, piece.length);
}