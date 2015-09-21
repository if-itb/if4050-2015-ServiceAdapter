
package com.edmundophie.adapter;

import javax.xml.bind.JAXBElement;
import javax.xml.bind.annotation.XmlElementDecl;
import javax.xml.bind.annotation.XmlRegistry;
import javax.xml.namespace.QName;


/**
 * This object contains factory methods for each 
 * Java content interface and Java element interface 
 * generated in the com.edmundophie.adapter package. 
 * <p>An ObjectFactory allows you to programatically 
 * construct new instances of the Java representation 
 * for XML content. The Java representation of XML 
 * content can consist of schema derived interfaces 
 * and classes representing the binding of schema 
 * type definitions, element declarations and model 
 * groups.  Factory methods for each of these are 
 * provided in this class.
 * 
 */
@XmlRegistry
public class ObjectFactory {

    private final static QName _GetClassParticipants_QNAME = new QName("http://adapter.edmundophie.com/", "getClassParticipants");
    private final static QName _IOException_QNAME = new QName("http://adapter.edmundophie.com/", "IOException");
    private final static QName _GetClassParticipantsResponse_QNAME = new QName("http://adapter.edmundophie.com/", "getClassParticipantsResponse");

    /**
     * Create a new ObjectFactory that can be used to create new instances of schema derived classes for package: com.edmundophie.adapter
     * 
     */
    public ObjectFactory() {
    }

    /**
     * Create an instance of {@link GetClassParticipantsResponse }
     * 
     */
    public GetClassParticipantsResponse createGetClassParticipantsResponse() {
        return new GetClassParticipantsResponse();
    }

    /**
     * Create an instance of {@link GetClassParticipants }
     * 
     */
    public GetClassParticipants createGetClassParticipants() {
        return new GetClassParticipants();
    }

    /**
     * Create an instance of {@link IOException }
     * 
     */
    public IOException createIOException() {
        return new IOException();
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link GetClassParticipants }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://adapter.edmundophie.com/", name = "getClassParticipants")
    public JAXBElement<GetClassParticipants> createGetClassParticipants(GetClassParticipants value) {
        return new JAXBElement<GetClassParticipants>(_GetClassParticipants_QNAME, GetClassParticipants.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link IOException }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://adapter.edmundophie.com/", name = "IOException")
    public JAXBElement<IOException> createIOException(IOException value) {
        return new JAXBElement<IOException>(_IOException_QNAME, IOException.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link GetClassParticipantsResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://adapter.edmundophie.com/", name = "getClassParticipantsResponse")
    public JAXBElement<GetClassParticipantsResponse> createGetClassParticipantsResponse(GetClassParticipantsResponse value) {
        return new JAXBElement<GetClassParticipantsResponse>(_GetClassParticipantsResponse_QNAME, GetClassParticipantsResponse.class, null, value);
    }

}
