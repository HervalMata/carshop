<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Owners;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OwnersController extends Controller
{

    protected $user;

    public function __construct()
    {
       $this->user = Auth()->guard('api')->user();
    }

    public function index(Request $request)
    {
        $owners = Owners::where('user_id', $this->user->id)
                    ->orderBy('id', 'DESC')
                    ->paginate(10);

        return compact('owners');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            Owners::$rules
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 200);
        }

        $owner = new Owners;
        $owner->user_id = $this->user->id;
        $owner->fill($request->all());
        $owner->save();
        
        if ($owner->id) {
            return $owner;
        }

        return $this->error('Erro ao cadastrar proprietário');
    }

    public function show($id)
    {
        $owner = Owners::where('user_id', $this->user->id)
                    ->find($id);

        if ($owner->id) {
            return $owner;
        }
            
        return $this->error('Nenhum proprietário cadastrado.');           
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            Owners::$rules
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 200);
        }

        $owner = Owners::where('user_id', $this->user->id)
                    ->find($id);
        
        if ($owner->id) {
            $owner->fill($request->all());
            if ($owner->save()) {
                return $this->success('Dados atualizados com sucesso');
            }
            return $this->error('Erro ao atualizar dados');
        }

        return $this->error('Proprietário não encontrado');
    }

    public function destroy($id)
    {
        $owner = Owners::where('user_id', $this->user->id)
                    ->find($id);

        if ($owner->id) {
            if ($owner->delete()) {
                return $this->success('Proprietário excluido com sucesso');
            }
            return $this->error('Erro ao excluir proprietário');
        }
            
        return $this->error('Proprietário não encontrado');            
    }
}
