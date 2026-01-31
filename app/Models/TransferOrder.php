<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransferOrder extends Model
{
    protected $table = 'order_list';

    protected $fillable = ['code', 'staff', 'all_order', 'status', 'total_price'];
}
