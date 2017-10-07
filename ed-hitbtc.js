var GoogleSpreadsheet = require('google-spreadsheet');
var request = require("request")
var sleep = require('system-sleep');
var cheerio = require('cheerio');

var doc = new GoogleSpreadsheet('1IIOlhYnF-5m2Wdqku0NWTdKi2f4-Ts6XC8_OlWmONbU');
var sheet;
var math = require("mathjs");
var dodeposit = true;
var BigNumber = require("bignumber.js");
var dowithdraw = true;
var dosenditback = true;
const user = '0x5100DAdF11113B0730829d2047B9df4DA1d80e68';
var request = require("request");
const sha256 = require('js-sha256').sha256;
const ethUtil = require('ethereumjs-util');
var sleep = require('system-sleep');
var doc = new GoogleSpreadsheet('102TvZrB0RyuBK4nqhUd3aP_zRvP8JpDRsukIEOInnwI');
var sheet;
var crypto = require("crypto");
var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var Eth = require('web3-eth');
const wei = 1000000000000000000;
var SOME_EXIT_CONDITION = false;
(function wait() {
    //if (!SOME_EXIT_CONDITION) setTimeout(wait, 1000);
})();
// "Eth.providers.givenProvider" will be set if in an Ethereum supported browser.
var eth = new Eth(Eth.givenProvider || 'http://localhost:8545');

var contractABI = require('./etherdelta.json');
var dosenditback = true;
var contract = new eth.Contract(contractABI, "0x8d12a197cb00d4747a1fe03395095ce2a5cc6819");

var fs = require('fs');
var lineReader2 = require('readline').createInterface({
    input: require('fs').createReadStream("private_keys.pem")
});
var hitKey = "";
var hitSecret = "";
var linecount = 0;
lineReader2.on('line', function(line) {
    console.log(line);
    if (linecount == 0) {
        privateKey = line;
    } else if (linecount == 1) {
        hitKey = line;
    } else if (linecount == 2) {
        hitSecret = line;
    }
    linecount++;
});
var isWin = /^win/.test(process.platform);
var isLin = /^linux/.test(process.platform);
if (isLin) {
    var creds = require('/root/EthTokenArbTradingNode/googlesheet.json');
} else if (isWin) {
    var creds = require('D:\\Projects\\EthTokenArbTradingNode\\googlesheet.json');
}
const commandLineArgs = require('command-line-args');
const optionDefinitions = []
//const options = commandLineArgs(optionDefinitions)
var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('decimals.csv')
});
var dodeposit = true;
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
var precises = [];
lineReader.on('line', function(line) {
    if (line.indexOf('currentValue') == -1) {
        currentValue2[count2] = line.split(',')[0];
        decimals2[count2] = line.split(',')[2];
        tokens2[count2] = line.split(',')[1];
        //console.log(line);
        count2++;
    }
});
setTimeout(function() {
    lala123(0);
}, 1500)
var go = true;

function lala123(tokencount) {
    var lalaurl = "https://api.hitbtc.com/api/1/public/symbols";
    console.log(lalaurl);
    request.get(lalaurl, {
        json: true,
        timeout: 41500
    }, function(error, response, lala) {
        if (error) {
            //sleep(5000);					
            //oulala123(currentValue, bidEx, askEx, tokenAddr);
        }
        //console.log(lala);
        for (var symbol in lala['symbols']) {
            for (var i in currentValue2) {
                if (currentValue2[i] + "ETH" == lala['symbols'][symbol]['symbol']) {

                    currentValue[count] = currentValue2[i];
                    decimals[count] = decimals2[i];
                    tokens[count] = tokens2[i];
                    lots[count] = lala['symbols'][symbol]['lot'];
                    steps[count] = lala['symbols'][symbol]['step'];
                    precises[count] = (steps[count].toString().length - 2);
                    count++;
                }
            }
        }
        console.log(count);
        go = false;
        console.log(tokens[count]);
        lala321(tokens[0], 0);
    });
}

