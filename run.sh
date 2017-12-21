#!/bin/sh

killall node
sleep 5s

max=9
   awka=$(awk -v min=2 -v max=5 "BEGIN{srand(); print int(min+rand()*(max-min+1))}")
   s=2
   m=$((($awka+5)+2))
   echo $s
   echo $m
   node monitorarbs.js -s $s -m $m &>/dev/null &
   s=5
   m=$((($awka+5)+5))
   echo $s
   echo $m
   node monitorarbs.js -s $s -m $m &>/dev/null &
for i in `seq 1 $max`
do

   
   s=$((($i*5)+$awka))
   m=$(((($i*5)+$awka)+5))
   echo $s
   echo $m
   node monitorarbs.js -s $s -m $m &>/dev/null &
done
while :
do

if [ $(ps -ef | grep -v grep | grep node | wc -l) -lt 8 ]; then

    echo "less than 8 running"
	sleep 30s
killall node
	sleep 10s
max=9
   awka=$(awk -v min=2 -v max=5 "BEGIN{srand(); print int(min+rand()*(max-min+1))}")
   s=2
   m=$((($awka+5)+2))
   echo $s
   echo $m
   node monitorarbs.js -s $s -m $m &>/dev/null &
   s=5
   m=$((($awka+5)+5))
   echo $s
   echo $m
   node monitorarbs.js -s $s -m $m &>/dev/null &
for i in `seq 1 $max`
do
   s=$((($i*5)+$awka))
   m=$(((($i*5)+$awka)+5))
   echo $s
   echo $m
   node monitorarbs.js -s $s -m $m &>/dev/null &
done

sleep 20s


#node jare-arb.js -s 3 -m 22 &>/dev/null &
#node jare-arb.js -s 162 -m 190 &>/dev/null &
#node jare-arb.js -s 132 -m 162 &>/dev/null &
#node jare-arb.js -s 112 -m 132 &>/dev/null &
#node jare-arb.js -s 82 -m 112 &>/dev/null &
#node jare-arb.js -s 52 -m 82 &>/dev/null &
#node jare-arb.js -s 22 -m 52 &>/dev/null &

#node jare.js -s 2 -m 2 &>/dev/null 
else
    echo "8 or more running"
sleep 10s
fi
done
