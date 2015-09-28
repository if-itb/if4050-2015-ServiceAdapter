<?php

namespace App\Http\Controllers;

use Response;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

use Goutte\Client;
use Symfony\Component\DomCrawler\Crawler;

class HomeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function crawl(Request $request){
        if ($request->has('ps') && $request->has('kode') && $request->has('kelas')){
            $client = new Client();
            $crawler = $client->request('GET','https://six.akademik.itb.ac.id/publik/menu.php');
            $uri_list = $crawler->selectLink('Daftar Peserta Kelas')->each(function(Crawler $node){
                return $node->link()->getUri();
            });
            $found = false;
            $ada = true;
            $iter = 0;
            $filter_node;
            $final;
            while (!$found && $ada && $iter < sizeof($uri_list)){
                $crawler = $client->request('GET',$uri_list[$iter]);
                $filter_node = $crawler->filter('a')->reduce(function(Crawler $node) use (&$request){
                    return str_contains($node->attr('href'),"ps=".$request->ps);
                });
                if ($filter_node->count()>0){
                    $crawler = $client->request('GET',$filter_node->attr('href'));
                    $filter_node = $crawler->filter('li')->reduce(function(Crawler $node) use (&$request){
                        return str_contains($node->text(), $request->kode);
                    });
                    if ($filter_node->count()>0){
                        $filter_node = $filter_node->filter('a')->reduce(function(Crawler $node) use (&$request){
                            return str_contains($node->text(), $request->kelas);
                        });
                        if ($filter_node->count()>0){
                            $crawler = $client->request('GET','https://six.akademik.itb.ac.id/publik/'.$filter_node->attr('href'));
                            $final = $crawler->filter('body')->text();
                            $found = true;
                        }
                        else{
                            $ada = false;
                            $message = "tidak ditemukan kelas dengan angka ".$request->kelas;
                        }
                    }
                    else{
                        $ada = false;
                        $message = "tidak ditemukan kelas dengan kode ".$request->kode;
                    }
                }
                else{
                    $ada = false;
                    $message = "tidak ditemukan kelas dengan ps ".$request->ps;
                }
                $iter++;
            }
            if (!$ada){
                return Response::json(['error' => $message],404);
            }
            else if ($found){
               return $final;
            }
        }
        else{
            return Response::json(['error' => "Request tidak sesuai format"],400);
        }
    }
}
