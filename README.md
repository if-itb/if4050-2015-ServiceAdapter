# README for Service Adapter Assignment on IF4050 2015

##Instruction
1. Fork this repository https://github.com/if-itb/if4050-2015-ServiceAdapter.git
2. Work on your fork --> commit --> push [as many as you want]
3. [When you are done OR the deadline] create pull request  

Each participnats should indicate clearly the following data:
 * NIM      = 1[35|82]+XXYYY
 * Name     = XXXXXXX
 * GithubID = YYYY

## Requirements:
Both SOAP & REST adapter require glassfish server:
 - GlassFish Server


How to Deploy
1. 


## How to Run the SOAP Adapter
1. Run GlassFish server using:  

     ```
     PATH/TO/GLASSFISH/BIN/asadmin start-domain --domaindir /PATH/TO/GLASSFISH/DOMAINS -v [DOMAIN_FOLDER_NAME]
     ```
In my machine, the script would look like:
    ```
     Users/edmundophie/Downloads/glassfish4full/glassfish/bin/asadmin start-domain --domaindir /Users/edmundophie/Downloads/glassfish4full/glassfish/domains -v domain1
     ```
2. Go to GlassFish admin console at `localhost:4848`
3. Select `Application` menu in the sidebar
4. Select `Deploy...` button and point the directory to the exploded war folder in `six-adapter-soap/out/artifacts/six_adapter_soap_war_exploded/
`
5. To test the endpoint, you can go to `http://localhost:8080/six_adapter_soap_war_exploded/SixAdapterService?Tester`
 
## How to Run the SOAP Client
1. Move to `six-adapter-client` directory
	 ```
	 cd six-adapter-soap-client
	 ```
2. Compile using maven
	 ```
	 mvn package
	 ```
2. Run `SixClient`
	 ```
	 java -cp target/six-adapter-soap-client-1.0-SNAPSHOT.jar com.edmundophie.client.SixClient
	 ```
3. Input your `Kode Prodi`, `Kode Mata Kuliah`, and `Kelas`


## How to Run the REST Adapter
1. Run GlassFish server using:  

     ```
     PATH/TO/GLASSFISH/BIN/asadmin start-domain --domaindir /PATH/TO/GLASSFISH/DOMAINS -v [DOMAIN_FOLDER_NAME]
     ```
In my machine, the script would look like:
    ```
     Users/edmundophie/Downloads/glassfish4full/glassfish/bin/asadmin start-domain --domaindir /Users/edmundophie/Downloads/glassfish4full/glassfish/domains -v domain1
     ```
2. Go to GlassFish admin console at `localhost:4848`
3. Select `Application` menu in the sidebar
4. Select `Deploy...` button and point the directory to the exploder war folder in `out/artifacts/six_adapter_war_exploded`
5. To test the endpoint, you can go to `http://localhost:8080/six_adapter_war_exploded/SixAdapterService?Tester`
