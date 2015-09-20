package com.yafithekid;

public class Mahasiswa {
    private final String nim;
    private final String nama;

    public Mahasiswa(String nim,String name){
        this.nim = nim;
        this.nama = name;
    }

    public Mahasiswa() {
        nim = null;
        nama = null;
    }

    public String getNama() {
        return nama;
    }

    public String getNim() {
        return nim;
    }



}
