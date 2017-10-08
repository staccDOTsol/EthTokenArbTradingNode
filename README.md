# EthTokenArbTradingNode

killall node
killall runarb.sh
killall killallnode.sh
rm -r EthTokenArbTradingNode
git clone https://github.com/dunncreativess/EthTokenArbTradingNode
cd EthTokenArbTradingNode
npm install
echo "your eth address" >> private_keys.pem
echo "your eth private key" >> private_keys.pem
echo "your hitbtc api key" >> private_keys.pem
echo "your hitbc api secret" >> private_keys.pem
echo "your geth eth address password" >> private_keys.pem
chmod +x run*
chmod +x killallnode.sh
nohup ./runarb.sh &
tail -f nohup.out
