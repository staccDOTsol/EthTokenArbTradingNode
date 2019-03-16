var GoogleSpreadsheet = require('google-spreadsheet');
var request = require("request")
var sleep = require('system-sleep');
var doc = new GoogleSpreadsheet('1GgCCW2uH_4HKRdd9JzXIKcnPpcesxWnqnSXmixS9VbY');
var sheet;
var fees = {
	"DAY":51.05,
	"KIN": 258065,
    "CAS": 1089,
    "NET": 3.96,
    "DRT": 4695,
    "LOC": 8.32,
    "MANA": 169.6,
    "ICOS": .76,
    "SNC": 415.4,
    "FYN": 1.849,
    "ENG": 18.29 ,
    "DENT": 8538 ,
    "PLR": 308.6,
    "BAS": 578,
    "AMM": 1405 ,
    "CTX": 780,
    "1ST": 195.8 ,
    "TAAS": 28.74,
    "MSP": 121,
    "LEND": 856 ,
    "PLU": 4.325,
    "AIR": 1294,
    "WRC": 107,
    "AMB": 129 ,
    "TNT": 425.2 ,
    "FUEL": 681.7 ,
    "GVT": 1.962 ,
    "ADX": 56.19,
    "DATA": 402.1 ,
    "STAR": 2174 ,
    "SAN": 16.86 ,
    "BNT": 13.18   ,
    "DDF": 152,
    "SWT": 72.72 ,
    "ATS": 860,
    "ATM": 1588,
    "PTOY": 505.2 ,
    "HVN":2545 ,
    "EBET": 84,
    "IND": 1170 ,
    "PRO": 57.68 ,
    "BQX": 49.2 ,
    "CCT": 195,
    "IXT": 507.7 ,
    "POE": 1573 ,
    "BMC": 55.93 ,
    "ZRX": 29.4 ,
    "PIX": 1570 ,
    "PAY": 29.87 ,
    "CTR": 15,
    "OMG": 5.552 ,
    "MTH": 403 ,
    "AVT": 57.02 ,
    "TRX": 150.5 ,
    "VERI": 0.087, "LA": 96.3 , "QVT": 26, "CFI": 181, "SUB": 540.5 , "BET": 915 , 
		"DICE": 24.15 , "NEU": 46.14 , "STX": 520.8 , "ZSC": 6270 , "FUN": 1892 , "BCPT": 167.2 , "CDT": 929 , 
		"SNT": 349.3 , "VEN": 3.6, "R": 6 // do not include SMART
};
var currentdo = [];
var tokendo = [];
var threshold = .4;
//var creds = require('/home/jd4/EthTokenArbTradingNodeGoogleSheets/googlesheet.json');
var cheerio = require('cheerio');

