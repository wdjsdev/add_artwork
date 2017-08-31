/*
	Component Name: regular_logo
	Author: William Dowling
	Creation Date: 11 July, 2017
	Description: 
		Get the information necessary to apply a standard front logo
		then pass that data into the addArt["Generic"] function.
	Arguments
		none
	Return value
		success boolean

*/

function regularLogo() {
	var result = true;
	var logoTop = logo.top;

	//loop the prepress layers to add the art to the dest piece of each size
	var logoCopy, ppLen = ppLay.layers.length;

	logoCopy = logo.duplicate();

	if (sfl) {
		var smallestScale = getSmallestScale();
		var newWidth = logo.width - (smallestScale * 3.6);
		var scaleFactor = (newWidth / logo.width) * 100;
		logoCopy.resize(scaleFactor,scaleFactor,true,true,true,true,scaleFactor,Transformation.TOP);
	}

	result = addArt["Generic"](logoCopy,dest,"Front Logo","standard");

	logoCopy.remove();

	return result;
}