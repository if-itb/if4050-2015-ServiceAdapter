(function() {

	var REGEX_ALL = /<pre>([\w\W]+)\n+.*:\s*([\w\W]+)\n+.*:\s*(\d+)\/(\d+)\n+.*:\s*([\w]+)\s*\/\s*([\w\W]+),\s*(\d+)\s*SKS\n+.*:\s*(\d+)\s*\/\s*([\w\W]+)\n+-*\n+.*\n+-+\n+([\s\S]*)-+\n+Total Peserta = (\d+)/g;
	var REGEX_PESERTA_KELAS = /\d+\s+(\w+)\s+(.*)/gm;

	module.exports = function(dpk) {
		var result = {};

		var match = REGEX_ALL.exec(dpk);
		if (match == null) {
			return {
				error: "Error while parsing dpk"
			};
		} else {
			result.fakultas = match[1];
			result.prodi = match[2];
			result.semester = match[3];
			result.tahun = 2000 + parseInt(match[4]);
			result.kode = match[5];
			result.mata_kuliah = match[6];
			result.sks = match[7];
			result.kelas = match[8];
			result.dosen = match[9];
			result.peserta = [];
			result.jumlah_peserta = match[11];

			var matchPesertaKelas = REGEX_PESERTA_KELAS.exec(match[10]);
			while (matchPesertaKelas !== null) {
				result.peserta.push({
					nim: matchPesertaKelas[1],
					nama: matchPesertaKelas[2].trim()
				});
				matchPesertaKelas = REGEX_PESERTA_KELAS.exec(match[10]);
			}
			return result;
		}
	}
})();
