<?php

namespace App\Enums;

enum StatusEvent: string
{
    case DRAFT = 'draft';
    case PUBLISHED = 'published';
    case PAUSED = 'paused';
    case CANCELED = 'canceled';
    case FINISHED = 'finished';
}
