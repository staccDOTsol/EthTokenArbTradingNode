#!/bin/sh

killall node
killall killallnode.sh
nohup ./killallnode.sh &
sleep 5s

while :
do

if [ $(ps -ef | grep -v grep | grep ed-hitbtc | wc -l) -lt 1 ]; then

    echo "less than 1 running"
	sleep 5s

   node ed-hitbtc.js &>/dev/null &




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
sleep 10s
fi
done
