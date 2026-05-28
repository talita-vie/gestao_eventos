<?php

namespace App\Http\Requests\User;

use App\Enums\EducationLevel;
use App\Rules\Cpf;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateInfoRequest extends FormRequest
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
        if ($this->has('phone')) {
            $phoneLimpo = preg_replace('/[^0-9]/', '', $this->phone);

            if (strlen($phoneLimpo) === 11) {
                $phoneFormatado = '(' . substr($phoneLimpo, 0, 2) . ')' . substr($phoneLimpo, 2, 5). '-' . substr($phoneLimpo, 7, 4);

                $this->merge([
                    'phone' => $phoneFormatado
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
        $userId = $this->user()->id;

        return [
            'name' => [
                'required',
                'max:60',
                'regex:/^[\pL\s]+$/u'
            ],
            'email' => [
                'required',
                'email',
                'max:100',
                Rule::unique('users', 'email')->ignore($userId)
            ],
            'cpf' => [
                'required',
                new Cpf(),
                Rule::unique('users', 'cpf')->ignore($userId)
            ],
            'phone' => [
                'nullable',
                'string',
                'celular_com_ddd'
            ],
            'institution' => [
                'nullable',
                'string'
            ],
            'education_level' => [
                'nullable',
                'integer',
                Rule::enum(EducationLevel::class)
            ]
        ];
    }
}
