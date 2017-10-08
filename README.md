# EthTokenArbTradingNode

killall node <br />
killall runarb.sh <br />
killall killallnode.sh <br />
rm -r EthTokenArbTradingNode <br />
git clone https://github.com/dunncreativess/EthTokenArbTradingNode <br />
cd EthTokenArbTradingNode <br />
npm install <br />
echo "your eth address" >> private_keys.pem <br />
echo "your eth private key" >> private_keys.pem <br />
echo "your hitbtc api key" >> private_keys.pem <br />
echo "your hitbc api secret" >> private_keys.pem <br />
echo "your geth eth address password" >> private_keys.pem <br />
chmod +x run* <br />
chmod +x killallnode.sh <br />
nohup ./runarb.sh & <br />
tail -f nohup.out <br />