var creds = require('./googlesheet.json');
const commandLineArgs = require('command-line-args')
const optionDefinitions = [{
        name: 'start',
        alias: 's',
        type: Number
    },
    {
        name: 'max',
        type: Number,
        alias: 'm'
    }
]
const options = commandLineArgs(optionDefinitions)
////console.log(options['starSt']);
////console.log(options['max']);
function ed(x, error6, response6, data6, tokenAddr, cells, currentValue) {
if (data6.buys.length > 0){
    try {
            //////////console.log(data6);
            var buyDone = false;
            var sellDone = false;
            var buyTotal = 0;
            var sellTotal = 0;
            while (buyDone == false) {  try{
                for (var buys in data6['buys']) {
                    if (buys == data6['buys'].length) {
                        buyDone = true;
                        break;
                        buyPrice = 0;

                        console.log('ed buy' + buyPrice);
                    }
                    buyTotal = buyTotal + parseFloat(data6['buys'][buys]['ethAvailableVolumeBase']);
                    if (buyTotal >= threshold) {
                        buyDone = true;
                        buyPrice = data6['buys'][buys]['price'];
                        //////console.log(buyPrice);
                        console.log('ed buy' + buyPrice);
                        //bps['ed'] = buyPrice;
                        break;
                    }
                } }catch(err){}
            } 
            while (sellDone == false) { try{
                for (var sells in data6['sells']) {
                    if (sells == data6['sells'].length) {
                        sellDone = true;
                        break;
                        sellPrice = 1000000;

                        //console.log('ed sell' + sellPrice);
                    }

                    sellTotal = sellTotal + parseFloat(data6['sells'][sells]['ethAvailableVolumeBase']);
                    if (sellTotal >= threshold) {
                        sellDone = true;
                        sellPrice = data6['sells'][sells]['price'];
                        //console.log('ed sell' + sellPrice);
                        //////console.log(sellPrice);


                        //sps['ed'] = sellPrice;
                        break;
                    }
                }}catch(err){}
            } try{
            if (buyDone == false || sellDone == false) {
                socket.emit('getMarket', { token: tokenAddr, user: "0x8545d4515e27c092bd25d30EB1deb4fDF100AF92"});
				socket.once('market', (market) => {
					console.log(tokenAddr);

				ed(x, error, market.orders, market.orders, tokenAddr, cells, currentValue);
				});
                //sleep(Math.random() * (43000 - 25000) + 25000);
            } else {
				if (sellPrice > 0.0000001){
                cells[1].value = sellPrice.toString();
                cells[3].value = sellTotal.toString();
				}
				else {
                cells[1].value = "too small";
                cells[3].value = sellTotal.toString();
					
				}
                cells[1].save();
                cells[3].save();
				if (buyPrice > 0.0000001){
                cells[2].value = buyPrice.toString();
                cells[4].value = buyTotal.toString();
				}
				else {
					cells[2].value = "too small";
					cells[4].value = buyTotal.toString();
				}
                cells[2].save();
                cells[4].save();
				if (cells[1].value > cells[15].value){
				if (isNaN(1 + ((sellTotal * sellPrice) / 1))){//fees[currentValue]))){
			var nan = -99999;
		}
		else {
			var nan = (1 + ((sellTotal * sellPrice) / 1)); //fees[currentValue]));
			//console.log('nan nan '+ nan);
		}}else{
			var nan = (1 + ((sellTotal * sellPrice) / 1)); //fees[currentValue]));
			//console.log('ED nan nan '+ nan);
		}
		//console.log('celly celly x = ' + x);
        cells[19].value = "=if(R" + (x) + "=0 ,-100, -1*(1-(S" + (x).toString() + "/R" + (x).toString() + ")/" + 1  + "))";//nan + "))";
        cells[19].save();
		setTimeout(function(){
			if (cells[20].value.startsWith('https://etherdelta.com')) {
			console.log('ed startswith!!!!');
		doc.addRow(2,{"currentValue": currentValue, "percent": cells[19].value, "bidex": cells[21].value.substring(8,18)},function(){	x = x + 1;
		if (x <= options['max']) {
			console.log('row added');
			setTimeout(function() {
		//console.log(count11);
		goforit = true;
		doit = true;
		console.log('lala');
		console.log(x);
		oulala123(x, sheet);
		}, 4000);}});
			console.log('ed lala!!!');
		}
		console.log('past ed check');
		}, 9000);
                x = x + 1;
                if (x == (options['max'])) {
                    //x = options['start'];
                console.log('exiting....');
						process.exit();
				}
                setTimeout(function() {
                        //console.log(count11);
						
                        oulala123(x, sheet);
                    }, 5000);
					
		}}catch(err){console.log(err);}
        
		
    } catch (err) {
        console.log(err);
    }
    
}else{
	x = x + 1;
                if (x == (options['max'])) {
                    //x = options['start'];
                console.log('exiting....');
						process.exit();
				}
                setTimeout(function() {
                        //console.log(count11);
						
                        oulala123(x, sheet);
                    }, 5000);
}

	}
	
					var Bancor = require("bancor-api-node");

var bancor = new Bancor();

