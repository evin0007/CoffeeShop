<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint; // <--- Ensure this is here
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Change 'Table' to 'Blueprint' here
        Schema::create('admin_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('legal_name');
            $table->string('corporate_email')->unique();
            $table->string('phone');
            $table->string('primary_hub');
            $table->string('timezone')->default('GMT (London)');
            $table->string('access_level')->default('Owner / Super');
            $table->string('password'); // For the modal verification
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_accounts');
    }
};
