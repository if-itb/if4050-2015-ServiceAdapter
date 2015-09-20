package com.yafithekid;

import com.sun.deploy.util.OrderedHashSet;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.RunnableFuture;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
public class DPKController {
    private final static String PATTERN_MAHASISWA = "[0-9]{3} [0-9]{8}(.*)";
    private final static String PATTERN_DOSEN = "No. Kelas/Dosen\t\t: [0-2]{2} / (.*)";
    private final static String PATTERN_JUMLAH_PESERTA  = "Total Peserta = ([0-9]+)";

    private static final String template = "Hello, %s!";
    private static final java.lang.String PATTERN_MATA_KULIAH = "Kode/Mata Kuliah\t: [A-Za-z0-9]{6} / (.*),";
    private static final java.lang.String PATTERN_FAKULTAS = "(.*)\n";
    private static final java.lang.String PATTERN_PRODI = "Program Studi\t\t: (.*)";
    private static final java.lang.String PATTERN_TAHUN = "Semester\t\t: [0-9]/(.*)";
    private static final java.lang.String PATTERN_SEMESTER = "Semester		: ([0-9])+";
    private static final java.lang.String PATTERN_SKS = "([0-9]) SKS";

    @RequestMapping("/dpk")
    public ResponseEntity<Object> greeting(
            @RequestParam(value = "ps", defaultValue = "-1") int ps,
            @RequestParam(value = "semester", defaultValue = "1") int semester,
            @RequestParam(value = "tahun", defaultValue = "2015") int tahun,
            @RequestParam(value = "th_kur", defaultValue = "2013") int th_kur,
            @RequestParam(value = "kode", defaultValue = "-1") String kd,
            @RequestParam(value = "kelas", defaultValue = "-1") String kelas
    ) {
        try {
            if (ps == -1 || kd.equals("-1") || kelas.equals("-1")){
                return new ResponseEntity<Object>(responseFormatError(),HttpStatus.BAD_REQUEST);
            }
            String daftarKuliah = searchDaftarKuliah(String.valueOf(ps), kd);
            if (daftarKuliah == null){
                return new ResponseEntity<Object>(responseKuliahNotFound(kd),HttpStatus.NOT_FOUND);
            }

            //String daftarKuliah = String.format("https://six.akademik.itb.ac.id/publik/daftarkelas.php?ps=%s&semester=%s&tahun=%s&th_kur=%s", ps, 1, 2015, 2013);
            Document doc = Jsoup.connect(daftarKuliah).get();
            Elements mataKuliahDom = doc.select("ol>li");
            //System.out.println(mataKuliahDom.html());
            boolean found = false;
            for(Element mataKuliah : mataKuliahDom){
                //System.out.println(mataKuliah.html().substring(0,6));
                //System.out.println(mataKuliah.html());
                if (mataKuliah.html().contains(kd)){
                    found = true;
                    Elements listKelas = mataKuliah.select("ul>li>a");
                    //System.out.println(listKelas);
                    for(Element domKelas : listKelas)
                        if (domKelas.html().equals(kelas)) {
                            String targetLink = new StringBuilder()
                                    .append("https://six.akademik.itb.ac.id/publik/")
                                    .append(domKelas.attr("href")).toString();
                            List<Mahasiswa> mahasiswas = crawlDaftarPeserta(targetLink);

                            Map<String, Object> result = new LinkedHashMap<>();
                            Document dokumen = Jsoup.connect(targetLink).get();
                            String content = (dokumen.select("pre").first()).html();
                            result.put("fakultas", getFakultas(content));
                            result.put("prodi", getProdi(content));
                            result.put("semester", getSemester(content));
                            result.put("tahun", "20" + getTahun(content));
                            result.put("kode", kd);
                            result.put("mata_kuliah", getMataKuliah(content));
                            result.put("sks", getSks(content));
                            result.put("kelas", kelas);
                            result.put("dosen", getDosen(content));
                            result.put("jumlah_peserta", getJumlahPeserta(content));
                            result.put("peserta", mahasiswas);
                            return new ResponseEntity<Object>(result,HttpStatus.OK);
                        }
                }
            }
            return new ResponseEntity<Object>(responseKuliahNotFound(kd), HttpStatus.NOT_FOUND);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<Object>(responseException(),HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    private Map<String,String> responseFormatError(){
        Map<String,String> response = new HashMap<String,String>();
        response.put("error","Request tidak sesuai format");
        return response;
    }

    private Map<String,String> responseKuliahNotFound(String kodeKuliah){
        Map<String,String> response = new HashMap<String,String>();
        response.put("error","Tidak ditemukan kelas dengan kode "+kodeKuliah);
        return response;
    }

    private Map<String,String> responseException(){
        Map<String,String> response = new HashMap<String,String>();
        response.put("error","Terjadi kesalahan pada server");
        return response;
    }

    private List<Mahasiswa> crawlDaftarPeserta(String url) throws IOException {
        Document doc = Jsoup.connect(url).get();
        Element element = doc.getElementsByTag("pre").first();
        String content = element.html();
        return getMahasiswa(content);
    }

    private String getDosen(String content){
        Pattern pattern = Pattern.compile(PATTERN_DOSEN);
        Matcher matcher = pattern.matcher(content);
        matcher.find();
        return matcher.group(1);
    }

    private String getJumlahPeserta(String content){
        Pattern pattern = Pattern.compile(PATTERN_JUMLAH_PESERTA);
        Matcher matcher = pattern.matcher(content);
        matcher.find();
        return matcher.group(1);
    }

    private String getFakultas(String content){
        Pattern pattern = Pattern.compile(PATTERN_FAKULTAS);
        Matcher matcher = pattern.matcher(content);
        matcher.find();
        return matcher.group(1);
    }

    private String getProdi(String content){
        Pattern pattern = Pattern.compile(PATTERN_PRODI);
        Matcher matcher = pattern.matcher(content);
        matcher.find();
        return matcher.group(1);
    }

    private String getSemester(String content){
        Pattern pattern = Pattern.compile(PATTERN_SEMESTER);
        Matcher matcher = pattern.matcher(content);
        matcher.find();
        return matcher.group(1);
    }

    private String getTahun(String content){
        Pattern pattern = Pattern.compile(PATTERN_TAHUN);
        Matcher matcher = pattern.matcher(content);
        matcher.find();
        return matcher.group(1);
    }

    private String getMataKuliah(String content){
        Pattern pattern = Pattern.compile(PATTERN_MATA_KULIAH);
        Matcher matcher = pattern.matcher(content);
        matcher.find();
        return matcher.group(1);
    }

    private String getSks(String content){
        Pattern pattern = Pattern.compile(PATTERN_SKS);
        Matcher matcher = pattern.matcher(content);
        matcher.find();
        return matcher.group(1);
    }


    private List<Mahasiswa> getMahasiswa(String content){
        List<Mahasiswa> ret = new ArrayList<>();
        Pattern pattern = Pattern.compile(PATTERN_MAHASISWA);
        Matcher matcher = pattern.matcher(content);
        while (matcher.find()){
            String result = matcher.group();
            int first = result.indexOf(" ");
            int second = result.indexOf(" ", first + 1);
            String nim = result.substring(first + 1, second);
            String nama = result.substring(second+1).trim();
            ret.add(new Mahasiswa(nim,nama));
        }
        return ret;
    }

    private class IsDaftarKuliahContainsKodeTask extends Thread{
        private String kd;
        private boolean isFound;
        private int semester;
        private int tahun;
        private String daftarKuliah;

        public IsDaftarKuliahContainsKodeTask(String daftarKuliah, String kd,int semester,int tahun){
            this.daftarKuliah = daftarKuliah;
            this.kd = kd;
            this.semester = semester;
            this.tahun = tahun;
        }

        @Override
        public void run() {
            Document doc = null;
            try {
                doc = Jsoup.connect(daftarKuliah).get();
            } catch (IOException e) {
                e.printStackTrace();
            }
            Elements mataKuliahDom = doc.select("ol>li");
            for(Element mataKuliah : mataKuliahDom) {
                if (mataKuliah.html().contains(kd)) {
                    this.isFound = true;
                }
            }
        }

        public String getKd() {
            return kd;
        }

        public boolean isFound() {
            return isFound;
        }

        public int getSemester() {
            return semester;
        }

        public String getDaftarKuliah() {
            return daftarKuliah;
        }

        public int getTahun() {
            return tahun;
        }
    }

    private String searchDaftarKuliah(String ps,String kd){
        List<IsDaftarKuliahContainsKodeTask> tasks = new ArrayList<>();
        for(int tahun = 2015; tahun >= 2013; tahun--){
            for(int semester = 2; semester >= 1; semester--){
                String daftarKuliah = String.format("https://six.akademik.itb.ac.id/publik/daftarkelas.php?ps=%s&semester=%s&tahun=%d&th_kur=%s", ps, semester, tahun, "2013");
                IsDaftarKuliahContainsKodeTask task = new IsDaftarKuliahContainsKodeTask(daftarKuliah,kd,semester,tahun);
                tasks.add(task);
            }
        }
        for(IsDaftarKuliahContainsKodeTask task:tasks){
            task.start();
        }
        for(IsDaftarKuliahContainsKodeTask task:tasks){
            try {
                task.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        for(int i = 0; i < tasks.size();i++){
            IsDaftarKuliahContainsKodeTask task = tasks.get(i);
            if (task.isFound()){
                //System.out.println("Semester = "+task.getSemester()+" tahun = "+task.getTahun());
                return task.getDaftarKuliah();
            }
        }
        return null;
    }

}
