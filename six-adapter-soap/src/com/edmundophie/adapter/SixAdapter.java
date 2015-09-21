package com.edmundophie.adapter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import javax.jws.WebMethod;
import javax.jws.WebService;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by edmundophie on 9/19/15.
 */
@WebService
public class SixAdapter {
    private String ps;
    private String classCode;
    private int classNumber;

    public SixAdapter() {}

    @WebMethod
    public String getClassParticipants(String ps, String classCode, int cNumber) throws IOException {
        this.ps = ps;
        this.classCode = classCode;
        this.classNumber = cNumber==0?1:cNumber;
        String classParticipantLink = null;
        String ERROR = null;
        String url =  "http://six.akademik.itb.ac.id/publik/daftarkelas.php?ps="+ ps + "&semester=1&tahun=2015&th_kur=2013";

        System.out.println("Searching class...");
        Document doc = Jsoup.connect(url).get();
        Elements elements = doc.body().select("ol>li");

        Element classElement = null;
        for(Element el:elements) {
            if(el.text().substring(0,6).equalsIgnoreCase(classCode)) {
                classElement = el;
                break;
            }
        }

        if(classElement!=null) {
            System.out.println("Searching class number...");
            Elements classCountElements = classElement.select("ul>li>a:first-child");
            int classCount = classCountElements.size();

            if (classCount >= classNumber)
                classParticipantLink = "http://six.akademik.itb.ac.id/publik/" + classCountElements.get(classNumber - 1).attr("href");
            else
                ERROR = "Class number not found";
        }
        else
            ERROR = "Class not found";

        if(ERROR!=null) {
            Map<String, String> errorMap = new HashMap<String, String>();
            if(ERROR.equalsIgnoreCase("Class number not found") || ERROR.equalsIgnoreCase("Class not found")) {
                errorMap.put("error", "Tidak ditemukan kelas dengan kode " + classCode);
            }

            System.err.println(ERROR);
            String errorJson = new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(errorMap);
            return errorJson;
        }

        return getClassInformation(classParticipantLink);
    }

    private String getClassInformation(String classParticipantLink) throws IOException {
        System.out.println(classParticipantLink);
        System.out.println("Getting class information...");

        Document doc = Jsoup.connect(classParticipantLink).get();
        Elements preElements = doc.body().select("pre");
        String preText = preElements.get(0).text();

        Map<String, Object> classInfoMap = new HashMap<String, Object>();
        List<Map<String, String>> participantMapList = new ArrayList<Map<String, String>>();

        String[] classInfoStringArr = preText.split("\n");
        for (int i = 0; i < classInfoStringArr.length; ++i) {
            String info = classInfoStringArr[i];
            if (i == 0)
                classInfoMap.put("fakultas", info);
            else if (i == 1)
                classInfoMap.put("prodi", info.substring("Program Studi\t\t: ".length()));
            else if (i == 2) {
                int prefixLength = "Semester\t\t: ".length();
                classInfoMap.put("semester", info.substring(prefixLength, prefixLength + 1));
                classInfoMap.put("tahun", Integer.parseInt("20" + info.substring(prefixLength + 2, prefixLength + 4)));
            } else if (i == 4) {
                int prefixLength = "Kode/Mata Kuliah\t: ".length();
                int commaSeparatorIdx = info.indexOf(",");
                classInfoMap.put("kode", info.substring(prefixLength, prefixLength + 6));
                classInfoMap.put("mata_kuliah", info.substring(prefixLength + 9, commaSeparatorIdx));
                classInfoMap.put("sks", info.substring(commaSeparatorIdx + 2, commaSeparatorIdx + 3));
            } else if (i == 5) {
                int prefixLength = "No. Kelas/Dosen\t\t: ".length();
                classInfoMap.put("kelas", info.substring(prefixLength, prefixLength + 2));
                classInfoMap.put("dosen", info.substring(prefixLength + 5));
                classInfoMap.put("jumlah_peserta", String.valueOf(Integer.parseInt(classInfoStringArr[classInfoStringArr.length - 3].substring(0, 3))));
            } else if (i > 9 && i < classInfoStringArr.length - 2) {
                Map<String, String> participantInfoMap = new HashMap<String, String>();
                String nim = info.substring(4, 12);
                String nama = info.substring(15);
                participantInfoMap.put("nim", nim);
                participantInfoMap.put("nama", nama.trim());

                participantMapList.add(participantInfoMap);
            }
        }
        classInfoMap.put("peserta", participantMapList);

        String json = new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(classInfoMap);
//        System.out.println(json);
        return json;
    }
}