<?php

namespace App\Enums;

enum EducationLevel: int
{
    case EnsinoMedio = 1;
    case Graduacao = 2;
    case PosGraduacao = 3;
    case Mestrado = 4;
    case Doutorado = 5;

    public function label(): string 
    {
        return match($this) {
            self::EnsinoMedio => 'Ensino Médio',
            self::Graduacao => 'Ensino Superior / Graduação',
            self::PosGraduacao => 'Pós-Graduação / Especialização',
            self::Mestrado => 'Mestrado',
            self::Doutorado => 'Doutorado'
            };
        }
}
