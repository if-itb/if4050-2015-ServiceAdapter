<?php

namespace App\Http\Controllers;

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
        $client = new Client();
        $crawler = $client->request('GET','https://six.akademik.itb.ac.id/publik/menu.php');
        $uri_list = $crawler->selectLink('Daftar Peserta Kelas')->each(function(Crawler $node){
            return $node->link()->getUri();
        });
        $found = false;
        $iter = 0;
        $filter_node;
        $tampung;
        while (!$found && $iter<sizeof($uri_list)){
            $crawler = $client->request('GET',$uri_list[$iter]);
            $filter_node = $crawler->filter('a')->reduce(function(Crawler $node) use (&$request){
                return str_contains($node->attr('href'),"ps=".$request->ps);
            });
            $crawler = $client->request('GET',$filter_node->attr('href'));
            $filter_node = $crawler->filter('li')->reduce(function(Crawler $node) use (&$request){
                return str_contains($node->text(), $request->kode);
            });
            $filter_node = $filter_node->filter('a')->reduce(function(Crawler $node) use (&$request){
                if (str_contains($node->text(), $request->kelas)){
                    return str_contains($node->text(), $request->kelas);
                }
            });
            $crawler = $client->request('GET','https://six.akademik.itb.ac.id/publik/'.$filter_node->attr('href'));
            $final = "Not found";
            $final = $crawler->filter('body')->text();
            if ($final != "Not found"){
                $found = true;
            }
            print "ulang kembali ".$iter;
            $iter++;
        }
        return $final;
        // return response()->json(['Prodi' => $request->ps, 'kode'=> $request->kode, 'kelas'=> $request->kelas]);
    }
}
