<?php
/**
 * Created by PhpStorm.
 * User: Akhfa
 * Date: 9/17/2015
 * Time: 1:38 PM
 */
namespace app\models;
//use keltstr\yii2-simplehtmldom\
class Html extends \yii\base\Object
{
    public function getHtml($url)
    {
        $html = new simple_html_dom();
        return $html-> file_get_html('http://www.google.com/');
    }

    public function getLink($ps, $kode, $kelas)
    {
        $html = file_get_html('https://six.akademik.itb.ac.id/publik/daftarkelas.php?ps='.$ps.'&semester=1&tahun=2015&th_kur=2013');
            /* get link final */
            $link = null;
            foreach ($html->find('li') as $element) {
//                echo $element.'<br>';
//                echo substr($element,4,6).'<br>';
                if(substr($element,4,6) === $kode)
                {
                    $daftarKelas = str_get_html($element->children(0)->innertext);
                    foreach($daftarKelas->find('li a') as $element)
                    {
                        if($element->innertext === $kelas)
                        {
                            $link = 'https://six.akademik.itb.ac.id/publik/'.$element->href.'<br>';
                            break;
                        }
                    }
                }
            }
            if(isset($link))
                return $link;
            else
                return false;
    }

    public function getData($ps, $kode, $kelas)
    {
        $data = file_get_html($this->getLink($ps, $kode, $kelas));
        $dataPattern = '/<pre>([\w\W]+)[\n|\s]+Program Studi\s*:\s*([\w\W]+)[\n|\s]+Semester\s*:\s*(\d+)\/(\d+)[\n|\s]+Kode\/Mata Kuliah*\s*:\s*(\w{6})\s*\/\s*([\w|\W]+),\s*(\d)\s*SKS[\n|\s]+No. Kelas\/Dosen\s*:\s*(\d\d)\s*\/\s*([\w|\s|.|\']*)[\n|\s]+-*[\n|\s]+([\w|\W]+)[\n|\s*]Total Peserta = (\d+)/';

        echo $data;
        if(preg_match_all($dataPattern,$data,$data_match))
        {
//            return $data_match;
            foreach($data_match[1] as $element)
                $result["fakultas"] = $element;
//            print_r($data_match[1]).'<br>';
            foreach($data_match[2] as $element)
                $result["prodi"] = $element;
//            print_r($data_match[2]).'<br>';
            foreach($data_match[3] as $element)
                $result["semester"] = $element;
//            print_r($data_match[3]).'<br>';
            foreach($data_match[4] as $element)
                $result["tahun"] = '20'.$element;
//            print_r($data_match[4]).'<br>';
            foreach($data_match[5] as $element)
                $result["kode"] = $element;
//            print_r($data_match[5]).'<br>';
            foreach($data_match[6] as $element)
                $result["mata_kuliah"] = $element;
//            print_r($data_match[6]).'<br>';
            foreach($data_match[7] as $element)
                $result["sks"] = $element;
//            print_r($data_match[7]).'<br>';
            foreach($data_match[8] as $element)
                $result["kelas"] = $element;
//            print_r($data_match[8]).'<br>';
            foreach($data_match[9] as $element)
                $result["dosen"] = $element;
//            print_r($data_match[9]).'<br>';
            foreach($data_match[11] as $element)
                $result["jumlah_peserta"] = $element;
//            print_r($data_match[11]).'<br>';
            $result["peserta"] = array();
            foreach($data_match[10] as $element)
            {
                $regexPeserta = '/\d{3}\s*(\d{8})\s*([a-z|A-Z|\s]+)/';
                if(preg_match_all($regexPeserta, $element, $pesertaMatch))
                {
                    echo 'nama nama <br>';
                    $arrayPeserta = array();
                    for($i=0; $i<count($pesertaMatch[1]);$i++)
                    {
                        $arrayPeserta["nim"] = $pesertaMatch[1][$i];
                        $arrayPeserta["nama"] = $pesertaMatch[2][$i];
                        array_push($result["peserta"],$arrayPeserta);
//                        echo $pesertaMatch[1][$i].' '.$pesertaMatch[2][$i].'<br>';
                    }
                }
            }

//            print_r($data_match[10]).'<br>';
            return $result;
        }
        else
        {
            //kesalahan sistem
            return false;
        }
    }
}
