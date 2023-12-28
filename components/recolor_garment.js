/*
	Component Name: recolor_garment
	Author: William Dowling
	Creation Date: 3 February, 2021
	Description: loop the param blocks and apply the appearance
	of the param block to all items with a fill color swatch
	matching the name of the param block.

	locate param block called "paramcolor-c1", select all items
	with the fill color "C1" and apply the graphic style named "C1"

	repeat for all param blocks
		
	Arguments
		none
	Return value
		void

*/

function recolorGarment ()
{

	// var userPref = false;
	// var w = new Window("dialog");
	// 		var msg = UI.static(w,"Do you want to automatically recolor the prepress?");
	// 		var btnGroup = UI.group(w);
	// 			var noBtn = UI.button(btnGroup,"No",function()
	// 			{
	// 				userPref = false
	// 				w.close();
	// 			})
	// 			var yesBtn = UI.button(btnGroup,"Yes",function()
	// 			{
	// 				userPref = true;
	// 				w.close();
	// 			})
	// 	w.show();

	// if(!userPref)
	// {
	// 	return;
	// }




	resetGraphicStylesToParamBlocks( paramLay );
	var curBlock;
	for ( var x = 0; x < paramLay.pageItems.length; x++ )
	{
		curBlock = paramLay.pageItems[ x ];
		if ( /c[\d]{1,2}/i.test( curBlock.name ) )
		{
			processParamBlock( curBlock );
		}
	}

	// setPrepressLayersVisibility(garments,false);

	function processParamBlock ( paramBlock )
	{
		var name = paramBlock.name.replace( "paramcolor-", "" );
		log.l( "Attempting to recolor: " + name );
		//look for the graphic style
		var gs = findSpecificGraphicStyle( docRef, name );




		if ( gs )
		{
			var curSel, item;
			for ( var cc = 0, len = docRef.selection.length; cc < len; cc++ )
			{
				dig( docRef.selection[ cc ] );
				item = undefined;
			}
			var bSelection = selectArt( name.replace( /c/i, "B" ) ); //select the "b" placeholder colors. B1, B2, etc.
			var cSelection = selectArt( name ); //select the "c" placeholder colors. C1, C2, etc.
			cSelection = cSelection.concat( bSelection );
			cSelection.forEach( function ( item )
			{
				dig( item );
			} );
			log.l( "finished applying the graphic style: " + name + " to all selected pageItems." );
		}
		else
		{
			errorList.push( "Please double check this artwork! There was no graphic style for " + name );
			log.l( "no graphic style existed for: " + name );
			log.l( "using simple fill color: " + paramBlock.fillColor.name );
			docRef.defaultFillColor = paramBlock.fillColor;
		}


		function selectArt ( swatchName )
		{
			var placeholderSwatch = makeNewSpotColor( swatchName );
			//select all items that match the fill color "name"

			if ( docRef.selection && docRef.selection.length > 0 )
			{
				docRef.selection = null;
			}
			docRef.defaultFillColor = placeholderSwatch.color;
			// docRef.defaultStrokeColor = docRef.swatches[ "[None]" ].color;
			docRef.defaultStrokeColor = new NoColor();
			app.executeMenuCommand( "Find Fill Color menu item" );
			var result = afc( docRef, "selection" );
			docRef.selection = null;
			return result;
		}



		function dig ( curItem )
		{
			if ( curItem.typename === "PathItem" )
			{
				gs.applyTo( curItem );
			}
			else if ( curItem.typename === "CompoundPathItem" && curItem.pathItems.length )
			{
				if ( curItem.groupItems && curItem.groupItems.length )
				{
					for ( var g = 0, len = curItem.groupItems.length; g < len; g++ )
					{
						dig( curItem.groupItems[ g ] );
					}
				}
				if ( curItem.pathItems && curItem.pathItems.length )
				{
					gs.applyTo( curItem.pathItems[ 0 ] );
				}
			}
			else if ( curItem.typename === "CompoundPathItem" && curItem.groupItems )
			{
				for ( var g = 0, len = curItem.groupItems.length; g < len; g++ )
				{
					dig( curItem.groupItems[ g ] );
				}
			}
			else if ( curItem.typename === "GroupItem" )
			{
				for ( var g = 0, len = curItem.pageItems.length; g < len; g++ )
				{
					dig( curItem.pageItems[ g ] );
				}
			}
		}




	}
}