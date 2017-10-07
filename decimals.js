var request = require("request");
var sleep = require('system-sleep');
var fs = require('fs');
fs.readFile("decimals.csv", function(err, data) {
    if (err) throw err;
    if (data.indexOf("currentValue,tokenAddr,decimals") == -1) {
        fs.writeFile("decimals.csv", "currentValue,tokenAddr,decimals\n", function(err) {
            if (err) {
                return console.log(err);
            }

        });
    }
});

sleep(2000);
var url = 'https://api.etherdelta.com/returnTicker';
//console.log(url);//sleep(1060)
function decimalWrite(x, data) {

    var currentValue = Object.keys(data)[x].substring(4);
    var tokenAddr = data[Object.keys(data)[x]]['tokenAddr'];
    fs.readFile("decimals.csv", function(err, data2) {
        if (err) throw err;
        if (data2.indexOf(tokenAddr) == -1) {
            sleep(100);
            request({
                url: "https://api.ethplorer.io/getTokenInfo/" + tokenAddr + "?apiKey=freekey",
                method: 'GET',
                json: true,
            }, (error, response, body) => {
				if (currentValue != "ETH"){
                fs.appendFile("decimals.csv", currentValue + "," + tokenAddr + "," + body.decimals + "\n", function(err) {
                    console.log(currentValue + "," + tokenAddr + "," + body.decimals);
                    if (err) {
                        return console.log(err);
                    }
                    x++; //1
                    if (x == (Object.keys(data).length - 1)) {
                        console.log('done!');
                    } else {
                        decimalWrite(x + 1, data);
                    }
                });
				}
            });
        } else {
            x++; //1
            if (x == (Object.keys(data).length - 1)) {
                console.log('done!');
            } else {
                decimalWrite(x + 1, data);
            }
        }
    });
}

function doThatThing() {
    request.get(url, {
        json: true,
        timeout: 80000
    }, function(error, response, data) {
        if (data.toString().indexOf('<title>') >= 0) {
            console.log('ed error, sleeping...');
            sleep(1000);
            doThatThing();
        } else {
            var currentValue = [];
            var tokenAddr = [];
            var x = 0;
            decimalWrite(0, data);
        }
    });
}
doThatThing();