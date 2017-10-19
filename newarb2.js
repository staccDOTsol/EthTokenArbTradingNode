
const commandLineArgs = require('command-line-args')
const optionDefinitions = [{
        name: 'pair',
        alias: 'p',
        type: String
    },
    {
        name: 'bidEx',
        type: String,
        alias: 'b'
    },
    {
        name: 'askEx',
        type: String,
        alias: 'a'
    }
]

var linecount = 0;
var tokens2 = [];
var decimals2 = [];
var currentValue2 = [];
var tokens = [];
var decimals = [];
var currentValue = [];
var count = 0;
var count2 = 0;
var lots = [];
var steps = [];
var precises =  {};

var isWin = /^win/.test(process.platform);
var isLin = /^linux/.test(process.platform);
if (isLin) {
    var creds = require('/root/googlesheet.json');
} else if (isWin) {
    var creds = require('D:\\Projects\\googlesheet.json');
}
var threshold = 0;
var GoogleSpreadsheet = require('google-spreadsheet');
var doc = new GoogleSpreadsheet('1gYMl9FKn-eGf5qIH7FlYm1Td1W2k8IPgUmEXbBJxtKA');
var sheet;
var request = require("request")
var cheerio = require('cheerio');
var math = require("mathjs");
var BigNumber = require("bignumber.js");
var crypto = require("crypto");
var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('decimals.csv')
});
lineReader.on('line', function(line) {
    if (line.indexOf('currentValue') == -1) {
        currentValue2[count2] = line.split(',')[0];
        decimals2[count2] = line.split(',')[2];
        tokens2[count2] = line.split(',')[1];
        ////console.log(line);
        count2++;
    }
});
var sleep = require('system-sleep');
sleep(3000);
var lalaurl = "https://api.hitbtc.com/api/1/public/symbols";
//console.log(lalaurl);
request.get(lalaurl, {
	json: true,
	timeout: 41500
}, function(error, response, lala) {
	if (error) {
		//sleep(5000);					
		//oulala123(currentValue, bidEx, askEx, tokenAddr);
	}
	////console.log(lala);
	for (var symbol in lala['symbols']) {
		for (var i in currentValue2) {
			if (currentValue2[i] + "ETH" == lala['symbols'][symbol]['symbol']) {

				currentValue[count] = currentValue2[i];
				decimals[count] = decimals2[i];
				tokens[count] = tokens2[i];
				lots[count] = lala['symbols'][symbol]['lot'];
				steps[count] = lala['symbols'][symbol]['step'];
				precises[currentValue2[i] + "ETH"] = (steps[count].toString().length - 2);
				count++;
			}
		}
	}
});
var hitKey = "";
var hitSecret = "";
var lineReader2 = require('readline').createInterface({
    input: require('fs').createReadStream("private_keys.pem")
});
var bittrexApi = "";
var bittrexSec = "";
var bApi = require('node-bittrex-api');
//sleep(5000);                     



lineReader2.on('line', function(line) {
    //console.log(line);
    if (linecount == 0) {
        user = line;
    } else if (linecount == 1) {
        privateKey = line;
    } else if (linecount == 2) {
        hitKey = line;
    } else if (linecount == 3) {
        hitSecret = line;
    } else if (linecount == 4) {
        pass = line;
    } else if (linecount == 5) {
        bittrexApi = line;
    } else if (linecount == 6) {
        bittrexSec = line;
		bApi.options({
		  'apikey' : bittrexApi,
		  'apisecret' : bittrexSec,
		  'verbose' : true,
		  'cleartext' : false
		});
		//bApi.withdraw({ currency : "SNT", quantity : 29, address : '0x86c5e934ee3ec5843269deda60f60e845ebe64a0' }, function( data, err ) {
		//												  //console.log( data );
		//												  //console.log( err );
														  
//});
    }
    linecount++;
});
const options = commandLineArgs(optionDefinitions);
var debug = false;
//const TradingApi = require('poloniex-api').tradingApi;
//const tradingApi = TradingApi.create("TD64OD82-BXRZEKI9-52TPPEI8-2R58RRZB", "9769540a1e0407d2b34cd83f6c73c6139adb28e33454d10d172c792190bf3deccc023aa5946c9d4e932e7c40f8a6aa4c1957c6d8fdd6e89831d3dbba11e478f0");
//const publicApi = require('poloniex-api').publicApi.create();
var Poloniex = require('poloniex.js');
var poloniex2 = new Poloniex('TD64OD82-BXRZEKI9-52TPPEI8-2R58RRZB', '9769540a1e0407d2b34cd83f6c73c6139adb28e33454d10d172c792190bf3deccc023aa5946c9d4e932e7c40f8a6aa4c1957c6d8fdd6e89831d3dbba11e478f0');

var sps = {};
var bps = {};
var bittrexDone = false;
var hitbtcDone = false;
var done = {};

	done['poloniex'] = {};

