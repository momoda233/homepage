<?php
// 构建请求 URL
$targetUrl = "https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&__biz=MjM5ODQ5MjA4Mg==&album_id=3215332197688410113&count=10&is_reverse=1&uin=&key=&pass_ticket=&wxtoken=&devicetype=&clientversion=&__biz=MjM5ODQ5MjA4Mg%3D%3D&appmsg_token=&x5=0&f=json";

// 允许所有来源访问
header("Access-Control-Allow-Origin: *");

// 允许的请求方法
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// 允许的请求头
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
// 处理预检请求
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // 返回成功状态码
    exit();
}
// 初始化 cURL
$ch = curl_init($targetUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_HEADER, false);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// 检查是否请求成功
if ($httpCode === 200) {
    $headers = [
        'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
        'Referer: https://mp.weixin.qq.com/',
        'Cookie: YOUR_VALID_COOKIE_HERE'
    ];

    // 将响应解析为 JSON
    $data = json_decode($response, true);

    if (isset($data['getalbum_resp']['article_list'][0]['url'])) {
        $firstArticleUrl = $data['getalbum_resp']['article_list'][0]['url'];
        
        // 允许所有来源访问
        header("Access-Control-Allow-Origin: *");

        // 允许的请求方法
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

        // 允许的请求头
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
        // 处理预检请求
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(204); // 返回成功状态码
            exit();
        }
        // 获取页面 HTML 内容
        function fetchPageContent($url, $headers) {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // 跳过 SSL 验证
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers); // 设置 Headers
            $html = curl_exec($ch);
            curl_close($ch);
            return $html;
        }

        $html = fetchPageContent($firstArticleUrl, $headers);

        // 使用 DOM 解析 HTML
        libxml_use_internal_errors(true);
        $dom = new DOMDocument();
        $dom->loadHTML($html);
        libxml_clear_errors();

        $xpath = new DOMXPath($dom);
        $pContents = []; // 用于存储所有 <p> 内容

        // 找到 class="js_darkmode__4" 的 section
        $darkModeDivs = $xpath->query('//section[contains(@class, "js_darkmode__3")]');
        if ($darkModeDivs->length > 0) {
            $darkModeDiv = $darkModeDivs->item(0);

            // 查找 div 中的所有 <p> 标签
            $paragraphs = $xpath->query('.//p', $darkModeDiv);
            foreach ($paragraphs as $p) {
                $pContents[] = trim($p->textContent); // 获取 <p> 的文本内容
            }
        }

        if (!empty($pContents)) {
            header("Content-Type: application/json");
            echo json_encode([
                "status" => "success",
                "p_contents" => $pContents
            ]);
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "No matching <p> tags found."
            ]);
        }
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "No article URL found."
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Failed to fetch JSON data."
    ]);
}
?>
