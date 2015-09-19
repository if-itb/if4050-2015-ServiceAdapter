# README for Service Adapter Assignment on IF4050 2015

 * NIM      = 13512076
 * Name     = Ahmad Zaky
 * GithubID = azaky

## Requirements:

 * Node JS 4.0.0

## How to Deploy

 1. Install the dependencies by executing `npm install`.
 2. Run the server with `node server.js`. The server can be accessed through `localhost:8080`.

## How to Run

 1. The request will be in form `GET /?queryparams...`. The parameters are:
    - `ps` is the study program code.
    - `kode` is the course code.
    - `kelas` is the class number.
    - `tahun` is the year. If not specified, 2015 is assumed.
    - `semester` is the semester. If not specified, 1 is assumed.
 2. For example, a full request might look like `GET /?ps=135&kode=IF4050&kelas=01`.
 3. The returned value will be JSON containing the class data. If no class was found or there are some errors, then the response will explain what is happening with the relevant error codes.
