<?php
foreach (glob(__DIR__ . '/../public/screens/*.html') as $file) {
    $c = file_get_contents($file);
    $c = preg_replace('#<script src="[^"]*dracorent-app\.js"></script>\s*#', '', $c);
    $c = str_replace('</body>', '<script src="../js/dracorent-app.js"></script></body>', $c);
    file_put_contents($file, $c);
}
foreach (glob(__DIR__ . '/../resources/views/dracorent/*.blade.php') as $file) {
    $c = file_get_contents($file);
    $c = preg_replace('#<script src="[^"]*dracorent-app\.js"></script>\s*#', '', $c);
    $c = str_replace('</body>', '<script src="/js/dracorent-app.js"></script></body>', $c);
    file_put_contents($file, $c);
}
echo "Injected dracorent-app.js into all 13 screens and Blade views.\n";
