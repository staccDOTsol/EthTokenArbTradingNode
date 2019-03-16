var debug = false;

var isWin = /^win/.test(process.platform);
var isLin = /^linux/.test(process.platform);
if (isLin) {
    var creds = require('/root/googlesheet.json');
} else if (isWin) {
    var creds = require('./googlesheet.json');
}
var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('decimals.csv')
});
var linecount = 0;
var tokens2 = {};
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
lineReader.on('line', function(line) {
    if (line.indexOf('currentValue') == -1) {
        currentValue2[count2] = line.split(',')[0];
        decimals2[count2] = line.split(',')[2];
        tokens2[line.split(',')[0]] = line.split(',')[1];
        //////consol.log(tokens2[line.split(',')[0]]);
		
		//////consol.log(line.split(',')[0]);
        count2++;
    }
});
var threshold = ((Math.random() * 10) + .1);
var GoogleSpreadsheet = require('google-spreadsheet');
var doc = new GoogleSpreadsheet('1i97AYneAUFRl12gPp8BkL06_V-SYerkchYy-HPIxAbE');
var sheet;
var request = require("request")
//var sleep = require('system-//sleep');
var cheerio = require('cheerio');
var math = require("mathjs");
var BigNumber = require("bignumber.js");
var request = require("request");
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
	done['etherdelta'] = {};
