/*
	Component Name: send_logo_info
	Author: William Dowling
	Creation Date: 11 July, 2017
	Description: 
		save a reference to the current logo to the placedLogos object
		so that the front number functionality can access the exact size and position
		of the logos so the numbers can be placed precisely relative to the logo
	Arguments
		logo = properly sized and placed logo
		size = the current shirt size
	Return value
		none

*/

function sendLogoInfo(logo, size) {
	placedLogos[size] = logo;
}