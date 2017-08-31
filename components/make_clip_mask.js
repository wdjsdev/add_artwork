/*
	Component Name: make_clip_mask
	Author: William Dowling
	Creation Date: 10 July, 2017
	Description: 
		make a clipping mask out of the dest piece and place the art inside the mask
	Arguments
		art = the artwork to put inside the mask
		dest = the shirt piece to make a mask out of
	Return value
		the clipping mask object

*/

function makeClipMask(art, dest) {
	var result = true;
	// var bounds = [dest.top, dest.left, dest.left + dest.width, dest.top - dest.height];
	var bounds = [dest.top, dest.left, dest.width, dest.height];
	var tmpLay = docRef.layers.add();
	tmpLay.name = "temporary";
	var clip = tmpLay.pathItems.rectangle(bounds[0], bounds[1], bounds[2], bounds[3]);
	art.move(dest, ElementPlacement.PLACEATBEGINNING);
	var clipGroup = dest.groupItems.add();
	clipGroup.name = "Clipping Mask";
	art.move(clipGroup, ElementPlacement.PLACEATBEGINNING);
	clip.move(clipGroup, ElementPlacement.PLACEATBEGINNING);
	clip.clipping = true;
	clipGroup.clipped = true;
	tmpLay.remove();

	result = clipGroup;

	return result;
}