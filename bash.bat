
:run
taskkill /f /im node.exe


  @start /b cmd /c node monitorarbs.js -s 2 -m 6
  
  @start /b cmd /c node monitorarbs.js -s 6 -m 10
  
  @start /b cmd /c node monitorarbs.js -s 11 -m 16
  
  @start /b cmd /c node monitorarbs.js -s 16 -m 20
  
  @start /b cmd /c node monitorarbs.js -s 20 -m 24
  
  @start /b cmd /c node monitorarbs.js -s 24 -m 28
  
  @start /b cmd /c node monitorarbs.js -s 28 -m 32
  

  @start /b cmd /c node monitorarbs.js -s 32 -m 36
  
  @start /b cmd /c node monitorarbs.js -s 36 -m 40
  
  @start /b cmd /c node monitorarbs.js -s 40 -m 44
  
  @start /b cmd /c node monitorarbs.js -s 44 -m 48
  
  @start /b cmd /c node monitorarbs.js -s 48 -m 52
  @start /b cmd /c node monitorarbs.js -s 52 -m 56
  
  @start /b cmd /c node monitorarbs.js -s 56 -m 60
  
  @start /b cmd /c node monitorarbs.js -s 60 -m 64
  
  @start /b cmd /c node monitorarbs.js -s 64 -m 68
  
  @start /b cmd /c node monitorarbs.js -s 68 -m 72
  
  @start /b cmd /c node monitorarbs.js -s 72 -m 76
  
  @start /b cmd /c node monitorarbs.js -s 76 -m 80
  

  @start /b cmd /c node monitorarbs.js -s 80 -m 84

  @start /b cmd /c node monitorarbs.js -s 84 -m 88

  @start /b cmd /c node monitorarbs.js -s 88 -m 92

  @start /b cmd /c node monitorarbs.js -s 92 -m 96

  @start /b cmd /c node monitorarbs.js -s 96 -m 100

  @start /b cmd /c node monitorarbs.js -s 100 -m 104

  @start /b cmd /c node monitorarbs.js -s 104 -m 108
  
  @start /b cmd /c node monitorarbs.js -s 108 -m 112
  ping 127.0.0.1 -n 10 > nul
  goto again
 :again
 for /f "tokens=1,*" %%a in ('tasklist ^| find /I /C "node.exe"') do set var1=%%a
 echo %var1%
 if %var1% gtr 10 ping 127.0.0.1 -n 60 > nul
 if %var1% leq 10 goto run
 goto again
