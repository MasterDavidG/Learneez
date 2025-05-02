<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">


    <!-- Open Graph / Facebook / Viber / Instagram -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://learneez.eu/">
    <meta property="og:title" content="Learneez - Учи Лесно">
    <meta property="og:description" content="Попълвайте тетрадките си електронно и се възползвайте от уникалните аудио бутони.">
    <meta property="og:image" content="images/footer_logo.png">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://learneez.eu/">
    <meta property="twitter:title" content="Learneez - Учи Лесно">
    <meta property="twitter:description" content="Попълвайте тетрадките си електронно и се възползвайте от уникалните аудио бутони.">
    <meta property="twitter:image" content="images/footer_logo.png">

    <title>Learneez</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Basic -->
    <link rel="icon" href="{{ asset('images/favicon.ico') }}?v=2" type="image/x-icon">

    <!-- For iOS/Android -->
    <link rel="apple-touch-icon" href="{{ asset('images/favicon.ico') }}">

    <!-- For legacy browsers -->
    <link rel="shortcut icon" href="{{ asset('images/favicon.ico') }}" type="image/x-icon">


    <!-- Scripts -->

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-VY9SDRDN2M"></script>
    <script>
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());

        gtag('config', 'G-VY9SDRDN2M');
    </script>

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>