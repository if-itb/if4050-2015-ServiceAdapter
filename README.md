# README for Service Adapter Assignment on IF4050 2015
* NIM   : 18212009
* Nama  : Syahid Naufal Ramadhan
* GithubID  : fhals

###Requirements
* NodeJS
* Dependencies (request, express, cheerio, url)

###How to Deploy
1. Open terminal and go to the source code folder
2. Install dependencies by executing `npm install [dependency]`
3. Run the server by executing `node scraper.js`
4. The server can be accessed via `http://localhost:3000`

###How to Run
1. Request can be conducted with this format parameters `GET /?ps=135&kode=IF4050&kelas=01`. The parameters are:
   - ps : study program code (required)
   - kode : course code (required)
   - kelas : class number (default: 01)
   - tahun : year (default: 2015)
   - sem : semester (default: 1)
2. The response will be in a JSON file.

###Example of Execution Result
![alt text](https://raw.githubusercontent.com/fhals/if4050-2015-ServiceAdapter/master/screenshots/screenshot.png)