function rest(x, tokenAddr, cells, currentValue, threshold) {
	
request.get("https://api.kyber.network/currencies", function (e, r, d1){
	for (var v in JSON.parse(d1).data){
		if(JSON.parse(d1).data[v].symbol == currentValue){
			let code = JSON.parse(d1).data[v].id;
			console.log('id: ' + code);
			var url = "https://api.kyber.network/sell_rate?id=" + code + "&qty=" + threshold.toString();
			console.log(url);
			request.get(url, function (e, r, d2){
				console.log(d2);
				console.log(JSON.parse(d2).data);
	var sellrate = (JSON.parse(d2).data[0].dst_qty[0]);
	sellrate = sellrate / threshold
	var url = "https://api.kyber.network/buy_rate?id=" + code + "&qty=" + threshold.toString();
			console.log(url);
			request.get(url, function (e, r, d3){
				console.log(d2);
	console.log(JSON.parse(d3).data[0].src_qty[0]);
	
	var buyrate = (JSON.parse(d3).data[0].src_qty[0]);
	buyrate = buyrate / threshold
					console.log('buyrate: ' + buyrate);
					console.log('sellrate: ' + sellrate);
									
				 cells[72].value = buyrate.toString();
				cells[74].value = sellrate.toString();
				cells[72].save();
				cells[74].save();
})
})
		}
	}
})
	request.get("https://api.bancor.network/0.1/currencies/tokens?limit=100&skip=0&fromCurrencyCode=ETH&includeTotal=false&orderBy=liquidityDepth&sortOrder=desc", function (err, resp, data3){
	console.log(JSON.parse(data3));
		for (var currency in JSON.parse(data3).data.currencies.page){
			if(JSON.parse(data3).data.currencies.page[currency].code == currentValue){
				let code = JSON.parse(data3).data.currencies.page[currency]._id;
				console.log('code: ' + code);
				request.get("https://api.bancor.network/0.1/currencies/"+code+"/value?toCurrencyId=5937d635231e97001f744267&toAmount="+ (threshold * Math.pow(10,18)).toString(), function (err, resp, data4	){
                var lineReader = require('readline').createInterface({
                    input: require('fs').createReadStream('decimals.csv')
                });
                var lc = 0;
                var currents = [];
                var tokens = [];
                lineReader.on('line', function(line) {
                    var arr = line.split(",");
                    currents[lc] = arr[0];
                    tokens[lc] = arr[2];
                    lc++;
                });
setTimeout(function(){				
				let rate = JSON.parse(data4).data;
					for (var c in currents){
					if (currents[c] == currentValue){
					rate = (rate / Math.pow(10, tokens[c]));
					rate = rate / threshold
					rate = 1 / rate
					console.log('rate: ' + rate);
						
	 cells[71].value = rate.toString();
	cells[73].value = rate.toString();
	cells[71].save();
	cells[73].save();
					}
					}
				})
				}, 2500);
			}
		}
	})
    if (options['max'] == 2) {
        for (var abc = 1; abc < 16; abc++) {
            if (cells[abc]) {
                cells[abc].value = " ";
            }
        }
    } else {
        for (var abc = 1; abc < 16; abc++) {
            if (cells[abc]) {
                cells[abc].value = " ";
            }
        }
    }
    for (var abc = 29; abc < 40; abc++) {
        if (cells[abc]) {
            cells[abc].value = " ";
        }
    }
    var url2 = "https://bittrex.com/api/v1.1/public/getorderbook?market=ETH-" + currentValue + "&type=both";
    //console.log(url2);
    //sleep(1060)
    request.get(url2, {
        json: true,
        timeout: 13000
    }, function(error, response, data5) {
        //////////console.log(data5);
        var buyDone = false;
        var sellDone = false;
        var buyTotal = 0;
        var sellTotal = 0;
        //////console.log(buyTotal);
        //////console.log(sellTotal);
        try {
            while (buyDone == false) {
                for (var buys in data5['result']['buy']) {
                    buyTotal = buyTotal + (data5['result']['buy'][buys]['Quantity'] * data5['result']['buy'][buys]['Rate']);
                    if (buys == data5['result']['buy'].length) {
                        buyDone = true;
                        break;
                        buyPrice = 0;

                    }
                    //////console.log(buyTotal);
                    if (buyTotal >= threshold) {
                        buyDone = true;
                        buyPrice = data5['result']['buy'][buys]['Rate'];
                        //////console.log(buyPrice);

                        cells[6].value = buyPrice.toString();
                        cells[8].value = buyTotal.toString();
                        cells[6].save();
                        cells[8].save();

                        //bps['bit'] = buyPrice;
                        break;
                    }
                }
            }
            while (sellDone == false) {
                for (var sells in data5['result']['sell']) {
                    if (sells == data5['result']['sell'].length) {
                        sellDone = true;
                        break;
                        sellPrice = 1000000;

                    }
                    sellTotal = sellTotal + (data5['result']['sell'][sells]['Quantity'] * data5['result']['sell'][sells]['Rate']);

                    //////console.log(sellTotal);
                    if (sellTotal >= threshold) {
                        sellDone = true;
                        sellPrice = data5['result']['sell'][sells]['Rate'];
                        //////console.log(sellPrice);

                        cells[5].value = sellPrice.toString();
                        cells[7].value = sellTotal.toString();

                        cells[7].save();
                        cells[5].save();

                        //sps['bid'] = sellPrice;
                        break;
                    }
                }
            }
        } catch (err) {
            if (err instanceof TypeError) {} else {
                console.log(err);
            }
            console.log(err);
        }

        var url3 = 'https://www.binance.com/api/v1/depth?symbol=' + currentValue + "ETH";
        //console.log(url3);
        //sleep(1060)
        request.get(url3, {
            json: true,
            timeout: 13000
        }, function(error, response, data3) {
            ////////console.log(data3);
            var buyDone = false;
            var sellDone = false;

            try {
                if (data3['bids'].length == 0 || data3['asks'].length == 0) {

                    buyDone = true;
                    sellDone = true;
                }
                if (data3.code == -1121) {
                    buyDone = true;
                    sellDone = true;
                }
                var buyTotal = 0;
                var sellTotal = 0;
                //////console.log(buyTotal);
                //////console.log(sellTotal);
                while (buyDone == false) {
                    for (var buys in data3['bids']) {
                        buyTotal = buyTotal + (data3['bids'][buys][1] * data3['bids'][buys][0]);
                        if (buys == data3['bids'].length) {
                            buyDone = true;
                            break;
                            buyPrice = 0;

                        }
                        //////console.log(buyTotal);
                        if (buyTotal >= threshold) {
                            buyDone = true;
                            buyPrice = data3['bids'][buys][0];
                            //////console.log(buyPrice);

                            cells[10].value = buyPrice.toString();
                            cells[12].value = buyTotal.toString();
                            cells[10].save();
                            cells[12].save();
                            //bps['bin'] = buyPrice;
                            break;
                        }
                    }
                }
                while (sellDone == false) {
                    for (var sells in data3['asks']) {
                        if (sells == data3['asks'].length) {
                            sellDone = true;
                            break;
                            sellPrice = 1000000;

                        }
                        sellTotal = sellTotal + (data3['asks'][sells][1] * data3['asks'][sells][0]);

                        //////console.log(sellTotal);
                        if (sellTotal >= threshold) {
                            sellDone = true;
                            sellPrice = data3['asks'][sells][0];
                            //////console.log(sellPrice);

                            cells[9].value = sellPrice.toString();
                            cells[11].value = sellTotal.toString();
                            cells[9].save();
                            cells[11].save();

                            //sps['bin'] = sellPrice;
                            break;
                        }
                    }
                }
            } catch (err) {
                if (err instanceof TypeError) {} else {
                    console.log(err);
                }

                //  console.log(err)
            }
            var url9 = "https://api.liqui.io/api/3/depth/" + currentValue.toLowerCase() + "_eth";
            //console.log(url9);
            sleep(1);
            request.get(url9, {
                json: true,
                timeout: 13000
            }, function(error, response, data9) {
                //////////console.log(data5);
                var buyDone = false;
                var sellDone = false;
                var buyTotal = 0;
                var sellTotal = 0;
                //////console.log(data9);
                try {
                    if (data9.success == 0) {

                        buyDone = true;
                        sellDone = true;
                    }
                } catch (err) {
                    console.log(err);
                }
                try {
                    //////console.log(buyTotal);
                    //////console.log(sellTotal);
                    while (buyDone == false) {
                        for (var buys in data9[currentValue.toLowerCase() + '_eth']['bids']) {
                            buyTotal = buyTotal + (data9[currentValue.toLowerCase() + '_eth']['bids'][buys][0] * data9[currentValue.toLowerCase() + '_eth']['bids'][buys][1]);
                            if (buys == data9[currentValue.toLowerCase() + '_eth']['bids'].length) {
                                buyDone = true;
                                break;
                                buyPrice = 0;

                            }
                            //////console.log(buyTotal);
                            if (buyTotal >= threshold) {
                                buyDone = true;
                                buyPrice = data9[currentValue.toLowerCase() + '_eth']['bids'][buys][0];
                                //////console.log(buyPrice);

                                cells[29].value = buyPrice.toString();
                                cells[31].value = buyTotal.toString();
                                cells[29].save();
                                cells[31].save();
                                //bps['liq'] = buyPrice;
                                break;
                            }
                        }
                    }
                    while (sellDone == false) {
                        for (var sells in data9[currentValue.toLowerCase() + '_eth']['asks']) {
                            if (sells == data9[currentValue.toLowerCase() + '_eth']['asks'].length) {
                                sellDone = true;
                                break;
                                sellPrice = 1000000;

                            }
                            sellTotal = sellTotal + (data9[currentValue.toLowerCase() + '_eth']['asks'][sells][0] * data9[currentValue.toLowerCase() + '_eth']['asks'][sells][1]);

                            //////console.log(sellTotal);
                            if (sellTotal >= threshold) {
                                sellDone = true;
                                sellPrice = (parseFloat(data9[currentValue.toLowerCase() + '_eth']['asks'][sells][0]) + 0.015);
                                //////console.log(sellPrice);

                                cells[28].value = sellPrice.toString();
                                cells[30].value = sellTotal.toString();

                                cells[30].save();
                                cells[28].save();

                                //sps['liq'] = sellPrice;
                                break;
                            }
                        }
                    }
                    var url6 = 'https://api.etherdelta.com/orders/' + tokenAddr + '/0'; //sleep(1060);
                    //console.log(url6);
                   socket.emit('getMarket', { token: tokenAddr, user: "0x8545d4515e27c092bd25d30EB1deb4fDF100AF92"});
				socket.once('market', (market) => {
				console.log(tokenAddr);

				ed(x, error, market.orders, market.orders, tokenAddr, cells, currentValue);
				var url9 = "https://api.idex.market/returnOrderBook?count=10&market=ETH_" + currentValue;
            console.log(url9);
            sleep(1);
            request.get(url9, {
                json: true,
                timeout: 13000
            }, function(error, response, data9) {
                console.log(data9);
                var buyDone = false;
                var sellDone = false;
                var buyTotal = 0;
                var sellTotal = 0;
                //////console.log(data9);
                try {
                    if (data9.success == 0) {

                        buyDone = true;
                        sellDone = true;
                    }
                } catch (err) {
                    console.log(err);
                }
                try {
                    console.log(buyTotal);
                    console.log(sellTotal);
                    while (buyDone == false) {
                        for (var buys in data9['bids']) {
                            buyTotal = buyTotal + parseFloat(data9['bids'][buys]['total']);
                            if (buys == data9['bids'].length) {
                                buyDone = true;
                                break;
                                buyPrice = 0;

                            }
                            console.log(buyTotal);
                            if (buyTotal >= threshold) {
                                buyDone = true;
                                buyPrice = parseFloat(data9['bids'][buys]['price']);
                                //////console.log(buyPrice);

                                cells[64].value = buyPrice.toString();
                                cells[66].value = buyTotal.toString();
                                cells[64].save();
                                cells[66].save();
                                //bps['liq'] = buyPrice;
                                break;
                            }
                        }
                    }
                    while (sellDone == false) {
                        for (var sells in data9['asks']) {
                            if (sells == data9['asks'].length) {
                                sellDone = true;
                                break;
                                sellPrice = 1000000;

                            }
                            sellTotal = sellTotal + parseFloat(data9['asks'][sells]['total']);

                            console.log(sellTotal);
                            if (sellTotal >= threshold) {
                                sellDone = true;
                                sellPrice = (parseFloat(data9['asks'][sells]['price']));
                                //////console.log(sellPrice);

                                cells[63].value = sellPrice.toString();
                                cells[65].value = sellTotal.toString();

                                cells[65].save();
                                cells[63].save();

                                //sps['liq'] = sellPrice;
                                break;
                            }
                        }
                    }
					var url9 = "https://v1-1.api.token.store/orderbook/ETH_" + currentValue;
            console.log(url9);
            sleep(1);
            request.get(url9, {
                json: true,
                timeout: 13000
            }, function(error, response, data9) {
                console.log(data9);
                var buyDone = false;
                var sellDone = false;
                var buyTotal = 0;
                var sellTotal = 0;
                //////console.log(data9);
                try {
                    if (data9.success == 0) {

                        buyDone = true;
                        sellDone = true;
                    }
                } catch (err) {
                    console.log(err);
                }
                try {
                    console.log(buyTotal);
                    console.log(sellTotal);
                    while (buyDone == false) {
						if (data9['bids'].length == 0){
							buyDone = true;
							break;
						}
                        for (var buys in data9['bids']) {
                            buyTotal = buyTotal + parseFloat(data9['bids'][buys]['price']) * parseFloat(data9['bids'][buys]['volume']);
                            if (buys == data9['bids'].length - 1) {
                                buyDone = true;
                                buyPrice = 0;

                                cells[68].value = buyPrice.toString();
                                cells[70].value = buyTotal.toString();
                                cells[68].save();
                                cells[70].save();
                                break;
                            }
							
                            if (buyTotal >= threshold) {
                                buyDone = true;
                                buyPrice = parseFloat(data9['bids'][buys]['price']);
                                //////console.log(buyPrice);

                                cells[68].value = buyPrice.toString();
                                cells[70].value = buyTotal.toString();
                                cells[68].save();
                                cells[70].save();
                                //bps['liq'] = buyPrice;
                                break;
                            }
                        }
                    }
                    while (sellDone == false) {
						if (data9['asks'].length == 0){
							sellDone = true;
							break;
						}
                        for (var sells in data9['asks']) {
                            if (sells == data9['asks'].length - 1) {
                                sellDone = true;
                                sellPrice = 1000000;

                                cells[67].value = sellPrice.toString();
                                cells[69].value = sellTotal.toString();

                                cells[69].save();
                                cells[67].save();
                                break;
                            }
                            sellTotal = sellTotal + parseFloat(data9['asks'][sells]['price']) * parseFloat(data9['asks'][sells]['volume']);

								
                            if (sellTotal >= threshold) {
                                sellDone = true;
                                sellPrice = (parseFloat(data9['asks'][sells]['price']));
                                //////console.log(sellPrice);

                                cells[67].value = sellPrice.toString();
                                cells[69].value = sellTotal.toString();

                                cells[69].save();
                                cells[67].save();

                                //sps['liq'] = sellPrice;
                                break;
                            }
                        }
                    }
				}catch(err){
					console.log(err);
				}
				
			})
				}catch(err){
					console.log(err);
				}
				
			})
				})
                } catch (err) {
                    if (err instanceof TypeError) {} else {
                        console.log(err);
                    }
                   console.log(err);
                }

            }); //5th

        }); //4th
    }); // 3rd

}
const io = require('socket.io-client');
const Web3 = require('web3');

