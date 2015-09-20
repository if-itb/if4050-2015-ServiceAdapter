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

        \Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;

        if(!isset($ps) || !isset($kode) || !isset($kelas))
        {
            \Yii::$app->response->statusCode = 400;
            $response["error"] = 'Request tidak sesuai format';
        }
        else
        {
            $response = $html_model->getData($ps,$kode,$kelas);
        }
        return $response;
    }
}