function lala321(tokenAddr, tokencount) {

    console.log(currentValue[tokencount]);

    //console.log(tokens);
    try {
        web3.eth.personal.unlockAccount("0x5100DAdF11113B0730829d2047B9df4DA1d80e68", "w0rdp4ss", 120000);
        //console.log(err);
        var debug = false;
        if (currentValue[tokencount] == "PAY") {
            debug = true;
        }
        var url6 = 'https://api.etherdelta.com/orders/' + tokens[tokencount] + '/0'; //sleep(1060);
        console.log(url6);
        request.get(url6, {
            json: true,
            timeout: 8000
        }, function(error6, response6, data6) {
            if (error6 || response6.statusCode != 200) {
                sleep(1000);
                console.log(error6);
                console.log(tokenAddr + ' again');
                lala321(tokenAddr, tokencount);
            }
            try {
                if (!error6 && response6.statusCode === 200) {
                    ////////console.log(data6);
                    var buyDone = false;
                    var sellDone = false;
                    var buyTotal = 0;
                    var sellTotal = 0;
                    var edBuys = [];
                    var edSells = [];
                    var url4 = 'https://api.hitbtc.com/api/1/public/' + currentValue[tokencount] + 'ETH/orderbook';
                    console.log(url4);
                    //sleep(1060)
                    request.get(url4, {
                        json: true,
                        timeout: 41500
                    }, function(error, response, data4) {
                        if (error) {}
                        var uri = '/api/2/trading/balance';
                        console.log(uri);
                        var auth = "Basic " + new Buffer(hitKey + ":" + hitSecret).toString("base64");
                        request({
                            url: 'https://api.hitbtc.com' + uri, //
                            method: 'GET',
                            headers: {
                                "Authorization": auth
                            },
                            json: true,
                        }, (error, response, body) => {
                            //console.log(body);
                            for (var currency in body) {
                                if (body[currency]['currency'] == "ETH") {
                                    var qty = (parseFloat(body[currency]['available']) * .99).toFixed(precises[tokencount]); // TODO Fix to .99
                                    console.log('qty! ' + qty);
                                    if (qty >= 0.001) {
										dodeposit = true;
                                        dosenditback = true;
                                    }
                                    var threshold = parseFloat(qty); // / 10;
                                    console.log(tokenAddr);
                                    console.log(threshold);
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

                                    ////console.log(sellTotal);
                                    if (sellTotal >= qty) {
                                        sellDone = true;
                                        sellPrice = data4['asks'][sells][0];
                                        /*//console.log(sellPrice);
                                        cells[13].value = sellPrice.toString();
                                        cells[15].value = sellTotal.toString();
                                        cells[13].save();
                                        cells[15].save();*/
                                        var sps = sellPrice;
                                        break;
                                    }
                                }
                            }
                            var callData = contract.methods.balanceOf(tokenAddr, user).call().then(function(data) {
                                var tokenBal = data;
                                while (buyDone == false) {
                                    for (var buys in data6['buys']) {
                                        if (data6['buys'][buys]['ethAvailableVolume'] <= 0.05) {
                                            console.log('useless....');
                                        } else {
                                            //console.log(data6['buys'][buys]);
                                            console.log(buyTotal);
                                            edBuys[buys] = {};
                                            edBuys[buys]['available'] = data6['buys'][buys]['availableVolumeBase'];
                                            edBuys[buys]['nonce'] = data6['buys'][buys]['nonce'];
                                            edBuys[buys]['v'] = data6['buys'][buys]['v'];
                                            edBuys[buys]['r'] = data6['buys'][buys]['r'];
                                            edBuys[buys]['expires'] = data6['buys'][buys]['expires'];
                                            edBuys[buys]['s'] = data6['buys'][buys]['s'];
                                            edBuys[buys]['user'] = data6['buys'][buys]['user'];
                                            edBuys[buys]['amountGet'] = math.bignumber(Number(data6['buys'][buys]['amountGet'])).toFixed(); //tokens
                                            edBuys[buys]['amountGive'] = math.bignumber(Number(data6['buys'][buys]['amountGive'])).toFixed(); //eth
                                            //console.log(edBuys);
                                            if (buys == data6['buys'].length) {
                                                buyDone = true;
                                                break;
                                                buyPrice = 0;

                                            }
                                            buyTotal = buyTotal + parseFloat(data6['buys'][buys]['availableVolumeBase']);
                                            if (buyTotal >= tokenBal) {
                                                buyDone = true;
                                                buyPrice = data6['buys'][buys]['price'];
                                                var bps = buyPrice;
                                                break;
                                            }
                                        }
                                    }
                                    break;

                                }
                                console.log(bps);
                                console.log(sps);
                                if (sps != 10 && bps != 0) {
                                    var arb = -1 * (1 - (bps / sps));
                                    var winSp = sps;
                                    var winBp = bps;
                                    console.log(arb);
                                    debug = false;
                                    if ((arb > .004 && arb <= 10) || debug == true) {
                                        console.log('ed arb!');

                                        try {
                                            if (threshold > .01 || debug == true) {
                                                buyit(tokenAddr, tokencount, threshold, edSells, winSp, currentValue[tokencount], precises[tokencount], threshold);
                                                //sleep(220000);
                                            }
                                        } catch (err) {
                                            console.log(err);
                                        }


                                    }

                                }
                                go = true;
                                depositit(tokenAddr, tokencount, threshold, edBuys, winBp, decimals[tokencount]);
                                sellitoff(tokenAddr, tokencount, threshold, edBuys, winBp);
                                withdraw(tokenAddr, tokencount, threshold, edBuys, winBp);
                                senditback(tokenAddr, tokencount, threshold, edBuys, winBp);
                                depositDatEth(tokenAddr, tokencount, threshold, edSells, winSp, currentValue, decimals[tokencount], qty);
                                if (tokencount == tokens.length) {
                                    lala321(tokens[0], 0);
                                } else {
                                    lala321(tokens[tokencount + 1], tokencount + 1);
                                }
                            });
                        });
                    });
                }
            } catch (err) {
                go = true;
                if (tokencount == tokens.length) {
                    lala321(tokens[0], 0);
                } else {
                    lala321(tokens[tokencount + 1], tokencount + 1);
                }
                console.log(err);
            }
        });
    } catch (err) {
        console.log(err);
        go = true;
        lala321(tokenAddr, tokencount);
    }
}