function poloniex(threshold, base, symbol) {
	if (base == "USDT"){
		threshold = threshold * 60; 
	}
	if (symbol == "BTC"){
		threshold = threshold * 21.27;
	}
    poloniex2.returnOrderBook(base, symbol, function(err, data) {
    if (err){
		////console.log(err);
		if ((err.toString().indexOf('socket hang up') != -1) || (err.toString().indexOf('ETIMEDOUT') != -1)){
			//console.log('rerun polo');
			poloniex(threshold, base, symbol);
		}
		}
			////console.log(data);
			////console.log('poloniex ' + base + symbol);
			var buyDone = false;
			var sellDone = false;
	var buyPrice = 0;
	var sellPrice = 1000000;
			var buyTotal = 0;
			var sellTotal = 0;
			try {
	done['poloniex'][base + symbol] = false;
				while (buyDone == false) {
					for (var buys in data['bids']) {
						buyTotal = buyTotal + (data['bids'][buys][0] * data['bids'][buys][1]);
						if (buys == data['bids'].length) {
							buyDone = true;
							buyPrice = 0;
							bps[base + symbol]['poloniex'] = buyPrice;
							break;

						}
						if (buyTotal >= threshold) {
							buyDone = true;
							buyPrice = data['bids'][buys][0];
							////console.log('buyprice: ' + buyPrice);
							////console.log('buytotal: ' + buyTotal);
					 
							bps[base + symbol]['poloniex'] = buyPrice;
							break;
						}
					}
					break;
				}
			} catch(err){//console.log(err);}
				////console.log(data);
					////console.log(data['asks']);
					try{
				while (sellDone == false) {
					for (var sells in data['asks']) {
						////console.log(data['asks']);
						if (sells == data['asks'].length) {
							sellDone = true;
							////console.log('polo length');
							sellPrice = 1000000;
							sps[base + symbol]['poloniex'] = sellPrice;
							break;

						}
						sellTotal = sellTotal + (data['asks'][sells][0] * data['asks'][sells][1]);

						if (sellTotal >= threshold) {
							sellDone = true;
							sellPrice = data['asks'][sells][0];
							////console.log('sellprice: ' + sellPrice);
							////console.log('selltotal: ' + sellTotal);
							sps[base + symbol]['poloniex'] = sellPrice;
							break;
						}
					}
					break;
				}
			} catch (err) {
				if (err instanceof TypeError) {} else {
					//console.log(err);
				} 
		done['poloniex'][base + symbol] = true;
			}
		}
});
}
	done['hitbtc'] = {};
	//bidex done
function hitbtc(threshold, basesymbol, askOrBid) {
	if (askOrBid == 'b'){
		
		var bsTemp = basesymbol;
		var symbol = basesymbol.substring(3,basesymbol.length);
		bsTemp = bsTemp.substring(0,3);
		basesymbol = basesymbol.substring(3,basesymbol.length) + bsTemp;
		
		var base = bsTemp;
		var uri = '/api/2/account/balance';
            var auth = "Basic " + new Buffer(hitKey + ":" + hitSecret).toString("base64");
            //console.log(uri);
            request({
                url: 'https://api.hitbtc.com' + uri, //
                method: 'GET',
                headers: {
                    "Authorization": auth
                },
                json: true,
            }, (error, response, bodycurrency) => {
                ////console.log(body);
                for (var currency in bodycurrency) {
                    if (bodycurrency[currency]['currency'] == symbol) {

                        qty = (parseFloat(bodycurrency[currency]['available']));
                        if (qty > 0.01) {
                            var txObject1 = {
                                currency: symbol,
                                amount: qty,
                                type: "bankToExchange"
                            };
                            //console.log(txObject1);
                            var uri = '/api/2/account/transfer';
                            var options = {
                                url: 'https://api.hitbtc.com' + uri,
                                'json': true,
                                'method': 'POST',
                                headers: {
                                    "Authorization": auth
                                },
                                'body': txObject1

                            };
                            request(options, function(error, response, body) {
                            });
                        }
                    } else {
                    }
                }
            });
		//console.log('hitbtc: ' + basesymbol);
		//console.log('hitbtc: ' + base);
		//console.log('hitbtc: ' + symbol);
		var buyDone = false;
		var buyPrice = 0;
		var sellPrice = 1000000;
		var sellDone = false;
		var buyTotal = 0;
		var sellTotal = 0;
		var url = 'https://api.hitbtc.com/api/1/public/' + basesymbol + '/orderbook';
		//////console.log(url);
		//sleep(1060)
		request.get(url, {
			json: true,
			timeout: 22000
		}, function(error, response, data) {if (error){////console.log(error);
				hitbtc(threshold, base, symbol);
			}
			////console.log('hitbtc ' + base + symbol);
			sellDone = false;
			//try {
		done['hitbtc'][base + symbol] = false; /*
				while (sellDone == false) {
					for (var sells in data['asks']) {
						if (sells == (data['asks'].length - 1)) {
							sellDone = true;
							//////console.log('sells length');
							sellPrice = 1000000;
							sps[base + symbol]['hitbtc'] = sellPrice;
							break;

						}
						sellTotal = sellTotal + (data['asks'][sells][1] * data['asks'][sells][0]);
						//console.log('hitbtc current sell price: ' + data['asks'][sells][0]);
						//console.log('hitbtc selltotal: ' + sellTotal);
						if (sellTotal >= threshold) {
							//console.log('threshold: ' + threshold);
							sellDone = true;
							sellPrice = data['asks'][sells][0];
							sps[base + symbol]['hitbtc'] = sellPrice;
							break;
						}
					}
					sellDone = true;
					break;
				}
			} catch (err) {
				//////console.log(err);
			} */
			try {
				while (buyDone == false) {
					for (var buys in data['bids']) {
						if (buys == (data['bids'].length - 1)) {
							buyDone = true;
							//////console.log('buys length');
							buyPrice = 0;
							bps[base + symbol]['hitbtc'] = buyPrice;
							break;

						}
						buyTotal = buyTotal + (data['bids'][buys][1] * data['bids'][buys][0]);

						//////console.log(sellTotal);
						if (buyTotal >= threshold * data['bids'][buys][0]) {
							//////console.log('threshold');
							buyDone = true;
							buyPrice = data['bids'][buys][0];
							//console.log('hitbtc sellprice: ' + buyPrice);
							//console.log('hitbtc selltotal: ' + buyTotal);
							bps[base + symbol]['hitbtc'] = buyPrice;
							break;
						}
					}
					buyDone = true;
					break;
				}
			} catch (err) {
			   // //////console.log(err);
			}
			done['hitbtc'][base + symbol] = true;
		});
	}
}

	done['bittrex'] = {};
	//askex done
