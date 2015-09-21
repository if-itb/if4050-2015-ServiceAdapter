# README for Service Adapter Assignment on IF4050 2015

## Requirements:
Both SOAP & REST adapter require glassfish server:
 - [https://glassfish.java.net/download.html](GlassFish Server)


## How to Deploy
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
4. Select `Deploy...` button and point the directory to the exploded war folder in `six-adapter-soap/out/artifacts/six_adapter_soap_war_exploded`
5. To test the endpoint, you can go to `http://localhost:8080/six_adapter_soap_war_exploded/SixAdapterService?Tester`
 
## How to Run the SOAP Client
1. Move to `six-adapter-client` directory  

	 ```
	 $ cd six-adapter-soap-client
	 ```
2. Build using maven  

	 ```
	 $ mvn package
	 ```
2. Run `SixClient`  

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
 * NIM      = 13512095
 * Name     = Edmund Ophie
 * GithubID = edmundophie