const config = {
  addressEtherDelta: '0x8d12a197cb00d4747a1fe03395095ce2a5cc6819',
  provider: 'https://mainnet.infura.io/Ky03pelFIxoZdAUsr82w',
  socketURL: 'https://api.forkdelta.com',
  gasLimit: 150000,
  gasPrice: 4000000000,
};    
web3 = new Web3(new Web3.providers.HttpProvider(config.provider));
socket = io.connect(config.socketURL, { transports: ['websocket'] })
function oulala123(x, sheet) {
    var y = 0;
    //console.log('lala' + x);
    //console.log(currentdo[x - 2]);
    sleep(50);
	
			
    sheet.getCells({
        'min-row': x,
        'max-row': x,
        'return-empty': true
    }, function(err, cells) {
		//threshold = Math.random() * 0.75 + 0.25;
		// cells[62].value = threshold.toString();
         //           cells[62].save();
		threshold = cells[62].value;
		console.log('threshold ' + threshold);
        //console.log(threshold);

        //console.log(currentdo[x - 2]);
        try {
            ////console.log(x);
            sleep(2);
            var currentValue = currentdo[x - 2];
            /*if (currentValue != "8BT" && 
            	currentValue != "AMB" && 
            	currentValue != "B2X" && 
            	currentValue != "BOS" && 
            	currentValue != "CAT" && 
            	currentValue != "CL" && 
            	currentValue != "CRS" && 
            	currentValue != "GRAPH" && 
            	currentValue != "HRB" && 
            	currentValue != "ICX" && 
            	currentValue != "IGNIS" && 
            	currentValue != "IML" && 
            	currentValue != "MPK" && 
            	currentValue != "MRV" && 
            	currentValue != "PBKX" && 
            	currentValue != "PQT" && 
            	currentValue != "RLC" && 
            	currentValue != "ROOTS" && 
            	currentValue != "SBD" && 
            	currentValue != "STAR" && 
            	currentValue != "Steem" && 
            	currentValue != "TFL" && 
            	currentValue != "TGT" && 
            	currentValue != "WEALTH" && 
            	currentValue != "WTT" && 
            	currentValue != "XLC" && 
            	currentValue != "XTZ"){ */

            var goforit = true;
            var url = 'https://hitbtc.com/system-health';
            //console.log(url);
            request(url, function(error, response, html) {
                if (!error) {
                    // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
                    var $ = cheerio.load(html);
                    $('tr').each((i, elm) => {

                        var val = $(elm).children().eq(0).text().replace(/\s/g, '');
                        var withdrawal = $(elm).children().eq(6).first().text().replace(/\s/g, '');
                         var hourdays = $(elm).children().eq(10).first().text().replace(/\s/g, '');
                         var deposit = $(elm).children().eq(1).first().text().replace(/\s/g, '');
                        if (val == currentValue && ((withdrawal || deposit) == "Offline")) {
                            //console.log(val);
                            goforit = false;
                        }
					if (val == currentValue ){// && (hourdays.indexOf('days') > -1 )){// || hourdays.indexOf('hours') > -1 )) {
							//goforit = false;
							//console.log('hourdays\n\n\n');
}

                    });
                } else {
                    console.log(error);
                }

                if (goforit == true && currentValue != "STU"&& currentValue != "GEN" && currentValue != "NIO" && currentValue != "CAS" && currentValue != "SMART"&& currentValue != "STV") {

                    ////console.log(Object.keys(data)[y + options['start']]);

                    console.log(currentValue);

                    //currentValue = "CAT";
                    //currentValue = "OMG";
                    ////console.log(currentValue);
                    //if (options['max'] == 2){
                    //currentValue = cells[0].value;


                    //}
                    // else {

                    cells[0].value = currentdo[x - 2];
                    cells[0].save();
                    //}

                    //currentValue = "MCO";
                    var doit = true;
                    if (currentValue != "CAT" && doit == true) {

                        //console.log(currentValue);
                        try {
                            var tokenAddr = tokendo[x - 2];
                            // sleep(1000);
                            //sleep(1000);
                            var url4 = 'https://api.hitbtc.com/api/1/public/' + currentValue + 'ETH/orderbook';
                            //console.log(url4);
                            //sleep(1060)
                            request.get(url4, {
                                json: true,
                                timeout: 13000
                            }, function(error, response, data4) {
                                ////console.log(data4);
                                var buyDone = false;
                                var sellDone = false;
                                try {
                                    if (data4['bids'].length == 0 || data4['asks'].length == 0) {

                                        buyDone = true;
                                        sellDone = true;
                                    }
                                    if (data4.code == -1121) {
                                        buyDone = true;
                                        sellDone = true;
                                    }
                                    var buyTotal = 0;
                                    var sellTotal = 0;
                                    //////console.log(buyTotal);
                                    //////console.log(sellTotal);

                                    while (buyDone == false) {
                                        for (var buys in data4['bids']) {
                                            buyTotal = buyTotal + (data4['bids'][buys][1] * data4['bids'][buys][0]);
                                            if (buys == data4['bids'].length) {
                                                buyDone = true;
                                                break;
                                                buyPrice = 0;

                                            }
                                            //////console.log(buyTotal);
                                            if (buyTotal >= threshold) {
                                                buyDone = true;
                                                buyPrice = data4['bids'][buys][0];
                                                //////console.log(buyPrice);

                                                cells[14].value = buyPrice.toString();
                                                cells[16].value = buyTotal.toString();
                                                cells[14].save();
                                                cells[16].save();

                                                //bps['hit'] = buyPrice;
                                                break;
                                            }
                                        }
                                    }
                                    while (sellDone == false) {
                                        for (var sells in data4['asks']) {
                                            if (sells == data4['asks'].length) {
                                                sellDone = true;
                                                break;
                                                sellPrice = 1000000;

                                            }
                                            sellTotal = sellTotal + (data4['asks'][sells][1] * data4['asks'][sells][0]);

                                            //////console.log(sellTotal);
                                            if (sellTotal >= threshold) {
                                                sellDone = true;
                                                sellPrice = data4['asks'][sells][0];
                                                ////console.log(sellPrice);
                                                cells[13].value = sellPrice.toString();
                                                cells[15].value = sellTotal.toString();
                                                cells[13].save();
                                                cells[15].save();
                                                //sps['hit'] = sellPrice;
                                                break;
                                            }
                                        }
                                    }
                                } catch (err) {
                                    if (err instanceof TypeError) {} else {
                                        console.log(err);
                                    }

                                    console.log(err)
                                }
                                rest(x, tokenAddr, cells, currentValue, threshold);
								
/* var url6 = 'https://api.etherdelta.com/orders/' + tokenAddr + '/0'; //sleep(1060);
            //console.log(url6);
                request.get(url6, {
                    json: true,
                    timeout: 43000
                }, function(error, response, data) {
                    ed(x, error, response, data, tokenAddr, cells, currentValue);

                }); */



                                //  cells[23].value = data['ETH_' + currentValue]['baseVolume'];
                                //	cells[23].save();


                            });
                        } catch (err) {
                            console.log(err);
                        }

                    } else {
                        running = false;
                        x = x + 1;
                        if (x >= options['max']) {
                            //console.log('rerun');
							x = options['start'];
							console.log('exiting...');
							process.exit();
                           /* setTimeout(function() {
                        //console.log(count11);
                        oulala123(x, sheet);
                    }, 5000); */
					
                        }
                    }
                } else {
                        x = x + 1;
                        if (x <= options['max']) {
                            setTimeout(function() {
                        //console.log(count11);
                        oulala123(x, sheet);
                    }, 5000);
					
                        } else {
							x = options['start'];
							console.log('exiting...');
							process.exit();
						}
                }
            });
            }catch (err) {
				x = options['start'];
				console.log('exiting...');
				process.exit();
            console.log(err);
        }
    });
}


