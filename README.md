# README for Service Adapter Assignment on IF4050 2015

 * NIM      = 13512067
 * Name     = Muhammad Husain Jakfari
 * GithubID = MuhammadHusain

## Requirements:

 * Node JS 0.12.7
 * Cheerio
 * Express

## How to Deploy

 1. Go to the root of project folder
 2. Build all dependencies (cheerio and express) with comand : `npm install <dependency name>`
 3. Run the server with type on terminal: `node myserver.js`. 
 4. The server can be accessed through `localhost:8080`.

## How to Run

 1. The request will be in form `GET /api?queryparams...`. The parameters are:
    - `ps` is the study program code.
    - `mk` is the course code.
    - `kelas` is the class number.
 2. For example, a full request might look like `GET /api?ps=135&mk=IF4050&kelas=01`.
 3. The returned value will be JSON format.