function depositDatEth(tokenAddr, tokencount, threshold, edSells, winSp, currentValue, precise, qty) {
	if (dodeposit == true){
		dodeposit = false;
		var uri = '/api/2/account/balance';
		var auth = "Basic " + new Buffer(hitKey + ":" + hitSecret).toString("base64");
		console.log(uri);
		request({
			url: 'https://api.hitbtc.com' + uri, //
			method: 'GET',
			headers: {
				"Authorization": auth
			},
			json: true,
		}, (error, response, bodycurrency) => {
			//console.log(body);
			for (var currency in bodycurrency) {
				if (bodycurrency[currency]['currency'] == "ETH") {

					qty = (parseFloat(bodycurrency[currency]['available'])).toFixed(precise);
					if (qty > 0.01) {
						var txObject1 = {
							currency: "ETH",
							amount: qty,
							type: "bankToExchange"
						};
						console.log(txObject1);
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
	depositDatEth(tokenAddr, tokencount, threshold, edSells, winSp, currentValue, precise, qty);
						});
					}
				} else {
					setTimeout(function() {
						depositDatEth(tokenAddr, tokencount, threshold, edSells, winSp, currentValue, precise, qty);
					}, Math.floor((Math.random() * 120000) + 8000))
				}
			}
		});
	}
}


function buyit(tokenAddr, tokencount, threshold, edSells, winSp, currentValue, precise, qty) {

    var auth = "Basic " + new Buffer(hitKey + ":" + hitSecret).toString("base64");
    var n = require('nonce')();
    const orderObject = {
        clientOrderId: n().toString(),
        symbol: currentValue + "ETH",
        side: "buy",
        price: parseFloat(winSp).toFixed(precise),
        quantity: qty / parseFloat(winSp).toFixed(precise)
    };
    console.log(orderObject);
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
        sleep(4000);
        var uri = '/api/2/trading/balance';
        console.log(uri);
        request({
            url: 'https://api.hitbtc.com' + uri, //
            method: 'GET',
            headers: {
                "Authorization": auth
            },
            json: true,
        }, (error, response, bodycurrency) => {
            //console.log(body);
            for (var currency in bodycurrency) {
                if (bodycurrency[currency]['currency'] == currentValue) {

                    qty = (parseFloat(bodycurrency[currency]['available'])).toFixed(precise);
                }
            }
            var txObject1 = {
                currency: currentValue,
                amount: qty,
                type: "exchangeToBank"
            };
            console.log(txObject1);
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
                console.log(body);
                sleep(4000);
                var txObject2 = {
                    currency: currentValue,
                    amount: qty,
                    address: user,
                    includeFee: true,
                };
                console.log(txObject2);
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
                    console.log(body);
                });

            });

        });
    });

}

