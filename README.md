# README for Service Adapter Assignment on IF4050 2015

##Instruction
1. Fork this repository https://github.com/if-itb/if4050-2015-ServiceAdapter.git
2. Work on your fork --> commit --> push [as many as you want]
3. [When you are done OR the deadline] create pull request  

Each participnats should indicate clearly the following data:
 * NIM      = 13513601
 * Name     = Akhmad Fakhoni Listiyan Dede
 * GithubID = akhfa

Requreiments:
 * Composer
 * Yii2

How to Deploy
 1. Clone this repository di dalam web browser directory
 2. Go to project directory
 3. composer global require "fxp/composer-asset-plugin:~1.0.3"
 4. composer update
 5. chmod -R 777 runtime
 6. chmod -R 777 web/assets
 7. chmod 777 yii.php
 
How to Run
 1. Akses http://localhost/clone-folder/web/html/?ps=133&kode=TF2102&kelas=01
 2. Change ps, kode, and kelas value
 
 Screenshoot
 
 ![Success Request](screenshoot/200.png?raw=true "Success Request")
 ![Bad Request](screenshoot/400.png?raw=true "Bad Request")
 ![Request not found](screenshoot/404.png?raw=true "Request not found")
 ![Kesalahan Server](screenshoot/500.png?raw=true "Kesalahan Server")