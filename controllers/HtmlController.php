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
            $html_model = new Html();
            if($link = $html_model->getLink('230','TK5001','01'))
                echo $link;
            else
                echo 'not found ';

        $data = file_get_html($link);
        $dataPattern = '/([\w\W]+)[\n|\s]+Program Studi\s*:\s*([\w\W]+)[\n|\s]+Semester\s*:\s*(\d+)\/(\d+)[\n|\s]+Kode\/Mata Kuliah*\s*:\s*(\w{6})\s*\/\s*([\w|\W]+),\s*(\d)\s*SKS[\n|\s]+No. Kelas\/Dosen\s*:\s*(\d\d)\s*\/\s*([\w|\s]*)[\n|\s]+-*[\n|\s]+([\w|\W]+)[\n|\s*]Total Peserta = (\d+)/';

        if(preg_match_all($dataPattern,$data,$data_match))
        {
            echo 'count = '.count($data_match). '<br>';
            foreach($data_match[1] as $element)
                echo $element. '<br>';
//            print_r($data_match[1]).'<br>';
            foreach($data_match[2] as $element)
                echo $element. '<br>';
//            print_r($data_match[2]).'<br>';
            foreach($data_match[3] as $element)
                echo $element. '<br>';
//            print_r($data_match[3]).'<br>';
            foreach($data_match[4] as $element)
                echo $element. '<br>';
//            print_r($data_match[4]).'<br>';
            foreach($data_match[5] as $element)
                echo $element. '<br>';
//            print_r($data_match[5]).'<br>';
            foreach($data_match[6] as $element)
                echo $element. '<br>';
//            print_r($data_match[6]).'<br>';
            foreach($data_match[7] as $element)
                echo $element. '<br>';
//            print_r($data_match[7]).'<br>';
            foreach($data_match[8] as $element)
                echo $element. '<br>';
//            print_r($data_match[8]).'<br>';
            foreach($data_match[9] as $element)
                echo $element. '<br>';
//            print_r($data_match[9]).'<br>';
            foreach($data_match[10] as $element)
            {
                $regexPeserta = '/\d{3}\s*(\d{8})\s*([a-z|A-Z|\s]+)/';
                if(preg_match_all($regexPeserta, $element, $pesertaMatch))
                {
                    echo 'nama nama <br>';
                    for($i=0; $i<count($pesertaMatch[1]);$i++)
                    {
                        echo $pesertaMatch[1][$i].' '.$pesertaMatch[2][$i].'<br>';
                    }
                }
            }

//            print_r($data_match[10]).'<br>';
            foreach($data_match[11] as $element)
                echo $element. '<br>';
//            print_r($data_match[11]).'<br>';
        }
        else
        {
            echo 'not match';
        }
        //echo $data;


        // Lets write a regular expression to extract the day of month in
// a string with numerous dates
        $pattern = "/[a-zA-Z]+ (\d+)/";
        $input_str = "June 24, August 13, and December 30";
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
//            echo '<br>';
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