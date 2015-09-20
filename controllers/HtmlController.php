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
//            if($link = $html_model->getLink('230','TK5001','01'))
//                echo $link;
//            else
//                echo 'not found ';
        
        $request = Yii::$app->request;
        $ps = $request->get('ps');
        $kode = $request->get('kode');
        $kelas = $request->get('kelas');

        $response = $html_model->getData($ps,$kode,$kelas);
        \Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        return $response;
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
}