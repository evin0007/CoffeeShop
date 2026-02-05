<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider; // <--- Import ito

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Sabihan ang Laravel na pilitin ang HTTPS sa production
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }
    }
}
