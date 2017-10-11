var GoogleSpreadsheet = require('google-spreadsheet');
var request = require("request")
var sleep = require('system-sleep');
var doc = new GoogleSpreadsheet('1xL3RkUoPfwncxeDSXxfSRNcktLWOSXPmQR1N-oMahfY');
var sheet;

   var isWin = /^win/.test(process.platform);
var isLin = /^linux/.test(process.platform);
if (isLin) {
    var creds = require('/root/EthTokenArbTradingNode/googlesheet.json');
} else if (isWin) {
    var creds = require('D:\\Projects\\EthTokenArbTradingNode\\googlesheet.json');
}
	const commandLineArgs = require('command-line-args')
const optionDefinitions = [
  { name: 'start', alias: 's', type: Number },
  { name: 'max', type: Number, alias: 'm' } 
]
const options = commandLineArgs(optionDefinitions)
//console.log(options['start']);
//console.log(options['max']);arb > 
function oulala123(x, data, sheet, threshold){
	try{
				    var running = false;
	if (running == false){
							running = true;
						bps = {};
						sps = {};
						try{
						//console.log(x);
						sleep(2);
				
					//console.log(Object.keys(data)[y + options['start']]);
				  var currentValue = Object.keys(data)[x].substring(4);
				  var lalaurl = " https://api.hitbtc.com/api/1/public/symbols";
request.get(lalaurl, {json: true, timeout: 80000}, function(error, response, lala) {
				 var doit = false;
				 for (symbol in lala['symbols']){
					 if (currentValue + "ETH" == lala['symbols'][symbol]['symbol']){
						 doit = true;
					 }
				 }
				 
					 
				  //currentValue = "CAT";
				  //currentValue = "OMG";
				  //console.log(currentValue);
				  //if (options['max'] == 2){
					  //currentValue = cells[0].value;
					  if(data.hasOwnProperty("ETH_" + currentValue )){


				  //}
				 // else {
					  
				  //cells[0].value = Object.keys(data)[y + options['start']].substring(4);
				  ////cells[0].save();
				  //}
				  if (currentValue.startsWith("0x")){running = false;
		x = x + 1;
		if (x <= options['max']){
			oulala123(x, data, sheet, ((Math.random() * 3.5) + .1));
		}
				  }else{
				//currentValue = "MCO";
	  if (currentValue != "CAT" && doit == true){
//cells[19].value = "=if(R" + (y + options['start']) + "=0 ,-100, -1*(1-(S" + (y + options['start']).toString() + "/R" + (y + options['start']).toString() + ")))";				  cells[19].save();
				  ////console.log(currentValue);
				  try {
				  var tokenAddr = data['ETH_' + currentValue]['tokenAddr'];
				 // sleep(1000);
				 //sleep(1000);
				  var url4 = 'https://api.hitbtc.com/api/1/public/' + currentValue + 'ETH/orderbook';
				  //console.log(url4);
//sleep(1060)
request.get(url4, {json: true, timeout: 80000}, function(error, response, data4) {
			//console.log(data4);
			var buyDone= false;
       var  sellDone = false;
	   try{
	   if (data4['bids'].length == 0 || data4['asks'].length == 0){
		   
		   buyDone = true;
		   sellDone = true;
	   }
	   if(data4.code == -1121){
		   buyDone = true;
		   sellDone = true;
	   }
       var buyTotal = 0;
       var sellTotal = 0;
	   ////console.log(buyTotal);
	   ////console.log(sellTotal);
	   
        while (buyDone == false){
          for (var buys in data4['bids']){
            buyTotal = buyTotal + (data4['bids'][buys][1] * data4['bids'][buys][0]);
            if (buys == data4['bids'].length){
				             buyDone = true;
             break;
				buyPrice = 0;
							 
			}
	   ////console.log(buyTotal);
	   if (buyTotal >=threshold){
             buyDone = true;
              buyPrice = data4['bids'][buys][0];
			  console.log('buyprice: ' + buyPrice);console.log('buytotal: ' + buyTotal);
			  /*
			  cells[14].value = buyPrice.toString();
			  cells[16].value = buyTotal.toString();
			  cells[14].save();
			  cells[16].save();
			  */
			  bps['hit'] = buyPrice;
             break;
            }
          }break;
        }
        while (sellDone == false){
          for (var sells in data4['asks']){
            if (sells == data4['asks'].length){
				            sellDone = true;
             break;
				sellPrice = 1000000;
							 
			}
            sellTotal = sellTotal + (data4['asks'][sells][1] * data4['asks'][sells][0]);
            
	   ////console.log(sellTotal);
			if (sellTotal >=threshold){
             sellDone = true;
               sellPrice = data4['asks'][sells][0];
			  console.log('sellprice: ' + sellPrice);console.log('selltotal: ' + sellTotal);
			  /*
			  cells[13].value = sellPrice.toString();
			  cells[15].value = sellTotal.toString();
			  cells[13].save();
			  cells[15].save();*/
			  sps['hit'] = sellPrice;
             break;
            }
          }break;
	   }}
	   catch (err){if (err instanceof TypeError){}else{console.log(err);}
		   
		   //console.log(err)
	   }
	   var url6 = 'https://api.etherdelta.com/orders/' + tokenAddr + '/0';//sleep(1060);
	   //console.log(url6);
request.get(url6, {json: true, timeout: 80000}, function(error6, response6, data6) {

	   try{
			if (!error6 && response6.statusCode === 200) {
				////////console.log(data6);
				var buyDone= false;
       var  sellDone = false;
       var buyTotal = 0;
       var sellTotal = 0;
        while (buyDone == false){
          for (var buys in data6['buys']){
			  if (buys == data6['buys'].length){
				             buyDone = true;
             break;
				buyPrice = 0;
							 
			  console.log('ed buy' + buyPrice);
			}
            buyTotal = buyTotal + parseFloat(data6['buys'][buys]['ethAvailableVolumeBase']);
            if (buyTotal >=threshold){
             buyDone = true;
              buyPrice = data6['buys'][buys]['price'];
			  console.log('buyprice: ' + buyPrice);console.log('buytotal: ' + buyTotal);
			  console.log('ed buy' + buyPrice);
			  bps['ed'] = buyPrice;/*
			  cells[2].value = buyPrice.toString();
			  cells[4].value = buyTotal.toString();
			  cells[2].save();
			  cells[4].save();*/
             break;
            }
          }
		  break;
        }
        while (sellDone == false){
          for (var sells in data6['sells']){
            if (sells == data6['sells'].length){
				            sellDone = true;
             break;
				sellPrice = 1000000;
							 
			  console.log('ed sell' + sellPrice);
			}
			  
            sellTotal = sellTotal + parseFloat(data6['sells'][sells]['ethAvailableVolumeBase']);
            if (sellTotal >=threshold){
             sellDone = true;
               sellPrice = data6['sells'][sells]['price'];
			  console.log('ed sell' + sellPrice);
			  console.log('sellprice: ' + sellPrice);console.log('selltotal: ' + sellTotal);
			  /*
			  cells[1].value = sellPrice.toString();
			  cells[3].value = sellTotal.toString();
			  cells[1].save();
			  cells[3].save();
			  */
			  
			  sps['ed'] = sellPrice;
             break;
            }
          }break;
	   } 
			}
	   }catch(err){console.log(err);}
	   
				 
			var url2 = "https://bittrex.com/api/v1.1/public/getorderbook?market=ETH-" + currentValue + "&type=both";
	  //console.log(url2);
//sleep(1060)
request.get(url2, {json: true, timeout: 80000}, function(error, response, data5) {
			////////console.log(data5);
			var buyDone= false;
       var  sellDone = false;
       var buyTotal = 0;
       var sellTotal = 0;
	   ////console.log(buyTotal);
	   ////console.log(sellTotal);
	   try{
        while (buyDone == false){
          for (var buys in data5['result']['buy']){
            buyTotal = buyTotal + (data5['result']['buy'][buys]['Quantity'] * data5['result']['buy'][buys]['Rate']);
            if (buys == data5['result']['buy'].length){
				             buyDone = true;
             break;
				buyPrice = 0;
							 
			}
	   ////console.log(buyTotal);
	   if (buyTotal >=threshold){
             buyDone = true;
              buyPrice = data5['result']['buy'][buys]['Rate'];
			  console.log('buyprice: ' + buyPrice);console.log('buytotal: ' + buyTotal);
			  /*
			  cells[6].value = buyPrice.toString();
			  cells[8].value = buyTotal.toString();
			  cells[6].save();
			  cells[8].save();
             */
			 bps['bit'] = buyPrice;
			 break;
            }
          }break;
        }
        while (sellDone == false){
          for (var sells in data5['result']['sell']){
            if (sells == data5['result']['sell'].length){
				            sellDone = true;
             break;
				sellPrice = 1000000;
							 
			}
            sellTotal = sellTotal + (data5['result']['sell'][sells]['Quantity'] * data5['result']['sell'][sells]['Rate']);
            
	   ////console.log(sellTotal);
			if (sellTotal >=threshold){
             sellDone = true;
               sellPrice = data5['result']['sell'][sells]['Rate'];
			  console.log('sellprice: ' + sellPrice);console.log('selltotal: ' + sellTotal);
			  /*
			  cells[5].value = sellPrice.toString();
			  cells[7].value = sellTotal.toString();
			  
			  cells[7].save();
			  cells[5].save(); */
			  
			  sps['bid'] = sellPrice;
             break;
            }
          }break;
	   }}
	   catch (err){if (err instanceof TypeError){}else{console.log(err);}//////console.log(err)
	   }
	   
	   var url3 = 'https://www.binance.com/api/v1/depth?symbol=' + currentValue + "ETH";
	   //console.log(url3);
		//sleep(1060)
request.get(url3, {json: true, timeout: 80000}, function(error, response, data3) {
			//////console.log(data3);
			var buyDone= false;
       var  sellDone = false;
	   
	   try{
	   if (data3['bids'].length == 0 || data3['asks'].length == 0){
		   
		   buyDone = true;
		   sellDone = true;
	   }
	   if(data3.code == -1121){
		   buyDone = true;
		   sellDone = true;
	   }
       var buyTotal = 0;
       var sellTotal = 0;
	   ////console.log(buyTotal);
	   ////console.log(sellTotal);
        while (buyDone == false){
          for (var buys in data3['bids']){
            buyTotal = buyTotal + (data3['bids'][buys][1] * data3['bids'][buys][0]);
            if (buys == data3['bids'].length){
				             buyDone = true;
             break;
				buyPrice = 0;
							 
			}
	   ////console.log(buyTotal);
	   if (buyTotal >=threshold){
             buyDone = true;
              buyPrice = data3['bids'][buys][0];
			  console.log('buyprice: ' + buyPrice);console.log('buytotal: ' + buyTotal);
			  /*
			  cells[10].value = buyPrice.toString();
			  cells[12].value = buyTotal.toString();
			  cells[10].save();
			  cells[12].save();*/
			  bps['bin'] = buyPrice;
             break;
            }
          }break;
        }
        while (sellDone == false){
          for (var sells in data3['asks']){
            if (sells == data3['asks'].length){
				            sellDone = true;
             break;
				sellPrice = 1000000;
							 
			}
            sellTotal = sellTotal + (data3['asks'][sells][1] * data3['asks'][sells][0]);
            
	   ////console.log(sellTotal);
			if (sellTotal >=threshold){
             sellDone = true;
               sellPrice = data3['asks'][sells][0];
			  console.log('sellprice: ' + sellPrice);console.log('selltotal: ' + sellTotal);
			  /*
			  cells[9].value = sellPrice.toString();
			  cells[11].value = sellTotal.toString();
			  cells[9].save();
			  cells[11].save(); */
			  
			  sps['bin'] = sellPrice;
             break;
            }
          }break;
	   }}
	   catch (err){if (err instanceof TypeError){}else{console.log(err);}
		   
		   //////console.log(err)
	   }
	   var url9 = "https://api.liqui.io/api/3/depth/" + currentValue.toLowerCase() + "_eth";
		//console.log(url9);
						sleep(1);
request.get(url9, {json: true, timeout: 80000}, function(error, response, data9) {
			////////console.log(data5);
			var buyDone= false;
       var  sellDone = false;
       var buyTotal = 0;
       var sellTotal = 0;
	   ////console.log(data9);
	   try{
	   if(data9.success == 0){
		   
			 buyDone= true;
         sellDone = true;
	   }}catch(err){}
	   try{
	   ////console.log(buyTotal);
	   ////console.log(sellTotal);
        while (buyDone == false){
          for (var buys in data9[currentValue.toLowerCase() + '_eth']['bids']){
            buyTotal = buyTotal + (data9[currentValue.toLowerCase() + '_eth']['bids'][buys][0] * data9[currentValue.toLowerCase() + '_eth']['bids'][buys][1]);
            if (buys == data9[currentValue.toLowerCase() + '_eth']['bids'].length){
				             buyDone = true;
             break;
				buyPrice = 0;
							 
			}
	   ////console.log(buyTotal);
	   if (buyTotal >=threshold){
             buyDone = true;
              buyPrice = data9[currentValue.toLowerCase() + '_eth']['bids'][buys][0];
			  console.log('buyprice: ' + buyPrice);console.log('buytotal: ' + buyTotal);
			  /*
			  cells[29].value = buyPrice.toString();
			  cells[31].value = buyTotal.toString();
			  cells[29].save();
			  cells[31].save();*/
			  bps['liq'] = buyPrice;
             break;
            }
          }break;
        }
        while (sellDone == false){
          for (var sells in data9[currentValue.toLowerCase() + '_eth']['asks']){
            if (sells == data9[currentValue.toLowerCase() + '_eth']['asks'].length){
				            sellDone = true;
             break;
				sellPrice = 1000000;
							 
			}
            sellTotal = sellTotal + (data9[currentValue.toLowerCase() + '_eth']['asks'][sells][0] * data9[currentValue.toLowerCase() + '_eth']['asks'][sells][1]);
            
	   ////console.log(sellTotal);
			if (sellTotal >=threshold){
             sellDone = true;
               sellPrice = (parseFloat(data9[currentValue.toLowerCase() + '_eth']['asks'][sells][0]) * 1.05);
			  console.log('sellprice: ' + sellPrice);console.log('selltotal: ' + sellTotal);
			  /*
			  cells[28].value = sellPrice.toString();
			  cells[30].value = sellTotal.toString();
			  
			  cells[30].save();
			  cells[28].save(); */
			  
			  sps['liq'] = sellPrice;
             break; 
            }
          }break;
	   }}
	   catch (err){if (err instanceof TypeError){}else{console.log(err);}//////console.log(err)
	   }
	   var url8 = "https://api.gatecoin.com/Public/MarketDepth/" + currentValue + "ETH";
		
		//console.log(url8);
						sleep(1);
request.get(url8, {json: true, timeout: 80000}, function(error, response, data8) {
			////////console.log(data5);
			var buyDone= false;
       var  sellDone = false;
       var buyTotal = 0;
       var sellTotal = 0;
	   ////console.log(data8);
	   try{
	   if(data8.responseStatus.message != 'OK'){
		   
			 buyDone= true;
         sellDone = true;
	   }
	   ////console.log(buyTotal);
	   ////console.log(sellTotal);
        while (buyDone == false){
          for (var buys in data8['bids']){
            buyTotal = buyTotal + (data8['bids'][buys]['price'] * data8['bids'][buys]['volume']);
            if (buys == data8['bids'].length){
				             buyDone = true;
             break;
				buyPrice = 0;
							 
			}
	   ////console.log(buyTotal);
	   if (buyTotal >=threshold){
             buyDone = true;
              buyPrice = data8['bids'][buys]['price'];
			  console.log('buyprice: ' + buyPrice);console.log('buytotal: ' + buyTotal);
			  /*
			  cells[33].value = buyPrice.toString();
			  cells[35].value = buyTotal.toString();
			  cells[33].save();
			  cells[35].save();*/
			  bps['gate'] = buyPrice;
             break;
            }
          }break;
        }
        while (sellDone == false){
          for (var sells in data8['asks']){
            if (sells == data8['asks'].length){
				            sellDone = true;
             break;
				sellPrice = 1000000;
							 
			}
            sellTotal = sellTotal + (data8['asks'][sells]['price'] * data8['asks'][sells]['volume']);
            
	   ////console.log(sellTotal);
			if (sellTotal >=threshold){
             sellDone = true;
               sellPrice = data8['asks'][sells]['price'];
			  console.log('sellprice: ' + sellPrice);console.log('selltotal: ' + sellTotal);
			  /*
			  cells[32].value = sellPrice.toString();
			  cells[34].value = sellTotal.toString();
			  
			  cells[34].save();
			  cells[32].save();*/
			  sps['gate'] = sellPrice;
             break;
            }
          }break;
	   }}
	   catch (err){if (err instanceof TypeError){}else{console.log(err);}//////console.log(err)
	   }
	   
	   
		var url7 = "https://api.livecoin.net/exchange/order_book/?currencyPair=" + currentValue + "/ETH";
		
		//console.log(url7);
						sleep(1);
request.get(url7, {json: true, timeout: 80000}, function(error, response, data7) {
			////////console.log(data5);
			var buyDone= false;
       var  sellDone = false;
       var buyTotal = 0;
	   try{
	   if (data7.success == false){
		   buyDone= true;
       sellDone = true;
	   }}catch(err){}
	   try{
       var sellTotal = 0;
	   ////console.log(buyTotal);
	   ////console.log(sellTotal);
        while (buyDone == false){
          for (var buys in data7['bids']){
            buyTotal = buyTotal + (parseFloat(data7['bids'][buys][0]) * parseFloat(data7['bids'][buys][1]));
            if (buys == data7['bids'].length){
				             buyDone = true;
             break;
				buyPrice = 0;
							 
			}
	   ////console.log(buyTotal);
	   if (buyTotal >=threshold){
             buyDone = true;
              buyPrice = parseFloat(data7['bids'][buys][0]);
			  console.log('buyprice: ' + buyPrice);console.log('buytotal: ' + buyTotal);
			  /*
			  cells[37].value = buyPrice.toString();
			  cells[39].value = buyTotal.toString();
			  cells[37].save();
			  cells[39].save();*/
			  bps['live'] = buyPrice;
             break;
            }
          }break;
        }
        while (sellDone == false){
          for (var sells in data7['asks']){
            if (sells == data7['asks'].length){
				            sellDone = true;
             break;
				sellPrice = 1000000;
							 
			}
            sellTotal = sellTotal + (parseFloat(data7['asks'][sells][0]) * parseFloat(data7['asks'][sells][1]));
            
	   ////console.log(sellTotal);
			if (sellTotal >=threshold){
             sellDone = true;
               sellPrice = parseFloat(data7['asks'][sells][0]) ;
			  console.log('sellprice: ' + sellPrice);console.log('selltotal: ' + sellTotal);
			  /*
			  cells[36].value = sellPrice.toString();
			  cells[38].value = sellTotal.toString();
			  
			  cells[38].save();
			  cells[36].save();*/
			  sps['live'] = sellPrice;
             break;
            }
          }break;
}
	   }catch (err){if (err instanceof TypeError){}else{console.log(err);}//////console.log(err)
	   }
	   
	    var winSp = 1000000000000000;
		var winBp = 0;
		var winExBp = "";
		var winExSp = "";
		for (var bp in bps){
			if (bps[bp] >= winBp && bps[bp] != 1000000 && bps[bp] != 0){
				winBp = bps[bp];
				winBpEx = bp;
			}
		}
		var winSp = 10;
		for (var sp in sps){
			
			if (sps[sp] <= winSp && sps[sp] != 1000000 && sps[sp] != 0){
				winSp = sps[sp];
				winSpEx = sp;
			}
		}
		if (winSp != 10 && winBp != 0 && winSp != 1 && winBp != 1){
		var arb = (-1 * (1 - (winBp/winSp))) - (.01/threshold);
		console.log(arb);
		if (arb > .01 && arb <= 10){
			var dateTime = require('node-datetime');
									var dt = dateTime.create();
									var formatted = dt.format('Y-m-d H:M:S');
									console.log(formatted);
			console.log('arb arb! ' + arb + ' ' + currentValue + ' winsp: ' + winSpEx + ' winbp: ' + winBpEx);
			sheet.addRow({'time':formatted, 'ticker': currentValue, 'bid': winBp, 'ask': winSp, 'arb with fee': arb, 'bid ex': winBpEx, 'ask ex': winSpEx, 'eth threshold': threshold}, function (err, row){console.log(err); });
		}
		}
		running = false;
		x = x + 1;
		if (x <= options['max']){
			oulala123(x, data, sheet, ((Math.random() * 3.5) + .1));
		}
		
	   }); // 7th
	   }); /// 6th
	   
	   });//5th

	   }); //4th
	   }); // 3rd
		});
	   });
	   
		
		
	   
	   //cells[23].value = data['ETH_' + currentValue]['baseVolume'];
		//cells[23].save();
	   
				 
	   }catch(err){}
	   }else {
		   running = false;
		x = x + 1;
		if (x <= options['max']){
			 oulala123(x, data, sheet, ((Math.random() * 3.5) + .1));
		}
	  }
				  }
				  }
});}catch(err){}}
	}catch(err){}
}
function oulala(){
// spreadsheet key is the long id in the sheets URL 
    doc.useServiceAccountAuth(creds, function lala(){
    doc.getInfo(function(err, info) {
      ////console.log('Loaded doc: '+info.title+' by '+info.author.email);
      sheet = info.worksheets[0];
      ////console.log('sheet 1: '+sheet.title+' '+sheet.rowCount+'x'+sheet.colCount);
	  var url = 'https://api.etherdelta.com/returnTicker';
	  //console.log(url);//sleep(1060)
request.get(url, {json: true, timeout: 80000}, function(error, response, data) {

			if (!error && response.statusCode === 200) {
				//console.log(Object.keys(data).length);
				
					oulala123(options['start'], data, sheet, ((Math.random() * 3.5) + .1));
			}
					  
						sleep(4460);		

});});});
				
					/*	
			 
			// 1st request
			sheet.getCells({
				  'min-row': x,
				  'max-row': x,
				  'return-empty': true
				}, function(err, cells) {/*
					if (options['max'] == 2){
					for (var abc = 1; abc < 16; abc++){
						cells[abc].value = " ";
					}
					}
					else {
						for (var abc = 1; abc < 16; abc++){
						cells[abc].value = " ";
					}
					}
					for (var abc = 28; abc < 40; abc++){
						cells[abc].value = " ";
					}
	   sheet.bulkUpdateCells(cells, function(result){
		   y++;
					if (err){
						////console.log(err);
					}
					});
	  
	});});*/
}
oulala();