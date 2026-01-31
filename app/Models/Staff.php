<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Staff extends Model
{
    protected $table = 'staff';

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone_number',
        'role',
        'gender',
        'age',
        'staff_code',
    ];
}
