/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.michaelaw320.dpkservice;

import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.PathParam;
import javax.ws.rs.Consumes;
import javax.ws.rs.Produces;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

/**
 * REST Web Service
 *
 * @author michael
 */
@Path("getdpk")
public class GetdpkResource {

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of GetdpkResource
     */
    public GetdpkResource() {
    }

    /**
     * Retrieves representation of an instance of com.michaelaw320.dpkservice.GetdpkResource
     * @param ps
     * @param kode
     * @param kelas
     * @return an instance of java.lang.String
     */
    @GET
    @Consumes("application/json")
    @Produces("application/json")
    public Response getJson(@QueryParam("ps") String ps, @QueryParam("kode") String kode, @QueryParam("kelas") String kelas) {
        try {
            if (!ps.isEmpty() && !kode.isEmpty() && !kelas.isEmpty()) {
                //Retrieve Data, preproses
                //return error 404 if not found
                DataRetriever retriever = new DataRetriever();
                String retval = retriever.RetrieveFromURL(ps, kode, kelas);
                if (retval.equals("{\"error\": \"Tidak ditemukan kelas dengan kode " + kode + "\"}")) {
                    return Response.status(404).entity(retval).build();
                } else {
                    //Transform dokumen jadi JSON
                    return Response.status(200).entity(retval).build();
                }
            } else {
                return Response.status(400).entity("{error:\"Request tidak sesuai format\"}").build();
            }
        } 
        catch (NullPointerException npe) {
            return Response.status(400).entity("{error:\"Request tidak sesuai format\"}").build();
        }
        catch (Exception e) {
            return Response.status(500).entity("{error:\"Terjadi kesalahan pada server\"}").build();
        }
        
    }

}
