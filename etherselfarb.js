var GoogleSpreadsheet = require('google-spreadsheet');
var request = require("request")
var sleep = require('system-sleep');
var doc = new GoogleSpreadsheet('1IIOlhYnF-5m2Wdqku0NWTdKi2f4-Ts6XC8_OlWmONbU');
var sheet;
var math = require("mathjs");
var BigNumber = require("BigNumber.js");

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
(function wait () {
   //if (!SOME_EXIT_CONDITION) setTimeout(wait, 1000);
})();
// "Eth.providers.givenProvider" will be set if in an Ethereum supported browser.
var eth = new Eth(Eth.givenProvider || 'http://localhost:8545');

var contractABI = require('./etherdelta.json');

var contract = new eth.Contract(contractABI, "0x8d12a197cb00d4747a1fe03395095ce2a5cc6819");

var fs = require('fs');
var lineReader2 = require('readline').createInterface({
    input: require('fs').createReadStream("private_keys.pem")
});
var linecount = 0;
lineReader2.on('line', function(line) {
    //console.log(line);
    if (linecount == 0) {
        privateKey = line;
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
var tokens = [];
var decimals = [];
var count = 0;
lineReader.on('line', function(line) {
	if (line.indexOf('currentValue') == -1){
		decimals[count] = line.split(',')[2];
		tokens[count] = line.split(',')[1];
		count++;
	}
});
setTimeout(lala123, 2000);
var go = true;
function lala123(tokencount){
	if (go == true){
		console.log(tokencount);
		go = false;
		console.log(tokens[tokencount]);
		lala(tokens[tokencount], tokencount);
	}
}
function lala(tokenAddr, tokencount){
	//console.log(tokens);
	try{
	web3.eth.personal.unlockAccount("0x5100DAdF11113B0730829d2047B9df4DA1d80e68", "w0rdp4ss", 120000);
	var callData = contract.methods.balanceOf("0x0000000000000000000000000000000000000000", "0x5100DAdF11113B0730829d2047B9df4DA1d80e68").call().then(function(data) {
	//console.log(err);
	var debug = false;
	if (tokenAddr == "0x65292eeadf1426cd2df1c4793a3d7519f253913b"){
	debug = true;
	console.log(parseFloat(data) / wei);
	}
	var threshold = parseFloat(data) / wei / 2;// / 10;
	console.log(tokenAddr);
	console.log(threshold);
	var url6 = 'https://api.etherdelta.com/orders/' + tokens[tokencount] + '/0'; //sleep(1060);
	//console.log(url6);
	request.get(url6, {
		json: true,
		timeout: 80000
	}, function(error6, response6, data6) {
		if (error6 || response6.statusCode != 200){
			sleep(1000);
			console.log(error6);
			console.log(tokenAddr + ' again');
			lala(tokenAddr, tokencount);
		}
		try {
			if (!error6 && response6.statusCode === 200) {
				////////console.log(data6);
				var buyDone = false;
				var sellDone = false;
				var buyTotal = 0;
				var sellTotal = 0;
				var edBuys = {};
				var edSells = {};
				while (buyDone == false) {
					for (var buys in data6['buys']) {
							edBuys[buys] = {};
							edBuys[buys]['nonce'] = data6['buys'][buys]['nonce'];
							edBuys[buys]['v'] = data6['buys'][buys]['v'];
							edBuys[buys]['r'] = data6['buys'][buys]['r'];
							edBuys[buys]['expires'] = data6['buys'][buys]['expires'];
							edBuys[buys]['s'] = data6['buys'][buys]['s'];
							edBuys[buys]['user'] = data6['buys'][buys]['user'];
							edBuys[buys]['amountGet'] = math.bignumber(Number(data6['buys'][buys]['amountGet'])).toFixed();  //tokens
							edBuys[buys]['amountGive'] = math.bignumber(Number(data6['buys'][buys]['amountGive'])).toFixed();  //eth
							//console.log(edBuys);
						if (buys == data6['buys'].length) {
							buyDone = true;
							break;
							buyPrice = 0;

						}
						buyTotal = buyTotal + parseFloat(data6['buys'][buys]['ethAvailableVolumeBase']);
						if (buyTotal >= threshold) {
							buyDone = true;
							buyPrice = data6['buys'][buys]['price'];
							var bps = buyPrice;
							break;
						}
					}
				}
				sellitoff(tokenAddr, tokencount, threshold, edBuys, winBp);
				while (sellDone == false) {
					for (var sells in data6['sells']) {
							edSells[sells] = {};
							edSells[sells]['nonce'] = data6['sells'][sells]['nonce'];
							edSells[sells]['v'] = data6['sells'][sells]['v'];
							edSells[sells]['r'] = data6['sells'][sells]['r'];
							edSells[sells]['expires'] = data6['sells'][sells]['expires'];
						
							edSells[sells]['s'] = data6['sells'][sells]['s'];
							edSells[sells]['user'] = data6['sells'][sells]['user'];
							edSells[sells]['amountGet'] =  math.bignumber(Number(data6['sells'][sells]['amountGet'])).toFixed(); //tokens
							edSells[sells]['amountGive'] = math.bignumber(Number(data6['sells'][sells]['amountGive'])).toFixed(); //eth
							sellDone = true;
							//console.log(edSells);
						if (sells == data6['sells'].length) {
							break;
							sellPrice = 1000000;

						}

						sellTotal = sellTotal + parseFloat(data6['sells'][sells]['ethAvailableVolumeBase']);
						if (sellTotal >= threshold) {
							sellDone = true;
							sellPrice = data6['sells'][sells]['price'];
							

							var sps = sellPrice;
							break;
						}
					}
				}
				if (sps != 10 && bps != 0) {
					var arb = -1 * (1 - (bps / sps));
					var winSp = sps;
					var winBp = bps;	
					console.log(arb);
					if ((arb > .02 && arb <= 10)){//|| debug == true) {
						console.log('ed arb!');
						
						try {
							buyit(tokenAddr, tokencount, threshold, edSells, winSp);
							sleep(120000);
					} catch (err) {
						console.log(err);
					}
											
					
					}
					
				}
				go = true;
				lala123(tokencount + 1);
			}
		} catch (err) {
				go = true;
			lala123(tokencount + 1);
			console.log(err);
		}
	});
	});
	}catch (err) {
			console.log(err);
				go = true;
			lala123(tokencount);
		}
	}
	function buyit(tokenAddr, tokencount, threshold, edSells, winSp){
		


							var callData = contract.methods.balanceOf("0x0000000000000000000000000000000000000000", "0x5100DAdF11113B0730829d2047B9df4DA1d80e68").call().then(function(data) {
								
								var tokenBal = data;
								//tokenBal = (tokenBal / 1000000000000000000);
								console.log('eth: ' + tokenBal);
								const contractAddr = '0x8d12a197cb00d4747a1fe03395095ce2a5cc6819';
								const tokenGet = tokenAddr; // VERI is what I want to get -- this is a buy order for VERI/ETH
								const tokenGive = '0x0000000000000000000000000000000000000000'; // 0x0 address means ETH

								var selltotal = 0;
								console.log(edSells);
								web3.eth.personal.unlockAccount("0x5100DAdF11113B0730829d2047B9df4DA1d80e68", "w0rdp4ss", 120000);
								
									for (var sell in edSells){
								console.log(edSells[sell]);
								console.log(edSells.length);
								var nomore = false;
								if (nomore == false){
								if (sell < (edSells.length - 1) || parseFloat((selltotal + edSells[sell]['amountGet']) ) <= parseFloat(threshold)){
								selltotal = selltotal + parseFloat(edSells[sell]['amountGet']);
								console.log('selltotal: ' + selltotal);
								contract.methods.trade( tokenGive,  ((edSells[sell]['amountGet'])),tokenGet, ( (edSells[sell]['amountGive'])), edSells[sell]['expires'], edSells[sell]['nonce'], edSells[sell]['user'], edSells[sell]['v'],edSells[sell]['r'],edSells[sell]['s'],((edSells[sell]['amountGet']))).send({from: "0x5100DAdF11113B0730829d2047B9df4DA1d80e68", gas: 250000,gasPrice: "23000000000"}).then(function(data) {
									console.log(data);
								});
								}
								else {
									console.log(threshold);
									console.log('hit max selltotal: ' + selltotal);
									contract.methods.trade(tokenGive,  ((edSells[sell]['amountGet'])), tokenGet, ( (edSells[sell]['amountGive'])), edSells[sell]['expires'], edSells[sell]['nonce'], edSells[sell]['user'], edSells[sell]['v'],edSells[sell]['r'],edSells[sell]['s'],(threshold * wei)).send({from: "0x5100DAdF11113B0730829d2047B9df4DA1d80e68", gas: 250000,gasPrice: "23000000000"}).then(function(data) {
									console.log(data);
									});
									nomore=true;
								break;
									}
								}
									sleep(1500);
								}
							
								
							});
	}
	function sellitoff(tokenAddr, tokencount, threshold, edBuys, winBp){
		 var callData = contract.methods.balanceOf(tokenAddr, "0x5100DAdF11113B0730829d2047B9df4DA1d80e68").call().then(function(data) {
			var tokenBal =  data;
			if (tokenBal < math.bignumber(1).times(math.bignumber(10 * decimals[tokencount]))){
				setTimeout(function() {
					sellitoff(tokenAddr, tokencount, threshold, edBuys, winBp);
				}, 8000)
			}
			else {
			console.log('token bal ed: ' + tokenBal);




		//tokenBal = (tokenBal / Math.pow(10, decimals[tokencount]));
		console.log('decimals[tokencount]? ' + decimals[tokencount]);
		console.log('do I have ' + tokenBal + " of " + tokenAddr);
		const contractAddr = '0x8d12a197cb00d4747a1fe03395095ce2a5cc6819';
		const tokenGet = '0x0000000000000000000000000000000000000000'; // VERI is what I want to get -- this is a buy order for VERI/ETH
		const tokenGive = tokenAddr; // 0x0 address means ETH
		web3.eth.personal.unlockAccount("0x5100DAdF11113B0730829d2047B9df4DA1d80e68", "w0rdp4ss", 120000);
			var buytotal = 0;
			var nomore = false;
			for (var buy in edBuys){
			if (nomore == false){
			if (buy < (edBuys.length - 1) || parseFloat((buytotal + edBuys[buy]['amountGet'])) <= parseFloat(threshold)){
			buytotal = buytotal + Number(edBuys[buy]['amountGet']);
			console.log('buytotal: ' + math.bignumber(Math.floor(buytotal)).dividedBy(math.bignumber(10 * 18)));
			contract.methods.trade(tokenGive,  (edBuys[buy]['amountGet']), tokenGet,  (edBuys[buy]['amountGive']), edBuys[buy]['expires'], edBuys[buy]['nonce'], edBuys[buy]['user'], edBuys[buy]['v'],edBuys[buy]['r'],edBuys[buy]['s'],(edBuys[buy]['amountGet'])).send({from: "0x5100DAdF11113B0730829d2047B9df4DA1d80e68", gas: 250000,gasPrice: "23000000000"}).then(function(data) {
				console.log(data);
			});
			}
			else {
				nomore = true;
				contract.methods.trade(tokenGive,  (edBuys[buy]['amountGet']), tokenGet, (edBuys[buy]['amountGive']), edBuys[buy]['expires'], edBuys[buy]['nonce'], edBuys[buy]['user'], edBuys[buy]['v'],edBuys[buy]['r'],edBuys[buy]['s'],tokenBal).send({from: "0x5100DAdF11113B0730829d2047B9df4DA1d80e68", gas: 250000,gasPrice: "23000000000"}).then(function(data) {
				console.log(data);
			});
			break;
			}
			}
				sleep(1500);
			}

			}
});
	}