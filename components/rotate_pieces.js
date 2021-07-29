//loop the prepress layer to find any pieces
//matching the names in the rotationSets array
//rotationSets will look like this:
// 		[{"angle":-90,"pieces":["front","back"]},{"angle":90,"pieces":["Right Sleeve", "Left Sleeve"]}]
function rotatePieces(rotationSets)
{
	var curSize, curLay, ppLen = ppLay.layers.length;
	var pieces,angle,curPiece;
	for(var rs = 0;rs<rotationSets.length;rs++)
	{
		pieces = rotationSets[rs].pieces;
		angle = rotationSets[rs].angle;
		for (var si = 0; si < ppLen; si++)
		{
			curLay = ppLay.layers[si];
			curSize = curLay.name;
			for (var p = 0; p < rotationSets[rs].pieces.length; p++)
			{
				// curLay.groupItems[curSize + " " + pieces[p]].rotate(rot);
				curPiece = findSpecificPageItem(curLay,curSize + " " + pieces[p],"imatch");
				if(curPiece)
				{
					curPiece.rotate(angle);
				}
			}
			
		}
	}
	
	
}