const user = '0x5100DAdF11113B0730829d2047B9df4DA1d80e68';

var fs = require('fs');
var lineReader2 = require('readline').createInterface({
  input: require('fs').createReadStream("private_keys.pem")
});
var linecount = 0;
var privateKey = "";
var hitKey = "";
var hitSecret = "";
var decimals = "";
lineReader2.on('line', function (line) {
			  console.log(line);
			  if (linecount == 0){
				  privateKey = line;
			  }
			  else if (linecount == 1){
				  hitKey = line;
			  }
			  else if (linecount == 2){
				  hitSecret = line;
			  }
			  linecount++;
});
	var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('decimals.csv')
});
function getlength(number) {
    return (number.toString().length - 2);
}

var isWin = /^win/.test(process.platform);
var isLin = /^linux/.test(process.platform);
if (isLin) {
    var creds = require('/root/EthTokenArbTradingNode/googlesheet.json');
} else if (isWin) {
    var creds = require('D:\\Projects\\EthTokenArbTradingNode\\googlesheet.json');
}
var GoogleSpreadsheet = require('google-spreadsheet');
var request = require("request");
const BigNumber = require('bignumber.js');
BigNumber.config({ ERRORS: false });
const sha256 = require('js-sha256').sha256;
const ethUtil = require('ethereumjs-util');
var sleep = require('system-sleep');
var doc = new GoogleSpreadsheet('102TvZrB0RyuBK4nqhUd3aP_zRvP8JpDRsukIEOInnwI');
var sheet;
var crypto = require("crypto");
var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
web3.eth.personal.unlockAccount("0x5100DAdF11113B0730829d2047B9df4DA1d80e68", "w0rdp4ss", 120000);
var Eth = require('web3-eth');
const wei = 1000000000000000000;
const tokwei = wei / 100000000000;
const zeroPad = function zeroPad(num, places) {
    const zero = (places - num.toString().length) + 1;
    return Array(+(zero > 0 && zero)).join('0') + num;
};

const parseToDigitsArray = function parseToDigitsArray(str, base) {
    const digits = str.split('');
    const ary = [];
    for (let i = digits.length - 1; i >= 0; i -= 1) {
        const n = parseInt(digits[i], base);
        if (isNaN(n)) return null;
        ary.push(n);
    }
    return ary;
};

const add = function add(x, y, base) {
    const z = [];
    const n = Math.max(x.length, y.length);
    let carry = 0;
    let i = 0;
    while (i < n || carry) {
        const xi = i < x.length ? x[i] : 0;
        const yi = i < y.length ? y[i] : 0;
        const zi = carry + xi + yi;
        z.push(zi % base);
        carry = Math.floor(zi / base);
        i += 1;
    }
    return z;
};

const multiplyByNumber = function multiplyByNumber(numIn, x, base) {
    let num = numIn;
    if (num < 0) return null;
    if (num === 0) return [];
    let result = [];
    let power = x;
    while (true) { // eslint-disable-line no-constant-condition
        if (num & 1) { // eslint-disable-line no-bitwise
            result = add(result, power, base);
        }
        num = num >> 1; // eslint-disable-line operator-assignment, no-bitwise
        if (num === 0) break;
        power = add(power, power, base);
    }
    return result;
};

const convertBase = function convertBase(str, fromBase, toBase) {
    const digits = parseToDigitsArray(str, fromBase);
    if (digits === null) return null;
    let outArray = [];
    let power = [1];
    for (let i = 0; i < digits.length; i += 1) {
        if (digits[i]) {
            outArray = add(outArray,
                multiplyByNumber(digits[i], power, toBase), toBase);
        }
        power = multiplyByNumber(fromBase, power, toBase);
    }
    let out = '';
    for (let i = outArray.length - 1; i >= 0; i -= 1) {
        out += outArray[i].toString(toBase);
    }
    if (out === '') out = 0;
    return out;
};

const decToHex = function decToHex(dec, lengthIn) {
    let length = lengthIn;
    if (!length) length = 32;
    if (dec < 0) {
        // return convertBase((Math.pow(2, length) + decStr).toString(), 10, 16);
        return (new BigNumber(2)).pow(length).add(new BigNumber(dec)).toString(16);
    }
    let result = null;
    try {
        result = convertBase(dec.toString(), 10, 16);
    } catch (err) {
        result = null;
    }
    if (result) {
        return result;
    }
    return (new BigNumber(dec)).toString(16);
};

const pack = function pack(dataIn, lengths) {
    let packed = '';
    const data = dataIn.map(x => x);
    for (let i = 0; i < lengths.length; i += 1) {
        if (typeof(data[i]) === 'string' && data[i].substring(0, 2) === '0x') {
            if (data[i].substring(0, 2) === '0x') data[i] = data[i].substring(2);
            packed += zeroPad(data[i], lengths[i] / 4);
        } else if (typeof(data[i]) !== 'number' && !(data[i] instanceof BigNumber) && /[a-f]/.test(data[i])) {
            if (data[i].substring(0, 2) === '0x') data[i] = data[i].substring(2);
            packed += zeroPad(data[i], lengths[i] / 4);
        } else {
            // packed += zeroPad(new BigNumber(data[i]).toString(16), lengths[i]/4);
            packed += zeroPad(decToHex(data[i], lengths[i]), lengths[i] / 4);
        }
    }
    return packed;
};