function oulala() {
    // spreadsheet key is the long id in the sheets URL 
    doc.useServiceAccountAuth(creds, function lala() {
        doc.getInfo(function(err, info) {
            //////console.log('Loaded doc: '+info.title+' by '+info.author.email);
            sheet = info.worksheets[0];
            //console.log('sheet 1: ' + sheet.title + ' ' + sheet.rowCount + 'x' + sheet.colCount);



            // 1st request
            sheet.getCells({
                'min-row': options['start'],
                'max-row': options['max'],
                'return-empty': true
            }, function(err, cells) {
                if (cells) {
                    //console.log(err);
                    sheet.bulkUpdateCells(cells, function(result) {
                        if (err) {
                            //console.log(err);
                        }

                    });
                }
                var lineReader = require('readline').createInterface({
                    input: require('fs').createReadStream('decimals.csv')
                });
                var lc = 0;
                var currents = [];
                var tokens = [];
                lineReader.on('line', function(line) {
                    var arr = line.split(",");
                    currents[lc] = arr[0];
                    tokens[lc] = arr[1];
                    lc++;
                });
                setTimeout(function() {
                    var x = 0;
                    var count11 = 0;
                    ////console.log(currents[currentValue]);
                    var lalaurl = "https://api.idex.market/returnTicker";
                    request.get(lalaurl, {
                        json: true,
                        timeout: 13000
                    }, function(error, response, lala) {
                        for (var currentValue in currents) {
                            var doit = false;
                            //console.log(lala);
                            for (symbol in lala) {
                                ////console.log(lala['symbols'][symbol]['symbol']);
                                if ("ETH_" + currents[currentValue] == symbol) {
                                    //console.log(lala['symbols'][symbol]['symbol']);
                                    console.log(currents[currentValue] + "ETH");
                                    doit = true;
                                    currentdo[count11] = currents[currentValue];
                                    tokendo[count11] = tokens[x];
                                    count11++;
                                    console.log(count11);
                                }
                            }
                            x++;
                        }
                    });
                    setTimeout(function() {
                        //console.log(count11);
                        oulala123(options['start'], sheet);
                    }, 5000);
					
                }, 3000);
            });
        });
    });
}

oulala();
