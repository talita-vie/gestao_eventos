<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => env('APP_ADMIN_NAME'),
            'email' => env('APP_ADMIN_EMAIL'),
            'password' => Hash::make(env('APP_ADMIN_PASSWORD')),
            'cpf' => env('APP_ADMIN_CPF'),
            'role' => UserRole::ADMIN->value,
            'phone' => env('APP_ADMIN_PHONE'),
            'institution' => 'UNIMONTES',
            'education_level' => 1
        ]);
    }
}
