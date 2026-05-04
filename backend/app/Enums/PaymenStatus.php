<?php

namespace App\Enums;

enum PaymenStatus: string {
    case PAID = 'paid';
    case PENDING = 'pending';
    case FREE = 'free';
}