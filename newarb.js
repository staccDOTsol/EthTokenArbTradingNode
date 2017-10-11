var debug = false;

var isWin = /^win/.test(process.platform);
var isLin = /^linux/.test(process.platform);
if (isLin) {
    var creds = require('/root/EthTokenArbTradingNode2/googlesheet.json');
} else if (isWin) {
    var creds = require('D:\\Projects\\EthTokenArbTradingNode\\googlesheet.json');
}
var threshold = 1;
var GoogleSpreadsheet = require('google-spreadsheet');
var doc = new GoogleSpreadsheet('1i97AYneAUFRl12gPp8BkL06_V-SYerkchYy-HPIxAbE');
var sheet;
var request = require("request")
var sleep = require('system-sleep');
var cheerio = require('cheerio');
var math = require("mathjs");
var BigNumber = require("bignumber.js");
var request = require("request");
var sleep = require('system-sleep');
var crypto = require("crypto");
var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var Eth = require('web3-eth');
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
    poloniex2.returnOrderBook(base, symbol, function(err, data) {
    if (err){
		//console.log(err);
		if ((err.toString().indexOf('socket hang up') != -1) || (err.toString().indexOf('ETIMEDOUT') != -1)){
			console.log('rerun polo');
			poloniex(threshold, base, symbol);
		}
		}
			//console.log(data);
			//console.log('poloniex ' + base + symbol);
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
							//console.log('buyprice: ' + buyPrice);
							//console.log('buytotal: ' + buyTotal);
					 
							bps[base + symbol]['poloniex'] = buyPrice;
							break;
						}
					}
					break;
				}
			} catch(err){console.log(err);}
				//console.log(data);
					//console.log(data['asks']);
					try{
				while (sellDone == false) {
					for (var sells in data['asks']) {
						//console.log(data['asks']);
						if (sells == data['asks'].length) {
							sellDone = true;
							//console.log('polo length');
							sellPrice = 1000000;
							sps[base + symbol]['poloniex'] = sellPrice;
							break;

						}
						sellTotal = sellTotal + (data['asks'][sells][0] * data['asks'][sells][1]);

						if (sellTotal >= threshold) {
							sellDone = true;
							sellPrice = data['asks'][sells][0];
							//console.log('sellprice: ' + sellPrice);
							//console.log('selltotal: ' + sellTotal);
							sps[base + symbol]['poloniex'] = sellPrice;
							break;
						}
					}
					break;
				}
			} catch (err) {
				if (err instanceof TypeError) {} else {
					console.log(err);
				} 
			}
		done['poloniex'][base + symbol] = true;
		
		});
}
	done['hitbtc'] = {};
function hitbtc(threshold, base, symbol) {
	
	base = base.replace("USDT", "USD");
	symbol = symbol.replace("USDT", "USD");
    var buyDone = false;
	var buyPrice = 0;
	var sellPrice = 1000000;
    var sellDone = false;
    var buyTotal = 0;
    var sellTotal = 0;
    var url = 'https://api.hitbtc.com/api/1/public/' + symbol + base + '/orderbook';
    ////console.log(url);
    //sleep(1060)
    request.get(url, {
        json: true,
        timeout: 22000
    }, function(error, response, data) {if (error){//console.log(error);
			hitbtc(threshold, base, symbol);
		}
		//console.log('hitbtc ' + base + symbol);
        sellDone = false;
        try {
    done['hitbtc'][base + symbol] = false;
            while (sellDone == false) {
                for (var sells in data['asks']) {
                    if (sells == (data['asks'].length - 1)) {
                        sellDone = true;
                        ////console.log('sells length');
                        sellPrice = 1000000;
                        sps[base + symbol]['hitbtc'] = sellPrice;
                        break;

                    }
                    sellTotal = sellTotal + (data['asks'][sells][1] * data['asks'][sells][0]);

                    ////console.log(sellTotal);
                    if (sellTotal >= threshold) {
                        ////console.log('threshold');
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
            ////console.log(err);
        }
        try {
            while (buyDone == false) {
                for (var buys in data['bids']) {
                    if (buys == (data['bids'].length - 1)) {
                        sellDone = true;
                        ////console.log('buys length');
                        sellPrice = 1000000;
                        bps[base + symbol]['hitbtc'] = sellPrice;
                        break;

                    }
                    sellTotal = sellTotal + (data['bids'][buys][1] * data['bids'][buys][0]);

                    ////console.log(sellTotal);
                    if (sellTotal >= threshold) {
                        ////console.log('threshold');
                        sellDone = true;
                        sellPrice = data['bids'][buys][0];
                        bps[base + symbol]['hitbtc'] = sellPrice;
                        break;
                    }
                }
                sellDone = true;
                break;
            }
        } catch (err) {
           // ////console.log(err);
        }
        done['hitbtc'][base + symbol] = true;
    });

}

	done['bittrex'] = {};
function bittrex(threshold, base, symbol) {
    var url = "https://bittrex.com/api/v1.1/public/getorderbook?market=" + base + "-" + symbol + "&type=both";
    ////console.log(url);
    request.get(url, {
                json: true,
                timeout: 22000
            }, function(error, response, data) {if (error){//console.log(error);
			bittrex(threshold, base, symbol);
		}
				//console.log('bittrex ' + base + symbol);
                var buyDone = false;
                var sellDone = false;
                var buyTotal = 0;
                var sellTotal = 0;
	var buyPrice = 0;
	var sellPrice = 1000000;
                try {
	done['bittrex'][base + symbol] = false;
                    while (buyDone == false) {
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
                                ////console.log('buyprice: ' + buyPrice);
                                ////console.log('buytotal: ' + buyTotal);
                         
                                bps[base + symbol]['bittrex'] = buyPrice;
                                break;
                            }
                        }
                        break;
				}}catch (err) {
            ////console.log(err);
        }
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

                            if (sellTotal >= threshold) {
                                sellDone = true;
                                sellPrice = data['result']['sell'][sells]['Rate'];
                                ////console.log('sellprice: ' + sellPrice);
                                ////console.log('selltotal: ' + sellTotal);
                                sps[base + symbol]['bittrex'] = sellPrice;
                                break;
                            }
                        }
                        break;
                    }
                } catch (err) {
                    if (err instanceof TypeError) {} else {
                        ////console.log(err);
                    } 
                }
			done['bittrex'][base + symbol] = true;
            });
}

	done['kraken'] = {};

