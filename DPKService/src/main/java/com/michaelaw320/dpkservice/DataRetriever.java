/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.michaelaw320.dpkservice;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

/**
 *
 * @author michael
 */
public class DataRetriever {
    
    public DataRetriever() {
        
    }
    
    public String RetrieveFromURL(String ps, String kode, String kelas) throws Exception {
        Document doc;
        String fullURL = Constants.SIX_URL + Constants.DAFTARKELAS_PARAM + ps + Constants.TH_SEM_PARAMS;
        try {
            doc = Jsoup.connect(fullURL).get();
            Elements links = doc.getElementsByTag("li");
            String ret = "";
            for (Element link : links) {
                if (link.toString().toLowerCase().contains(kode.toLowerCase())) {
                    Elements kelasLinks = link.getElementsByTag("a");
                    for (Element kelasLink : kelasLinks) {
                        String linkText = kelasLink.text();
                        if (linkText.equals(kelas)) {
                            String linkHref = kelasLink.attr("href");
                            try {
                            Document retval = Jsoup.connect(Constants.SIX_URL + linkHref).get();
                            Element clean = retval.getElementsByTag("pre").first();
                            ret = clean.text();
                            return ret;
                            } catch (Exception e) {
                                //Throw internal server error
                                throw new Exception();
                            }
                        }
                    }
                    //Error kelas gak nemu
                    return "{\"error\": \"Tidak ditemukan kelas dengan kode " + kode + "\"}";
                }
            }
            //Error kuliah ga ketemu
            return "{\"error\": \"Tidak ditemukan kelas dengan kode " + kode + "\"}";
        } catch (IOException ex) {
            //Error prodi ga ketemu
            return "{\"error\": \"Tidak ditemukan kelas dengan kode " + kode + "\"}";
        }

    }
    
}