function bittrex(threshold, basesymbol, askOrBid) {
	if (askOrBid == 'a'){
		var bsTemp = basesymbol;
		var symbol = basesymbol.substring(3,basesymbol.length);
		bsTemp = bsTemp.substring(0,3);
		basesymbol = bsTemp + "-" + basesymbol.substring(3,basesymbol.length);
		var base = bsTemp;
		//console.log('bittrex: ' + basesymbol);
		//console.log('bittrex: ' + base);
		//console.log('bittrex: ' + symbol);
		var url = "https://bittrex.com/api/v1.1/public/getorderbook?market=" + base + "-" + symbol + "&type=both";
		//////console.log(url);
		request.get(url, {
					json: true,
					timeout: 22000
				}, function(error, response, data) {if (error){////console.log(error);
				bittrex(threshold, base, symbol);
			}
					////console.log('bittrex ' + base + symbol);
					var buyDone = false;
					var sellDone = false;
					var buyTotal = 0;
					var sellTotal = 0;
		var buyPrice = 0;
		var sellPrice = 1000000; 
				//	try {
		done['bittrex'][base + symbol] = false;
					/*	while (buyDone == false) {
							for (var buys in data['result']['buy']) {
								buyTotal = buyTotal + (data['result']['buy'][buys]['Quantity'] * data['result']['buy'][buys]['Rate']);
								if (buys == data['result']['buy'].length) {
									buyDone = true;
									buyPrice = 0;
									bps[base + symbol]['bittrex'] = buyPrice;
									break;

								}
								if (buyTotal >= threshold) {
									buyDone = true;
									buyPrice = data['result']['buy'][buys]['Rate'];
									//////console.log('buyprice: ' + buyPrice);
									//////console.log('buytotal: ' + buyTotal);
							 
									bps[base + symbol]['bittrex'] = buyPrice;
									break;
								}
							}
							break;
					}}catch (err) {
				//////console.log(err);
			} */
			try {
				while (sellDone == false) {
					for (var sells in data['result']['sell']) {
						if (sells == data['result']['sell'].length) {
							sellDone = true;
							break;
							sellPrice = 1000000;
							sps[base + symbol]['bittrex'] = sellPrice;

						}
						sellTotal = sellTotal + (data['result']['sell'][sells]['Quantity'] * data['result']['sell'][sells]['Rate']);

						if (sellTotal >= threshold * data['result']['sell'][sells]['Rate']) {
							sellDone = true;
							sellPrice = data['result']['sell'][sells]['Rate'];
							//console.log('bittrex sellprice: ' + sellPrice);
							//console.log('bittrex selltotal: ' + sellTotal);
							sps[base + symbol]['bittrex'] = sellPrice;
							break;
						}
					}
					break;
				}
			} catch (err) {
				if (err instanceof TypeError) {} else {
					//////console.log(err);
				} 
			}
		done['bittrex'][base + symbol] = true;
		});
	}
}

	done['kraken'] = {};
done['liqui'] = {};
done['gatecoin'] = {};
done['bitstamp'] = {};
done['yobit'] = {};
function yobit(threshold, base, symbol){
	base = base.replace("USDT", "USD");
	symbol = symbol.replace("USDT", "USD");
	if (base == "USDT"){
		threshold = threshold * 60; 
	}
	if (symbol == "BTC"){
		threshold = threshold * 21.27;
	}
	var url = "https://yobit.net/api/3/depth/" + symbol.toLowerCase() + "_" + base.toLowerCase();
		
		//console.log(url);
						sleep(1);
request.get(url, {json: true, timeout: 80000}, function(error, response, data) {
			//////////console.log(data5);
					//console.log(data);
			var buyDone = false;
                var sellDone = false;
                var buyTotal = 0;
                var sellTotal = 0;
	var buyPrice = 0;
	var sellPrice = 1000000;
                try {
	done['yobit'][base + symbol] = false;
                    while (buyDone == false) {
                        for (var buys in data[symbol.toLowerCase() + "_" + base.toLowerCase()]['bids']) {
                            buyTotal = buyTotal + (data[symbol.toLowerCase() + "_" + base.toLowerCase()]['bids'][buys][0] * data[symbol.toLowerCase() + "_" + base.toLowerCase()]['bids'][buys][1]);
							if (buys == data[symbol.toLowerCase() + "_" + base.toLowerCase()]['bids'].length){
				             buyDone = true;
                                buyDone = true;
                                buyPrice = 0;
                                bps[base + symbol]['yobit'] = buyPrice;
                                break;

                            }
                            if (buyTotal >= threshold) {
                                buyDone = true;
                                buyPrice = data[symbol.toLowerCase() + "_" + base.toLowerCase()]['bids'][buys][0];
                                //console.log('buyprice yobit: ' + buyPrice);
                                //console.log('buytotal yobit: ' + buyTotal);
                         
                                bps[base + symbol]['yobit'] = buyPrice;
                                break;
                            }
                        }
                        break;
				}}catch (err) {
            //console.log(err);
        }
        try {
                    while (sellDone == false) {
                        for (var sells in data[symbol.toLowerCase() + "_" + base.toLowerCase()]['asks']) {
                            if (sells == data[symbol.toLowerCase() + "_" + base.toLowerCase()]['asks'].length) {
                                sellDone = true;
                                sellPrice = 1000000;
                                sps[base + symbol]['yobit'] = sellPrice;
                                break;

                            }
                            sellTotal = sellTotal + (data[symbol.toLowerCase() + "_" + base.toLowerCase()]['asks'][sells][0] * data[symbol.toLowerCase() + "_" + base.toLowerCase()]['asks'][sells][1]);
							//console.log(sellTotal);
                            if (sellTotal >= threshold) {
                                sellDone = true;
                                sellPrice = data[symbol.toLowerCase() + "_" + base.toLowerCase()]['asks'][0];
                               // //console.log('sellprice: ' + sellPrice);
                                ////console.log('selltotal: ' + sellTotal);
                                sps[base + symbol]['yobit'] = sellPrice;
                                break;
                            }
                        }
                        break;
                    }
                } catch (err) {
                    if (err instanceof TypeError) {} else {
                        //console.log(err);
                    } 
                }
			done['yobit'][base + symbol] = true;
		});
			
}

