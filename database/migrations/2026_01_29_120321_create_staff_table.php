<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('staff', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('phone_number')->nullable();
            $table->string('role'); // e.g., General Manager
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->integer('age')->nullable();
            $table->timestamps(); // Adds created_at and updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staff');
    }
};