function etherdelta(threshold, base, symbol) {
	if (base == "USDT"){
		threshold = threshold * 60; 
	}
	if (symbol == "BTC"){
		threshold = threshold * 21.27;
	}
	
			done['etherdelta'][base + symbol] = false;
	if (tokens2[symbol] != undefined && base == "ETH"){
	 var url6 = 'https://api.etherdelta.com/orders/' + tokens2[symbol] + '/0'; ////sleep(1060);
        //sleep((Math.random() * 120) + 50);
		//consol.log(url6);
        request.get(url6, {
            json: true,
            timeout: 8000
        }, function(error6, response6, data4) {
			if (error6){
            if (error6.toString().indexOf('bad gateway') != -1 ||  error6.toString().indexOf('Bad gateway') != -1 || error6.toString().indexOf('What happened') != -1 ) {//>What happened
                //sleep(2000);
				////consol.log('bad gateway');
                etherdelta(threshold, base, symbol);
            }
		else if (error6.toString().indexOf('ESOCKETTIMEDOUT') != -1 || error6.toString().indexOf('ETIMEDOUT')){
                //sleep(2000);
				////consol.log('timeout');
                etherdelta(threshold, base, symbol);
			}
			else if (error6){
				////consol.log(error6);
			}
			}
			if (data4){
			if(data4.toString().indexOf('bad gateway') != -1 || data4.toString().indexOf('Bad gateway') != -1|| data4.toString().indexOf('What happened') != -1){
				//sleep(2000);
				////consol.log('DATA4 bad gateway');
                etherdelta(threshold, base, symbol);
			}
			if (!error6){
				if(data4['buys'] == undefined){
				////consol.log(data4);
				}
				//////consol.log(data4['buys'] );
				////consol.log('got it' + data4['buys'][0]['price']);
            try {
                if (!error6 && response6.statusCode === 200) {
                    //////////////consol.log(data6);
                    var buyDone = false;
                    var sellDone = false;
                    var buyTotal = 0;
					sps[base + symbol]['etherdelta'] = 10;
					bps[base + symbol]['etherdelta'] = 0;
                    var sellTotal = 0;
                    var edBuys = [];
                    var edSells = [];
    
			try {
				while (buyDone == false) {
					for (var buys in data4['buys']) {
						buyTotal = buyTotal + (data4['buys'][buys]['price'] * data4['buys'][buys]['availableVolume']);
						////consol.log(buyTotal);
						if (buys == data4['buys'].length) {
							buyDone = true;
							buyPrice = 0;
							bps[base + symbol]['etherdelta'] = buyPrice;
							break;

						}
						if (buyTotal >= threshold) {
							buyDone = true;
							buyPrice = data4['buys'][buys]['price'];
							////consol.log('buyprice: ' + buyPrice);
							////consol.log('buytotal: ' + buyTotal);
					 
							bps[base + symbol]['etherdelta'] = buyPrice;
							break;
						}
					}
					break;
				}
			} catch(err){////consol.log(err);
			}
				//////////consol.log(data);
					//////////consol.log(data['asks']);
					try{
				while (sellDone == false) {
					for (var sells in data4['sells']) {
						//////////consol.log(data['asks']);
						if (sells == data4['asks'].length) {
							sellDone = true;
							//////////consol.log('polo length');
							sellPrice = 1000000;
							sps[base + symbol]['etherdelta'] = sellPrice;
							break;

						}
						sellTotal = (data4['sells'][sells]['availableVolume'] * data4['sells'][sells]['price']);
						////consol.log(buyTotal);

						if (sellTotal >= threshold) {
							sellDone = true;
							sellPrice = data4['sells'][sells]['price'];
							////consol.log('sellprice: ' + sellPrice);
							////consol.log('selltotal: ' + sellTotal);
							sps[base + symbol]['etherdelta'] = sellPrice;
							break;
						}
					}
					break;
				}
			} catch (err) {
				if (err instanceof TypeError) {} else {
					////consol.log(err);
				} 
			}
		done['etherdelta'][base + symbol] = true;
				}
			}catch(err){////consol.log(err);
			done['etherdelta'][base + symbol] = true;} }}else{done['etherdelta'][base + symbol] = true;}
		});
	}
	else {
		done['etherdelta'][base + symbol] = true;
	}
}
function poloniex(threshold, base, symbol) {
	if (base == "USDT"){
		threshold = threshold * 60; 
	}
	if (symbol == "BTC"){
		threshold = threshold * 21.27;
	}
    poloniex2.returnOrderBook(base, symbol, function(err, data) {
    if (err){
		//////////consol.log(err);
		if ((err.toString().indexOf('socket hang up') != -1) || (err.toString().indexOf('ETIMEDOUT') != -1)){
			////////consol.log('rerun polo');
			poloniex(threshold, base, symbol);
		}
		}
			//////////consol.log(data);
			//////////consol.log('poloniex ' + base + symbol);
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
							//////////consol.log('buyprice: ' + buyPrice);
							//////////consol.log('buytotal: ' + buyTotal);
					 
							bps[base + symbol]['poloniex'] = buyPrice;
							break;
						}
					}
					break;
				}
			} catch(err){////////consol.log(err);
			}
				//////////consol.log(data);
					//////////consol.log(data['asks']);
					try{
				while (sellDone == false) {
					for (var sells in data['asks']) {
						//////////consol.log(data['asks']);
						if (sells == data['asks'].length) {
							sellDone = true;
							//////////consol.log('polo length');
							sellPrice = 1000000;
							sps[base + symbol]['poloniex'] = sellPrice;
							break;

						}
						sellTotal = sellTotal + (data['asks'][sells][0] * data['asks'][sells][1]);

						if (sellTotal >= threshold) {
							sellDone = true;
							sellPrice = data['asks'][sells][0];
							//////////consol.log('sellprice: ' + sellPrice);
							//////////consol.log('selltotal: ' + sellTotal);
							sps[base + symbol]['poloniex'] = sellPrice;
							break;
						}
					}
					break;
				}
			} catch (err) {
				if (err instanceof TypeError) {} else {
					////////consol.log(err);
				} 
			}
		done['poloniex'][base + symbol] = true;
		
		});
}
	done['hitbtc'] = {};
