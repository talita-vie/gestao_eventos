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
            'organizer_id' => [
                'required',
                'integer',
                'exists:users,id'
            ],
            'address_id' => [
                'nullable',
                'integer',
                'exists:addresses,id'
            ]
        ];
    }
}
