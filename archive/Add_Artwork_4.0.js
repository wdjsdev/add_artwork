//Add Artwork 4.0
//Author William Dowling
//Rebuilt from v3.0 to accomodate standardized layer names and variable additional artwork scaling.
//Built: 09/18/15

#target Illustrator

function scriptContainer(){
	var docRef = app.activeDocument;
	var layers = docRef.layers;
	var valid = true;
	var wearerLayer;
	var prepressLayer;
	var smallestSize;
	var smallestWidth;
	var smallestScale;
	var smallestLogo;
	var secondSmallestLogo;
	var logo;
	var artLayers;
	var additionalArt;
	var additionalArtLoc;
	var additionalArtScale;
	var mockupSize;
	app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;
	
	//////////
	//Arrays//
	//////////
	var slowRegularPlacement = 	{
		"XS" : [[-946.67,622.35],[-194.35,715.67],[-194.35,594.61],[-448.01,721.26],[-718.38,721.66]],
		"S" : [[-948.92,362.97],[-197.54,458.19],[-197.54,335.32],[-453.54,465.45],[-723.9,465.84]],
		"M" : [[-951.17,96.54],[-200.73,193.36],[-200.73,68.98],[-458.92,202.55],[-729.29,202.9]],
		"L" : [[-953.42,-177.48],[-202.96,-78.46],[-202.96,-205.28],[-464.31,-67.77],[-734.68,-67.42]],
		"XL" : [[-955.22,-458.71],[-205.69,-357.86],[-205.69,-486.77],[-469.77,-345.47],[-740.06,-345.14]],
		"2XL" : [[-957.92,-747.11],[-209.06,-644.61],[-209.06,-775.03],[-475.08,-630.18],[-745.45,-629.88]],
		"3XL" : [[-960.17,-1042.73],[-211.78,-938.28],[-211.78,-1070.65],[-480.46,-922.26],[-750.84,-921.95]],
		"4XL" : [[-962.42,-1345.42],[-214.9,-1239.52],[-214.9,-1373.14],[-485.99,-1221.38],[-756.36,-1221.1]],
		"5XL" : [[-964.67,-1654.82],[-218.04,-1546.84],[-218.04,-1682.9],[-491.38,-1527.1],[-761.75,-1526.81]],
		"USA Collar" : [[-1180.11,622.35],[-1182.36,362.97],[-1184.61,96.54],[-1186.86,-177.48],[-1188.66,-458.71],[-1191.36,-747.11],[-1193.61,-1042.73],[-1195.86,-1345.42],[-1198.11,-1654.82]]
	}
								
	var slowRaglanPlacement = 	{
		"XS" : [[-1133.12,625.48],[-380.8,679.11],[-191.1,679.11],[-634.6,721.26],[-904.97,720.01]],
		"S" : [[-1135.37,366.12],[-383.99,423.37],[-194.29,423.37],[-639.84,465.45],[-910.21,463.94]],
		"M" : [[-1137.62,101.68],[-387.18,162.4],[-197.48,162.4],[-645.37,204.55],[-915.74,202.9]],
		"L" : [[-1139.87,-172.14],[-389.41,-108.29],[-199.71,-108.29],[-650.76,-65.58],[-921.13,-67.42]],
		"XL" : [[-1141.67,-453.05],[-392.14,-385.73],[-202.44,-385.73],[-656.22,-342.95],[-926.51,-345.14]],
		"2XL" : [[-1144.37,-740.87],[-395.51,-670.21],[-205.81,-670.21],[-661.53,-627.37],[-931.9,-629.88]],
		"3XL" : [[-1146.62,-1036.67],[-398.23,-962.45],[-208.53,-962.45],[-666.91,-919.34],[-937.29,-921.95]],
		"4XL" : [[-1148.87,-1339.05],[-401.35,-1261.09],[-211.65,-1261.09],[-672.44,-1218.18],[-942.81,-1221.1]],
		"5XL" : [[-1151.12,-1648.31],[-404.49,-1567.18],[-214.79,-1567.18],[-677.83,-1523.76],[-948.2,-1526.81]],
		"USA Collar" : [[-1349.86,622.35],[-1352.11,362.97],[-1354.36,96.54],[-1356.61,-177.48],[-1358.41,-458.71],[-1361.11,-747.11],[-1363.36,-1042.73],[-1365.61,-1345.42],[-1367.86,-1654.82]]
	}
								
	var womensSlowRegularPlacement = {
		"XXS" : [[-837.83,547],[-184.83,519],[-184.83,628],[-411.83,643],[-633.83,643]],
		"XS" : [[-839.83,260],[-187.83,231],[-187.83,339],[-415.83,357],[-637.83,357]],
		"S" : [[-841.83,-13],[-190.83,-42],[-190.83,65],[-418.83,87],[-641.83,88]],
		"M" : [[-843.83,-289],[-193.83,-317],[-193.83,-209],[-422.83,-185],[-644.83,-184]],
		"L" : [[-845.83,-596],[-195.83,-624],[-195.83,-515],[-425.83,-488],[-648.83,-487]],
		"XL" : [[-847.83,-891],[-197.83,-919],[-197.83,-809],[-429.83,-779],[-651.83,-779]],
		"2XL" : [[-849.83,-1184],[-199.83,-1212],[-199.83,-1099],[-433.83,-1070],[-655.83,-1070]],
		"3XL" : [[-851.83,-1499],[-202.83,-1527],[-202.83,-1414],[-436.83,-1384],[-659.83,-1383]],
		"USA Collar" : [[-1079.35,547.42],[-1081.6,259.55],[-1083.85,-13.03],[-1086.1,-288.73],[-1087.9,-595.28],[-1090.6,-890.96],[-1092.85,-1183.84],[-1095.1,-1497.18]]
	}
								
	var womensSlowRaglanPlacement = {
		"XXS" : [[-904.86,482],[-164.32,528],[-323.73,528],[-511.79,574],[-715.22,573]],
		"XS" : [[-906.86,242],[-166.22,288],[-325.63,288],[-515.79,336],[-719.22,334]],
		"S" : [[-908.86,-5],[-168.07,42],[-327.47,42],[-519.79,92],[-723.22,91]],
		"M" : [[-910.86,-257],[-170.17,-209],[-329.58,-209],[-522.79,-157],[-726.22,-158]],
		"L" : [[-912.86,-517],[-172.05,-467],[-331.45,-467],[-526.79,-413],[-730.22,-415]],
		"XL" : [[-914.86,-784],[-173.57,-733],[-332.98,-733],[-530.79,-676],[-734.22,-678]],
		"2XL" : [[-916.86,-1055],[-176.28,-1002],[-335.68,-1002],[-533.79,-946],[-737.22,-948]],
		"3XL" : [[-918.86,-1330],[-178.54,-1276],[-337.95,-1276],[-537.79,-1219],[-741.22,-1221]],
		"USA Collar" : [[-1129.51,482.51],[-1131.76,241.62],[-1134.01,-4.89],[-1136.26,-257.14],[-1138.06,-517.46],[-1140.76,-784.25],[-1143.01,-1055.67],[-1145.26,-1330.41]]
	}
								
	var youthSlowRegularPlacement = {
		"YXS" : [[-709.48,-16.91],[-165.84,39.67],[-165.84,-50.77],[-340.97,56.07],[-518.97,56.07]],
		"YS" : [[-713.48,-225.85],[-169.95,-163.67],[-169.95,-257.78],[-345.97,-147.93],[-523.97,-147.93]],
		"YM" : [[-716.48,-444.16],[-173.07,-381.13],[-173.07,-478.64],[-349.97,-361.93],[-527.97,-360.93]],
		"YL" : [[-719.48,-673.67],[-176.61,-604.32],[-176.61,-707.5],[-354.97,-585.93],[-533.97,-584.93]],
		"YXL" : [[-723.48,-914.93],[-180.72,-838.4],[-180.72,-946.97],[-358.97,-820.93],[-536.97,-820.93]],
		"USA Collar" : [[-891.79,-16.91],[-894.04,-225.85],[-896.29,-444.16],[-898.54,-673.67],[-900.34,-914.93]]
	}
								
	var youthSlowRaglanPlacement = 	{
		"YXS" : [[-803.12,-39.21],[-282.61,-3.66],[-135.71,-3.66],[-435.55,29.93],[-619.55,28.66]],
		"YS" : [[-807.12,-238.73],[-283.61,-200.12],[-139.71,-200.12],[-439.55,-164.18],[-621.55,-165.34]],
		"YM" : [[-809.12,-448],[-284.61,-406.09],[-141.71,-406.09],[-444.55,-368.09],[-626.55,-369.34]],
		"YL" : [[-813.12,-668.66],[-285.61,-622.4],[-145.71,-622.4],[-448.55,-583.37],[-631.55,-584.34]],
		"YXL" : [[-817.12,-900.07],[-286.61,-849.8],[-149.71,-849.8],[-453.55,-809.25],[-628.55,-810.34]],
		"USA Collar" : [[-974.06,-39.21],[-976.31,-238.73],[-978.56,-448],[-980.81,-668.66],[-982.61,-900.07]]
	}
	
	var fastSleevelessPlacement = {
		"XXS" : [[-689.03,398.19],[-230.65,481.18],[-439,479.78]],
		"XS" : [[-690.83,158.31],[-234.14,246.69],[-442.56,245.34]],
		"S" : [[-692.63,-95.65],[-237.7,0.88],[-446.1,-0.64]],
		"M" : [[-694.43,-359.71],[-241.26,-257.98],[-449.64,-259.67]],
		"L" : [[-696.23,-628.75],[-244.93,-525.15],[-453.33,-526.69]],
		"XL" : [[-696.23,-898.05],[-248.62,-792.79],[-457.01,-794.34]],
		"2XL" : [[-696.23,-1171.63],[-252.17,-1064.46],[-460.56,-1066.13]],
		"3XL" : [[-696.23,-1448.11],[-255.71,-1339.25],[-464.3,-1340.75]],
		"USA Collar" : [[-938.62,398.19],[-940.42,158.31],[-942.22,-95.65],[-944.02,-359.71],[-945.83,-628.75],[-945.83,-898.05],[-945.83,-1171.63],[-945.83,-1448.11]]
	}
	
	var base2buttonPlacement = {
		"S" : [[-1003.61,607.96],[-539.78,724.97],[-827.76,718],[-245.05,692.73],[-245.05,576.51],[-1155.05,634.72],[-1218.48,621.12],[-1310.57,634.72]],
		"M" : [[-1008.61,315.39],[-544.78,435],[-833.43,428],[-250.1,401.21],[-250.1,283.01],[-1155.05,342.09],[-1219.48,327.63],[-1311.57,342.09]],
		"L" : [[-1013.61,-0.01],[-550.04,123.15],[-838.68,116],[-253.44,89.55],[-253.37,-32.41],[-1155.05,26.68],[-1219.48,12.23],[-1311.57,26.68]],
		"XL" : [[-1019.61,-312.77],[-555.74,-186.94],[-843.38,-194],[-256.51,-219.58],[-256.57,-346.06],[-1155.05,-286.11],[-1219.48,-301.44],[-1312.57,-286.11]],
		"2XL" : [[-1024.61,-634.47],[-560.98,-504.96],[-848.51,-512],[-259.98,-537.92],[-259.98,-667.74],[-1155.05,-606.92],[-1219.48,-622.22],[-1312.57,-606.92]],
		"3XL" : [[-1029.61,-970.16],[-566.02,-836.94],[-853.19,-844],[-264.74,-876],[-264.97,-1003.34],[-1155.05,-941.7],[-1219.48,-957.88],[-1313.57,-941.7]],
		"4XL" : [[-1035.61,-1306.16],[-571.72,-1172.96],[-858.78,-1180],[-269.41,-1214.68],[-269.41,-1339.4],[-1155.05,-1276.8],[-1220.48,-1293.88],[-1314.57,-1276.8]],
		"5XL" : [[-1040.61,-1642.15],[-577.13,-1508.92],[-864.11,-1516],[-274.34,-1553.25],[-274.23,-1675.63],[-1155.05,-1611.89],[-1220.48,-1629.87],[-1315.57,-1611.89]],
		"USA Collar" : [[-1486.23,597.1],[-1487.77,278.56],[-1487.74,-40.93],[-1488.4,-359.47],[-1488.4,-678.95],[-1489.36,-998.43],[-1490.31,-1317.9],[-1491.27,-1637.38]]
	}
	
	var youth2buttonPlacement = {
		"YS" : [[-1066.6,-106.92],[-447.25,-13.79],[-647.06,-20.7],[-216.84,-31.99],[-216.84,-132.54],[-756.01,-74.7],[-803.43,-100.13],[-878.5,-74.71]],
		"YM" : [[-1067.49,-351],[-450.49,-252.46],[-650.3,-259.4],[-219.32,-275.55],[-219.32,-376.04],[-756.52,-317.9],[-803.43,-345.01],[-879.5,-317.9]],
		"YL" : [[-1068.36,-605.78],[-455.11,-501.85],[-654.9,-508.8],[-221.74,-529.75],[-221.74,-630.33],[-757.01,-571.8],[-808.43,-600.61],[-885.5,-571.8]],
		"YXL" : [[-1069.22,-871.29],[-459.13,-761.96],[-658.91,-768.93],[-224.12,-794.65],[-224.12,-895.42],[-757.48,-836.43],[-810.43,-866.95],[-888.5,-836.43]],
		"USA Collar" : [[-1277.93,-106.92],[-1280.18,-351],[-1282.43,-605.78],[-1284.23,-871.29]]
	}
	
	var baseFullButtonPlacement = {
		"S" : [[-887,727],[-248,703],[-248,587],[-518,734],[-716,727],[-1020,728],[-1099,728],[-1234,618]],
		"M" : [[-890,432],[-250,409],[-250,288],[-523,439],[-718,432],[-1021,432],[-1100,432],[-1235,319]],
		"L" : [[-892,129],[-254,105],[-254,-18],[-528,136],[-721,129],[-1021,129],[-1100,129],[-1235,13]],
		"XL" : [[-895,-182],[-257,-204],[-257,-331],[-533,-174],[-724,-182],[-1021,-181],[-1100,-181],[-1236,-300]],
		"2XL" : [[-898,-499],[-261,-522],[-261,-652],[-538,-492],[-726,-499],[-1021,-499],[-1100,-499],[-1236,-621]],
		"3XL" : [[-901,-824],[-266,-853],[-266,-980],[-543,-816],[-729,-824],[-1022,-823],[-1101,-823],[-1237,-949]],
		"4XL" : [[-903,-1155],[-271,-1188],[-271,-1311],[-550,-1148],[-732,-1155],[-1022,-1155],[-1101,-1155],[-1237,-1281]],
		"5XL" : [[-906,-1487],[-277,-1523],[-277,-1643],[-555,-1480],[-735,-1487],[-1023,-1487],[-1102,-1487],[-1238,-1613]]
	}
	
	var baseFullButtonSLPlacement = {
		"S" : [[-360.06,814.71],[-512.07,807.85],[-708.31,807.85],[-829.29,807.68],[-924.07,807.68],[-1112.95,697.41]],
		"M" : [[-363.06,519.71],[-514.07,512.84],[-710.31,512.84],[-834.29,512.6],[-926.07,512.6],[-1113.95,399.72]],
		"L" : [[-365.06,216.71],[-518.07,209.72],[-714.31,209.72],[-839.29,209.61],[-929.07,209.61],[-1113.95,93.16]],
		"XL" : [[-368.06,-94.29],[-521.07,-101.32],[-717.31,-101.32],[-844.29,-101.38],[-932.07,-101.38],[-1113.95,-220.47]],
		"2XL" : [[-371.06,-411.29],[-525.07,-418.43],[-721.31,-418.43],[-849.29,-418.6],[-934.07,-418.6],[-1113.95,-541.24]],
		"3XL" : [[-374.06,-736.29],[-530.07,-743.23],[-726.31,-743.23],[-854.29,-743.48],[-937.07,-743.48],[-1114.95,-869.75]],
		"4XL" : [[-376.06,-1067.29],[-535.07,-1074.36],[-731.31,-1074.36],[-861.29,-1074.59],[-940.07,-1074.59],[-1114.95,-1200.86]],
		"5XL" : [[-379.06,-1399.29],[-541.07,-1406.31],[-737.31,-1406.31],[-866.29,-1406.74],[-943.07,-1406.74],[-1115.95,-1532.97]]
	}
	
	var youthFullButtonPlacement = {
		"YS" : [[-672,-15],[-250,-26],[-250,-127],[-435,-8],[-558,-15],[-757,-15],[-822,-15],[-922,-97]],
		"YM" : [[-674,-254],[-252,-271],[-252,-371],[-439,-247],[-561,-254],[-757,-254],[-822,-254],[-923,-342]],
		"YL" : [[-676,-504],[-255,-525],[-255,-626],[-443,-497],[-565,-504],[-757,-504],[-822,-504],[-924,-597]],
		"YXL" : [[-678,-765],[-257,-791],[-257,-892],[-448,-758],[-569,-765],[-758,-765],[-823,-765],[-925,-864]]
	}
	
	var youthFullButtonSLPlacement = {
		"YS" : [[-318.02,2.5],[-457.76,-4.39],[-570.51,-4.39],[-661.48,-4.39],[-723.86,-4.39],[-846.33,-86.59]],
		"YM" : [[-320.02,-237.46],[-459.76,-244.31],[-572.51,-244.31],[-665.48,-244.31],[-726.86,-244.3],[-846.33,-331.97]],
		"YL" : [[-322.02,-488.1],[-462.76,-494.89],[-575.51,-494.89],[-669.48,-494.88],[-730.86,-494.88],[-846.33,-588]],
		"YXL" : [[-324.02,-749.9],[-464.76,-756.64],[-577.51,-756.64],[-674.48,-756.63],[-734.86,-756.63],[-847.33,-855.2]]
	}
	
	var fast2ButtonPlacement = {
		"XXS" : [[-1011.89,455.31],[-423.2,547.06],[-636.52,545.46],[-188.46,523.98],[-731.62,476.44],[-800.12,464.69],[-880.93,476.44],[-188.46,420.75]],
		"XS" : [[-1015.33,206.79],[-426.7,300.43],[-639.9,298.94],[-191.83,275.82],[-732.62,228.38],[-801,216.24],[-884.31,228.38],[-191.83,172.33]],
		"S" : [[-1018.88,-60.25],[-431.51,35.11],[-643.33,33.6],[-195.26,8.79],[-732.62,-38.2],[-801.98,-50.75],[-887.74,-38.2],[-195.26,-94.74]],
		"M" : [[-1022.12,-323.7],[-433.59,-224.75],[-647.15,-226.29],[-199.08,-253.56],[-732.62,-301.19],[-802.93,-314.15],[-891.56,-301.19],[-199.08,-358.05]],
		"L" : [[-1025.7,-595.67],[-438.3,-493.01],[-649.83,-494.53],[-201.76,-524.22],[-732.62,-572.71],[-803.88,-586.08],[-894.24,-572.71],[-201.76,-629.75]],
		"XL" : [[-1028.83,-879.72],[-440.33,-773.34],[-651.83,-775.08],[-203.76,-806.66],[-733.62,-856.3],[-804.82,-870.1],[-896.24,-856.3],[-203.76,-913.39]],
		"2XL" : [[-1032.38,-1168.08],[-443.88,-1059.97],[-654.69,-1061.53],[-206.62,-1093.51],[-733.62,-1144.21],[-805.76,-1158.43],[-899.1,-1144.21],[-206.62,-1201.14]],
		"3XL" : [[-1035.83,-1457.79],[-447.38,-1347.82],[-657.59,-1349.61],[-209.52,-1382.03],[-734.62,-1433.47],[-806.69,-1448.12],[-902,-1433.47],[-209.52,-1490.43]],
		"USA Collar" : [[-1186.26,459.95],[-1187.42,204.65],[-1188.5,-67.01],[-1189.53,-321.83],[-1190.54,-605.67],[-1191.52,-891.95],[-1192.5,-1164.03],[-1193.46,-1459.25]]
	}
	
	var fastFullButtonPlacement = {
		"XXS" : [[-239,506],[-239,404],[-465,530],[-629,528],[-776,528],[-918,528],[-997,528],[-1130,436]],
		"XS" : [[-243,251],[-243,149],[-468,277],[-631,275],[-778,275],[-918,275],[-997,275],[-1131,181]],
		"S" : [[-247,-7],[-246,-109],[-471,20],[-632,19],[-780,19],[-919,19],[-998,19],[-1133,-78]],
		"M" : [[-251,-270],[-251,-373],[-475,-240],[-634,-241],[-781,-241],[-919,-241],[-998,-241],[-1134,-341]],
		"L" : [[-253,-539],[-253,-644],[-478,-507],[-636,-509],[-783,-509],[-920,-509],[-999,-509],[-1135,-613]],
		"XL" : [[-256,-816],[-256,-921],[-482,-782],[-638,-783],[-785,-783],[-920,-783],[-999,-783],[-1135,-891]],
		"2XL" : [[-259,-1098],[-259,-1204],[-485,-1064],[-639,-1065],[-786,-1065],[-921,-1065],[-1000,-1065],[-1136,-1174]],
		"3XL" : [[-262,-1384],[-262,-1491],[-489,-1349],[-641,-1351],[-788,-1351],[-921,-1351],[-1000,-1351],[-1137,-1461]]
	}
	
	var fastFullButtonSLPlacement = {
		"XXS" : [[-256.81,602.69],[-502.35,601.07],[-640.44,601.07],[-768.64,601.07],[-863.64,601.07],[-1034.26,509.1]],
		"XS" : [[-260.1,350.49],[-504.03,348.87],[-642.12,348.87],[-769.12,348.87],[-864.12,348.87],[-1035.26,255.1]],
		"S" : [[-263.42,93.79],[-505.72,92.18],[-643.81,92.18],[-769.58,92.18],[-864.58,92.18],[-1036.25,-5.2]],
		"M" : [[-266.76,-170.51],[-507.43,-172.11],[-645.52,-172.11],[-770.05,-172.11],[-865.05,-172.11],[-1037.24,-273.1]],
		"L" : [[-270.13,-442.13],[-509.15,-443.74],[-647.23,-443.74],[-770.52,-443.74],[-865.52,-443.74],[-1038.22,-548.32]],
		"XL" : [[-273.52,-719.8],[-510.86,-721.41],[-648.95,-721.41],[-770.98,-721.41],[-865.98,-721.41],[-1039.21,-829.59]],
		"2XL" : [[-276.92,-1003.74],[-512.6,-1005.35],[-650.69,-1005.35],[-771.45,-1005.35],[-866.45,-1005.35],[-1040.18,-1115.33]],
		"3XL" : [[-280.35,-1293.49],[-514.33,-1295.1],[-652.42,-1295.1],[-771.9,-1295.1],[-866.9,-1295.1],[-1041.16,-1406.88]]
	}
	
	var fdmhPlacement = {
		"S" : [[-1839.13,709.17],[-1162.73,766.05],[-1162.73,919.71],[-1307.85,766.05],[-1307.85,919.71],[-1678.14,767.16],[-255.12,856.16],[-1839.13,767.16],[-477.25,856.16],[-1532.95,843.74],[-734.69,874.16],[-985.82,873.16]],
		"M" : [[-1839.13,369.17],[-1164.37,430.16],[-1164.37,583.82],[-1309.49,430.16],[-1309.49,583.82],[-1680.86,425.16],[-260.75,547.58],[-1839.13,425.16],[-482.88,547.61],[-1535.02,528.66],[-740.09,565.72],[-991.22,564.77]],
		"L" : [[-1839.13,55.02],[-1166.06,88.13],[-1166.06,241.78],[-1311.18,88.13],[-1311.18,241.78],[-1683.52,113.01],[-266.09,199.33],[-1839.13,113.01],[-488.22,199.33],[-1537.09,195.41],[-745.49,227.15],[-996.62,226.18]],
		"XL" : [[-1839.13,-279.58],[-1167.91,-250.39],[-1167.91,-96.74],[-1313.02,-250.39],[-1313.02,-96.74],[-1687.63,-219.6],[-270.41,-147.23],[-1839.13,-219.6],[-492.54,-147.23],[-1539.16,-143.28],[-750.89,-107.85],[-1002.01,-108.88]],
		"2XL" : [[-1839.13,-618.99],[-1169.75,-587.84],[-1169.75,-434.18],[-1314.87,-587.84],[-1314.87,-434.18],[-1692.14,-559],[-275.12,-455.41],[-1839.13,-559],[-497.24,-455.41],[-1541.22,-490.79],[-756.29,-443.64],[-1007.41,-444.71]],
		"3XL" : [[-1604.13,-1016.14],[-1839.13,-1016.14],[-1171.65,-954.81],[-1171.65,-801.15],[-1316.77,-954.81],[-1316.77,-801.15],[-1694.99,-956.28],[-279.86,-809.46],[-1839.13,-956.28],[-501.99,-809.63],[-1543.29,-853.98],[-761.69,-807.15],[-1012.81,-808.21]],
		"4XL" : [[-1604.13,-1387.06],[-1839.13,-1387.06],[-1173.54,-1308.82],[-1173.54,-1155.16],[-1318.66,-1308.82],[-1318.66,-1155.16],[-1697.01,-1324.08],[-284.66,-1203.53],[-1839.13,-1324.08],[-506.78,-1203.53],[-1545.35,-1215.04],[-767.09,-1159.54],[-1018.21,-1160.6]],
		"5XL" : [[-1604.13,-1726.1],[-1839.13,-1726.1],[-1175.44,-1672.89],[-1175.44,-1519.23],[-1320.56,-1672.89],[-1320.56,-1519.23],[-1699.78,-1666.11],[-289.44,-1556.51],[-1839.13,-1666.11],[-511.57,-1556.51],[-1547.42,-1571.18],[-772.48,-1521.9],[-1023.61,-1523.04]]
	}
	
	var fdwhPlacement = {
		"XS" : [[-1390.46,328.45],[-942.88,344.63],[-942.88,498.28],[-1037.03,344.62],[-1037.03,498.28],[-1156.12,400.67],[-220.13,452.78],[-1422.2,400.67],[-388.67,454.75],[-1320.35,417.48],[-600.11,461.11],[-807.58,459.39]],
		"S" : [[-1390.46,-11.18],[-942.88,4.81],[-942.88,158.46],[-1040.31,4.81],[-1040.3,158.46],[-1156.12,61.04],[-224.2,115.81],[-1422.2,61.04],[-392.74,117.81],[-1322.07,79.55],[-603.71,125.15],[-811.18,123.28]],
		"M" : [[-1400.46,-331.98],[-942.88,-316.12],[-942.88,-162.48],[-1043.66,-316.14],[-1043.66,-162.48],[-1158.12,-259.76],[-228.24,-202.31],[-1424.2,-259.76],[-396.77,-200.33],[-1323.82,-239.56],[-607.31,-191.99],[-814.78,-193.83]],
		"L" : [[-1411.46,-683.87],[-942.88,-667.98],[-942.88,-514.33],[-1047.06,-667.98],[-1047.06,-514.33],[-1159.12,-611.65],[-232.45,-551.05],[-1425.2,-611.65],[-400.99,-549.08],[-1325.59,-589.76],[-610.91,-540.21],[-818.38,-542.14]],
		"XL" : [[-1424.46,-1019.26],[-942.88,-1001.52],[-942.88,-847.87],[-1050.49,-1001.52],[-1050.49,-847.87],[-1162.12,-947.04],[-237.03,-883.29],[-1427.2,-947.04],[-405.57,-881.32],[-1327.35,-923.45],[-616.32,-871.95],[-823.79,-874.04]],
		"2XL" : [[-1436.46,-1352.98],[-942.88,-1335.17],[-942.88,-1181.52],[-1054.06,-1335.18],[-1054.07,-1181.52],[-1165.12,-1280.76],[-238.43,-1215.68],[-1428.2,-1280.76],[-406.97,-1213.51],[-1329.12,-1255.48],[-621.73,-1203.98],[-829.2,-1206.07]],
		"3XL" : [[-945.33,-1624.84],[-945.33,-1475.53],[-1056.51,-1624.84],[-1056.51,-1477.34],[-1167.85,-1540.26],[-242.17,-1505.29],[-1431.04,-1539.93],[-1449.2,-1647.71],[-410.71,-1505.28],[-1332.73,-1513.37],[-629.07,-1494.63],[-836.53,-1499.57]]
	}
	
	var fdyhPlacement = {
		"YS" : [[-1341.77,106.9],[-893.52,20.98],[-893.52,175.63],[-996.9,20.99],[-996.9,175.63],[-1273.93,16.9],[-269.97,107.83],[-1373.94,16.9],[-410.64,107.83],[-1172.68,34.03],[-588.24,128.91],[-768.31,124.21]],
		"YM" : [[-1352.34,-194.95],[-893.52,-280.17],[-893.52,-125.52],[-1000.49,-280.17],[-1000.5,-125.53],[-1274.84,-284.95],[-275.47,-192.29],[-1374.02,-284.95],[-416.14,-192.29],[-1176.28,-267.81],[-593.64,-169.8],[-773.71,-174.3]],
		"YL" : [[-1362.89,-515.91],[-893.52,-598.84],[-893.52,-444.18],[-1004.09,-598.84],[-1004.09,-444.19],[-1275.58,-605.9],[-280.78,-511.21],[-1375.33,-605.9],[-421.44,-511.13],[-1178.19,-587.87],[-599.04,-487.61],[-779.11,-491.91]],
		"YXL" : [[-1374.88,-844.95],[-893.52,-925.62],[-893.52,-770.97],[-1007.7,-925.62],[-1007.7,-770.97],[-1277.33,-934.94],[-284.93,-838.23],[-1376.59,-934.95],[-425.6,-838.23],[-1180.09,-916.01],[-604.44,-813.51],[-784.51,-817.61]]
	}
	
	var fdVolCsPlacement = {
		"XXS" : [[-918.23,273.44],[-186.63,287.57],[-332.55,287.57],[-506.09,364.42],[-699.13,361]],
		"XS" : [[-918.23,32.78],[-186.63,46.91],[-332.55,46.91],[-509.82,125.44],[-702.87,122]],
		"S" : [[-918.23,-212.8],[-186.63,-198.67],[-332.55,-198.67],[-515.22,-117.63],[-704.39,-121]],
		"M" : [[-920.03,-463.48],[-187.94,-448.42],[-333.86,-448.42],[-518.81,-366.67],[-708.27,-370]],
		"L" : [[-920.03,-722.31],[-187.57,-706.46],[-333.5,-706.46],[-521.88,-623.66],[-711.43,-627]],
		"XL" : [[-923.63,-987.03],[-188.58,-970.32],[-334.5,-970.32],[-525.54,-886.53],[-714.98,-890]],
		"2XL" : [[-923.63,-1259],[-189.81,-1241.2],[-335.73,-1241.2],[-528.93,-1156.7],[-718.95,-1160]],
		"USA Collar" : [[-1137.55,275.31],[-1138.71,20],[-1139.79,-235.31],[-1140.82,-490.63],[-1141.83,-745.94],[-1142.81,-1001.25],[-1143.79,-1256.57]]
	}
	
	var fdVolLsPlacement = {
		"XXS" : [[-871.17,312.81],[-285.34,392.57],[-156.72,392.57],[-462.01,403.75],[-636.85,400.33]],
		"XS" : [[-871.17,67.53],[-285.34,148.19],[-156.72,148.19],[-465.75,160.15],[-640.59,156.71]],
		"S" : [[-871.17,-176.25],[-286.9,-94.93],[-158.27,-94.93],[-471.15,-81.08],[-642.11,-84.46]],
		"M" : [[-872.97,-425.29],[-288.88,-343.29],[-160.25,-343.29],[-474.74,-328.48],[-645.99,-331.81]],
		"L" : [[-872.97,-664.94],[-291.81,-582.36],[-163.18,-582.36],[-477.8,-566.29],[-649.15,-569.63]],
		"XL" : [[-876.57,-921.05],[-295.12,-837.57],[-166.49,-837.57],[-481.47,-820.56],[-652.7,-824.03]],
		"2XL" : [[-876.57,-1168.07],[-298.31,-1084.99],[-169.69,-1084.99],[-484.86,-1065.77],[-656.67,-1069.07]],
		"USA Collar" : [[-1094.05,312.81],[-1095.21,67.53],[-1096.29,-176.25],[-1097.32,-425.29],[-1098.33,-664.94],[-1099.31,-921.05],[-1100.29,-1168.07]]
	}
	
	var fdSocSSPlacement = {
		"S" : [[-271.34,272.03],[-917.83,176.19],[-920.58,221.16],[-271.34,152.77],[-492.52,309.07],[-726.91,301.55]],
		"M" : [[-274.47,-15.25],[-919.76,-112.89],[-921.34,-67.92],[-274.47,-134.51],[-497.92,21.79],[-732.31,15.12]],
		"L" : [[-277.29,-303.18],[-920.39,-402.62],[-923.45,-357.65],[-277.29,-422.44],[-503.32,-264.31],[-737.71,-271.95]],
		"XL" : [[-280.38,-597.34],[-922.3,-698.59],[-924.19,-653.62],[-280.38,-716.61],[-508.72,-558.56],[-743.11,-565.26]],
		"2XL" : [[-283.19,-907.09],[-922.92,-1010.13],[-925.8,-965.17],[-283.19,-1026.35],[-514.13,-868.48],[-748.51,-874.14]]
	}

	var fdBaskRvSLPlacement = {
		"S" : [[-382.73,376.31],[-648.41,376.01]],
		"M" : [[-389.62,98.74],[-655.3,97.26]],
		"L" : [[-394.75,-187.85],[-660.43,-188.36]],
		"XL" : [[-400.58,-481.92],[-666.26,-481.24]],
		"2XL" : [[-406.66,-781.72],[-672.35,-782.13]],
		"3XL" : [[-411.85,-1093.62],[-677.54,-1093.35]]
	}

	var fdBaskRvSHPlacement = {
		"S" : [[-359.64,420.13],[-674.04,420.2]],
		"M" : [[-364.27,-462.92],[-678.3,-758.38]],
		"L" : [[-369.06,-163.81],[-682.91,-163.75]],
		"XL" : [[-373.87,-1046.64],[-688.15,-1046.58]],
		"2XL" : [[-378.27,138.95],[-691.86,139.02]],
		"3XL" : [[-382.42,-747.62],[-695.53,-452.03]]
	}

	//////////
	//Arrays//
	//////////
	
	
	///////////////////
	//Logic Container//
	///////////////////
	
	function inProgressIndicator(){
		var aB = docRef.artboards[docRef.artboards.getActiveArtboardIndex()];
		var height = aB.artboardRect[3] - aB.artboardRect[1];
		var width = aB.artboardRect[2] - aB.artboardRect[0];
	    var inProgText = wearerLayer.textFrames.add();
	    inProgText.name = 'inProgress';
	    inProgText.contents = 'IN PROGRESS';
	    inProgText.width = width;
	    inProgText.height = Math.abs(height);
	    inProgText.left = 0;
	    inProgText.top = 0;
	}

	function removeInProgressIndicator(){
		wearerLayer.textFrames['inProgress'].remove();
	}

	function generateWearer(){
		var activeLayer = docRef.activeLayer.name;
		var wearerList = [];
		for(var a=0;a<layers.length;a++){
			var curLayer = layers[a].name;
			if(curLayer.substring(0,2) == "FD" || curLayer.substring(0,2) == "Me" || curLayer.substring(0,2) == "Wo" || curLayer.substring(0,2) == "Yo" ){
				wearerList.push(layers[a]);
			}
		}
		if (wearerList.length>1){
			wearerLayer = docRef.activeLayer;
		}
		else if(wearerList.length == 1){
			wearerLayer = layers[0];
		}
		else if(wearerList.length<1){
			alert("You're missing a necessary layer!")
			valid = false;
			return;
		}
		if(wearerLayer.name.substring(0,2)!="FD" && wearerLayer.name.substring(0,2)!="Me" &&//
			wearerLayer.name.substring(0,2)!="Wo" && wearerLayer.name.substring(0,2)!="Yo"){
			alert("Please select an appropriate layer!" + ('\n') + 'Eg. "FD_SLOW_015"');
			valid = false;
			return;
		}
		prepressLayer = wearerLayer.layers.getByName("Prepress");
		smallestSize = prepressLayer.layers[0].name;
		artLayers = wearerLayer.layers.getByName("Artwork Layer");
		
		if(wearerLayer.name.indexOf("SLOW_")>-1 || wearerLayer.name.indexOf("BASE")>-1 || wearerLayer.name.indexOf("FDMH")>-1 || 
			wearerLayer.name.indexOf("SOC_")>-1 && wearerLayer.name.indexOf("Y")<0 || wearerLayer.name.indexOf("FD_BASK_SLRV2P")>-1){
			mockupSize = "XL";
		}
		else if(wearerLayer.name.indexOf("SLOWW_")>-1 || wearerLayer.name.indexOf("FAST")>-1 || wearerLayer.name.indexOf("FDWH")>-1 || wearerLayer.name.indexOf("VOL")>-1){
			mockupSize = "M";
		}
		else if(wearerLayer.name.indexOf("Y")>-1){
			mockupSize = "YXL";
		}
	}
	
	function unlock(){
		wearerLayer.locked = false;
		wearerLayer.visible = true;
		wearerLayer.layers.getByName("Prepress").visible = true;
		wearerLayer.layers.getByName("Prepress").locked = false;
	}
	
	function findSmallestWidth(){
		if(smallestSize == "XXS" || smallestSize == "S" || smallestSize == "YS"){
			smallestWidth = 10.8;
			smallestScale = 3;
		}
		else if (smallestSize == "XS" || smallestSize == "YXS"){
			smallestWidth = 14.4;
			smallestScale = 4;
		}
		else{
			alert("Couldn't determine the smallest garment size.");
			valid = false;
		}	
	}
	
	function placeFrontLogo(){
		logo = artLayers.layers.getByName("Front Logo").pageItems[0];		
		function regularLogo(){
			var logoTop = logo.top;
			var newWidth = logo.width - smallestWidth;
	
			for(var a=0;a<prepressLayer.layers.length;a++){
				var curSize = prepressLayer.layers[a].name;
				var scale = (newWidth/logo.width)*100;
				var logoResize;
				if(wearerLayer.name.indexOf("FB")<0){
					var curLoc = prepressLayer.layers.getByName(curSize).groupItems.getByName(curSize + " Front");
					logoResize = logo.duplicate(curLoc);
					logoResize.move(curLoc,ElementPlacement.PLACEATBEGINNING);
					logoResize.resize(scale,scale,true,true,true,true,00);
					logoResize.top = logoTop;
					logoResize.name = curSize + " Front Logo";
				}
				else{
					var curLocLeft = prepressLayer.layers.getByName(curSize).groupItems.getByName(curSize + " Left Front");
					var curLocRight = prepressLayer.layers.getByName(curSize).groupItems.getByName(curSize + " Right Front");
					logoResize = logo.duplicate();
					logoResize.resize(scale,scale,true,true,true,true,00);
					logoResize.name = curSize + " Left Front Logo";
					frontLogoClipMask(curLocLeft,logoResize);
					
					logoResize = logo.duplicate();
					logoResize.resize(scale,scale,true,true,true,true,00);
					logoResize.name = curSize + " Right Front Logo";
					frontLogoClipMask(curLocRight,logoResize);
				}
				newWidth = newWidth + 3.6;
				if(a==0){
					smallestLogo = logoResize.height;
				}
				else if(a==1){
					nextSmallestLogo = logoResize.height;
				}
			}
		}
		
		if(logo.width>50){
			regularLogo();
		}
		
		else if(logo.width<50 && logo.height<50){
			var logoType = findLogoType();
			function findLogoType(){
				var type;
				var isLeftChest = new Window("dialog","Is This Front Logo a Left/Right Chest?");
					var textGroup = isLeftChest.add("group");
						var text = textGroup.add("statictext", undefined, "Is this a regular front logo or a Left/Right Chest?");
					var buttonGroup = isLeftChest.add("group");
						buttonGroup.orientation = "column";
						var reg = buttonGroup.add("button", undefined, "Regular Front Logo");
							reg.onClick = function(){
								type = "regular";
								isLeftChest.close();
							}
						var lc = buttonGroup.add("button", undefined, "Left Chest Logo");
							lc.onClick = function(){
								type = "leftChest";
								isLeftChest.close();
							}
						var rc = buttonGroup.add("button", undefined, "Right Chest Logo");
							rc.onClick = function(){
								type = "rightChest";
								isLeftChest.close();
							}
				isLeftChest.show();
				return type;
			}
			if(logoType == "regular"){
				regularLogo();
			}
			else if(logoType = "leftChest"){
				sideChest("Left");
			}
			else if(logoType - "rightChest"){
				sideChest("Right");
			}
			function sideChest(sideString){
				if(wearerLayer.name.indexOf("FB")<0){
					var thePiece = prepressLayer.layers[mockupSize].groupItems[mockupSize + " Front"];
				}
				else{
					var thePiece = prepressLayer.layers[mockupSize].groupItems[mockupSize + " " + sideString + " Front"];
				}
				var horzDist = logo.left - thePiece.left;
				var vertDist = thePiece.top - logo.top;
				var horzRatio = Math.abs(horzDist/thePiece.width);
				var vertRatio = Math.abs(vertDist/thePiece.height);
				for(var a=0;a<prepressLayer.layers.length;a++){
					var curSize = prepressLayer.layers[a].name;
					if(wearerLayer.name.indexOf("FB")<0){
						var curLoc = prepressLayer.layers[a].groupItems[curSize + " Front"];
					}
					else{
						var curLoc = prepressLayer.layers[a].groupItems[curSize + " " + sideString + " Front"];
					}
					var logoResize = logo.duplicate(curLoc, ElementPlacement.PLACEATBEGINNING);
					logoResize.name = curSize + " " + sideString + " Chest Logo";
					var desiredHorz = curLoc.left + (curLoc.width*horzRatio);
					var desiredVert = curLoc.top - (curLoc.height*vertRatio);
					logoResize.left = desiredHorz;
					logoResize.top = desiredVert;
				}
			}
		}
	}
	
	function frontLogoClipMask(dest, logo){ //theSize = curLocLeft
		var bounds = [dest.visibleBounds[1],dest.visibleBounds[0],dest.width,dest.height];
		var clip = dest.pathItems.rectangle(bounds[0],bounds[1],bounds[2],bounds[3]);
		logo.move(dest,ElementPlacement.PLACEATBEGINNING);
		var clipGroup = dest.groupItems.add();
		clipGroup.name = "Clipping Mask";
		logo.move(clipGroup, ElementPlacement.PLACEATBEGINNING);
		clip.move(clipGroup, ElementPlacement.PLACEATBEGINNING);
		clip.clipping = true;
		clipGroup.clipped = true;
		
	}
	
	function placeFrontNumber(logoBool){
		var fNumberLoc = createWindow();
	
		function createWindow(){
			var result;
			var window = new Window("dialog", "Select Front Number Position");
			var buttonGroup = window.add("group");
				buttonGroup.orientation = "row";
				var dir = "/Volumes/Customization/Library/Scripts/Script Resources/Images/";
				var images = {left:File(dir+"left.jpg"), center:File(dir+"center.jpg"), right:File(dir+"right.jpg")}
				var leftImg = buttonGroup.add("iconButton", undefined, ScriptUI.newImage(images.left));
					leftImg.onClick = function(){
						result = 1;
						window.close();
					}
				var centerImg = buttonGroup.add("iconButton", undefined, ScriptUI.newImage(images.center));
					centerImg.onClick = function(){
						result = 2;
						window.close();
					}
				var rightImg = buttonGroup.add("iconButton", undefined, ScriptUI.newImage(images.right));
					rightImg.onClick = function(){
						result = 3;
						window.close();
					}
			window.show();
			return result;
		}
		var fNumber = artLayers.layers.getByName("Front Number").pageItems[0];
		if(logoBool == true){
			var left;
			var nextSmallest = prepressLayer.layers[1].name;
			var FB = false;
			if(wearerLayer.name.indexOf("FB")>0){
				FB = true;
			}
			var vertPos = nextSmallestLogo - smallestLogo;
			var topStart = fNumber.top + (vertPos * smallestScale);
			var top = topStart;
			var curSize;
		
			if(fNumberLoc == '1'){
				left = fNumber.left + (smallestWidth/2);
				for(var a=0;a<prepressLayer.layers.length;a++){
					curSize = prepressLayer.layers[a].name;
					if(!FB){
						var dest = prepressLayer.layers.getByName(curSize).groupItems.getByName(curSize + " Front");
					}
					else{
						var dest = prepressLayer.layers.getByName(curSize).groupItems.getByName(curSize + " Right Front");
					}
					var fNumberCopy = fNumber.duplicate(dest);
					fNumberCopy.name = curSize + " Front Number";
					fNumberCopy.left = left;
					fNumberCopy.top = top;
					left = left-1.8;
					top = fNumberCopy.top - vertPos;
				}
			}
			else if(fNumberLoc == '3'){
				left = fNumber.left - (smallestWidth/2);
				for(var a=0;a<prepressLayer.layers.length;a++){
					curSize = prepressLayer.layers[a].name;
					if(!FB){
						var dest = prepressLayer.layers.getByName(curSize).groupItems.getByName(curSize + " Front");
					}
					else{
						var dest = prepressLayer.layers.getByName(curSize).groupItems.getByName(curSize + " Left Front");
					}
					var fNumberCopy = fNumber.duplicate(dest);
					fNumberCopy.name = curSize + " Front Number";
					fNumberCopy.left = left;
					fNumberCopy.top = top;
					left = left+1.8;
					top = fNumberCopy.top - vertPos;
				}
			}
			else if(fNumberLoc == '2'){
				if(FB){
					alert("You can't put a centered front number on a full button jersey.")
					valid = false;
					return;
				}
				for(var a=0;a<prepressLayer.layers.length;a++){
					curSize = prepressLayer.layers[a].name;
					var dest = prepressLayer.layers.getByName(curSize).groupItems.getByName(curSize + " Front");
					var fNumberCopy = fNumber.duplicate(dest);
					fNumberCopy.name = curSize + " Front Number";
					fNumberCopy.top = top;
					top = fNumberCopy.top - vertPos;
				}
			}
			else{
				alert("Your selection was invalid. Please undo and try again");
				valid = false;
				return;
			}
		}
		else{
			for(var a=0;a<prepressLayer.layers.length;a++){
				curSize = prepressLayer.layers[a].name;
				var dest = prepressLayer.layers.getByName(curSize).groupItems.getByName(curSize + " Front");
				var fNumberCopy = fNumber.duplicate(dest);
				fNumberCopy.name = curSize + " Front Number";
			}
		}
	}

	function placePlayerName(){
		var name = artLayers.layers.getByName("Player Name").pageItems[0];
		for(var a=0;a<prepressLayer.layers.length;a++){
			var curSize = prepressLayer.layers[a].name;
			var dest = prepressLayer.layers[a].groupItems.getByName(curSize + " Back");
			var nameCopy = name.duplicate(dest);
			nameCopy.name = curSize + " Player Name";
			nameCopy.zOrder(ZOrderMethod.BRINGTOFRONT);
		}
	}
	
	function placePlayerNumber(){
		try{
			var number = artLayers.layers.getByName("Player Number").pageItems[0];
		}
		catch(e){
			var number = artLayers.layers.getByName("Back Number").pageItems[0];
		}
		for(var a=0;a<prepressLayer.layers.length;a++){
			var curSize = prepressLayer.layers[a].name;
			var dest = prepressLayer.layers[a].groupItems.getByName(curSize + " Back");
			var numberCopy = number.duplicate(dest);
			numberCopy.name = curSize + " Player Number";
		}
	}
	
	function placeLeftSleeve(){
		var leftSleeve = artLayers.layers.getByName("Left Sleeve").pageItems[0];
		for(var a=0;a<prepressLayer.layers.length;a++){
			var curSize = prepressLayer.layers[a].name;
			var dest = prepressLayer.layers[a].groupItems.getByName(curSize + " Left Sleeve");
			var leftCopy = leftSleeve.duplicate(dest);
			leftCopy.name = curSize + " Left Sleeve Art";
		}
	}
	
	function placeRightSleeve(){
		var rightSleeve = artLayers.layers.getByName("Right Sleeve").pageItems[0];
		for(var a=0;a<prepressLayer.layers.length;a++){
			var curSize = prepressLayer.layers[a].name;
			var dest = prepressLayer.layers[a].groupItems.getByName(curSize + " Right Sleeve");
			var rightCopy = rightSleeve.duplicate(dest);
			rightCopy.name = curSize + " Right Sleeve Art";
		}
	}
	
	function placeLockerTag(){
		var lockerTag = artLayers.layers.getByName("Locker Tag").pageItems[0];
		for(var a=0;a<prepressLayer.layers.length;a++){
			var curSize = prepressLayer.layers[a].name;
			var dest = prepressLayer.layers[a].groupItems.getByName(curSize + " Back");
			var lockerTagCopy = lockerTag.duplicate(dest);
			lockerTagCopy.name = curSize + " Locker Tag";
		
		}
	}
	
	function placeSponsor(){
		var sponsor = artLayers.layers.getByName("Sponsor Logo").pageItems[0];
		for(var a=0;a<prepressLayer.layers.length;a++){
			var curSize = prepressLayer.layers[a].name;
			var dest = prepressLayer.layers[a].groupItems.getByName(curSize + " Back");
			var sponsorCopy = sponsor.duplicate(dest);
			sponsorCopy.name = curSize + " Sponsor Logo"
		}
	}
	
	function placeLeftHood(){
		var leftHood = artLayers.layers.getByName("Left Hood").pageItems[0];
		var hoodPiece = prepressLayer.layers[mockupSize].pageItems[mockupSize + " Left Outside Hood"];
		var desiredScale = leftHood.width/hoodPiece.width;
		for(var a=0;a<prepressLayer.layers.length;a++){
			var curSize = prepressLayer.layers[a].name;
			var dest = prepressLayer.layers[a].groupItems.getByName(curSize + " Left Outside Hood");
			var leftHoodCopy = leftHood.duplicate(dest);
			var desiredWidth = dest.width*desiredScale;
			var scale = (desiredWidth/leftHoodCopy.width)*100
			leftHoodCopy.name = curSize + " Left Hood";
			leftHoodCopy.resize(scale,scale,true,true,true,true,scale,Transformation.LEFT);
		}
	}
	
	function placeRightHood(){
		var rightHood = artLayers.layers.getByName("Right Hood").pageItems[0];
		var hoodPiece = prepressLayer.layers[mockupSize].pageItems[mockupSize + " Right Outside Hood"];
		var desiredScale = rightHood.width/hoodPiece.width;
		for(var a=0;a<prepressLayer.layers.length;a++){
			var curSize = prepressLayer.layers[a].name;
			var dest = prepressLayer.layers[a].groupItems.getByName(curSize + " Right Outside Hood");
			var rightHoodCopy = rightHood.duplicate(dest);
			var desiredWidth = dest.width*desiredScale;
			var scale = (desiredWidth/rightHoodCopy.width)*100;
			rightHoodCopy.name = curSize + " Right Hood";
			rightHoodCopy.resize(scale,scale,true,true,true,true,scale,Transformation.RIGHT);
		}
	}
	
	function placeFrontPocket(){
		var pocket = artLayers.layers.getByName("Front Pocket").pageItems[0];
		var pocketPiece = prepressLayer.layers[mockupSize].pageItems[mockupSize + " Pocket"];
		var desiredScale = pocket.width/pocketPiece.width;
		for(var a=0;a<prepressLayer.layers.length;a++){
			var curSize = prepressLayer.layers[a].name;
			var dest = prepressLayer.layers[a].groupItems.getByName(curSize + " Pocket");
			var pocketCopy = pocket.duplicate(dest);
			var desiredWidth = dest.width*desiredScale;
			var scale = (desiredWidth/pocketCopy.width)*100;
			pocketCopy.name = curSize + " Front Pocket";
			pocketCopy.resize(scale,scale,true,true,true,true,scale,Transformation.BOTTOM);
		}	
	}
	
	function placeAdditionalArt(addArtLayer){
		var addArt = addArtLayer.pageItems[0];
		var layerName = addArtLayer.name;
		var pieces = wearerLayer.layers["Prepress"].layers[0].pageItems;
		var buttons = [];
		var thisName;
		
		
		var aaLoc = new Window("dialog", addArtLayer.name);
		var aaLocInfo = createAALoc();
		function createAALoc(){
			var result;
			var scale = false;
			var scaleGroup = aaLoc.add("group");
				var yesNoScale = scaleGroup.add("checkbox", undefined, "Check This Box to Scale Artwork");
			var pieceGroup = aaLoc.add("group");
				pieceGroup.orientation = "column";
				for(var a=pieces.length-1;a>-1;a--){
					var thisName = pieces[a].name.substring((pieces[a].name.indexOf(" "))+1,pieces[a].name.length);
					var thisPiece = pieces[a];
					if(thisName.indexOf("Waistband")<0 && thisName.indexOf("Cuff")<0 &&
					thisName.indexOf("Collar")<0 && thisName.indexOf("Placard")<0){
						addButton(a, thisName);
					}
				}
			
			function addButton(num, thisName){
				buttons[num] = pieceGroup.add("button", undefined, thisName);
				buttons[num].onClick = function(){
					result = thisName
					if(yesNoScale.value){
						scale = true;
					}
					aaLoc.close();
				}
			}
			aaLoc.show();
			return [result, scale];
		}
		
		
		var destPiece = aaLocInfo[0];
		var scaleAddArt = aaLocInfo[1];
		
		// end script ui
		
		var thePiece = prepressLayer.layers[mockupSize].groupItems[mockupSize + " " + destPiece];
		var desiredScale = addArt.width/thePiece.width;
		var topDist = thePiece.top - addArt.top;
		var topRatio = Math.abs(topDist/thePiece.height);
		var leftDist = addArt.left - thePiece.left;
		var leftRatio = Math.abs(leftDist/thePiece.width);
		for(var a=0;a<prepressLayer.layers.length;a++){
			var curSize = prepressLayer.layers[a].name;
			var dest = prepressLayer.layers[a].groupItems.getByName(curSize + " " + destPiece); 
			var addArtCopy = addArt.duplicate(dest);
			addArtCopy.name = curSize + " Additional Art";
			if(scaleAddArt){
				var desiredWidth = dest.width*desiredScale;
				if(dest.width>addArtCopy.width){
					var scale = (desiredWidth/addArtCopy.width)*100;
					addArtCopy.resize(scale,scale,true,true,true,true,scale);
					desiredTop = dest.top-(dest.height*topRatio);
					addArtCopy.top = desiredTop;
					desiredLeft = dest.left+(dest.width*leftRatio);
					addArtCopy.left = desiredLeft;
				}else{
					
				}
			}
			
		}
	}
	
	function placeLeftLegFront(){
		var leftLeg = artLayers.layers.getByName("Left Leg Front").pageItems[0];
		for(var a=0;a<prepressLayer.layers.length;a++){
			var curSize = prepressLayer.layers[a].name;
			var dest = prepressLayer.layers[a].groupItems.getByName(curSize + " Left Leg");
			var leftLegCopy = leftLeg.duplicate(dest);
			leftLegCopy.name = curSize + " Left Leg Front Logo";
		}
	}

	function placeLeftLegSide(){
		var leftLeg = artLayers.layers.getByName("Left Leg Side").pageItems[0];
		for(var a=0;a<prepressLayer.layers.length;a++){
			var curSize = prepressLayer.layers[a].name;
			var dest = prepressLayer.layers[a].groupItems.getByName(curSize + " Left Leg");
			var leftLegCopy = leftLeg.duplicate(dest);
			leftLegCopy.name = curSize + " Left Leg Side Logo";
		}
	}

	function placeRightLegFront(){
		var rightLeg = artLayers.layers.getByName("Right Leg Front").pageItems[0];
		for(var a=0;a<prepressLayer.layers.length;a++){
			var curSize = prepressLayer.layers[a].name;
			var dest = prepressLayer.layers[a].groupItems.getByName(curSize + " Right Leg");
			var rightLegCopy = rightLeg.duplicate(dest);
			rightLegCopy.name = curSize + " Right Leg Front Logo";
		}
	}

	function placeRightLegSide(){
		var rightLeg = artLayers.layers.getByName("Right Leg Side").pageItems[0];
		for(var a=0;a<prepressLayer.layers.length;a++){
			var curSize = prepressLayer.layers[a].name;
			var dest = prepressLayer.layers[a].groupItems.getByName(curSize + " Right Leg");
			var rightLegCopy = rightLeg.duplicate(dest);
			rightLegCopy.name = curSize + " Right Leg Front Logo";
		}
	}

	function addArtwork(){
		var removeLayers = [];
		
		try{
			artLayers.layers.getByName("Player Name").zOrder(ZOrderMethod.SENDTOBACK);
			artLayers.layers.getByName("Front Logo").zOrder(ZOrderMethod.BRINGTOFRONT);
			artLayers.layers.getByName("Additional Art").zOrder(ZOrderMethod.BRINGTOFRONT);
		}
		catch(e){
		}
		for(var a=0;a<artLayers.layers.length;a++){
			var curArtLayer = artLayers.layers[a];
			if (curArtLayer.pageItems.length < 1){
				removeLayers.push(curArtLayer);
			}
			else if (curArtLayer.pageItems.length == 1 && curArtLayer.visible == true){
				if (curArtLayer.name.indexOf("Additional Art")>-1){
					placeAdditionalArt(curArtLayer);				
				}
				else if (curArtLayer.name == "Front Logo"){
					placeFrontLogo();
				}
				else if (curArtLayer.name == "Front Number"){
					if(artLayers.layers.getByName("Front Logo").pageItems.length>0){
						placeFrontNumber(true);
					}
					else{
						placeFrontNumber(false);
					}
				}
				else if (curArtLayer.name == "Player Number" || curArtLayer.name == "Back Number"){
					placePlayerNumber();
				}
				else if (curArtLayer.name == "Left Sleeve"){
					placeLeftSleeve();
				}	
				else if (curArtLayer.name == "Right Sleeve"){
					placeRightSleeve();
				}
				else if (curArtLayer.name == "Locker Tag"){
					placeLockerTag();
				}
				else if (curArtLayer.name == "Sponsor Logo"){
					placeSponsor();
				}
				else if (curArtLayer.name == "Player Name"){
					placePlayerName();
				}
				else if (curArtLayer.name == "Right Hood"){
					placeRightHood();
				}
				else if(curArtLayer.name == "Left Hood"){
					placeLeftHood();
				}
				else if(curArtLayer.name == "Front Pocket"){
					placeFrontPocket();
				}
				else if(curArtLayer.name == "Left Leg Front"){
					placeLeftLegFront();
				}
				else if(curArtLayer.name == "Left Leg Side"){
					placeLeftLegSide();
				}
				else if(curArtLayer.name == "Right Leg Side"){
					placeRightLegSide();
				}
				else if(curArtLayer.name == "Right Leg Front"){
					placeRightLegFront();
				}
			}
			else if (curArtLayer.pageItems.length > 1){
				alert("You have too much artwork on layer " + curArtLayer.name);
			}
		}
		if(removeLayers.length>0){
				for(var a=removeLayers.length-1;a>-1;a--){
					removeLayers[a].remove();
				}
		}
	}
	
	function moveArtwork(){
		if(wearerLayer.layers["Information"].layers[0].name != "Logos Fixed" || 
			wearerLayer.layers["Information"].layers[0].name.indexOf("Regular")>-1 ||
			wearerLayer.layers["information"].layers[0].name.indexOf("Raglan")>-1)
			var cut = wearerLayer.layers.getByName("Information").layers[0].name;
		else
			var cut = wearerLayer.layers["Information"].layers[1].name;
		var coords;
		if(cut.indexOf("Mens Raglan")>-1){
			coords = slowRaglanPlacement;
		}
		else if(cut.indexOf("Mens Regular")>-1){
			coords = slowRegularPlacement;
		}
		else if(cut.indexOf("Womens Regular")>-1){
			coords = womensSlowRegularPlacement;
		}
		else if(cut.indexOf("Womens Raglan")>-1){
			coords = womensSlowRaglanPlacement;
		}
		else if(cut.indexOf("Youth Regular")>-1){
			coords = youthSlowRegularPlacement;
		}
		else if(cut.indexOf("Youth Raglan")>-1){
			coords = youthSlowRaglanPlacement;
		}
		else if(cut.indexOf("Fast_SL")>-1 || cut.indexOf("Fast_RB")>-1){
			coords = fastSleevelessPlacement;
		}
		else if(cut == "FD_BASE_2B_SS_"){
			coords = base2buttonPlacement;
		}
		else if(cut == "FD_BASE_2B_Y_"){
			coords = youth2buttonPlacement;
		}
		else if(cut == "FD_BASE_FB_SS_"){
			coords = baseFullButtonPlacement;
		}
		else if(cut == "FD_BASE_FB_Y_SS_"){
			coords = youthFullButtonPlacement;
		}
		else if(cut == "FD_FAST_FB_W_SS_"){
			coords = fastFullButtonPlacement;
		}
		else if(cut == "FD_FAST_FB_W_SL_"){
			coords = fastFullButtonSLPlacement;
		}
		else if(cut == "FD_FAST_2B_W_"){
			coords = fast2ButtonPlacement;
		}
		else if(cut == "FD_BASE_FB_SL_"){
			coords = baseFullButtonSLPlacement;
		}
		else if(cut == "FD_BASE_FB_Y_SL_"){
			coords = youthFullButtonSLPlacement;
		}
		else if(cut == "FDMH_"){
			coords = fdmhPlacement;
		}
		else if(cut == "FDWH_"){
			coords = fdwhPlacement;
		}
		else if(cut == "FDYH_"){
			coords = fdyhPlacement;
		}
		else if(cut == "FD_VOL_CS_"){
			coords = fdVolCsPlacement;
		}
		else if(cut == "FD_VOL_LS_"){
			coords = fdVolLsPlacement;
		}
		else if(cut == "FD_SOC_SS_"){
			coords = fdSocSSPlacement;
		}
		else if(cut == "FD_BASK_SLRV2P_"){
			coords = fdBaskRvSLPlacement;
		}
		else if(cut == "FD_BASK_SHRV2P_"){
			coords = fdBaskRvSHPlacement;
		}
		for(var a=0; a<prepressLayer.layers.length;a++){
			var curSize = prepressLayer.layers[a].name;
			var curLayer = prepressLayer.layers[a];
			for(var b=0;b<curLayer.groupItems.length;b++){
				var curGroup = curLayer.groupItems[b];
				curGroup.left = coords[curSize][b][0];
				curGroup.top = coords[curSize][b][1];
			}
		}
		try{
			var usaCollarLayer = wearerLayer.layers["USA Collars"];
			usaCollarLayer.visible = true;
			var usaCollars = usaCollarLayer.groupItems;
			for(var a=0;a<usaCollars.length;a++){
				var thisCollar = usaCollars[a];
				thisCollar.left = coords["USA Collar"][a][0];
				thisCollar.top = coords["USA Collar"][a][1];
			}
			var drLabel = {
				"text": "DR Collars",
				"coords": [prepressLayer.layers[0].groupItems[0].left - 50,prepressLayer.layers[0].groupItems[0].top + 100]
			}
			var usaLabel = {
				"text": "USA Collars",
				"coords": [usaCollars[0].left -50,prepressLayer.layers[0].groupItems[0].top + 100]
			}
			var addDrLabel = wearerLayer.layers["Mockup"].textFrames.add();
			var addUsaLabel = wearerLayer.layers["USA Collars"].textFrames.add();
			addDrLabel.contents = drLabel.text;
			addDrLabel.left = drLabel.coords[0];
			addDrLabel.top = drLabel.coords[1];
			addDrLabel.textRange.characterAttributes.size = 35;
			addUsaLabel.contents = usaLabel.text;
			addUsaLabel.left = usaLabel.coords[0];
			addUsaLabel.top = usaLabel.coords[1];
			addUsaLabel.textRange.characterAttributes.size = 35;
			usaCollarLayer.visible = false;

		}
		catch(e){
			// usaCollarLayer.visible = false;
		}
	}

	function usaCollars(wearer){

	}
	
	///////////////////////
	//End Logic Container//
	///////////////////////
	
	//Begin Function Callouts//
	generateWearer();
	wearerLayer.layers["Artwork Layer"].locked = false;
	if(valid){
		inProgressIndicator();
		unlock();
		findSmallestWidth();
	}
	if(valid){
		addArtwork();
	}
	if(valid){
		moveArtwork();
		removeInProgressIndicator();
	}
}
scriptContainer();