function bitstamp(threshold, base, symbol){
	base = base.replace("USDT", "USD");
	symbol = symbol.replace("USDT", "USD");
	if (base == "USDT"){
		threshold = threshold * 60; 
	}
	if (symbol == "BTC"){
		threshold = threshold * 21.27;
	}
	var url = "https://www.bitstamp.net/api/v2/order_book/" + symbol.toLowerCase() + base.toLowerCase();
		
		////console.log(url8);
						sleep(1);
request.get(url, {json: true, timeout: 80000}, function(error, response, data) {
			//////////console.log(data5);
			var buyDone = false;
                var sellDone = false;
                var buyTotal = 0;
                var sellTotal = 0;
	var buyPrice = 0;
	var sellPrice = 1000000;
                try {
	done['bitstamp'][base + symbol] = false;
                    while (buyDone == false) {
                        for (var buys in data['bids']) {
                            buyTotal = buyTotal + (data['bids'][buys][0] * data['bids'][buys][1]);
							if (buys == data['bids'].length){
				             buyDone = true;
                                buyDone = true;
                                buyPrice = 0;
                                bps[base + symbol]['bitstamp'] = buyPrice;
                                break;

                            }
                            if (buyTotal >= threshold) {
                                buyDone = true;
                                buyPrice = data['bids'][buys][0];
                                //console.log('buyprice bitstamp: ' + buyPrice);
                                //console.log('buytotal bitstamp: ' + buyTotal);
                         
                                bps[base + symbol]['bitstamp'] = buyPrice;
                                break;
                            }
                        }
                        break;
				}}catch (err) {
            //////console.log(err);
        }
        try {
                    while (sellDone == false) {
                        for (var sells in data['asks']) {
                            if (sells == data['asks'].length) {
                                sellDone = true;
                                sellPrice = 1000000;
                                sps[base + symbol]['bitstamp'] = sellPrice;
                                break;

                            }
                            sellTotal = sellTotal + (data['asks'][sells][0] * data['asks'][sells][1]);
							//console.log(sellTotal);
                            if (sellTotal >= threshold) {
                                sellDone = true;
                                sellPrice = data['asks'][0];
                               // //console.log('sellprice: ' + sellPrice);
                                ////console.log('selltotal: ' + sellTotal);
                                sps[base + symbol]['bitstamp'] = sellPrice;
                                break;
                            }
                        }
                        break;
                    }
                } catch (err) {
                    if (err instanceof TypeError) {} else {
                        //////console.log(err);
                    } 
                }
			done['bitstamp'][base + symbol] = true;
		
		});
			
}
function gatecoin(threshold, base, symbol){
	base = base.replace("USDT", "USD");
	symbol = symbol.replace("USDT", "USD");
	if (base == "USDT"){
		threshold = threshold * 60; 
	}
	if (symbol == "BTC"){
		threshold = threshold * 21.27;
	}
	var url = "https://api.gatecoin.com/Public/MarketDepth/" + symbol + base;
		
		////console.log(url8);
						sleep(1);
request.get(url, {json: true, timeout: 80000}, function(error, response, data) {
			//////////console.log(data5);
			var buyDone = false;
                var sellDone = false;
                var buyTotal = 0;
                var sellTotal = 0;
	var buyPrice = 0;
	var sellPrice = 1000000;
                try {
	done['gatecoin'][base + symbol] = false;
                    while (buyDone == false) {
                        for (var buys in data['bids']) {
                            buyTotal = buyTotal + (data['bids'][buys]['price'] * data['bids'][buys]['volume']);
							if (buys == data['bids'].length){
				             buyDone = true;
                                buyDone = true;
                                buyPrice = 0;
                                bps[base + symbol]['gatecoin'] = buyPrice;
                                break;

                            }
                            if (buyTotal >= threshold) {
                                buyDone = true;
                                buyPrice = data['bids'][buys]['price'];
                                //console.log('buyprice gatecoin: ' + buyPrice);
                                //console.log('buytotal gatecoin: ' + buyTotal);
                         
                                bps[base + symbol]['gatecoin'] = buyPrice;
                                break;
                            }
                        }
                        break;
				}}catch (err) {
            //////console.log(err);
        }
        try {
                    while (sellDone == false) {
                        for (var sells in data['asks']) {
                            if (sells == data['asks'].length) {
                                sellDone = true;
                                sellPrice = 1000000;
                                sps[base + symbol]['gatecoin'] = sellPrice;
                                break;

                            }
                            sellTotal = sellTotal + (data['asks'][sells]['price'] * data['asks'][sells]['volume']);
							//console.log(sellTotal);
                            if (sellTotal >= threshold) {
                                sellDone = true;
                                sellPrice = data['asks']['price'];
                               // //console.log('sellprice: ' + sellPrice);
                                ////console.log('selltotal: ' + sellTotal);
                                sps[base + symbol]['gatecoin'] = sellPrice;
                                break;
                            }
                        }
                        break;
                    }
                } catch (err) {
                    if (err instanceof TypeError) {} else {
                        //////console.log(err);
                    } 
                }
			done['gatecoin'][base + symbol] = true;
		
		});
			
}
function liqui(threshold, base, symbol){
	if (base == "USDT"){
		threshold = threshold * 60; 
	}
	if (symbol == "BTC"){
		threshold = threshold * 21.27;
	}
	base = base.replace("USDT", "USD");
	symbol = symbol.replace("USDT", "USD");
    var url = "https://api.liqui.io/api/3/depth/" + symbol.toLowerCase() + "_" + base.toLowerCase();
    //////console.log(url);
    request.get(url, {
                json: true,
                timeout: 22000
            }, function(error, response, data) {if (error){////console.log(error);
			if ((error.toString().indexOf('socket hang up') != -1) || (error.toString().indexOf('ECONNRESET') != -1)){
				sleep(1000);
			liqui(threshold, base, symbol);
			}
		}else {
				////console.log(Object.keys(data['result'])[0]);
				////console.log('kraken ' + base + symbol);
                var buyDone = false;
                var sellDone = false;
                var buyTotal = 0;
                var sellTotal = 0;
	var buyPrice = 0;
	var sellPrice = 1000000;
                try {
	done['liqui'][base + symbol] = false;
                    while (buyDone == false) {
                        for (var buys in data[symbol.toLowerCase() + "_" + base.toLowerCase()]['bids']) {
                            buyTotal = buyTotal + (data[symbol.toLowerCase() + "_" + base.toLowerCase()]['bids'][buys][0] * data[symbol.toLowerCase() + "_" + base.toLowerCase()]['bids'][buys][1]);
							if (buys == data[symbol.toLowerCase() + "_" + base.toLowerCase()]['bids'].length){
				             buyDone = true;
                                buyDone = true;
                                buyPrice = 0;
                                bps[base + symbol]['liqui'] = buyPrice;
                                break;

                            }
                            if (buyTotal >= threshold) {
                                buyDone = true;
                                buyPrice = data[symbol.toLowerCase() + "_" + base.toLowerCase()]['bids'][buys][0];
                                //console.log('buyprice liqui: ' + buyPrice);
                                //console.log('buytotal liqui: ' + buyTotal);
                         
                                bps[base + symbol]['liqui'] = buyPrice;
                                break;
                            }
                        }
                        break;
				}}catch (err) {
            //////console.log(err);
        }
        try {
                    while (sellDone == false) {
                        for (var sells in data[symbol.toLowerCase() + "_" + base.toLowerCase()]['asks']) {
                            if (sells == data[symbol.toLowerCase() + "_" + base.toLowerCase()]['asks'].length) {
                                sellDone = true;
                                sellPrice = 1000000;
                                sps[base + symbol]['liqui'] = sellPrice;
                                break;

                            }
                            sellTotal = sellTotal + (data[symbol.toLowerCase() + "_" + base.toLowerCase()]['asks'][sells][0] * data[symbol.toLowerCase() + "_" + base.toLowerCase()]['asks'][sells][1]);
							//console.log(sellTotal);
                            if (sellTotal >= threshold) {
                                sellDone = true;
                                sellPrice = data[symbol.toLowerCase() + "_" + base.toLowerCase()]['asks'][sells][0];
                               // //console.log('sellprice: ' + sellPrice);
                                ////console.log('selltotal: ' + sellTotal);
                                sps[base + symbol]['liqui'] = sellPrice;
                                break;
                            }
                        }
                        break;
                    }
                } catch (err) {
                    if (err instanceof TypeError) {} else {
                        //////console.log(err);
                    } 
                }
			done['liqui'][base + symbol] = true;
		}
		});
}

