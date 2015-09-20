# README for Service Adapter Assignment on IF4050 2015 #

- NIM      = 13512036
- Name     = Riva Syafri Rachmatullah
- GithubID = rivasyafri

## Requirements: ##

- Node JS 4.1.0
- Cheerio
- Express

## How to Deploy ##

 1. Install the dependencies by executing `npm install`.
 2. Run the server with `node apps.js`. The server can be accessed through `localhost:8080`.

## How to Run

1. The request will be in form 

		
		`GET /dpk?ps=xxx&kode=yyzzzz&kelas=aa`.
		 
	
	where the parameters are:
    - `ps` is the study program code.
    - `kode` is the course code.
    - `kelas` is the class number.

2. For example, a full request might look like 

		`GET /dpk?ps=135&kode=IF4050&kelas=01`.

3. The returned value will be JSON containing the data. If there are some errors, then the response will explain what is happening relevant to error codes.
