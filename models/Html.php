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
        $kodeKelasPattern = "/(\w{2}\d{4}) \(/";
        if(preg_match_all($kodeKelasPattern, $html, $classMatch))
        {
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
    }
}
