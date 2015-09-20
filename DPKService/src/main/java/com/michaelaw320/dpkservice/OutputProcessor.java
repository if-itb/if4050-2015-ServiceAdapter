/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.michaelaw320.dpkservice;

import java.util.ArrayList;
import org.json.JSONArray;
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
    private ArrayList<JSONObject> peserta;
    private JSONObject oPeserta;
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
        
        //Read peserta
        peserta = new ArrayList<>();
        for(int i = startData; i < splitted.length-2; i++) {
            peserta.add(readPeserta(splitted[i]));
        }
    }
    
    private JSONObject readPeserta(String line) {
        String splitted[];
        String splitted2[];
        String nim;
        String nama;
        splitted = line.trim().split("  ");
        splitted2 = splitted[0].trim().split(" ");
        JSONObject ret = new JSONObject();
        ret.put("nim", splitted2[1]);
        ret.put("nama", splitted[1]);
        return ret;
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
        JSONObject[] arrPeserta = new JSONObject[peserta.size()];
        peserta.toArray(arrPeserta);
        retval.put("peserta", arrPeserta);
        return retval.toString();
    }
    
}
