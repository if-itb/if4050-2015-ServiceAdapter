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
     * @return an instance of java.lang.String
     */
    @GET
    @Consumes("application/json")
    @Produces("application/json")
    public String getJson() {
        //TODO return proper representation object
        return "asd:\"asd\"";
    }

}
