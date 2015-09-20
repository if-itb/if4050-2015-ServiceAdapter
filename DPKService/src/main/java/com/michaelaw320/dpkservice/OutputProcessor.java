/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.michaelaw320.dpkservice;

import java.util.ArrayList;
import org.json.JSONObject;

/**
 *
 * @author michael
 */
public class OutputProcessor {
    private String fakultas;
    private String prodi;
    private String semester;
    private int tahun;
    private String kode;
    private String mata_kuliah;
    private String sks;
    private String kelas;
    private String dosen;
    private String jumlah_peserta;
    private ArrayList peserta;
    private class InPeserta {
        public String nim;
        public String nama;
    }
    private final String source;
    
    public OutputProcessor(String document) {
        source = document;
        readData();
    }
    
    private void readData() {
        int startData = 10; //Data starts from line 11, in array 10 until len-2
        String splitted[];
        String resplit[];
        String resplit2[];
        String resplit3[];
        splitted = source.split("\n");
        fakultas = splitted[0].trim();
        prodi = splitted[1].split(":")[1].trim();
        
        //semester & tahun
        resplit = splitted[2].split(":");
        resplit2 = resplit[1].split("/");
        semester = resplit2[0].trim();
        String tahuntemp;
        tahuntemp = "20"+resplit2[1].trim();
        tahun = Integer.parseInt(tahuntemp);
        
        //kode & matkul & sks
        resplit = splitted[4].split(":");
        resplit2 = resplit[1].split("/");
        kode = resplit2[0].trim();
        resplit3 = resplit2[1].split(",");
        mata_kuliah = resplit3[0].trim();
        sks = resplit3[1].trim().split(" ")[0].trim();
        
        //kelas & dosen
        resplit = splitted[5].split(":");
        resplit2 = resplit[1].split("/");
        kelas = resplit2[0].trim();
        dosen = resplit2[1].trim();
        
        //Jumlah peserta
        resplit = splitted[splitted.length-1].split("=");
        jumlah_peserta = resplit[1].trim();
    }
    
    private InPeserta readPeserta(String line) {
        return new InPeserta();
    }
    
    public String debugPrint() {
        return prodi;
    }
    
    public String createOutputJSON() {
        JSONObject retval = new JSONObject();
        retval.put("fakultas", fakultas);
        retval.put("prodi", prodi);
        retval.put("semester", semester);
        retval.put("tahun", tahun);
        retval.put("kode", kode);
        retval.put("mata_kuliah", mata_kuliah);
        retval.put("sks", sks);
        retval.put("kelas", kelas);
        retval.put("dosen", dosen);
        retval.put("jumlah_peserta", jumlah_peserta);
        return retval.toString();
    }
    
}
