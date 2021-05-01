<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $date = Carbon::now();
        $elete_account = Carbon::now();

        $user = new User;
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->next_expriration = $date->addDays(7);
        $user->delete_account = $elete_account->addDays(15);
        $user->save();

        if ($user->id) {
            return response()->json([
                'access_token' => $user->createToken('auth_api')->accessToken
            ], 200);
        }

        return response()->json([
            'error' => 'Erro ao cadastrar usuário'
        ], 400);
    }
 
}
