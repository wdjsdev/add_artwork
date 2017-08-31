/*
	Component Name: prompt_for_logo_type
	Author: William Dowling
	Creation Date: 11 July, 2017
	Description: 
		Create a dialog box that asks the user whether this artwork should be treated as a regular
		logo or as a side chest logo that will be moved left/right up/down proportionally to the garment
	Arguments
		none
	Return value
		success boolean

*/

function promptForLogoType()
{
	var result;

	var w = new Window("dialog", curGarment.name);
		var txtGroup = w.add("group");
			txtGroup.orientation = "column";
			var garTxt = txtGroup.add("statictext",undefined, curGarment.name);
			var topTxt = txtGroup.add("statictext", undefined, "Regular Logo or Left/Right Chest?");

		var btnGroup = w.add("group");
			btnGroup.orientation = "column";
			var reg = btnGroup.add("button", undefined, "Regular Front Logo");
				reg.onClick = function()
				{
					if(!regularLogo())
					{
						result = false;
						errorList.push("Failed while adding the front logo to: " + curGarment.name);
						log.e("Failed while adding the front logo to: " + curGarment.name);
					}
					w.close();
				}
			var lrChest = btnGroup.add("button", undefined, "Left/Right Chest");
				lrChest.onClick = function()
				{
					if(!sideChestLogo())
					{
						result = false;
						errorList.push("Failed while adding the front logo to: " + curGarment.name);
						log.e("Failed while adding the front logo to: " + curGarment.name);
					}
					w.close();
				}
	w.show();
	return result;
}