<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function success($msg = 'Arquivo excluido com sucesso', $time = 1200)
    {
        return response()->json(['status' => 200, 'success' => $msg, 'time' => $time], 200);
    }

    public function error($msg = 'Erro ao excluir arquivo', $time = 1200)
    {
        return response()->json(['status' => 400, 'success' => $msg, 'time' => $time], 200);
    }

    public function validateUrl($string)
    {
        $format = array();
        $format['a'] = 'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜüÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûýýþÿRr"!@#$%&*()_-+={[}]/?;:.,\\\'´<>°ºª';
        $format['b'] = 'aaaaaaaceeeeiiiidnoooooouuuuuybsaaaaaaaceeeeiiiidnoooooouuuyybyRr                                  ';
        $data = strtr(utf8_decode($string), utf8_decode($format['a']), $format['b']);
        $data = strip_tags(trim($data));
        $data = str_replace(' ', '-', $data);
        $data = str_replace(array('-----', '----', '---', '--'), '-', $data);
        return strtolower(utf8_encode($data));
    }
}
