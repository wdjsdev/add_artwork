/*
	Component Name: get_smallest_scale
	Author: William Dowling
	Creation Date: 11 July, 2017
	Description: 
		find the factor by which to shrink the front logo to accomodate the smallest size
		this should be an integer indicating how many half inch increments will be used
		to shrink the logo to fit on the smallest size
	Arguments
		none
	Return value
		number of half inch increments as an integer

*/

function getSmallestScale() {
	var counter = 0;
	var slowpitch = false;
	for (var size in data.placement) {
		if (size == "Regular" || size == "Raglan") {
			slowpitch = true;
			break;
		}
		if (size == data.mockupSize) {
			break;
		}
		counter++;
	}
	if (slowpitch) {
		for (var size in data.placement["Regular"]) {
			if (size == data.mockupSize) {
				break;
			}
			counter++;
		}
	}
	return counter;
}