/*
	Component Name: dest_prompt
	Author: William Dowling
	Creation Date: 06 July, 2017
	Description: 
		display a scriptUI window that prompts the user to select the correct destination for the current artwork
		based on an array of possible destinations
	Arguments
		dests = an array of possible destination pieces
		art = the art object
	Return value
		the name of the destination piece selected by the user.

*/

function destPrompt(dests,art)
{
	var result;
	var btns = [];

	var w = new Window("dialog", "Select the desired destination.");
		var topTxt1 = w.add("statictext", undefined, curGarment.name);
		var topTxt2 = w.add("statictext", undefined, "The artwork on layer: " + art.parent.name + " overlaps multiple garment pieces.");
		var topTxt3 = w.add("statictext", undefined, "Select the correct destination for the artwork");
		var btnGroup = w.add("group");
		var len = dests.length;
		for(var x=0;x<len;x++)
		{
			makeButton(dests[x],x);
		}

	w.show();

	return result;


	function makeButton(txt,x)
	{
		btns[x] = btnGroup.add("button", undefined, txt);
		btns[x].onClick = function()
		{
			result = btns[x].text;
			w.close();
		}
	}
}
