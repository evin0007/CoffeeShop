<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OnlineOrder extends Model
{
    protected $table = 'online';

    protected $fillable = ['code', 'staff', 'total_price', 'status', 'all_order'];
}
