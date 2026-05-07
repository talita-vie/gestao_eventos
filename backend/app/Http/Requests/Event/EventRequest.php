<?php

namespace App\Http\Requests\Event;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class EventRequest extends FormRequest
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
        if ($this->has('address.street_zipcode')) {
            $cepLimpo = preg_replace('/[^0-9]/', '', $this->address['street_zipcode']);

            if (strlen($cepLimpo) === 8) {
                $cepFormatado = substr($cepLimpo, 0, 5) . '-' . substr($cepLimpo, 5, 3);

                $this->merge([
                    'address.street_zipcode' => $cepFormatado
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
            'name' => [
                'required',
                'string',
                'min:5',
                'max:255'
            ],
            'description' => 'required',
            'start_date_time' => [
                'required',
                'date'
            ],
            'end_date_time' => [
                'required',
                'date',
                'after:start_date_time'
            ],
            'category_id' => [
                'nullable',
                'integer'
            ],
            'registration_deadline' => [
                'required',
                'date',
                'before:start_date_time'
            ],
            'speaker' => [
                'required',
                'string',
                'max:100'
            ],
            'capacity' => [
                'required',
                'integer'
            ],
            'hours' => [
                'nullable',
                'integer'
            ],
            'price' => [
                'nullable',
                'numeric',
                'min:0'
            ],
            'is_external' => [
                'nullable',
                'boolean'
            ],
            'references_id' => [
                'nullable',
                'integer',
                'exists:events,id'
            ],
            'address' => [
                'required',
                'array'
            ],
            'address.street_name' => [
                'required',
                'string',
                'max:100'
            ],
            'address.neighborhood' => [
                'required',
                'string',
                'max:100'
            ],
            'address.city_name' => [
                'required',
                'string',
                'max:100'
            ],
            'address.state' => [
                'required',
                'string',
                'max:2',
                'uf'
            ],
            'address.house_number' => [
                'required',
                'string',
                'max:20'
            ],
            'address.street_zipcode' => [
                'required',
                'string',
                'formato_cep'
            ],
            'address.complement' => [
                'required',
                'string',
                'max:100'
            ],
            'address.reference_point' => [
                'nullable',
                'string'
            ]
        ];
    }

    public function getEventData()
    {
        return $this->except('address');
    }

    public function getAddressData()
    {
        return $this->input('address');
    }
}
