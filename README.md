# README for Service Adapter Assignment on IF4050 2015

##Instruction
1. Fork this repository https://github.com/if-itb/if4050-2015-ServiceAdapter.git
2. Work on your fork --> commit --> push [as many as you want]
3. [When you are done OR the deadline] create pull request  

Each participnats should indicate clearly the following data:
 * NIM      = 13512093
 * Name     = Jonathan Sudibya
 * GithubID = ClearingPath

Requreiments:
 * NodeJS
 * Express (NodeJS dependency)
 * Cheerio (NodeJS dependency)

How to Deploy
 1. Go to the root of the project folder and open terminal
 2. Install NodeJS dependency with command : `npm install <dependency>`
 3. Run the server with command : `node server.js`
 4. There will be notification where the server is address (the default setting is : `localhost:2121`)
 
How to Run
 1. To get a request from server, type `localhost:2121\?queryparams`. Where the parameters are :
 	- `ps` is the study program code. (in 3 digits. ex: 135)
 	- `mk` is the couse code. (ex : IF4091)
 	- `kelas` is the class number. (in 2 digits. ex : 01,02,etc)
 	- Every query seperated with `&`
 2. Full example of the url is `localhost:2121\?ps=135&mk=IF4091&kelas=01`. It should returns a json containing all information about that class.
 
