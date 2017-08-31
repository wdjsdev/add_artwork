/*
	Component Name: garment_prompt
	Author: William Dowling
	Creation Date: 14 June, 2017
	Description: 
		Prompt the user to select one or all of the valid garments 
		on which to execute the add artwork script 
	Arguments
		validGarments = array of validated script template layers
	Return value
		array of garments
*/

function garmentPrompt(garLayers)
{
	var result = [];
	var indButtons = [];

	var w = new Window("dialog", "Which garments do you want to process?");

		//all the things button
		var all = w.add("group");
			var img = "/Volumes/Customization/Library/Scripts/Script Resources/Images/all.jpg";
			var allButton = all.add("iconButton", undefined, img);
			allButton.onClick = function()
			{
				result = garLayers;
				w.close();
			}


		//group of buttons to generate an individual prepress
		var individual = w.add("group");
		individual.orientation = "column";

			for(var num = 0;num<garLayers.length;num++)
			{
				makeButton(num,garLayers[num])
			}

			function makeButton(num,layer)
			{
				indButtons[num] = individual.add("button", undefined, layer.name);
				indButtons[num].onClick = function()
				{
					result.push(layer);
					w.close();
				}
			}
	w.show();


	return result;
}