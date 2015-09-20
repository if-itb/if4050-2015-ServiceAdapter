<?php
/**
 * Created by PhpStorm.
 * User: Akhfa
 * Date: 9/17/2015
 * Time: 1:42 PM
 */
namespace app\controllers;

use Yii;
use app\models\Html;
use yii\web\Controller;
include "simple_html_dom.php";

class HtmlController extends Controller
{
    public function actionIndex()
    {
        // regex semua: ([\w\W]+)\n+Program Studi\s*:\s*([\w\W]+)\n+Semester\s*:\s*(\d+)/(\d+)\n+Kode/Mata Kuliah*\s*:\s*(\w{6})\s*/\s*([\w|\W]+),\s*(\d)\s*SKS\n+No. Kelas/Dosen\s*:\s*(\d\d)\s*/\s*([\w|\W]+)\n+-*\n+[\w|\W]*\n+-*\n+([\s|\S]*)-\n+Total Peserta\s*=\s*(\d*)
        // reges peserta: \d{3}\s*(\d{8})\s*([\w|\W]*)\n
        $html = file_get_html('https://six.akademik.itb.ac.id/publik/daftarkelas.php?ps=230&semester=1&tahun=2015&th_kur=2013');
        $kodeKelasPattern = "/(\w{2}\d{4}) \(/";
//        $linkPattern = "/kelas : <a href=\W([\w|\W]+)<\/\w>/";
        if(preg_match_all($kodeKelasPattern, $html, $classMatch))
        {
            /* masih error indexingnya */
            $classIdx = array_search("TK5101",$classMatch[1]);
            $idx = 0;
//            foreach($html->find('li a') as $element) {
////                echo $element. '<br>';
//                echo $element->innertext.'<br>';
//                if($element->innertext === '01')
//                {
//                    $idx++;
//                }
//                if($idx == $classIdx)
//                {
//                    echo $element->href;
//                }
////                echo 'children0 = ' . $element->children(0)->outertext . '<br>';
////                echo 'children1 = ' . $element->children(1)->outertext . '<br>';
//            }

            /* get link final */
//            foreach ($html->find('li') as $element) {
////                echo $element.'<br>';
////                echo substr($element,4,6).'<br>';
//                if(substr($element,4,6) === "TK5102")
//                {
//                    $daftarKelas = str_get_html($element->children(0)->innertext);
//                    foreach($daftarKelas->find('li a') as $element)
//                    {
//                        if($element->innertext === '01')
//                            $link = echo 'https://six.akademik.itb.ac.id/publik/'.$element->href.'<br>';
//                    }
//                }
//            }


//            $kelas = file_get_html($link)
            $html_model = new Html();
            if($link = $html_model->getLink('230','TK5001','02'))
                echo $link;
            else
                echo 'not found ';


//            foreach($html->find('a') as $element)
//                echo $element->href . '<br>';
//            echo "jumlahLink = ".count($html->find('a')) . '<br>';
//            echo "jumlahKelas = ".count($classMatch[1]);
//            print_r ($linkMatch[1]);
//
            //print_r($match[1]);
//            echo "<br>";
//            echo array_search("TK5060",$classMatch[1]);
//            echo array_values();
        }
//        foreach($html->find('a') as $element)
//            echo "https://six.akademik.itb.ac.id/publik/".$element->href . '<br>';
//        foreach($html->find('pre') as $element)
//        {
//            echo $element . '<br>';
//            echo "=======================================================================";
//        }
        //echo $html;

        // Lets write a regular expression to extract the day of month in
// a string with numerous dates
        $pattern = "/\d{3}\s*(\d{8})\s*([\w|\W]*)/";
        $input_str = "001 11211039   Khalilan Lambangsari
002 21113043   Kartika Fandika
003 21115023   Riesa Khairunnisa Wira Rohmat
004 21115024   Muhammad Maulana Malikul Ikram";
        if (preg_match_all($pattern, $input_str, $matches_out)) {
            // $matches_out is now an Array of size equal to N+1, for N
            // number of groups you are capturing in your regex, and +1
            // for the substrings that matched.

            // This will print "2" because we are capturing only one group
//            echo count($matches_out);

            // In addition, each value in $matches_out is another Array of
            // size M, for M number of matches of the regex in the input.

            // This will print "3" for the three dates in our input string
//            echo count($matches_out[0]);

            // $matches_out[0] is an Array of the matched strings from the
            // input string.

            // This prints an Array ("June 24", "August 13", "December 30")
//            print_r($matches_out[0]);

            // $matches_out[1], $matches_out[2], etc. are Arrays filled with
            // the captured data in the same order as in the regex pattern.

            // This prints an Array ("24", "13", "30")
//            print_r($matches_out[1]);
        }
//        echo $removedFirst = $this->stripFirstLine($input_str).'<br>';
//        echo $this->stripFirstLine($removedFirst);
    }

    function delFirstLine($text)
    {
        return substr( $text, strpos($text, "\n")+1 );
    }

    function getValue($index, $assosiativeArray)
    {
        foreach($age as $x => $x_value)
        {
            if($index === $x)
                return $x_value;
        }
    }

    public function actionGetkelas()
    {
        $kodeKelasPattern = "/(\w{2}\d{4}) \(/";
        $html = file_get_html('https://six.akademik.itb.ac.id/publik/daftarkelas.php?ps=230&semester=1&tahun=2015&th_kur=2013');
        if(preg_match_all($kodeKelasPattern, $html, $classMatch))
        {
            foreach($classMatch[1] as $element)
            {
                echo $element."<br>";
            }
        }
    }
    public function actionGethtml()
    {
        //echo "oke";
        //$html = new Html();
        //return $html->getHtml("http://www.google.com");
    }
}