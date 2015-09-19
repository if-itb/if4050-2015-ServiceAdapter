# README for Service Adapter Assignment on IF4050 2015

##Instruction
1. Fork this repository https://github.com/if-itb/if4050-2015-ServiceAdapter.git
2. Work on your fork --> commit --> push [as many as you want]
3. [When you are done OR the deadline] create pull request

Each participnats should indicate clearly the following data:
 * NIM      = 13512061
 * Name     = Tegar Aji Pangestu
 * GithubID = tegarajipangestu

Requirements:
 *  ```node "0.12.7"```
 *  ```express "4.13.3"```
 *  ```request "latest"```
 *  ```cheerio "latest"```

How to Run
 1. ```npm start``` at this directory
 2. navigate at browser to localhost:5000/ps=[kodeprodi]&kode=[kodematakuliah]&kelas=[kelas]
 3. Voila! You get what you want
 
How to Deploy
 1. Clone this project
 2. cd to this projct
 3. ```npm install```

##Documentation

#### HTTP Request
```json
GET http://localhost:5000/ps=[kodeprodi]&kode=[kodematakuliah]&kelas=[kelas]
```
#### Parameters

| Parameters    |               | Description  |
| ------------- |:-------------:| -------------|
| kodeprodi| required	  	| 3 digit kode prodi 	   |
| kodematakuliah         | required      |  Kode kuliah dari mata kuliah yang diinginkan 	   |
| kelas | required | Bernilai `01` jika ingin melihat kelas 1, Bernilai `02` jika ingin melihat kelas 2, |


#### Result

| Parameters    |  Description  |
| ------------- |:--------------|
|fakultas| Fakultas dari mata kuliah tersebut|
|prodi| Prodi dari mata kuliah tersebut |
|semester| Semester dari mata kuliah tersebut|
|tahun| Tahun ajaran dari mata kuliah tersebut|
|kode| Kode mata kuliah dari mata kuliah tersebut|
|mata kuliah| Nama dari mata kuliah tersebut|
|sks| Jumlah SKS dari mata kuliah tersebut|
|kelas| Kelas dari mata kuliah yang ingin dilihat|
|peserta| Array dari nim dan nama peserta kuliah|
