## Requirements
 - [GlassFish Server](https://glassfish.java.net/download.html)
 - Connection must be within the ITB network or use a vpn to the ITB network

## How to Deploy
1. 


## How to Run the SOAP Adapter
1. Move to `six-adapter-client` directory  

	 ```
	 $ cd six-adapter-soap
	 ```
2. Build war using maven  

	 ```
	 $ mvn compile war:war
	 ```	 
3. A new folder named `target` will be created inside `six-adapter-soap` folder.  
It contains war file named `six-adapter-soap-1.0-SNAPSHOT.war`  
4. Run GlassFish server:  

     ```
     PATH/TO/GLASSFISH/BIN/asadmin start-domain --domaindir /PATH/TO/GLASSFISH/DOMAINS -v [DOMAIN_FOLDER_NAME]
     ```
In my machine, the script looks like:
    ```
     Users/edmundophie/Downloads/glassfish4full/glassfish/bin/asadmin start-domain --domaindir /Users/edmundophie/Downloads/glassfish4full/glassfish/domains -v domain1
     ```
4. Go to GlassFish admin console at `localhost:4848`  
5. Select `Application` menu in the sidebar  
6. Select `Deploy...` button and locate the war file that we have just built  
7. To test the endpoint, you can go to `http://localhost:8080/six-adapter-soap-1.0-SNAPSHOT/SixAdapterService?Tester` or use the `SOAP Client` program in `six-adapter-soap-client` folder  
8. WSDL can be viewed at `http://localhost:8080/six-adapter-soap-1.0-SNAPSHOT/SixAdapterService?wsdl`
 
## How to Run the SOAP Client
1. Move to `six-adapter-client` directory  

	 ```
	 $ cd six-adapter-soap-client
	 ```
2. Build `jar` using maven `mvn`  

	 ```
	 $ mvn package
	 ```
2. Run `SixClient` from the generated `jar` in `target` folder  

	 ```
	 $ java -cp target/six-adapter-soap-client-1.0-SNAPSHOT.jar com.edmundophie.client.SixClient
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
4. Select `Deploy...` button and point the directory to the exploder war folder in ` six-adapter-rest/out/artifacts/six_adapter_rest_war_exploded`
5. To test the endpoint, you can go to `http://localhost:8080/six_adapter_soap_war_exploded/SixAdapterService?Tester`

## Other
 * NIM      : 13512095
 * Name     : Edmund Ophie
 * GithubID : edmundophie