function depositit(tokenAddr, tokencount, threshold, edBuys, winBp, decimals) {
    if (dodeposit == true) {
        dodeposit = false;
        request('https://etherscan.io/address/' + tokenAddr + '#code', function(error, response, html) {
            if (!error && response.statusCode == 200) {
                if (!error && response.statusCode == 200) {
                    var $ = cheerio.load(html);
                    $('#js-copytextarea2').each(function(i, element) {
                        var a = $(this);
                        //console.log(a.text());
                        request({
                            url: "https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=" + tokenAddr + "&address=" + user + "&tag=latest&apikey=Y54HQWC3NJ3E9ZSKKM5347WPHZ2D7KA2XW", //
                            method: 'GET',
                            json: true,
                        }, (error, response, data) => {
                            var tokenBal = data['result'];
                            console.log(decimals);
                            var tokenThreshold = (1 * Math.pow(10, decimals));
                            var tokenWhole = tokenBal / Math.pow(10, decimals);
                            var token1 = (tokenWhole * 1).toFixed(3);
                            tokenBal = token1 * Math.pow(10, decimals);
                            console.log('deposit bal: ' + tokenBal + ' threshold: ' + tokenThreshold);
                            if (tokenBal <= tokenThreshold) {
                                setTimeout(function() {
                                    depositit(tokenAddr, tokencount, threshold, edBuys, winBp, decimals);
                                }, Math.floor((Math.random() * 120000) + 8000))
                            } else {
                                web3.eth.personal.unlockAccount("0x5100DAdF11113B0730829d2047B9df4DA1d80e68", "w0rdp4ss", 120000);
                                console.log('depositToken: ' + tokenBal);
                                var contract2 = new eth.Contract(JSON.parse(a.text()), tokenAddr);
                                contract2.methods.approve("0x8d12a197cb00d4747a1fe03395095ce2a5cc6819", (tokenBal)).send({
                                    from: "0x5100DAdF11113B0730829d2047B9df4DA1d80e68",
                                    gas: 250000,
                                    gasPrice: "10000000000"
                                }).then(function(data) {

                                });
                                contract.methods.depositToken(tokenAddr, (tokenBal)).send({
                                    from: "0x5100DAdF11113B0730829d2047B9df4DA1d80e68",
                                    gas: 250000,
                                    gasPrice: "10000000000"
                                }).then(function(data) {

                                });
                            }
                        });
                    });
                }
            }
        });
    } else {
        setTimeout(function() {
            depositit(tokenAddr, tokencount, threshold, edBuys, winBp, decimals);
        }, Math.floor((Math.random() * 120000) + 8000))
    }

}

function senditback(tokenAddr, tokencount, threshold, edBuys, winBp) {
    if (dosenditback == true) {
        web3.eth.personal.unlockAccount("0x5100DAdF11113B0730829d2047B9df4DA1d80e68", "w0rdp4ss", 120000);

        eth.getBalance(user, function(error, tokenBal) {

            console.log('I have ' + tokenBal + ' ETH');
            if (tokenBal <= (.04 * Math.pow(10, 18))) {
                console.log('eth less than 0.04');
                setTimeout(function() {
                    senditback(tokenAddr, tokencount, threshold, edBuys, winBp);
                }, Math.floor((Math.random() * 120000) + 8000))
            } else {
                dosenditback = false;
                dowithdraw = true;
                var uri = '/api/2/account/crypto/address/ETH';
                console.log(uri);

                var auth = "Basic " + new Buffer(hitKey + ":" + hitSecret).toString("base64");
                request({
                    url: 'https://api.hitbtc.com' + uri, //
                    method: 'GET',
                    headers: {
                        "Authorization": auth
                    },
                    json: true,
                }, (error, response, body) => {
                    var address = body['address'];
                    console.log('deposit to ' + address);
                    eth.sendTransaction({
                        from: user,
                        to: address,
                        value: (tokenBal * .8)
                    });
                });

            }
        });
    }
}

