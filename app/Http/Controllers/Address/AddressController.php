<?php

namespace App\Http\Controllers\Address;

use App\Http\Controllers\Controller;
use App\Http\Requests\Address\AddressRequest;
use App\Services\Address\AddressService;
use Illuminate\Http\Request;

class AddressController extends Controller
{

    public function __construct(protected AddressService $addressService)
    {
        
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function myAddress(Request $request) 
    {
        try {
            $result = $this->addressService->myAddress($request->user());
            return $this->sendResponse($result, 'Meus endereços recuperados com sucesso');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }

    public function myDeletedAddress(Request $request)
    {
        try {
            $result = $this->addressService->myDeletedAddress($request->user());
            return $this->sendResponse($result, 'Meus endereços apagados recuperados com sucesso');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AddressRequest $request)
    {
        try {
            $data = $request->validated();
            $result = $this->addressService->StoreAddress($data);
            return $this->sendResponse($result, 'Endereço criado com sucesso');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $result = $this->addressService->findAddress($id);
            return $this->sendResponse($result, 'Endereço encontrado com sucesso');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AddressRequest $request, string $id)
    {
        try {
            $data = $request->validated();
            $result = $this->addressService->updateAddress($id, $data);
            return $this->sendResponse($result, 'Endereço atualizado com sucesso');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $result = $this->addressService->deleteAddress($id);
            return $this->sendResponse($result, 'Endereço deletado com sucesso');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }

    public function restoreAddress(string $id)
    {
        try {
            $result = $this->addressService->restoreAddress($id);
            return $this->sendResponse($result, 'Endereço restaurado com sucesso');
        } catch (\Throwable $th) {
            return $this->sendError('Erro generico: ', [0 => $th->getMessage()]);
        }
    }
}
