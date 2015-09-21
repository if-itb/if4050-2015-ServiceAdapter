# README for Service Adapter Assignment on IF4050 2015

 * NIM      = 13512007
 * Name     = Mamat Rahmat
 * GithubID = mamat-rahmat

Requreiments:
 * NodeJS 4.1.0

How to Deploy
 1. Go to the root folder of the project
 2. Execute command `npm install` to install all the dependencies
 3. Execute the command `node main.js` to run the server
 4. Access through localhost:8000
 
How to Run
 1. Send a request in a form of GET /?parameters.... The parameters are 
  	- `prodi` which is the study program code.
 	- `kode` which is the course code.
 	- `kelas` which is the class number.
 2. It will returned JSON containing the information of the course
 3. If error found, the information about error will be returned