function testSig(msgIn, sig, userAddress) {
    const msg = new Buffer(msgIn.slice(2), 'hex');
    const recoveredAddress =
        `0x${ethUtil.pubToAddress(ethUtil.ecrecover(msg, sig.v, sig.r, sig.s)).toString('hex')}`;
    return recoveredAddress.toLowerCase() === userAddress.toLowerCase();
}

const sign = function sign(msgToSignIn, privateKeyIn) {
    function prefixMessage(msgIn) {
        let msg = msgIn;
        msg = new Buffer(msg.slice(2), 'hex');
        msg = Buffer.concat([
            new Buffer(`\x19Ethereum Signed Message:\n${msg.length.toString()}`),
            msg
        ]);
        msg = web3.utils.sha3(`0x${msg.toString('hex')}`, {
            encoding: 'hex'
        });
        msg = new Buffer(msg.slice(2), 'hex');
        return `0x${msg.toString('hex')}`;
    }
    const privateKey = privateKeyIn.substring(0, 2) === '0x' ?
        privateKeyIn.substring(2, privateKeyIn.length) : privateKeyIn;
    const msgToSign = prefixMessage(msgToSignIn);
    try {
        const sig = ethUtil.ecsign(
            new Buffer(msgToSign.slice(2), 'hex'),
            new Buffer(privateKey, 'hex'));
        const r = `0x${sig.r.toString('hex')}`;
        const s = `0x${sig.s.toString('hex')}`;
        const v = sig.v;
        const result = {
            r,
            s,
            v,
            msg: msgToSign
        };
        return result;
    } catch (err) {
        throw new Error(err);
    }
};
// "Eth.providers.givenProvider" will be set if in an Ethereum supported browser.
var eth = new Eth(Eth.givenProvider || 'http://localhost:8545');

var contractABI = require('./etherdelta.json');

var contract = new eth.Contract(contractABI, "0x8d12a197cb00d4747a1fe03395095ce2a5cc6819");

var threshold = .4;
const commandLineArgs = require('command-line-args')
const optionDefinitions = [{
        name: 'cur',
        alias: 'c',
        type: String
    },
    {
        name: 'bid',
        type: String,
        alias: 'b'
    },
    {
        name: 'ask',
        type: String,
        alias: 'a'
    }
]
			var tokenAddr = "";