function kraken(threshold, base, symbol) {
	base = base.replace("BTC", "XBT");
	base = base.replace("USDT", "USD");
	symbol = symbol.replace("BTC", "XBT");
	symbol = symbol.replace("USDT", "USD");
    var url = "https://api.kraken.com/0/public/Depth?pair=" + symbol + base;
    ////console.log(url);
    request.get(url, {
                json: true,
                timeout: 22000
            }, function(error, response, data) {if (error){//console.log(error);
			if ((error.toString().indexOf('socket hang up') != -1) || (error.toString().indexOf('ECONNRESET') != -1)){
				sleep(1000);
			kraken(threshold, base, symbol);
			}
		}else {
				//console.log(Object.keys(data['result'])[0]);
				//console.log('kraken ' + base + symbol);
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
                            if (buys == data['result'][Object.keys(data['result'])[0]]['bids'].length) {
                                buyDone = true;
                                buyPrice = 0;
                                bps[base + symbol]['kraken'] = buyPrice;
                                break;

                            }
                            if (buyTotal >= threshold) {
                                buyDone = true;
                                buyPrice = data['result'][Object.keys(data['result'])[0]]['bids'][buys][0];
                                //console.log('buyprice: ' + buyPrice);
                                //console.log('buytotal: ' + buyTotal);
                         
                                bps[base + symbol]['kraken'] = buyPrice;
                                break;
                            }
                        }
                        break;
				}}catch (err) {
            ////console.log(err);
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

                            if (sellTotal >= threshold) {
                                sellDone = true;
                                sellPrice = data['result'][Object.keys(data['result'])[0]]['asks'][sells][0];
                               // console.log('sellprice: ' + sellPrice);
                                //console.log('selltotal: ' + sellTotal);
                                sps[base + symbol]['kraken'] = sellPrice;
                                break;
                            }
                        }
                        break;
                    }
                } catch (err) {
                    if (err instanceof TypeError) {} else {
                        ////console.log(err);
                    } 
                }
			done['kraken'][base + symbol] = true;
		}
		});
}