function hitbtc(threshold, base, symbol) {
	if (base == "USDT"){
		threshold = threshold * 60; 
	}
	if (symbol == "BTC"){
		threshold = threshold * 21.27;
	}
	base = base.replace("USDT", "USD");
	symbol = symbol.replace("USDT", "USD");
    var buyDone = false;
	var buyPrice = 0;
	var sellPrice = 1000000;
    var sellDone = false;
    var buyTotal = 0;
    var sellTotal = 0;
    var url = 'https://api.hitbtc.com/api/1/public/' + symbol + base + '/orderbook';
    ////////////consol.log(url);
    ////sleep(1060)
    request.get(url, {
        json: true,
        timeout: 22000
    }, function(error, response, data) {if (error){//////////consol.log(error);
			hitbtc(threshold, base, symbol);
		}
		//////////consol.log('hitbtc ' + base + symbol);
        sellDone = false;
        try {
    done['hitbtc'][base + symbol] = false;
            while (sellDone == false) {
                for (var sells in data['asks']) {
                    if (sells == (data['asks'].length - 1)) {
                        sellDone = true;
                        ////////////consol.log('sells length');
                        sellPrice = 1000000;
                        sps[base + symbol]['hitbtc'] = sellPrice;
                        break;

                    }
                    sellTotal = sellTotal + (data['asks'][sells][1] * data['asks'][sells][0]);
					////////consol.log('hitbtc current sell price: ' + data['asks'][sells][0]);
                    ////////consol.log('hitbtc selltotal: ' + sellTotal);
                    if (sellTotal >= threshold) {
                        ////////consol.log('threshold: ' + threshold);
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
            ////////////consol.log(err);
        }
        try {
            while (buyDone == false) {
                for (var buys in data['bids']) {
                    if (buys == (data['bids'].length - 1)) {
                        sellDone = true;
                        ////////////consol.log('buys length');
                        sellPrice = 1000000;
                        bps[base + symbol]['hitbtc'] = sellPrice;
                        break;

                    }
                    sellTotal = sellTotal + (data['bids'][buys][1] * data['bids'][buys][0]);

                    ////////////consol.log(sellTotal);
                    if (sellTotal >= threshold) {
                        ////////////consol.log('threshold');
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
           // ////////////consol.log(err);
        }
        done['hitbtc'][base + symbol] = true;
    });

}

	done['bittrex'] = {};
function bittrex(threshold, base, symbol) {
	if (base == "USDT"){
		threshold = threshold * 60; 
	}
	if (symbol == "BTC"){
		threshold = threshold * 21.27;
	}
    var url = "https://bittrex.com/api/v1.1/public/getorderbook?market=" + base + "-" + symbol + "&type=both";
    ////////////consol.log(url);
    request.get(url, {
                json: true,
                timeout: 22000
            }, function(error, response, data) {if (error){//////////consol.log(error);
			bittrex(threshold, base, symbol);
		}
				//////////consol.log('bittrex ' + base + symbol);
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
                                ////////////consol.log('buyprice: ' + buyPrice);
                                ////////////consol.log('buytotal: ' + buyTotal);
                         
                                bps[base + symbol]['bittrex'] = buyPrice;
                                break;
                            }
                        }
                        break;
				}}catch (err) {
            ////////////consol.log(err);
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
                                ////////////consol.log('sellprice: ' + sellPrice);
                                ////////////consol.log('selltotal: ' + sellTotal);
                                sps[base + symbol]['bittrex'] = sellPrice;
                                break;
                            }
                        }
                        break;
                    }
                } catch (err) {
                    if (err instanceof TypeError) {} else {
                        ////////////consol.log(err);
                    } 
                }
			done['bittrex'][base + symbol] = true;
            });
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
		
		////////consol.log(url);
						//sleep(1);
