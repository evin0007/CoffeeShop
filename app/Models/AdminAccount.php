<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminAccount extends Model
{
    protected $fillable = [
        'legal_name', 'corporate_email', 'phone',
        'primary_hub', 'timezone', 'access_level', 'password',
    ];

    protected $hidden = ['password'];
}
