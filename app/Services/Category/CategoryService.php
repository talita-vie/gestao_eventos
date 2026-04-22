<?php

namespace App\Services\Category;

use App\Models\Category;
use Illuminate\Support\Facades\DB;

class CategoryService
{
    public function indexCategory() 
    {
        try {
            $categories = Category::all();
            return $categories;
            
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function DeletedCategory() 
    {
        try {
            $categories = Category::onlyTrashed()->get();
            return $categories;
            
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function showCategory(string $id) 
    {
        try {
            $category = Category::findOrFail($id);
            return $category;

        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function storeCategory(array $data)
    {
        try {
            $category = Category::create($data);
            return $category;

        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function updateCategory(string $id, array $data)
    {
        try {
            $category = Category::findOrFail($id);
            $category->update($data);
            return $category;

        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function deleteCategory(string $id)
    {
        try {
            $category = Category::findOrFail($id);
            $category->delete();
            return $category;

        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function restoreCategory(string $id)
    {
        try {
            $category = Category::withTrashed()->findOrFail($id);
            $category->restore();
            return $category;

        } catch (\Throwable $th) {
            throw $th;
        }
  
    }
}
        