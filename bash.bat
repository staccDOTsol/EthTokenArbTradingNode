:again
  @start /b cmd /c node jare.js -s 2 -m 32
  ping 127.0.0.1 -n 16 > nul
  @start /b cmd /c node jare.js -s 32 -m 52
  ping 127.0.0.1 -n 16 > nul
  @start /b cmd /c node jare.js -s 52 -m 72
  ping 127.0.0.1 -n 16 > nul
  @start /b cmd /c node jare.js -s 72 -m 92
  ping 127.0.0.1 -n 16 > nul
  @start /b cmd /c node jare.js -s 92 -m 112
  ping 127.0.0.1 -n 16 > nul
  @start /b cmd /c node jare.js -s 112 -m 132
  ping 127.0.0.1 -n 16 > nul
  @start /b cmd /c node jare.js -s 132 -m 152
  ping 127.0.0.1 -n 16 > nul
  node jare-7.js -s 152 -m 172
  ping 127.0.0.1 -n 61 > nul

goto again