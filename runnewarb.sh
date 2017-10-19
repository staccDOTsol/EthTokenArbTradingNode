#!/bin/sh

killall node
killall killallnode.sh
nohup /root/EthTokenArbTradingNodeAct/killallnode.sh &
sleep 5s

	
   nohup node /root/EthTokenArbTradingNodeAct/monitornewarb.js &
   nohup node /root/EthTokenArbTradingNodeAct/newarb2.js -a "bittrex" -b "hitbtc" -p "ETHADX" &

   nohup node /root/EthTokenArbTradingNodeAct/newarb2.js -a "bittrex" -b "hitbtc" -p "ETHOMG" &
   nohup node /root/EthTokenArbTradingNodeAct/newarb2.js -a "bittrex" -b "hitbtc" -p "ETHFUN" &
   nohup node /root/EthTokenArbTradingNodeAct/newarb2.js -a "bittrex" -b "hitbtc" -p "ETHSNT" &
   nohup node /root/EthTokenArbTradingNodeAct/newarb2.js -a "bittrex" -b "hitbtc" -p "ETHPAY" &
while :
do

if [ $(ps -ef | grep -v grep | grep newarb2.js | wc -l) -lt 4 ]; then

    echo "less than 4 newarb2 running"
   killall node
   sleep 10s
   
   nohup node /root/EthTokenArbTradingNodeAct/monitornewarb.js &
   nohup node /root/EthTokenArbTradingNodeAct/newarb2.js -a "bittrex" -b "hitbtc" -p "ETHADX" &

   nohup node /root/EthTokenArbTradingNodeAct/newarb2.js -a "bittrex" -b "hitbtc" -p "ETHOMG" &
   nohup node /root/EthTokenArbTradingNodeAct/newarb2.js -a "bittrex" -b "hitbtc" -p "ETHFUN" &
   nohup node /root/EthTokenArbTradingNodeAct/newarb2.js -a "bittrex" -b "hitbtc" -p "ETHSNT" &
   nohup node /root/EthTokenArbTradingNodeAct/newarb2.js -a "bittrex" -b "hitbtc" -p "ETHPAY" &
sleep 30s



#node jare-arb.js -s 3 -m 22 &>/dev/null &
#node jare-arb.js -s 162 -m 190 &>/dev/null &
#node jare-arb.js -s 132 -m 162 &>/dev/null &
#node jare-arb.js -s 112 -m 132 &>/dev/null &
#node jare-arb.js -s 82 -m 112 &>/dev/null &
#node jare-arb.js -s 52 -m 82 &>/dev/null &
#node jare-arb.js -s 22 -m 52 &>/dev/null &

#node monitorarbs.js -s 2 -m 2 &>/dev/null 
else
    echo "1 or more running"
sleep 30s
fi
done
