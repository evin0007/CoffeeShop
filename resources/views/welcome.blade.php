<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Coffee Shop</title>
    
{{-- Ang 'build' parameter ay nagsasabi kay Laravel na tingnan ang public/build folder --}}
@vite(['src/main.jsx'], 'build')
</head>
<body>
    <div id="app"></div>
</body>
</html>