function kraken(threshold, base, symbol) {
	if (base == "USDT"){
		threshold = threshold * 60; 
	}
	if (symbol == "BTC"){
		threshold = threshold * 21.27;
	}
	base = base.replace("BTC", "XBT");
	base = base.replace("USDT", "USD");
	symbol = symbol.replace("BTC", "XBT");
	symbol = symbol.replace("USDT", "USD");
    var url = "https://api.kraken.com/0/public/Depth?pair=" + symbol + base;
    //////console.log(url);
    request.get(url, {
                json: true,
                timeout: 22000
            }, function(error, response, data) {if (error){////console.log(error);
			if ((error.toString().indexOf('socket hang up') != -1) || (error.toString().indexOf('ECONNRESET') != -1)){
				sleep(1000);
			kraken(threshold, base, symbol);
			}
		}else {
				////console.log(Object.keys(data['result'])[0]);
				////console.log('kraken ' + base + symbol);
                var buyDone = false;
                var sellDone = false;
                var buyTotal = 0;
                var sellTotal = 0;
	var buyPrice = 0;
	var sellPrice = 1000000;
                try {
	done['kraken'][base + symbol] = false;
                    while (buyDone == false) {
                        for (var buys in data['result'][Object.keys(data['result'])[0]]['bids']) {
                            buyTotal = buyTotal + (data['result'][Object.keys(data['result'])[0]]['bids'][buys][1] * data['result'][Object.keys(data['result'])[0]]['bids'][buys][0]);
                            //console.log(buyTotal);
							if (buys == data['result'][Object.keys(data['result'])[0]]['bids'].length) {
                                buyDone = true;
                                buyPrice = 0;
                                bps[base + symbol]['kraken'] = buyPrice;
                                break;

                            }
                            if (buyTotal >= threshold) {
                                buyDone = true;
                                buyPrice = data['result'][Object.keys(data['result'])[0]]['bids'][buys][0];
                                ////console.log('buyprice: ' + buyPrice);
                                ////console.log('buytotal: ' + buyTotal);
                         
                                bps[base + symbol]['kraken'] = buyPrice;
                                break;
                            }
                        }
                        break;
				}}catch (err) {
            //////console.log(err);
        }
        try {
                    while (sellDone == false) {
                        for (var sells in data['result'][Object.keys(data['result'])[0]]['asks']) {
                            if (sells == data['result'][Object.keys(data['result'])[0]]['asks'].length) {
                                sellDone = true;
                                sellPrice = 1000000;
                                sps[base + symbol]['kraken'] = sellPrice;
                                break;

                            }
                            sellTotal = sellTotal + (data['result'][Object.keys(data['result'])[0]]['asks'][sells][0] * data['result'][Object.keys(data['result'])[0]]['asks'][sells][1]);
							//console.log(sellTotal);
                            if (sellTotal >= threshold) {
                                sellDone = true;
                                sellPrice = data['result'][Object.keys(data['result'])[0]]['asks'][sells][0];
                               // //console.log('sellprice: ' + sellPrice);
                                ////console.log('selltotal: ' + sellTotal);
                                sps[base + symbol]['kraken'] = sellPrice;
                                break;
                            }
                        }
                        break;
                    }
                } catch (err) {
                    if (err instanceof TypeError) {} else {
                        //////console.log(err);
                    } 
                }
			done['kraken'][base + symbol] = true;
		}
		});
}