function withdraw(tokenAddr, tokencount, threshold, edBuys, winBp) {
    var callData = contract.methods.balanceOf("0x0000000000000000000000000000000000000000", user).call().then(function(data) {
        var tokenBal = data;
        if (tokenBal <= (.04 * Math.pow(10, 18))) {
            setTimeout(function() {
                withdraw(tokenAddr, tokencount, threshold, edBuys, winBp);
            }, Math.floor((Math.random() * 120000) + 8000))
        } else {
            if (dowithdraw == true) {
                dowithdraw = false;
                contract.methods.withdraw(tokenBal).send({
                    from: "0x5100DAdF11113B0730829d2047B9df4DA1d80e68",
                    gas: 250000,
                    gasPrice: "10000000000"
                }).then(function(data) {
                    senditback(tokenAddr, tokencount, threshold, edBuys, winBp);
                });
            } else {
                setTimeout(function() {
                    withdraw(tokenAddr, tokencount, threshold, edBuys, winBp);
                }, Math.floor((Math.random() * 120000) + 8000))
            }
        }
    });
}

function sellitoff(tokenAddr, tokencount, threshold, edBuys, winBp) {
    var callData = contract.methods.balanceOf(tokenAddr, user).call().then(function(data) {
        var tokenBal = data;
        if (tokenBal <= (1.1 * Math.pow(10, decimals[tokencount]))) {
            setTimeout(function() {
                sellitoff(tokenAddr, tokencount, threshold, edBuys, winBp);
            }, Math.floor((Math.random() * 120000) + 8000))
        } else {
            dodeposit = true;
            console.log('token bal ed: ' + tokenBal);




            //tokenBal = (tokenBal / Math.pow(10, decimals[tokencount]));
            console.log('decimals[tokencount]? ' + decimals[tokencount]);
            console.log('do I have ' + tokenBal + " of " + tokenAddr);
            const contractAddr = '0x8d12a197cb00d4747a1fe03395095ce2a5cc6819';
            const tokenGet = '0x0000000000000000000000000000000000000000'; // VERI is what I want to get -- this is a buy order for VERI/ETH
            const tokenGive = tokenAddr; // 0x0 address means ETH
            web3.eth.personal.unlockAccount("0x5100DAdF11113B0730829d2047B9df4DA1d80e68", "w0rdp4ss", 120000);
            var buytotal = 0;
            var buy = 0;
            console.log('edbuys length' + edBuys.length);
            console.log('available: ' + new BigNumber(edBuys[buy]['available']) / winBp);
            while (buy < edBuys.length) {
                console.log(edBuys[buy]);
                console.log('tokenbal: ' + Number(tokenBal));
                if ((new BigNumber(edBuys[buy]['available']) / winBp) >= parseFloat(tokenBal)) {
                    buytotal = buytotal + new BigNumber(edBuys[buy]['available']);


                    tokenBal = (tokenBal * .997);
                    console.log('buytotal max: ' + buytotal);
                    contract.methods.trade(tokenGive, (edBuys[buy]['amountGet']), tokenGet, (edBuys[buy]['amountGive']), edBuys[buy]['expires'], edBuys[buy]['nonce'], edBuys[buy]['user'], edBuys[buy]['v'], edBuys[buy]['r'], edBuys[buy]['s'], Number(tokenBal)).send({
                        from: "0x5100DAdF11113B0730829d2047B9df4DA1d80e68",
                        gas: 250000,
                        gasPrice: "10000000000"
                    }).then(function(data) {
                        console.log(data);

                    });
                    break;
                } else {

                    console.log('buytotal +1');

                    contract.methods.trade(tokenGive, (edBuys[buy]['amountGet']), tokenGet, (edBuys[buy]['amountGive']), edBuys[buy]['expires'], edBuys[buy]['nonce'], edBuys[buy]['user'], edBuys[buy]['v'], edBuys[buy]['r'], edBuys[buy]['s'], Number(edBuys[buy]['available'])).send({
                        from: "0x5100DAdF11113B0730829d2047B9df4DA1d80e68",
                        gas: 250000,
                        gasPrice: "10000000000"
                    }).then(function(data) {
                        console.log(data);



                    });
                    tokenBal = tokenBal - edBuys[buy]['available'];
                }
                console.log('loop done...');
                buy++;
            }

        }
    });
}