#!/bin/sh

killall node
sleep 5s

max=5
   awka=$(awk -v min=0 -v max=33 "BEGIN{srand(); print int(min+rand()*(max-min+1))}")
   s=0
   m=$(($awka+33))
   echo $s
   echo $m
   node monitorarbs.js -s $s -m $m >> runmonitor.txt &
for i in `seq 0 $max`
do

   
   s=$((($i*33)+$awka))
   m=$((($i*33)+33+$awka))
   echo $s
   echo $m
   node monitorarbs.js -s $s -m $m  >> runmonitor.txt &
done
while :
do

if [ $(ps -ef | grep -v grep | grep node | wc -l) -lt 2 ]; then

    echo "less than 2 running"
killall node
	sleep 10s
max=5
   awka=$(awk -v min=0 -v max=33 "BEGIN{srand(); print int(min+rand()*(max-min+1))}")
   s=0
   m=$(($awka+33))
   echo $s
   echo $m
   node monitorarbs.js -s $s -m $m  >> runmonitor.txt &
for i in `seq 0 $max`
do
   s=$((($i*33)+$awka))
   m=$((($i*33)+33+$awka))
   echo $s
   echo $m
   node monitorarbs.js -s $s -m $m  >> runmonitor.txt &
done



#node jare-arb.js -s 3 -m 22 &>/dev/null &
#node jare-arb.js -s 162 -m 190 &>/dev/null &
#node jare-arb.js -s 132 -m 162 &>/dev/null &
#node jare-arb.js -s 112 -m 132 &>/dev/null &
#node jare-arb.js -s 82 -m 112 &>/dev/null &
#node jare-arb.js -s 52 -m 82 &>/dev/null &
#node jare-arb.js -s 22 -m 52 &>/dev/null &

#node monitorarbs.js -s 2 -m 2 &>/dev/null 
else
    killall node
	max=5
   awka=$(awk -v min=0 -v max=33 "BEGIN{srand(); print int(min+rand()*(max-min+1))}")
   s=0
   m=$(($awka+33))
   echo $s
   echo $m
   node monitorarbs.js -s $s -m $m  >> runmonitor.txt &
for i in `seq 0 $max`
do
   s=$((($i*33)+$awka))
   m=$((($i*33)+33+$awka))
   echo $s
   echo $m
   node monitorarbs.js -s $s -m $m  >> runmonitor.txt &
done
sleep 120s
fi
done