function run(){
	var url = "https://bittrex.com/api/v1.1/public/getmarkets";
    
    request.get(url, {
                json: true,
                timeout: 8000
            }, function(error, response, data) {
				if (error){////console.log(error);
					////console.log(error);
					//////console.log(result);
					sleep(10000);
					run();
				}
				if (debug == false){
					//for (result in data['result']){
						sps[options['pair']] = {};
						bps[options['pair']] = {};
						var basesymbol = options['pair'];
						//sleep((Math.random() * 1400) + 100);
						// only using bidEx = hitbtc, askEx = bittrex
						
									var uri = '/api/2/trading/balance';
									//console.log(uri);
									var auth = "Basic " + new Buffer(hitKey + ":" + hitSecret).toString("base64");
									request({
										url: 'https://api.hitbtc.com' + uri, //
										method: 'GET',
										headers: {
											"Authorization": auth
										},
										json: true,
									}, (error, response, body) => {
										for (var currency in body) {
											if (body[currency]['currency'] == basesymbol.substring(3, basesymbol.length)) {
												//console.log(body[currency]);
												var threshold = (parseFloat(body[currency]['available'])); // TODO Fix to .99
												//console.log('threshold! ' + threshold);
												
												
											}
										}
						if (options['bidEx'] == 'gatecoin'){
							gatecoin(threshold, options['pair'], 'b');
							done['gatecoin'][options['pair']] == false;
						}
						if (options['askEx'] == 'gatecoin'){
							gatecoin(threshold, options['pair'], 'a');
							done['gatecoin'][options['pair']] == false;
						}
						
						if (options['bidEx'] == 'bitstamp'){
							bitstamp(threshold, options['pair'], 'b');
							done['bitstamp'][options['pair']] == false;
						}
						if (options['askEx'] == 'bitstamp'){
							bitstamp(threshold, options['pair'], 'a');
							done['bitstamp'][options['pair']] == false;
						}
						if (options['bidEx'] == 'yobit'){
							yobit(threshold, options['pair'], 'b');
							done['yobit'][options['pair']] == false;
						}
						if (options['askEx'] == 'yobit'){
							yobit(threshold, options['pair'], 'a');
							done['yobit'][options['pair']] == false;
						}
						if (options['bidEx'] == 'liqui'){
							liqui(threshold, options['pair'], 'b');
							done['liqui'][options['pair']] == false;
						}
						if (options['askEx'] == 'liqui'){
							liqui(threshold, options['pair'], 'a');
							done['liqui'][options['pair']] == false;
						}
						if (options['bidEx'] == 'hitbtc'){
							hitbtc(threshold, options['pair'], 'b');
							done['hitbtc'][options['pair']] == false;
						}
						if (options['askEx'] == 'hitbtc'){
							hitbtc(threshold, options['pair'], 'a');
							done['hitbtc'][options['pair']] == false;
						}
						if (options['bidEx'] == 'bittrex'){
							bittrex(threshold, options['pair'], 'b');
							done['bittrex'][options['pair']] == false;
						}
						if (options['askEx'] == 'bittrex'){
							bittrex(threshold, options['pair'], 'a');
							done['bittrex'][options['pair']] == false;
						}
						if (options['bidEx'] == 'poloniex'){
							poloniex(threshold, options['pair'], 'b');
							done['poloniex'][options['pair']] == false;
						}
						if (options['askEx'] == 'poloniex'){
							poloniex(threshold, options['pair'], 'a');
							done['poloniex'][options['pair']] == false;
						}
						if (options['bidEx'] == 'kraken'){
							kraken(threshold, options['pair'], 'b');
							done['kraken'][options['pair']] == false;
						}
						if (options['askEx'] == 'kraken'){
							kraken(threshold, options['pair'], 'a');
							done['kraken'][options['pair']] == false;
						}//}
									});
				}
				else {
					sps['BTC' + 'ETH'] = {};
					bps['BTC' + 'ETH'] = {};
					yobit(threshold, 'BTC', 'ETH');
					bitstamp(threshold, 'BTC', 'ETH');
					gatecoin(threshold, 'BTC', 'ETH');
					liqui(threshold,'BTC', 'ETH');
					hitbtc(threshold, 'BTC', 'ETH');
					bittrex(threshold, 'BTC', 'ETH');
					poloniex(threshold, 'BTC', 'ETH');
					kraken(threshold,'BTC', 'ETH');

				}
			});
}
var goAgain = true;
setInterval(function(){ 
//console.log('check dones');
var go = {};
for (exchange in done){
	go[exchange] = true;
	for (basesymbol in done[exchange]){
		//////console.log(done[exchange][basesymbol]);
		if (done[exchange][basesymbol] == false){
			go[exchange] = false;
		}
	}
}
var goYes = true;
for (exchange in go){
	////console.log(exchange);
	////console.log(go[exchange]);
	if (go[exchange] == false){
		goYes = false;
	}
}
if (goYes == true){
	if (goAgain == true){
		goAgain = false;
		doc.useServiceAccountAuth(creds, function lala(){
			doc.getInfo(function(err, info) {
				//////console.log('Loaded doc: '+info.title+' by '+info.author.email);
				sheet = info.worksheets[2];
				for (exchange in go){
					go[exchange] = false;
				}
				for (exchange in done){
					for (basesymbol in done[exchange]){
						done[exchange][basesymbol] = false;
					}
				}
				var winSp = {};//1000000000000000;
				var winBp = {};//0;
				var winExBp = {};
				var winExSp = {};
				for (basesymbol in sps){
					//////console.log('sps ' + basesymbol);
					winSp[basesymbol] = 1000000000000000;
					winExSp[basesymbol] = "";
					for (exchange in sps[basesymbol]){
						if (sps[basesymbol][exchange] <= winSp[basesymbol] && sps[basesymbol][exchange] != 1000000 && sps[basesymbol][exchange] != 0){
							winSp[basesymbol] = sps[basesymbol][exchange];
							winExSp[basesymbol] = exchange;
						}
					}
					//////console.log('winsp: ' + winSp[basesymbol]);
				}	
				for (basesymbol in bps){
					//////console.log('bps ' + basesymbol);
					winBp[basesymbol] = 0;
					winExBp[basesymbol] = "";
					for (exchange in bps[basesymbol]){
						//console.log('bps exchange: ' + exchange);
							//console.log(basesymbol);
						if (bps[basesymbol][exchange] >= winBp[basesymbol] && bps[basesymbol][exchange] != 1000000 && bps[basesymbol][exchange] != 0){
							winBp[basesymbol] = bps[basesymbol][exchange];
							winExBp[basesymbol] = exchange;
						}
							//console.log(winBp[basesymbol]);
					}
					//////console.log('winbp: ' + winBp[basesymbol]);
				}	
				var arb = {};
				for (basesymbol in bps){
					
					for (basesymbol2 in sps){
						if (basesymbol == basesymbol2){
							
							if (winSp[basesymbol2] != 10 && winBp[basesymbol] != 0 && winSp[basesymbol2] != 1 && winBp[basesymbol] != 1){
								var fee = 0.5;
								var uri = '/api/2/trading/balance';
									//console.log(uri);
									var auth = "Basic " + new Buffer(hitKey + ":" + hitSecret).toString("base64");
									request({
										url: 'https://api.hitbtc.com' + uri, //
										method: 'GET',
										headers: {
											"Authorization": auth
										},
										json: true,
									}, (error, response, body) => {
										for (var currency in body) {
											if (body[currency]['currency'] == basesymbol.substring(3, basesymbol.length)) {
												//console.log(body[currency]);
												var qty = (parseFloat(body[currency]['available'])).toFixed(precises[basesymbol]); // TODO Fix to .99
												//console.log('qty! ' + qty);
												if (qty >= 0.001) {
													/*dodeposit = true;
													dodeposit2 = true;
													dosenditback = true; */
												}
												threshold = parseFloat(qty); // / checker; // / 10;
												if (threshold == 0){
													threshold = 0.01;
												}
												if (debug == true) { /*
													threshold = .1 * checker;
													//console.log('debug threshold: ' + threshold + ', modifier: ' + checker);
												    */
												}
												console.log(basesymbol);
												console.log('qty: ' + qty);
												console.log('price: ' + winBp[basesymbol]);
									fee = (0.00215 / (parseFloat(winBp[basesymbol]) * qty)) + 0.0025;
								console.log('fee: ' + fee);
								arb[basesymbol] = (-1 * (1 - (winBp[basesymbol]/winSp[basesymbol2]))) - fee;
								console.log('arb: ' + arb[basesymbol]);
							////console.log(winExBp[basesymbol]);
							////console.log(winExSp[basesymbol]);
								if (arb[basesymbol] > .00001 && arb[basesymbol] <= 300){
									//console.log('arb ' + basesymbol + " " + basesymbol2 + ": " + arb[basesymbol]);
									var dateTime = require('node-datetime');
									var dt = dateTime.create();
									var formatted = dt.format('Y-m-d H:M:S');
									////console.log(formatted);
									console.log('arb arb! ' + arb[basesymbol] + ' ' + basesymbol + ' winsp: ' + winExSp[basesymbol] + ' winbp: ' + winExBp[basesymbol]);
									
									try{
									
												if (threshold >= 0.02){
													if (basesymbol.startsWith('USDTBTC')){
														sheet.addRow({'time':formatted, 'ticker': basesymbol, 'bid': winBp[basesymbol], 'ask': winSp[basesymbol2], 'arb with fee': arb[basesymbol], 'bid ex': winExBp[basesymbol], 'ask ex': winExSp[basesymbol], 'base threshold': threshold * 60 * 21.27}, function (err, row){ });
														
													}
													
													else if (basesymbol.startsWith('USDT')){
														sheet.addRow({'time':formatted, 'ticker': basesymbol, 'bid': winBp[basesymbol], 'ask': winSp[basesymbol2], 'arb with fee': arb[basesymbol], 'bid ex': winExBp[basesymbol], 'ask ex': winExSp[basesymbol], 'base threshold': threshold * 60}, function (err, row){ });
														
													}
													else{
														sheet.addRow({'time':formatted, 'ticker': basesymbol, 'bid': winBp[basesymbol], 'ask': winSp[basesymbol2], 'arb with fee': arb[basesymbol], 'bid ex': winExBp[basesymbol], 'ask ex': winExSp[basesymbol], 'base threshold': threshold}, function (err, row){ });
													}
													try {
														var auth = "Basic " + new Buffer(hitKey + ":" + hitSecret).toString("base64");
														var n = require('nonce')();
														var bsTemp = basesymbol;
														var symbol = basesymbol.substring(3,basesymbol.length);
														bsTemp = bsTemp.substring(0,3);
														const orderObject = {
															clientOrderId: n().toString(),
															symbol: symbol + bsTemp,
															side: "sell",
															price: parseFloat(winBp[basesymbol]),
															quantity: qty
														};
														//console.log(orderObject);
														var uri = '/api/2/order';
														var options = {
															url: 'https://api.hitbtc.com' + uri,
															'json': true,
															'method': 'POST',
															headers: {
																"Authorization": auth
															},
															'body': orderObject

														};
													request(options, function(error, response, body) {
														//sleep(4000);
														//console.log (body);
													});
													} catch (err) {
														//console.log(err);
													}
													//https://bittrex.com/api/v1.1/market/buylimit?apikey=API_KEY&market=BTC-LTC&quantity=1.2&rate=1.3    
													var bsTemp = basesymbol;
													var symbol = basesymbol.substring(3,basesymbol.length);
													bsTemp = bsTemp.substring(0,3);
													bApi.tradebuy({
													  MarketName: bsTemp + "-" + basesymbol.substring(3,basesymbol.length),
													  OrderType: 'LIMIT',
													  Quantity: qty,
													  Rate: winSp[basesymbol],
													  TimeInEffect: 'IMMEDIATE_OR_CANCEL', // supported options are 'IMMEDIATE_OR_CANCEL', 'GOOD_TIL_CANCELLED', 'FILL_OR_KILL'
													  ConditionType: 'NONE', // supported options are 'NONE', 'GREATER_THAN', 'LESS_THAN'
													  Target: 0, // used in conjunction with ConditionType
													}, function( data, err ) {
													  //console.log( data );
													  //console.log( err );
														var uri = '/api/2/account/crypto/address/' + basesymbol.substring(3,basesymbol.length);
														var options = {
															url: 'https://api.hitbtc.com' + uri,
															'json': true,
															'method': 'GET',
															headers: {
																"Authorization": auth
															}

														};
													request(options, function(error, response, body) {
														//sleep(4000);
														//console.log (body);
														bApi.withdraw({ currency : basesymbol.substring(3,basesymbol.length), quantity : qty, address : body['address'] }, function( data, err ) {
														  //console.log( data );
														  //console.log( err );
														  
														  sleep(2000);
														  var uri = '/api/2/trading/balance';
															//console.log(uri);
															request({
																url: 'https://api.hitbtc.com' + uri, //
																method: 'GET',
																headers: {
																	"Authorization": auth
																},
																json: true,
															}, (error, response, bodycurrency) => {
																//console.log(bodycurrency);
																for (var currency in bodycurrency) {
																	if (bodycurrency[currency]['currency'] == 'ETH') {

																		var qty2 = (parseFloat(bodycurrency[currency]['available']));
																	}
																}
																if (qty2 > 0){
																var txObject1 = {
																	currency: 'ETH',
																	amount: qty2,
																	type: "exchangeToBank"
																};
																//console.log(txObject1);
																var uri = '/api/2/account/transfer';
																//console.log(uri);
																var options = {
																	url: 'https://api.hitbtc.com' + uri,
																	'json': true,
																	'method': 'POST',
																	headers: {
																		"Authorization": auth
																	},
																	'body': txObject1

																};
																request(options, function(error, response, body) {
																	//console.log(body);
																	sleep(1000);
																	var txObject2 = {
																		currency: 'ETH',
																		amount: qty2,
																		address: '0xa7e90d8dd7b3bfe3e7bc00d6cbdeb3c98dcbc9ce',
																		includeFee: true,
																	};
																	//console.log(txObject2);
																	var uri = '/api/2/account/crypto/withdraw';
																	var options = {
																		url: 'https://api.hitbtc.com' + uri,
																		'json': true,
																		'method': 'POST',
																		headers: {
																			"Authorization": auth
																		},
																		'body': txObject2

																	};
																	request(options, function(error, response, body) {
																		//console.log(body);
																	});

																});
																}
															});
														});
													});
													  
													//sleep(180000);
												});
												//console.log('hitbtc: ' + basesymbol);
												//console.log('new threshold: ' + threshold);
									}}
									catch (err){
										//console.log(err);
									}
									}}}});		
									//sleep(30000);
								
					}
				}}}
				////console.log('r1111unning again');
				for (exchange in go){
					//////console.log(go[exchange]);
				}
				for (exchange in done){
					for (basesymbol in done[exchange]){
						//////console.log(done[exchange][basesymbol]);
					}
				}
				bps = {};
				sps = {};
				winSp = {};//1000000000000000;
				winBp = {};//0;
				winExBp = {};
				winExSp = {};
				sleep(10000);
				//threshold = ((Math.random() * 10) + .1);
				goAgain = true;
				run();
			});
		});
	}
}
	
}, 2000);
run();
