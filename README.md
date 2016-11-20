# README for Service Adapter Assignment on IF4050 2015
 * NIM      = 13512053
 * Name     = Rakhmatullah Yoga Sutrisna
 * GithubID = [rakhmatullahyoga](https://github.com/rakhmatullahyoga)

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
Response berikut didapat ketika client melakukan request dengan format parameter url yang lengkap dan tersedia pada data DPK.
![](https://raw.githubusercontent.com/rakhmatullahyoga/if4050-2015-ServiceAdapter/master/test/success.PNG)

### Request format error
Response berikut didapat ketika client melakukan request dengan format parameter url yang tidak lengkap atau salah.
![](https://raw.githubusercontent.com/rakhmatullahyoga/if4050-2015-ServiceAdapter/master/test/format_error.PNG)

### Class not found
Response berikut didapat ketika client melakukan request dengan format parameter url yang lengkap dan benar, namun tidak terdapat data yang diminta pada DPK.
![](https://raw.githubusercontent.com/rakhmatullahyoga/if4050-2015-ServiceAdapter/master/test/not_found.PNG)

### Server error
Response berikut didapat ketika terjadi kesalahan pada server yang disebabkan tidak tersedianya koneksi menuju jaringan ITB.
![](https://raw.githubusercontent.com/rakhmatullahyoga/if4050-2015-ServiceAdapter/master/test/server_error.PNG)
