# README for Service Adapter Assignment on IF4050 2015

##Instruction
1. Fork this repository https://github.com/if-itb/if4050-2015-ServiceAdapter.git
2. Work on your fork --> commit --> push [as many as you want]
3. [When you are done OR the deadline] create pull request  

Each participnats should indicate clearly the following data:
 * NIM      = 18212035
 * Name     = Ghani Ruhman
 * GithubID = ghaniruhman

Requirements:
 * Node JS 4.0.0
 * 
 *
 
How to Deploy
 1. install dependencies by using "npm install" command
 2. run index.js
 3. access it through localhost:8081
 4. 
 
How to Run
 1. The required parameters are:
     - 'ps': major code
     - 'kode': course code
     - 'kelas': class number
     tahun (year) and semester has its own default number
 2. Example of a full request: localhost:8081/?ps=135&kode=IF4050&kelas=01
 3. The result of the request will be in a form of JSON
 
 Execution Result
 
 Below is the successful request result:
 ![](https://github.com/ghaniruhman/if4050-2015-ServiceAdapter/blob/master/status-200.PNG)
 
 Below is the result when there are no match:
 ![](https://github.com/ghaniruhman/if4050-2015-ServiceAdapter/blob/master/status-400.PNG)
 ![](https://github.com/ghaniruhman/if4050-2015-ServiceAdapter/blob/master/status-404.PNG)
 
