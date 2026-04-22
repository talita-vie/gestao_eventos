<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Tecnologia e Inovação',
            'Cursos e Workshops',
            'Música e Shows',
            'Negócios e Empreendedorismo',
            'Festas e Baladas',
            'Esportes e Saúde',
            'Arte e Cultura',
            'Gastronomia',
            'Games e Geek',
            'Religião e Espiritualidade',
            'Moda e Beleza',
            'Infantil e Família',
        ];

        foreach($categories as $category) {
            Category::create([
                'name' => $category
            ]);
        }
    }
}
