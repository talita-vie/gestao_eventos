<?php

namespace App\Enums;

enum ModerationEvent: string
{
    case APPROVED = 'approved';
    case SUSPENDED = 'suspended';
    case BANNED = 'banned';
}