function run(){
	var url = "https://bittrex.com/api/v1.1/public/getmarkets";
    var threshold = 1;
    request.get(url, {
                json: true,
                timeout: 8000
            }, function(error, response, data) {
				if (error){//console.log(error);
					//console.log(error);
					////console.log(result);
					sleep(10000);
					run();
				}
				if (debug == false){
					for (result in data['result']){
						sps[data['result'][result]['BaseCurrency'] + data['result'][result]['MarketCurrency']] = {};
						bps[data['result'][result]['BaseCurrency'] + data['result'][result]['MarketCurrency']] = {};
						hitbtc(threshold, data['result'][result]['BaseCurrency'], data['result'][result]['MarketCurrency']);
						bittrex(threshold, data['result'][result]['BaseCurrency'], data['result'][result]['MarketCurrency']);
						poloniex(threshold, data['result'][result]['BaseCurrency'], data['result'][result]['MarketCurrency']);
						kraken(threshold, data['result'][result]['BaseCurrency'], data['result'][result]['MarketCurrency']);
					}
				}
				else {
					sps['BTC' + 'XVC'] = {};
					bps['BTC' + 'XVC'] = {};
					hitbtc(threshold, 'BTC', 'XVC');
					bittrex(threshold, 'BTC', 'XVC');
					poloniex(threshold, 'BTC', 'XVC');
					kraken(threshold,'BTC', 'XVC');
					kraken(threshold,'BTC', 'XVC');

				}
			});
}
var goAgain = true;
setInterval(function(){ 
console.log('check dones');
var go = {};
for (exchange in done){
	go[exchange] = true;
	for (basesymbol in done[exchange]){
		////console.log(done[exchange][basesymbol]);
		if (done[exchange][basesymbol] == false){
			go[exchange] = false;
		}
	}
}
var goYes = true;
for (exchange in go){
	//console.log(exchange);
	//console.log(go[exchange]);
	if (go[exchange] == false){
		goYes = false;
	}
}
sleep(10000);
if (goYes == true){
	if (goAgain == true){
		goAgain = false;
		doc.useServiceAccountAuth(creds, function lala(){
			doc.getInfo(function(err, info) {
				////console.log('Loaded doc: '+info.title+' by '+info.author.email);
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
					////console.log('sps ' + basesymbol);
					winSp[basesymbol] = 1000000000000000;
					winExSp[basesymbol] = "";
					for (exchange in sps[basesymbol]){
						if (sps[basesymbol][exchange] <= winSp[basesymbol] && sps[basesymbol][exchange] != 1000000 && sps[basesymbol][exchange] != 0){
							winSp[basesymbol] = sps[basesymbol][exchange];
							winExSp[basesymbol] = exchange;
						}
					}
					////console.log('winsp: ' + winSp[basesymbol]);
				}	
				for (basesymbol in bps){
					////console.log('bps ' + basesymbol);
					winBp[basesymbol] = 0;
					winExBp[basesymbol] = "";
					for (exchange in bps[basesymbol]){
						////console.log('bps exchange: ' + exchange);
						if (bps[basesymbol][exchange] >= winBp[basesymbol] && bps[basesymbol][exchange] != 1000000 && bps[basesymbol][exchange] != 0){
							winBp[basesymbol] = bps[basesymbol][exchange];
							////console.log(winBp[basesymbol]);
							winExBp[basesymbol] = exchange;
						}
					}
					////console.log('winbp: ' + winBp[basesymbol]);
				}	
				var arb = {};
				for (basesymbol in bps){
					
					for (basesymbol2 in sps){
						if (basesymbol == basesymbol2){
							
							if (winSp[basesymbol2] != 10 && winBp[basesymbol] != 0 && winSp[basesymbol2] != 1 && winBp[basesymbol] != 1){
								arb[basesymbol] = (-1 * (1 - (winBp[basesymbol]/winSp[basesymbol2]))) - (.01/threshold);
								//console.log(arb[basesymbol]);
							//console.log(winExBp[basesymbol]);
							//console.log(winExSp[basesymbol]);
								if (arb[basesymbol] > .0001 && arb[basesymbol] <= 10){
									console.log('arb ' + basesymbol + " " + basesymbol2 + ": " + arb);
									var dateTime = require('node-datetime');
									var dt = dateTime.create();
									var formatted = dt.format('Y-m-d H:M:S');
									//console.log(formatted);
									//console.log('arb arb! ' + arb[basesymbol] + ' ' + basesymbol + ' winsp: ' + winExSp[basesymbol] + ' winbp: ' + winExBp[basesymbol]);
									sheet.addRow({'time':formatted, 'ticker': basesymbol, 'bid': winBp[basesymbol], 'ask': winSp[basesymbol2], 'arb with fee': arb[basesymbol], 'bid ex': winExBp[basesymbol], 'ask ex': winExSp[basesymbol], 'base threshold': threshold}, function (err, row){ });
								}
							}
						}
					}
				}
				//console.log('running again');
				for (exchange in go){
					////console.log(go[exchange]);
				}
				for (exchange in done){
					for (basesymbol in done[exchange]){
						////console.log(done[exchange][basesymbol]);
					}
				}
				sleep(10000);
				threshold = ((Math.random() * 10) + .1);
				goAgain = true;
				run();
			});
		});
	}
}
	
}, 8000);
run();