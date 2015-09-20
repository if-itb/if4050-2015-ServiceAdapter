# README for Service Adapter Assignment on IF4050 2015

 * NIM      = 18212002
 * Name     = Taufik Akbar Abdullah
 * GithubID = taufika
 
##Requreiments:
 * Node JS

##How to Deploy
 1. Open terminal on the .js file location
 2. Use npm install to install dependencies. To manually install dependencies, the following modules are needed:
    a. httpdispatcher
    b. htmlparser2
 3. Run the server with `node crawler.js` and access ith through `http://127.0.0.1:8880`
 
##How to Run
 1. Server will accept GET request with format `GET /?ps=xx&kode=yy&kelas=zz` where:
    a. ps = program code. If not specified, server will search from all program and take longer response time.
    b. kode = subject code
    c. kelas = class number
 2. For example full request will look like this `GET /?ps=135&kode=IF4050&kelas=01`
 3. The returned value will be a JSON containing the class data. Error in query or non existing class will return JSON containing error message and approriate HTTP status code.
 
