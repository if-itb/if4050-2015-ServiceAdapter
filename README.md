# README for Service Adapter Assignment on IF4050 2015

##Instruction
NIM      = 18212006
Name     = Nadhira Afriani
GithubID = nadhiraafi

##Requirements:
 * Node JS

##How to Deploy
 1. Open terminal and go to the directory where server.js is placed
 2. Execute `npm install` to install dependencies
 3. Run the server with `node server.js`. The server can now be accessed through `localhost:8080`
 4.
 
##How to Run
 1. The server accepts GET request with 3 necessary parameters:
   * `ps` : study program code
   * `kode` : course code
   * `kelas` : class number
   An example of acceptable requests is  `GET \?ps=182&kode=II4033&kelas=01`
 2. The response will be JSON containing the class data. If an error occurs, the response will contain the error description.
 
