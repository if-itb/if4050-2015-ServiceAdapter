package adapterdpk;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.json.JSONArray;
import org.json.JSONObject;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.jsoup.Jsoup;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class AdapterDpkController {
	public static final String BASE_URL = "https://six.akademik.itb.ac.id/publik/daftarkelas.php";
	public static final String SUFFIX_URL = "&semester=1&tahun=2015&th_kur=2013";
	public Pattern peserta = Pattern.compile("([0-9]{8})(.*)", Pattern.MULTILINE);
	public Pattern allData = Pattern.compile("^\\s*(.*)\n.+Studi\\s+:\\s+(.*$)\n.+:\\s(\\d)\\/(\\d+)\n+.+:\\s+(\\w+)\\s\\/\\s(.*),\\s(\\d).+\n.+:\\s(\\d+)\\s\\/\\s(.*)(.*[\n])*.+=\\s*(\\d+)", Pattern.MULTILINE);
	public Pattern nama = Pattern.compile("\\s{3}(.*$)", Pattern.MULTILINE);
	
	@RequestMapping(method = RequestMethod.GET, value = "/")
	@ResponseBody
	public ResponseEntity<String> getDPK(@RequestParam String ps, @RequestParam String kode,
			@RequestParam String kelas) throws IOException {
		HttpHeaders header = new HttpHeaders();
		header.add("Content-Type", "application/json; charset=utf-8");
		JSONObject jo = new JSONObject();
		if (ps == null || kode == null || kelas == null) {
			jo.put("error", "Request tidak sesuai format");
			return new ResponseEntity<String>(jo.toString(), header, HttpStatus.BAD_REQUEST);
		}
		Document doc = Jsoup.connect(BASE_URL + "?ps=" + ps + SUFFIX_URL).get();
		if (doc == null) {
			jo.put("error", "Terjadi kesalahan pada server");
			return new ResponseEntity<String>(jo.toString(), header, HttpStatus.SERVICE_UNAVAILABLE);
		}
		List<String> parsedData = new ArrayList<String>();
		List<String> dataPeserta = new ArrayList<String>();
		
		Elements classList = doc.select("ol li");
		Element itElm = classList.get(0);
		int i = 0;
		while (!itElm.text().contains(kode) && i < classList.size()-1) {
			i++;
			itElm = classList.get(i);
		}
		if (itElm.text().contains(kode)) {
			Elements classNo = itElm.select("ul li");
			Element itClass = classNo.get(0);
			int j = 0;
			while (!itClass.text().contains(kelas) && j < classNo.size()-1) {
				j++;
				itClass = classNo.get(i);
			}
			if (itClass.text().contains(kelas)) {
				System.out.println(kode + kelas + " ada");
				Element link = itClass.select("a").first();
				String strLink = link.attr("abs:href");
//				jo.put("link", strLink);
				Document doc2 = Jsoup.connect(strLink).get();
				Elements data = doc2.getElementsByTag("pre");
//				jo.put("raw_retval", data.text());
				Matcher m1 = allData.matcher(data.text());
//				m1.matches();
				while (m1.find()) {
					parsedData.add(m1.group());
					jo.put("fakultas", m1.group(1));
					jo.put("prodi", m1.group(2));
					jo.put("semester", m1.group(3));
					jo.put("tahun", "20" + m1.group(4));
					jo.put("kode", m1.group(5));
					jo.put("mata_kuliah", m1.group(6));
					jo.put("sks", m1.group(7));
					jo.put("kelas", m1.group(8));
					jo.put("dosen", m1.group(9));
					jo.put("jumlah_peserta", m1.group(11));
				}
				JSONArray jarr = new JSONArray();
				
				Matcher m2 = peserta.matcher(data.text());
				
				while (m2.find()) {
					dataPeserta.add(m2.group());
					for (int k = 0 ; k < dataPeserta.size() ; k++) {
						System.out.println(dataPeserta.get(k).toString());
						JSONObject tempjo = new JSONObject();
						String[] tempStr = dataPeserta.get(k).toString().split("\\s+", 2);
						tempjo.put("nim", tempStr[0]);
						System.out.println(tempStr[0]);
						System.out.println(tempStr[1]);
						tempjo.put("nama", tempStr[1]);
						jarr.put(tempjo);
					}
					
				}
				jo.put("peserta", jarr);
			}
			else {
				jo.put("error", "Tidak ditemukan kelas dengan kode " + kode);
				return new ResponseEntity<String>(jo.toString(), header, HttpStatus.NOT_FOUND);
			}
		}
			
		return new ResponseEntity<String>(jo.toString(), header, HttpStatus.OK);
	}
	
}
