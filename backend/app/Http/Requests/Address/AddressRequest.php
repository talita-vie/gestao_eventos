<?php

namespace App\Http\Requests\Address;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AddressRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        if ($this->has('street_zipcode')) {
            $cepLimpo = preg_replace('/[^0-9]/', '', $this->street_zipcode);

            if (strlen($cepLimpo) === 8) {
                $cepFormatado = substr($cepLimpo, 0, 5) . '-' . substr($cepLimpo, 5, 3);

                $this->merge([
                    'street_zipcode' => $cepFormatado
                ]);
            }
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'street_name' => [
                'required',
                'string',
                'max:100'
            ],
            'neighborhood' => [
                'required',
                'string',
                'max:100'
            ],
            'city_name' => [
                'required',
                'string',
                'max:100'
            ],
            'state' => [
                'required',
                'string',
                'max:2',
                'uf'
            ],
            'house_number' => [
                'required',
                'string',
                'max:20'
            ],
            'street_zipcode' => [
                'required',
                'string',
                 'formato_cep'
            ],
            'complement' => [
                'required',
                'string',
                'max:100'
            ],
            'reference_point' => [
                'nullable',
                'string'
            ]
        ];
    }
}
