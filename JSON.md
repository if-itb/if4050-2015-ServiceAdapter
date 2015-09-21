# Service Adapter Daftar Peserta Kelas akademik.itb.ac.id

## Format Request

	Method: GET

Parameter:

	ps: Kode angka jurusan. Contoh: 135
	kode: Kode mata kuliah. Contoh: IF4050
	kelas: Kelas. Contoh: 01

Contoh request:

	GET /?ps=135&kode=IF4050&kelas=01

## Format Response

	Content-Type: application/json

Response saat berhasil:

	Status Code: 200

	Content:
	{
	    "fakultas": "Sekolah Teknik Elektro dan Informatika",
	    "prodi": "Teknik Informatika",
	    "semester": "1",
	    "tahun": 2015,
	    "kode": "IF4050",
	    "mata_kuliah": "Pembangunan Perangkat Lunak Berorientasi Service",
	    "sks": "3",
	    "kelas": "01",
	    "dosen": "Adi Mulyanto",
	    "jumlah_peserta": "50",
	    "peserta": [
	        {
	            "nim": "13511018",
	            "nama": "Tito D Kesumo Siregar"
	        },
			...
	    ]
	}

Response saat request tidak sesuai format:

	Status Code: 400

	Content:
	{
		"error": "Request tidak sesuai format"
	}

Response saat kelas tidak ditemukan:

	Status Code: 404

	Content:
	{
		"error": "Tidak ditemukan kelas dengan kode IF4051"
	}

Response saat terjadi kesalahan di server:

	Status Code: 500

	Content:
	{
		"error": "Terjadi kesalahan pada server"
	}