request.get(url, {json: true, timeout: 80000}, function(error, response, data) {
			////////////////consol.log(data5);
					////////consol.log(data);
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
                                ////////consol.log('buyprice yobit: ' + buyPrice);
                                ////////consol.log('buytotal yobit: ' + buyTotal);
                         
                                bps[base + symbol]['yobit'] = buyPrice;
                                break;
                            }
                        }
                        break;
				}}catch (err) {
            ////////consol.log(err);
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
							////////consol.log(sellTotal);
                            if (sellTotal >= threshold) {
                                sellDone = true;
                                sellPrice = data[symbol.toLowerCase() + "_" + base.toLowerCase()]['asks'][0];
                               // ////////consol.log('sellprice: ' + sellPrice);
                                //////////consol.log('selltotal: ' + sellTotal);
                                sps[base + symbol]['yobit'] = sellPrice;
                                break;
                            }
                        }
                        break;
                    }
                } catch (err) {
                    if (err instanceof TypeError) {} else {
                        ////////consol.log(err);
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
		
		//////////consol.log(url8);
						//sleep(1);
request.get(url, {json: true, timeout: 80000}, function(error, response, data) {
			////////////////consol.log(data5);
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
                                ////////consol.log('buyprice bitstamp: ' + buyPrice);
                                ////////consol.log('buytotal bitstamp: ' + buyTotal);
                         
                                bps[base + symbol]['bitstamp'] = buyPrice;
                                break;
                            }
                        }
                        break;
				}}catch (err) {
            ////////////consol.log(err);
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
							////////consol.log(sellTotal);
                            if (sellTotal >= threshold) {
                                sellDone = true;
                                sellPrice = data['asks'][0];
                               // ////////consol.log('sellprice: ' + sellPrice);
                                //////////consol.log('selltotal: ' + sellTotal);
                                sps[base + symbol]['bitstamp'] = sellPrice;
                                break;
                            }
                        }
                        break;
                    }
                } catch (err) {
                    if (err instanceof TypeError) {} else {
                        ////////////consol.log(err);
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
		
		//////////consol.log(url8);
						//sleep(1);
request.get(url, {json: true, timeout: 80000}, function(error, response, data) {
			////////////////consol.log(data5);
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
                                ////////consol.log('buyprice gatecoin: ' + buyPrice);
                                ////////consol.log('buytotal gatecoin: ' + buyTotal);
                         
                                bps[base + symbol]['gatecoin'] = buyPrice;
                                break;
                            }
                        }
                        break;
				}}catch (err) {
            ////////////consol.log(err);
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
							////////consol.log(sellTotal);
                            if (sellTotal >= threshold) {
                                sellDone = true;
                                sellPrice = data['asks']['price'];
                               // ////////consol.log('sellprice: ' + sellPrice);
                                //////////consol.log('selltotal: ' + sellTotal);
                                sps[base + symbol]['gatecoin'] = sellPrice;
                                break;
                            }
                        }
                        break;
                    }
                } catch (err) {
                    if (err instanceof TypeError) {} else {
                        ////////////consol.log(err);
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
    ////////////consol.log(url);
    request.get(url, {
                json: true,
                timeout: 22000
            }, function(error, response, data) {if (error){}//////////consol.log(error);
			try{
			if ((error.toString().indexOf('socket hang up') != -1) || (error.toString().indexOf('ECONNRESET') != -1)){
				//sleep(1000);
			liqui(threshold, base, symbol);
			}else {
				//////////consol.log(Object.keys(data['result'])[0]);
				//////////consol.log('kraken ' + base + symbol);
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
                                ////////consol.log('buyprice liqui: ' + buyPrice);
                                ////////consol.log('buytotal liqui: ' + buyTotal);
                         
                                bps[base + symbol]['liqui'] = buyPrice;
                                break;
                            }
                        }
                        break;
				}}catch (err) {
            ////////////consol.log(err);
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
							////////consol.log(sellTotal);
                            if (sellTotal >= threshold) {
                                sellDone = true;
                                sellPrice = data[symbol.toLowerCase() + "_" + base.toLowerCase()]['asks'][sells][0];
                               // ////////consol.log('sellprice: ' + sellPrice);
                                //////////consol.log('selltotal: ' + sellTotal);
                                sps[base + symbol]['liqui'] = sellPrice;
                                break;
                            }
                        }
                        break;
                    }
                } catch (err) {
                    if (err instanceof TypeError) {} else {
                        ////////////consol.log(err);
                    } 
                }
			done['liqui'][base + symbol] = true;
		}
			}catch(err){}
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
    ////////////consol.log(url);
    request.get(url, {
                json: true,
                timeout: 22000
            }, function(error, response, data) {if (error){//////////consol.log(error);
			if ((error.toString().indexOf('socket hang up') != -1) || (error.toString().indexOf('ECONNRESET') != -1)){
				//sleep(1000);
			kraken(threshold, base, symbol);
			}
		}else {
				//////////consol.log(Object.keys(data['result'])[0]);
				//////////consol.log('kraken ' + base + symbol);
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
                            ////////consol.log(buyTotal);
							if (buys == data['result'][Object.keys(data['result'])[0]]['bids'].length) {
                                buyDone = true;
                                buyPrice = 0;
                                bps[base + symbol]['kraken'] = buyPrice;
                                break;

                            }
                            if (buyTotal >= threshold) {
                                buyDone = true;
                                buyPrice = data['result'][Object.keys(data['result'])[0]]['bids'][buys][0];
                                //////////consol.log('buyprice: ' + buyPrice);
                                //////////consol.log('buytotal: ' + buyTotal);
                         
                                bps[base + symbol]['kraken'] = buyPrice;
                                break;
                            }
                        }
                        break;
				}}catch (err) {
            ////////////consol.log(err);
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
							////////consol.log(sellTotal);
                            if (sellTotal >= threshold) {
                                sellDone = true;
                                sellPrice = data['result'][Object.keys(data['result'])[0]]['asks'][sells][0];
                               // ////////consol.log('sellprice: ' + sellPrice);
                                //////////consol.log('selltotal: ' + sellTotal);
                                sps[base + symbol]['kraken'] = sellPrice;
                                break;
                            }
                        }
                        break;
                    }
                } catch (err) {
                    if (err instanceof TypeError) {} else {
                        ////////////consol.log(err);
                    } 
                }
			done['kraken'][base + symbol] = true;
		}
		});
}

