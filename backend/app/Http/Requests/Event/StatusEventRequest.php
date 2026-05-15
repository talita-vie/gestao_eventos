<?php

namespace App\Http\Requests\Event;

use App\Enums\ModerationEvent;
use App\Enums\StatusEvent;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StatusEventRequest extends FormRequest
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
            'status' => [
                'nullable',
                Rule::enum(StatusEvent::class)
            ],
            'moderation_status' => [
                'nullable',
                Rule::enum(ModerationEvent::class)
            ]
        ];
    }
}
