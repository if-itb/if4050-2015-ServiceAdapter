# ITB Course Finder API
![ITB Course Finder API](/../screenshoot/screenshoots/running.jpg?raw=true "ITB Course Finder API")

ITB Course Finder API is an API for getting information about a course in ITB by its name and class number

## Student Information
```
NIM       : 13512028
Name      : Andre Susanto
GithubID  : andresusanto
```

## Requirement
1. All Windows/Unix operating system
2. Nodejs 0.8.x +
3. Express 3.x +

## Usage
This project is made by using **Nodejs** and **Express**. To install express with npm, issue this command in project directory: 
```
npm install express
```
and to run this project, issue this command:
```
node akademik.js
```

## Execution and Result
After the program has been started, request can be done by issuing:
```
GET /?kode=[COURSE CODE]&kelas=[CLASS NUMBER]
```

Sample execution result:

![ITB Course Finder API Result](/../screenshoot/screenshoots/result.jpg?raw=true "ITB Course Finder API Result")

The datasheet that is used for JSON output can be found in: https://www.dropbox.com/s/40rrzscor0p4qsy/JSON.md?dl=0
