<?php

namespace App\Http\Requests\Admin;

use App\Enums\ModerationEvent;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ModerateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'moderation_status' => [
                'required',
                Rule::enum(ModerationEvent::class)
            ],
            'moderation_reason' => [
                'nullable',
                'string'
            ]
        ];
    }
}
