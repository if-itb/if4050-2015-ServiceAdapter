# README for Service Adapter Assignment on IF4050 2015

Personal Data
 * NIM      = 18212034
 * Name     = Muhammad Ibrahim Al Muwahidan
 * GithubID = almuwahidan

Requirements:
 * ```node.js```
 * ```cheerio``` module
 * ```request``` module
 * ```express``` module

How to Deploy
 1. clone this project
 2. Open terminal and navigate to this project folder
 3. run ```npm install```
 
How to Run
 1. Open terminal and navigate to this project folder
 2. Run the server using the ```node server.js``` command
 3. Enter the query via HTTP, ```localhost:8081/?prodi=[kodeProdi]&matkul=[kodeMatkul]&kelas=[kodeKelas]```
 
Parameters
 1. ```prodi``` : Kode Prodi (mis. 135)
 2. ```matkul``` : Kode Mata Kuliah, case sensitive (mis. IF3150)
 3. ```kelas``` : Nomor kelas (mis. 01)
