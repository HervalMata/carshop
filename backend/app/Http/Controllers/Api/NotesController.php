<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NotesController extends Controller
{
    protected $user;

    public function __construct()
    {
       $this->user = Auth()->guard('api')->user();
    }

    public function index(Request $request)
    {
        $notes = Notes::where('user_id', $this->user->id)
                    ->where('type', $request->type)
                    ->where('uid', $request->uid)
                    ->with('user')
                    ->orderBy('id', 'DESC')
                    ->paginate(10);

        return compact('notes');            
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            Notes::$rules
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 200);
        }

        $note = new Notes;
        $note->user_id = $this->user->id;
        $note->fill($request->all());
        $note->save();
        
        if ($note->id) {
            return $note->fresh('user');
        }

        return $this->error('Erro ao cadastrar nota');
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            Notes::$rules
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 200);
        }

        $note = Notes::where('user_id', $this->user->id)->find($id);
        if ($note->id) {
            $note->fill($request->all());
            if ($note->save()) {
                return $this->success('Dados atualizados com sucesso.');
            }
            return $this->error('Erro ao atualizar dados');
        }
        return $this->error('Nota não encontrada.');
    }

    public function destroy($id)
    {
        $note = Notes::where('user_id', $this->user->id)
                    ->find($id);

        if ($note->id) {
            if ($note->delete()) {
                return $this->success('Nota excluída com sucesso.');
            }
            return $this->error('Erro ao excluir nota');
        }
        return $this->error('Nota não encontrada.');            
    }

}
