<?php

namespace App\Http\Requests\Auth;

use App\Enums\EducationLevel;
use App\Rules\Cpf;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
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
                $phoneFormatado = '(' . substr($phoneLimpo, 0, 2) . ')' . substr($phoneLimpo, 2, 5). '-' . substr($phoneLimpo, 5, 4);

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
        return [
            'name' => [
                'required',
                'max:60',
                'regex:/^[\pL\s]+$/u'
            ],
            'email' => [
                'required',
                'email',
                'max:100'
            ],
            'password' => [
                'required',
                'confirmed',
                Password::min(8)->uncompromised(),
                'max:128'
            ],
            'cpf' => [
                'required',
                new Cpf()
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
