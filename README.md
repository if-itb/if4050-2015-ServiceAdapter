# README for Service Adapter Assignment on IF4050 2015

##Instruction
1. Fork this repository https://github.com/if-itb/if4050-2015-ServiceAdapter.git
2. Work on your fork --> commit --> push [as many as you want]
3. [When you are done OR the deadline] create pull request  

Each participnats should indicate clearly the following data:
 * NIM      = 13512024
 * Name     = Riady Sastra Kusuma
 * GithubID = riady

Requreiments:
 * Node JS 4.0.0

How to Deploy
 1. Install dependencies by execute "npm-install"
 2. Run "node server.js". This server run on port 3000
 
How to Run
 1. The request will be in form `GET /?queryparams...`. The parameters are:
    - `ps` is the study program code.
    - `kode` is the course code.
    - `kelas` is the class number.
 2. The returned value will be JSON containing the class data. If there are some errors, then the response will be error explanation.