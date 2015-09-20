# README for Service Adapter Assignment on IF4050 2015

 * NIM      = 13512014
 * Name     = Muhammad Yafi
 * GithubID = yafithekid

Requreiments:
 * Gradle build tools
 * Internet connection
 * Java JDK 1.8
 * IntelliJ IDEA

How to Deploy
 1. Setup your Java and Gradle environment.
 2. Resolve gradle dependencies with IDEA (or command prompt)
 
How to Run
 1. Run the `Application.java` file.
 2. See `localhost:8080/dpk?query_params` where query_params contains:
    - `ps` is the study program code.
    - `kode` is the course code.
    - `kelas` is the class number.
 3. Example of valid request: `GET localhost:8080/dpk?ps=135&kode=IF4050&kelas=01`
 4. The server will return the most recent class data, or 404 not found if the `kode` doesn't exist.
 
Run result:
![](https://raw.githubusercontent.com/yafithekid/if4050-2015-ServiceAdapter/master/demo/smt1.PNG)

![](https://raw.githubusercontent.com/yafithekid/if4050-2015-ServiceAdapter/master/demo/smt2.PNG)
 
