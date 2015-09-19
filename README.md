# README for Service Adapter Assignment on IF4050 2015

##Instruction
1. Fork this repository https://github.com/if-itb/if4050-2015-ServiceAdapter.git
2. Work on your fork --> commit --> push [as many as you want]
3. [When you are done OR the deadline] create pull request  

Each participnats should indicate clearly the following data:
 * NIM      = 13512042
 * Name     = Muhammad Reza Irvanda
 * GithubID = muzavan

Requreiments:
 * ```nodejs (tested using v0.10.34)```


How to Deploy
 1. Pull this project
 2. Activate server by run ```node main.js``` using cmd/terminal. 
 
How to Run
 1. Access "http://localhost:8081/?ps=[kode_jurusan]&kode=[kode_matakuliah]&kelas=[nomor_kelas]"
 2. [kode_jurusan] : code of department that administer the class, e.g. 135 for Informatics, 132 for Electrical Engineering
 3. [kode_matakuliah] : code of course, e.g. IF4050, IF2110, IF4150
 4. [nomor_kelas] : code of class, written in '0x' format, e.g 01, 02.
 5. Example : "http://localhost:8081/?ps=135&kode=IF4050&kelas=01", should return data for IF4050 Pembangunan Perangkat Lunak Berorientasi Service.
 
Returned data explained.
1. "fakultas" : Faculty administer the class requested
2. "prodi" : Department adminster the class requested
3. "semester" : class is held in what semester
4. "tahun" : class' year
5. "kode" : course's code
6. "mata_kuliah" : course's name
7. "sks" : academic charge for class mentioned
8. "kelas" : class' number
9. "dosen" : lecturer
10. "jumlah_peserta" : participant number
11. "peserta" : list of students in class
