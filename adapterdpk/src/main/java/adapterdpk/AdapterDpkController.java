package adapterdpk;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class AdapterDpkController {
	
	@RequestMapping(method = RequestMethod.GET, value = "/")
	public ResponseEntity<String> getDPK(@RequestParam int ps, @RequestParam String kode,
			@RequestParam String kelas) {
		
		return new ResponseEntity<String>(HttpStatus.OK);
	}
}
