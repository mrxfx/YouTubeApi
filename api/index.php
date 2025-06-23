<?php
header('Content-Type: application/json');

if (!isset($_GET['url'])) {
    echo json_encode(['error' => 'Missing "url" parameter']);
    exit;
}

$inputUrl = $_GET['url'];

function fetchInstagramData($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url . '?__a=1&__d=dis');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
    $response = curl_exec($ch);
    curl_close($ch);

    return json_decode($response, true);
}

function extractMedia($data) {
    if (isset($data['items'][0]['video_versions'][0]['url'])) {
        return [
            'type' => 'video',
            'url' => $data['items'][0]['video_versions'][0]['url'],
            'thumbnail' => $data['items'][0]['image_versions2']['candidates'][0]['url']
        ];
    }

    if (isset($data['items'][0]['image_versions2']['candidates'][0]['url'])) {
        return [
            'type' => 'image',
            'url' => $data['items'][0]['image_versions2']['candidates'][0]['url']
        ];
    }

    return ['error' => 'Media not found'];
}

function fetchHTMLMeta($url) {
    $html = file_get_contents($url);
    preg_match('/<meta property="og:video" content="([^"]+)"/', $html, $video);
    preg_match('/<meta property="og:image" content="([^"]+)"/', $html, $image);
    preg_match('/<meta property="og:title" content="([^"]+)"/', $html, $title);

    return [
        'title' => $title[1] ?? null,
        'video' => $video[1] ?? null,
        'image' => $image[1] ?? null
    ];
}

// Try private API method first
$data = fetchInstagramData($inputUrl);

if ($data && isset($data['items'])) {
    $media = extractMedia($data);
    echo json_encode($media, JSON_PRETTY_PRINT);
} else {
    // Fallback to meta tag scraping
    $meta = fetchHTMLMeta($inputUrl);
    echo json_encode([
        'type' => $meta['video'] ? 'video' : 'image',
        'url' => $meta['video'] ?: $meta['image'],
        'thumbnail' => $meta['image'],
        'title' => $meta['title']
    ], JSON_PRETTY_PRINT);
}