function run(){
	var url = "https://bittrex.com/api/v1.1/public/getmarkets";
    ////consol.log('run');
    request.get(url, {
                json: true,
                timeout: 8000
            }, function(error, response, data) {
				if (error){//////////consol.log(error);
					//////////consol.log(error);
					////////////consol.log(result);
					//sleep(10000);
					run();
				}
				if (debug == false){
					for (result in data['result']){
						sps[data['result'][result]['BaseCurrency'] + data['result'][result]['MarketCurrency']] = {};
						bps[data['result'][result]['BaseCurrency'] + data['result'][result]['MarketCurrency']] = {};
						////sleep((Math.random() * 1400) + 100);
						gatecoin(threshold, data['result'][result]['BaseCurrency'], data['result'][result]['MarketCurrency']);
						//bitstamp(threshold, data['result'][result]['BaseCurrency'], data['result'][result]['MarketCurrency']);
						//yobit(threshold, data['result'][result]['BaseCurrency'], data['result'][result]['MarketCurrency']);
						liqui(threshold, data['result'][result]['BaseCurrency'], data['result'][result]['MarketCurrency']);
						hitbtc(threshold, data['result'][result]['BaseCurrency'], data['result'][result]['MarketCurrency']);
						bittrex(threshold, data['result'][result]['BaseCurrency'], data['result'][result]['MarketCurrency']);
						poloniex(threshold, data['result'][result]['BaseCurrency'], data['result'][result]['MarketCurrency']);
						etherdelta(threshold, data['result'][result]['BaseCurrency'], data['result'][result]['MarketCurrency']);
						
						kraken(threshold, data['result'][result]['BaseCurrency'], data['result'][result]['MarketCurrency']);
					}
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
////consol.log('check dones');
var go = {};
for (exchange in done){
	go[exchange] = true;
	for (basesymbol in done[exchange]){
		//////consol.log(done[exchange][basesymbol]);
		if (done[exchange][basesymbol] == false){
			go[exchange] = false;
		}
	}
}
var goYes = true;
for (exchange in go){
	//////////consol.log(exchange);
	//////////consol.log(go[exchange]);
	if (go[exchange] == false){
		goYes = false;
	}
}
////sleep(10000);
if (goYes == true){
	if (goAgain == true){
		goAgain = false;
		doc.useServiceAccountAuth(creds, function lala(){
			doc.getInfo(function(err, info) {
				////////////consol.log('Loaded doc: '+info.title+' by '+info.author.email);
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
					////////////consol.log('sps ' + basesymbol);
					winSp[basesymbol] = 1000000000000000;
					winExSp[basesymbol] = "";
					for (exchange in sps[basesymbol]){
						if (sps[basesymbol][exchange] <= winSp[basesymbol] && sps[basesymbol][exchange] != 1000000 && sps[basesymbol][exchange] != 0){
							winSp[basesymbol] = sps[basesymbol][exchange];
							winExSp[basesymbol] = exchange;
						}
					}
					////////////consol.log('winsp: ' + winSp[basesymbol]);
				}	
				for (basesymbol in bps){
					////////////consol.log('bps ' + basesymbol);
					winBp[basesymbol] = 0;
					winExBp[basesymbol] = "";
					for (exchange in bps[basesymbol]){
						////////consol.log('bps exchange: ' + exchange);
							////////consol.log(basesymbol);
						if (bps[basesymbol][exchange] >= winBp[basesymbol] && bps[basesymbol][exchange] != 1000000 && bps[basesymbol][exchange] != 0){
							winBp[basesymbol] = bps[basesymbol][exchange];
							winExBp[basesymbol] = exchange;
						}
							////////consol.log(winBp[basesymbol]);
					}
					////////////consol.log('winbp: ' + winBp[basesymbol]);
				}	
				var arb = {};
				for (basesymbol in bps){
					
					for (basesymbol2 in sps){
						if (basesymbol == basesymbol2){
							
							if (winSp[basesymbol2] != 10 && winBp[basesymbol] != 0 && winSp[basesymbol2] != 1 && winBp[basesymbol] != 1){
								arb[basesymbol] = (-1 * (1 - (winBp[basesymbol]/winSp[basesymbol2]))) - (.001/threshold);
								
								//consol.log(basesymbol);
								//consol.log(arb[basesymbol]);
							//////////consol.log(winExBp[basesymbol]);
							//////////consol.log(winExSp[basesymbol]);
								if (arb[basesymbol] > .0001 && arb[basesymbol] <= 10){
									////consol.log('arb ' + basesymbol + " " + basesymbol2 + ": " + arb[basesymbol]);
									var dateTime = require('node-datetime');
									var dt = dateTime.create();
									var formatted = dt.format('Y-m-d H:M:S');
									//////////consol.log(formatted);
									//////////consol.log('arb arb! ' + arb[basesymbol] + ' ' + basesymbol + ' winsp: ' + winExSp[basesymbol] + ' winbp: ' + winExBp[basesymbol]);
									if (basesymbol.startsWith('USDTBTC')){
										sheet.addRow({'time':formatted, 'ticker': basesymbol, 'bid': winBp[basesymbol], 'ask': winSp[basesymbol2], 'arb with fee': arb[basesymbol], 'bid ex': winExBp[basesymbol], 'ask ex': winExSp[basesymbol], 'base threshold': threshold * 60 * 21.27}, function (err, row){ });
										
									}
									
									else if (basesymbol.startsWith('USDT')){
										sheet.addRow({'time':formatted, 'ticker': basesymbol, 'bid': winBp[basesymbol], 'ask': winSp[basesymbol2], 'arb with fee': arb[basesymbol], 'bid ex': winExBp[basesymbol], 'ask ex': winExSp[basesymbol], 'base threshold': threshold * 60}, function (err, row){ });
										
									}
									else{
										sheet.addRow({'time':formatted, 'ticker': basesymbol, 'bid': winBp[basesymbol], 'ask': winSp[basesymbol2], 'arb with fee': arb[basesymbol], 'bid ex': winExBp[basesymbol], 'ask ex': winExSp[basesymbol], 'base threshold': threshold}, function (err, row){ });
									}
								}
							}
						}
					}
				}
				//////////consol.log('r1111unning again');
				for (exchange in go){
					////////////consol.log(go[exchange]);
				}
				for (exchange in done){
					for (basesymbol in done[exchange]){
						////////////consol.log(done[exchange][basesymbol]);
					}
				}
				bps = {};
				sps = {};
				winSp = {};//1000000000000000;
				winBp = {};//0;
				winExBp = {};
				winExSp = {};
				////sleep(10000);
				threshold = ((Math.random() * 10) + .1);
				goAgain = true;
				run();
			});
		});
	}
}
	
}, 3000);
run();
