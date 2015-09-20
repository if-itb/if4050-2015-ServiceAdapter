# README for Service Adapter Assignment on IF4050 2015

 * NIM      = 13512013
 * Name     = Joshua Bezaleel Abednego
 * GithubID = joshuabezaleel

##Requirements:
 * NodeJS 4.0.0

##How to Deploy
 1. Go to the root folder of the project
 2. Install all of the dependencies by executing the command `npm install` through command prompt.
 3. Run the server by executing the command `node server.js`.
 4. Server can be accessed through `localhost:80`.
 
##How to Run
 1. Send a request in a form of `GET /?parameters...`. The parameters are :
 	- `prodi` which indicates the study program code.
 	- `kode` which indicates the course code.
 	- `kelas` which indicates the class number.
 2. Example of a complete request will be `GET /?prodi=135&kode=IF4050&kelas=01`.
 3. It will return a value in a form of JSON containing the information of the course.
 4. If there is error found, the error will be described in the JSON returned. 
 
