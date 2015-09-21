# README for Service Adapter Assignment on IF4050 2015
 * NIM      = 13512053
 * Name     = Rakhmatullah Yoga Sutrisna
 * GithubID = rakhmatullahyoga

## Requreiments:
 * Node.js 4.1.0
 * Express
 * Request
 * Cheerio

## How to Deploy
 1. Install dependency dengan memasukkan perintah "npm install" melalui command prompt pada direktori root project
 2. Ketik perintah "npm start" pada command prompt untuk menjalankan server
 
## How to Run
 1. Pastikan client berada di lingkungan network ITB
 2. Pada browser atau aplikasi POSTMAN masukkan address "http://localhost:3000/?ps=<kode prodi>&kode=<kode kuliah>&kelas=<nomor kelas>"

## Execution Result

### Success response

![](https://raw.githubusercontent.com/rakhmatullahyoga/if4050-2015-ServiceAdapter/master/test/success.PNG)

### Request format error

![](https://raw.githubusercontent.com/rakhmatullahyoga/if4050-2015-ServiceAdapter/master/test/format_error.PNG)

### Class not found

![](https://raw.githubusercontent.com/rakhmatullahyoga/if4050-2015-ServiceAdapter/master/test/not_found.PNG)

### Server error

![](https://raw.githubusercontent.com/rakhmatullahyoga/if4050-2015-ServiceAdapter/master/test/server_error.PNG)