const options = commandLineArgs(optionDefinitions)
//console.log(options['start']);
//console.log(options['max']);
function oulala123(currentValue, bidEx, askEx, tokenAddr, sheet) {
	sleep(2000);
													var edBuys = [];
														var edSells = [];
    var running = false;
    if (running == false) {
        running = true;
        bps = {};
        sps = {};
        try {
            //console.log(x);
            sleep(2);
            //console.log(Object.keys(data)[y + options['start']]);
            var currentValue = options['cur'];
			
            console.log(currentValue);
            var lalaurl = "https://api.hitbtc.com/api/1/public/symbols";
			console.log(lalaurl);
            request.get(lalaurl, {
                json: true,
                timeout: 41500
            }, function(error, response, lala) {if (error){
//sleep(5000);					
					//oulala123(currentValue, bidEx, askEx, tokenAddr, sheet);
				}
				//console.log(lala);
                var doit = false;
                for (symbol in lala['symbols']) {
                    if (currentValue + "ETH" == lala['symbols'][symbol]['symbol']) {
                        doit = true;
						var lot =  lala['symbols'][symbol]['lot'];
						console.log(lot);
						var step = lala['symbols'][symbol]['step'];
						console.log(step);
						var precise = (step.toString().length - 2);
						console.log(precise);
                    }
                }


                //currentValue = "CAT";
                //currentValue = "OMG";
                //console.log(currentValue);
                //if (options['max'] == 2){
                //currentValue = cells[0].value;
                if (true) {


                    //}
                    // else {

                    //cells[0].value = Object.keys(data)[y + options['start']].substring(4);
                    ////cells[0].save();
                    //}
                    if (currentValue.startsWith("0x")) {
                        running = false;
                        // oulala123(options['currentValue'], options['bid'], options['ask'], tokenAddr, sheet);;
                    } else {
                        //currentValue = "MCO";
                        if (currentValue != "CAT" && doit == true) {
                            //cells[19].value = "=if(R" + (y + options['start']) + "=0 ,-100, -1*(1-(S" + (y + options['start']).toString() + "/R" + (y + options['start']).toString() + ")))";				  cells[19].save();
                            ////console.log(currentValue);
                            try {
                                if (bidEx == "hit" || askEx == "hit") {
                                    var url4 = 'https://api.hitbtc.com/api/1/public/' + currentValue + 'ETH/orderbook';
                                    //console.log(url4);
                                    //sleep(1060)
									console.log(url4);
                                    request.get(url4, {
                                        json: true,
                                        timeout: 41500
                                    }, function(error, response, data4) {if (error){
//sleep(5000);					
					//oulala123(currentValue, bidEx, askEx, tokenAddr, sheet);
				}
                                        //console.log(data4);
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
                                            ////console.log(buyTotal);
                                            ////console.log(sellTotal);

                                            if (bidEx == "hit") {
                                                while (buyDone == false) {
                                                    for (var buys in data4['bids']) {
                                                        buyTotal = buyTotal + (data4['bids'][buys][1] * data4['bids'][buys][0]);
                                                        if (buys == data4['bids'].length) {
                                                            buyDone = true;
                                                            break;
                                                            buyPrice = 0;

                                                        }
                                                        ////console.log(buyTotal);
                                                        if (buyTotal >= threshold) {
                                                            buyDone = true;
                                                            buyPrice = data4['bids'][buys][0];
                                                            ////console.log(buyPrice);
                                                            /*
                                                            cells[14].value = buyPrice.toString();
                                                            cells[16].value = buyTotal.toString();
                                                            cells[14].save();
                                                            cells[16].save();
                                                            */
                                                            bps['hit'] = buyPrice;
                                                            break;
                                                        }
                                                    }
                                                }
                                            }

                                            if (askEx == "hit") {
                                                while (sellDone == false) {
                                                    for (var sells in data4['asks']) {
                                                        if (sells == data4['asks'].length) {
                                                            sellDone = true;
                                                            break;
                                                            sellPrice = 1000000;

                                                        }
                                                        sellTotal = sellTotal + (data4['asks'][sells][1] * data4['asks'][sells][0]);

                                                        ////console.log(sellTotal);
                                                        if (sellTotal >= threshold) {
                                                            sellDone = true;
                                                            sellPrice = data4['asks'][sells][0];
                                                            /*//console.log(sellPrice);
                                                            cells[13].value = sellPrice.toString();
                                                            cells[15].value = sellTotal.toString();
                                                            cells[13].save();
                                                            cells[15].save();*/
                                                            sps['hit'] = sellPrice;
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                        } catch (err) {
                                            if (err instanceof TypeError) {} else {
                                                console.log(err);
                                            }

                                            //console.log(err)
                                        }
                                    });
                                }
                                if (bidEx == "ed" || askEx == "ed") {
                                    var url6 = 'https://api.etherdelta.com/orders/' + tokenAddr + '/0'; //sleep(1060);
                                    console.log(url6);
                                    request.get(url6, {
                                        json: true,
                                        timeout: 41500
                                    }, function(error6, response6, data6) {if (error){
//sleep(5000);					
					//oulala123(currentValue, bidEx, askEx, tokenAddr, sheet);
				}

                                        try {
                                            if (!error6 && response6.statusCode === 200) {
                                                ////////console.log(data6);
                                                var buyDone = false;
                                                var sellDone = false;
                                                var buyTotal = 0;
                                                var sellTotal = 0;

                                                if (bidEx == "ed") {
                                                    while (buyDone == false) {
                                                        for (var buys in data6['buys']) {
														edBuys[buys] = {};
															edBuys[buys]['v'] = data6['buys'][buys]['v'];
															edBuys[buys]['r'] = data6['buys'][buys]['r'];
														
															edBuys[buys]['s'] = data6['buys'][buys]['s'];
															edBuys[buys]['user'] = data6['buys'][buys]['user'];
															edBuys[buys]['amountGet'] = data6['buys'][buys]['amountGet']; //tokens
															edBuys[buys]['amountGive'] = data6['buys'][buys]['amountGive']; //eth
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
                                                                ////console.log(buyPrice);
                                                                console.log('ed buy' + buyPrice);
                                                                bps['ed'] = buyPrice;
                                                                /*
                                                                			  cells[2].value = buyPrice.toString();
                                                                			  cells[4].value = buyTotal.toString();
                                                                			  cells[2].save();
                                                                			  cells[4].save();*/
                                                                break;
                                                            }
                                                        }
                                                    }
                                                }
                                                if (askEx == "ed") {
                                                    while (sellDone == false) {
                                                        for (var sells in data6['sells']) {
															//console.log(data6['sells']);
														edSells[sells] = {};
															edSells[sells]['v'] = data6['sells'][sells]['v'];
															edSells[sells]['r'] = data6['sells'][sells]['r'];
														
															edSells[sells]['s'] = data6['sells'][sells]['s'];
															edSells[sells]['user'] = data6['sells'][sells]['user'];
															edSells[sells]['amountGet'] = data6['sells'][sells]['amountGet']; //tokens
															edSells[sells]['amountGive'] = data6['sells'][sells]['amountGive']; //eth
															console.log(edSells[sells]['amountGive']);
															
                                                            if (sells == data6['sells'].length) {
                                                                sellDone = true;
                                                                break;
                                                                sellPrice = 1000000;

                                                                console.log('ed sell' + sellPrice);
                                                            }

                                                            sellTotal = sellTotal + parseFloat(data6['sells'][sells]['ethAvailableVolumeBase']);
                                                            if (sellTotal >= threshold) {
                                                                sellDone = true;
                                                                sellPrice = data6['sells'][sells]['price'];
                                                                console.log('ed sell' + sellPrice);
                                                                ////console.log(sellPrice);
                                                                /*
                                                                cells[1].value = sellPrice.toString();
                                                                cells[3].value = sellTotal.toString();
                                                                cells[1].save();
                                                                cells[3].save();
                                                                */

                                                                sps['ed'] = sellPrice;
                                                                break;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        } catch (err) {
                                            console.log(err);
                                        }
									sleep(3000);
									
                                var winBp = 0;
                                var winExBp = "";
                                var winExSp = "";
                                for (var bp in bps) {
                                    if (bps[bp] >= winBp && bps[bp] != 1000000 && bps[bp] != 0) {
                                        winBp = bps[bp];
                                        winBpEx = bp;
                                    }
                                }
                                var winSp = 10;
                                for (var sp in sps) {

                                    if (sps[sp] <= winSp && sps[sp] != 1000000 && sps[sp] != 0) {
                                        winSp = sps[sp];
                                        winSpEx = sp;
                                    }
                                }
                                console.log(winSp);
                                console.log(winBp);
                                if (winSp != 10 && winBp != 0) {
                                    var arb = -1 * (1 - (winBp / winSp));
                                    console.log(arb);
                                    if (arb > -20.01 && arb <= 10) {
                                        console.log('arb arb! ' + arb + ' ' + currentValue + ' winsp: ' + winSpEx + ' winbp: ' + winBpEx);
                                        sheet.addRow({
                                            'time': new Date().toString(),
                                            'ticker': currentValue,
                                            'bid': winBp,
                                            'ask': winSp,
                                            'arb': arb,
                                            'bid ex': winBpEx,
                                            'ask ex': winSpEx
                                        }, function(err, row) {
                                            console.log(err);
                                        });
                                        //HitBTC
                                        if (askEx == "hit") { //sell eth buy token
										console.log('hit ask');
                                            var n = require('nonce')();
											var uri = '/api/2/trading/balance';
											 var auth = "Basic " + new Buffer(hitKey + ":" + hitSecret).toString("base64");
											 request({
                                                            url: 'https://api.hitbtc.com' + uri, //
                                                            method: 'GET',
															headers : {
																"Authorization" : auth
															},
                                                            json: true,
                                                        }, (error, response, body) => {
															//console.log(body);
                                                            for (var currency in body){
																if (body[currency]['currency'] == "ETH"){
																	var qty = (parseFloat(body[currency]['available']) * .05).toFixed(precise);
																	console.log('qty!');
																}	
															}
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
															headers : {
																"Authorization" : auth
															},
												 'body': orderObject

												};
												 request(options, function (error, response, body)  {
                                                            console.log(body);
                                                        });
                                                        });
                                        } else if (bidEx == "hit") { 
                                            var n = require('nonce')();
										console.log('hit bid');//sell token get eth
											var uri = '/api/2/trading/balance';
											 var auth = "Basic " + new Buffer(hitKey + ":" + hitSecret).toString("base64");
											 request({
                                                            url: 'https://api.hitbtc.com' + uri, //
                                                            method: 'GET',
															headers : {
																"Authorization" : auth
															},
                                                            json: true,
                                                        }, (error, response, body) => {
															//console.log(body);
                                                            for (var currency in body){
																if (body[currency]['currency'] == currentValue){
																	var qty = (parseFloat(body[currency]['available']) * .05).toFixed(precise);
																	console.log('qty!');
																}	
															}
                                            console.log('bidex hit');
											const orderObject = {
                                                            clientOrderId: n().toString(),
															symbol: currentValue + "ETH",
															side: "sell",
															price: parseFloat(winSp).toFixed(precise),
															quantity: qty
                                                        };
                                                        console.log(orderObject);
											 var uri = '/api/2/order';
																	 var options = {
												url: 'https://api.hitbtc.com' + uri,
												'json': true,
												'method': 'POST',
															headers : {
																"Authorization" : auth
															},
												 'body': orderObject

												};
												 request(options, function (error, response, body)  {
                                                            console.log(body);
                                                        });
                                                        });
                                        }
                                        //ED

                                        if (askEx == "ed") { //sell eth buy token//don't kno if this works with qty...
                                            console.log(tokenAddr);

                                            console.log('askex ed');
                                            try {

                                                (eth.getBlock('latest')).then(function(data) {
                                                    var block = data.number + 10000;
                                                    console.log(block);


                                                    var callData = contract.methods.balanceOf("0x0000000000000000000000000000000000000000", "0x5100DAdF11113B0730829d2047B9df4DA1d80e68").call().then(function(data) {
														
                                                        var tokenBal = data;
                                                        console.log('eth: ' + tokenBal);
                                                        const contractAddr = '0x8d12a197cb00d4747a1fe03395095ce2a5cc6819';
                                                        const tokenGet = tokenAddr; // VERI is what I want to get -- this is a buy order for VERI/ETH
                                                        const tokenGive = '0x0000000000000000000000000000000000000000'; // 0x0 address means ETH
														tokenBal = (tokenBal / 1000000000000000000);
														
                                                        const amountGet = new BigNumber((tokenBal * .05) * winSp).times(new BigNumber(10 ** decimals)); // // 6.31 VERI 1 / 0.001623
                                                        const amountGive = new BigNumber(tokenBal * .05).times(new BigNumber(10 ** 18)); // 0.01 ETH
                                                        const expires = block; // this is a block number
														var selltotal = 0;
														console.log(edSells);
														web3.eth.personal.unlockAccount("0x5100DAdF11113B0730829d2047B9df4DA1d80e68", "w0rdp4ss", 120000);
														web3.eth.getTransactionCount("0x5100DAdF11113B0730829d2047B9df4DA1d80e68", function (data){
															var n2 = data + 1;
															for (var sell in edSells){
                                                        var n = require('nonce')();
                                                        var orderNonce = n();
														console.log(edSells);
														if (edSells[sell]['amountGet'] > 0){
														if (sell < edSells.length && (selltotal + edSells[sell]['amountGet']) <= amountGive){
														selltotal = selltotal + edSells[sell]['amountGet'];
														var callData2 = contract.methods.trade(tokenGet, new BigNumber( edSells[sell]['amountGive']), tokenGive,  new BigNumber(edSells[sell]['amountGet']), expires, n2, edSells[sell]['user'], edSells[sell]['v'],edSells[sell]['r'],edSells[sell]['s'],new BigNumber(edSells[sell]['amountGet'])).send({from: "0x5100DAdF11113B0730829d2047B9df4DA1d80e68", gasPrice: "23000000000"}).then(function(data) {
															console.log(data);
														});
														n2++;
														}
														else {
															var callData2 = contract.methods.trade(tokenGet, new BigNumber( edSells[sell]['amountGive'] ), tokenGive,  new BigNumber(edSells[sell]['amountGet']), expires, n2, edSells[sell]['user'], edSells[sell]['v'],edSells[sell]['r'],edSells[sell]['s'],new BigNumber(amountGive - sellTotal)).send({from: "0x5100DAdF11113B0730829d2047B9df4DA1d80e68", gasPrice: "23000000000"}).then(function(data) {
															console.log(data);
															});
														n2++;
															}
														}
														}
														});
													
														
                                                    });
                                                });
                                            } catch (err) {
                                                console.log(err);
                                            }
                                        } else if (bidEx == "ed") { //sell token get eth

                                                    var callData = contract.methods.balanceOf(tokenAddr, "0x5100DAdF11113B0730829d2047B9df4DA1d80e68").call().then(function(data) {
														var tokenBal =  data;
														console.log('token bal ed: ' + tokenBal);
                                            
                                            
                                            var callData = contract.methods.balanceOf(tokenAddr, "0x5100DAdF11113B0730829d2047B9df4DA1d80e68").call().then(function(data) {
                                                var tokenBal = data;
                                                console.log(tokenBal);


                                                (eth.getBlock('latest')).then(function(data) {
                                                    var block = data.number + 10000;
                                                    console.log(block);


													tokenBal = (tokenBal / Math.pow(10, decimals));
													console.log('decimals? ' + decimals);
													console.log('do I have ' + tokenBal);
													const contractAddr = '0x8d12a197cb00d4747a1fe03395095ce2a5cc6819';
													const tokenGet = '0x0000000000000000000000000000000000000000'; // VERI is what I want to get -- this is a buy order for VERI/ETH
													const tokenGive = tokenAddr; // 0x0 address means ETH
													const amountGet = new BigNumber((tokenBal * .05) * winBp).times(new BigNumber(10 ** 18)); // // 1 eth
													const amountGive = new BigNumber((tokenBal * .05)).times(new BigNumber(10 ** decimals)); // 15 tokens rate 0.066
													const expires = block; // this is a block number
													web3.eth.personal.unlockAccount("0x5100DAdF11113B0730829d2047B9df4DA1d80e68", "w0rdp4ss", 120000);
														var buytotal = 0;
														web3.eth.getTransactionCount("0x5100DAdF11113B0730829d2047B9df4DA1d80e68", function (data){
																var n2 = data + 1;
														for (var buy in edBuys){
                                                        var n = require('nonce')();
                                                        var orderNonce = n();
														if (buy != edBuys.length && (selltotal + edBuys[buy]['amountGet']) < amountGive){
														selltotal = selltotal + edBuys[buy]['amountGet'];
														var callData2 = contract.methods.trade(tokenGet,  edBuys[buy]['amountGive'], tokenGive,  edBuys[buy]['amountGet'], expires, n2, edBuys[buy]['user'], edBuys[buy]['v'],edBuys[buy]['r'],edBuys[buy]['s'],edBuys[buy]['amountGet']).send({from: "0x5100DAdF11113B0730829d2047B9df4DA1d80e68", gasPrice: "23000000000"}).then(function(data) {
															console.log(data);
														});
														n2++;
														}
														else {
															var callData2 = contract.methods.trade(tokenGet,  edBuys[buy]['amountGive'], tokenGive,  edBuys[buy]['amountGet'], expires, n2, edBuys[buy]['user'], edBuys[buy]['v'],edBuys[buy]['r'],edBuys[buy]['s'],(amountGive - buyTotal)).send({from: "0x5100DAdF11113B0730829d2047B9df4DA1d80e68", gasPrice: "23000000000"}).then(function(data) {
															console.log(data);
														});
														n2++;
														}
														}
														});

                                                });
                                            });});
									}
                                    }
                                }
                                    });
                                }
                                if (bidEx == "bit" || askEx == "bit") {
                                    var url2 = "https://bittrex.com/api/v1.1/public/getorderbook?market=ETH-" + currentValue + "&type=both";
                                    //console.log(url2);
                                    //sleep(1060)
                                    request.get(url2, {
                                        json: true,
                                        timeout: 41500
                                    }, function(error, response, data5) {if (error){
//sleep(5000);					
					//oulala123(currentValue, bidEx, askEx, tokenAddr, sheet);
				}
                                        ////////console.log(data5);
                                        var buyDone = false;
                                        var sellDone = false;
                                        var buyTotal = 0;
                                        var sellTotal = 0;
                                        ////console.log(buyTotal);
                                        ////console.log(sellTotal);
                                        try {
                                            if (bidEx == "bit") {
                                                while (buyDone == false) {
                                                    for (var buys in data5['result']['buy']) {
                                                        buyTotal = buyTotal + (data5['result']['buy'][buys]['Quantity'] * data5['result']['buy'][buys]['Rate']);
                                                        if (buys == data5['result']['buy'].length) {
                                                            buyDone = true;
                                                            break;
                                                            buyPrice = 0;

                                                        }
                                                        ////console.log(buyTotal);
                                                        if (buyTotal >= threshold) {
                                                            buyDone = true;
                                                            buyPrice = data5['result']['buy'][buys]['Rate'];
                                                            ////console.log(buyPrice);
                                                            /*
			  cells[6].value = buyPrice.toString();
			  cells[8].value = buyTotal.toString();
			  cells[6].save();
			  cells[8].save();
             */
                                                            bps['bit'] = buyPrice;
                                                            break;
                                                        }
                                                    }
                                                }
                                            }

                                            if (askEx == "bit") {
                                                while (sellDone == false) {
                                                    for (var sells in data5['result']['sell']) {
                                                        if (sells == data5['result']['sell'].length) {
                                                            sellDone = true;
                                                            break;
                                                            sellPrice = 1000000;

                                                        }
                                                        sellTotal = sellTotal + (data5['result']['sell'][sells]['Quantity'] * data5['result']['sell'][sells]['Rate']);

                                                        ////console.log(sellTotal);
                                                        if (sellTotal >= threshold) {
                                                            sellDone = true;
                                                            sellPrice = data5['result']['sell'][sells]['Rate'];
                                                            ////console.log(sellPrice);
                                                            /*
                                                            cells[5].value = sellPrice.toString();
                                                            cells[7].value = sellTotal.toString();
			  
                                                            cells[7].save();
                                                            cells[5].save(); */

                                                            sps['bid'] = sellPrice;
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                        } catch (err) {
                                            if (err instanceof TypeError) {} else {
                                                console.log(err);
                                            } //////console.log(err)
                                        }
                                    });
                                }
                                if (bidEx == "bin" || askEx == "bin") {
                                    var url3 = 'https://www.binance.com/api/v1/depth?symbol=' + currentValue + "ETH";
                                    //console.log(url3);
                                    //sleep(1060)
                                    request.get(url3, {
                                        json: true,
                                        timeout: 41500
                                    }, function(error, response, data3) {if (error){
//sleep(5000);					
					//oulala123(currentValue, bidEx, askEx, tokenAddr, sheet);
				}
                                        //////console.log(data3);
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
                                            ////console.log(buyTotal);
                                            ////console.log(sellTotal);
                                            if (bidEx == "bin") {
                                                while (buyDone == false) {
                                                    for (var buys in data3['bids']) {
                                                        buyTotal = buyTotal + (data3['bids'][buys][1] * data3['bids'][buys][0]);
                                                        if (buys == data3['bids'].length) {
                                                            buyDone = true;
                                                            break;
                                                            buyPrice = 0;

                                                        }
                                                        ////console.log(buyTotal);
                                                        if (buyTotal >= threshold) {
                                                            buyDone = true;
                                                            buyPrice = data3['bids'][buys][0];
                                                            ////console.log(buyPrice);
                                                            /*
                                                            cells[10].value = buyPrice.toString();
                                                            cells[12].value = buyTotal.toString();
                                                            cells[10].save();
                                                            cells[12].save();*/
                                                            bps['bin'] = buyPrice;
                                                            break;
                                                        }
                                                    }
                                                }
                                            }

                                            if (askEx == "bin") {
                                                while (sellDone == false) {
                                                    for (var sells in data3['asks']) {
                                                        if (sells == data3['asks'].length) {
                                                            sellDone = true;
                                                            break;
                                                            sellPrice = 1000000;

                                                        }
                                                        sellTotal = sellTotal + (data3['asks'][sells][1] * data3['asks'][sells][0]);

                                                        ////console.log(sellTotal);
                                                        if (sellTotal >= threshold) {
                                                            sellDone = true;
                                                            sellPrice = data3['asks'][sells][0];
                                                            ////console.log(sellPrice);
                                                            /*
                                                            cells[9].value = sellPrice.toString();
                                                            cells[11].value = sellTotal.toString();
                                                            cells[9].save();
                                                            cells[11].save(); */

                                                            sps['bin'] = sellPrice;
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                        } catch (err) {
                                            if (err instanceof TypeError) {} else {
                                                console.log(err);
                                            }

                                            //////console.log(err)
                                        }
                                    });
                                }
                                if (bidEx == "liq" || askEx == "liq") {
                                    var url9 = "https://api.liqui.io/api/3/depth/" + currentValue.toLowerCase() + "_eth";
                                    //console.log(url9);
                                    sleep(1);
                                    request.get(url9, {
                                        json: true,
                                        timeout: 41500
                                    }, function(error, response, data9) {if (error){
//sleep(5000);					
					//oulala123(currentValue, bidEx, askEx, tokenAddr, sheet);
				}
                                        ////////console.log(data5);
                                        var buyDone = false;
                                        var sellDone = false;
                                        var buyTotal = 0;
                                        var sellTotal = 0;
                                        ////console.log(data9);
                                        try {
                                            if (data9.success == 0) {

                                                buyDone = true;
                                                sellDone = true;
                                            }
                                        } catch (err) {}
                                        try {
                                            ////console.log(buyTotal);
                                            ////console.log(sellTotal);
                                            if (bidEx == "liq") {
                                                while (buyDone == false) {
                                                    for (var buys in data9[currentValue.toLowerCase() + '_eth']['bids']) {
                                                        buyTotal = buyTotal + (data9[currentValue.toLowerCase() + '_eth']['bids'][buys][0] * data9[currentValue.toLowerCase() + '_eth']['bids'][buys][1]);
                                                        if (buys == data9[currentValue.toLowerCase() + '_eth']['bids'].length) {
                                                            buyDone = true;
                                                            break;
                                                            buyPrice = 0;

                                                        }
                                                        ////console.log(buyTotal);
                                                        if (buyTotal >= threshold) {
                                                            buyDone = true;
                                                            buyPrice = data9[currentValue.toLowerCase() + '_eth']['bids'][buys][0];
                                                            ////console.log(buyPrice);
                                                            /*
                                                            cells[29].value = buyPrice.toString();
                                                            cells[31].value = buyTotal.toString();
                                                            cells[29].save();
                                                            cells[31].save();*/
                                                            bps['liq'] = buyPrice;
                                                            break;
                                                        }
                                                    }
                                                }
                                            }

                                            if (askEx == "liq") {
                                                while (sellDone == false) {
                                                    for (var sells in data9[currentValue.toLowerCase() + '_eth']['asks']) {
                                                        if (sells == data9[currentValue.toLowerCase() + '_eth']['asks'].length) {
                                                            sellDone = true;
                                                            break;
                                                            sellPrice = 1000000;

                                                        }
                                                        sellTotal = sellTotal + (data9[currentValue.toLowerCase() + '_eth']['asks'][sells][0] * data9[currentValue.toLowerCase() + '_eth']['asks'][sells][1]);

                                                        ////console.log(sellTotal);
                                                        if (sellTotal >= threshold) {
                                                            sellDone = true;
                                                            sellPrice = (parseFloat(data9[currentValue.toLowerCase() + '_eth']['asks'][sells][0]) * 1.05);
                                                            ////console.log(sellPrice);
                                                            /*
                                                            cells[28].value = sellPrice.toString();
                                                            cells[30].value = sellTotal.toString();
			  
                                                            cells[30].save();
                                                            cells[28].save(); */

                                                            sps['liq'] = sellPrice;
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                        } catch (err) {
                                            if (err instanceof TypeError) {} else {
                                                console.log(err);
                                            } //////console.log(err)
                                        }
                                    });
                                }
                                if (bidEx == "gate" || askEx == "gate") {
                                    var url8 = "https://api.gatecoin.com/Public/MarketDepth/" + currentValue + "ETH";

                                    //console.log(url8);
                                    sleep(1);
                                    request.get(url8, {
                                        json: true,
                                        timeout: 41500
                                    }, function(error, response, data8) {if (error){
//sleep(5000);					
					//oulala123(currentValue, bidEx, askEx, tokenAddr, sheet);
				}
                                        ////////console.log(data5);
                                        var buyDone = false;
                                        var sellDone = false;
                                        var buyTotal = 0;
                                        var sellTotal = 0;
                                        ////console.log(data8);
                                        try {
                                            if (data8.responseStatus.message != 'OK') {

                                                buyDone = true;
                                                sellDone = true;
                                            }
                                            ////console.log(buyTotal);
                                            ////console.log(sellTotal);
                                            if (bidEx == "gate") {
                                                while (buyDone == false) {
                                                    for (var buys in data8['bids']) {
                                                        buyTotal = buyTotal + (data8['bids'][buys]['price'] * data8['bids'][buys]['volume']);
                                                        if (buys == data8['bids'].length) {
                                                            buyDone = true;
                                                            break;
                                                            buyPrice = 0;

                                                        }
                                                        ////console.log(buyTotal);
                                                        if (buyTotal >= threshold) {
                                                            buyDone = true;
                                                            buyPrice = data8['bids'][buys]['price'];
                                                            ////console.log(buyPrice);
                                                            /*
                                                            cells[33].value = buyPrice.toString();
                                                            cells[35].value = buyTotal.toString();
                                                            cells[33].save();
                                                            cells[35].save();*/
                                                            bps['gate'] = buyPrice;
                                                            break;
                                                        }
                                                    }
                                                }
                                            }

                                            if (askEx == "gate") {
                                                while (sellDone == false) {
                                                    for (var sells in data8['asks']) {
                                                        if (sells == data8['asks'].length) {
                                                            sellDone = true;
                                                            break;
                                                            sellPrice = 1000000;

                                                        }
                                                        sellTotal = sellTotal + (data8['asks'][sells]['price'] * data8['asks'][sells]['volume']);

                                                        ////console.log(sellTotal);
                                                        if (sellTotal >= threshold) {
                                                            sellDone = true;
                                                            sellPrice = data8['asks'][sells]['price'];
                                                            ////console.log(sellPrice);
                                                            /*
                                                            cells[32].value = sellPrice.toString();
                                                            cells[34].value = sellTotal.toString();
			  
                                                            cells[34].save();
                                                            cells[32].save();*/
                                                            sps['gate'] = sellPrice;
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                        } catch (err) {
                                            if (err instanceof TypeError) {} else {
                                                console.log(err);
                                            } //////console.log(err)
                                        }

                                    });
                                }
                                if (bidEx == "live" || askEx == "live") {
                                    var url7 = "https://api.livecoin.net/exchange/order_book/?currencyPair=" + currentValue + "/ETH";

                                    //console.log(url7);
                                    sleep(1);
                                    request.get(url7, {
                                        json: true,
                                        timeout: 41500
                                    }, function(error, response, data7) {
				if (error){
//sleep(5000);					
					//oulala123(currentValue, bidEx, askEx, tokenAddr, sheet);
				}
                                        ////////console.log(data5);
                                        var buyDone = false;
                                        var sellDone = false;
                                        var buyTotal = 0;
                                        try {
                                            if (data7.success == false) {
                                                buyDone = true;
                                                sellDone = true;
                                            }
                                        } catch (err) {}
                                        try {
                                            var sellTotal = 0;
                                            ////console.log(buyTotal);
                                            ////console.log(sellTotal);
                                            if (bidEx == "live") {
                                                while (buyDone == false) {
                                                    for (var buys in data7['bids']) {
                                                        buyTotal = buyTotal + (parseFloat(data7['bids'][buys][0]) * parseFloat(data7['bids'][buys][1]));
                                                        if (buys == data7['bids'].length) {
                                                            buyDone = true;
                                                            break;
                                                            buyPrice = 0;

                                                        }
                                                        ////console.log(buyTotal);
                                                        if (buyTotal >= threshold) {
                                                            buyDone = true;
                                                            buyPrice = parseFloat(data7['bids'][buys][0]);
                                                            ////console.log(buyPrice);
                                                            /*
                                                            cells[37].value = buyPrice.toString();
                                                            cells[39].value = buyTotal.toString();
                                                            cells[37].save();
                                                            cells[39].save();*/
                                                            bps['live'] = buyPrice;
                                                            break;
                                                        }
                                                    }
                                                }
                                            }

                                            if (askEx == "live") {
                                                while (sellDone == false) {
                                                    for (var sells in data7['asks']) {
                                                        if (sells == data7['asks'].length) {
                                                            sellDone = true;
                                                            break;
                                                            sellPrice = 1000000;

                                                        }
                                                        sellTotal = sellTotal + (parseFloat(data7['asks'][sells][0]) * parseFloat(data7['asks'][sells][1]));

                                                        ////console.log(sellTotal);
                                                        if (sellTotal >= threshold) {
                                                            sellDone = true;
                                                            sellPrice = parseFloat(data7['asks'][sells][0]);
                                                            ////console.log(sellPrice);
                                                            /*
                                                            cells[36].value = sellPrice.toString();
                                                            cells[38].value = sellTotal.toString();
			  
                                                            cells[38].save();
                                                            cells[36].save();*/
                                                            sps['live'] = sellPrice;
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                        } catch (err) {
                                            if (err instanceof TypeError) {} else {
                                                console.log(err);
                                            } //////console.log(err)
                                        }
                                    });
                                }
                                sleep(10000);


                                running = false;
                                // oulala123(options['currentValue'], options['bid'], options['ask'], tokenAddr, sheet);;
                            } catch (err) {
                                console.log(err);
                            }
                        } // 7th




                        //cells[23].value = data['ETH_' + currentValue]['baseVolume'];
                        //cells[23].save();


                    }
                } else {
                    running = false;
                    // oulala123(options['currentValue'], options['bid'], options['ask'], tokenAddr, sheet);;
                }
            });
        } catch (err) {}
    }
}

function oulala() {
    // spreadsheet key is the long id in the sheets URL 
    doc.useServiceAccountAuth(creds, function lala() {
        doc.getInfo(function(err, info) {
			sleep(2000);
            ////console.log('Loaded doc: '+info.title+' by '+info.author.email);
            sheet = info.worksheets[0];
            ////console.log('sheet 1: '+sheet.title+' '+sheet.rowCount+'x'+sheet.colCount);
            
                     oulala123(options['currentValue'], options['bid'], options['ask'], tokenAddr, sheet);;
                
        });
    });
lineReader.on('line', function (line) {
			  if(line.startsWith(options['cur'])){
				  decimals = line.split(',')[2];
				  if (line.split(',')[0] == options['cur']){
					  
					  tokenAddr = line.split(',')[1];
					  
				  }
			  }
			});
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