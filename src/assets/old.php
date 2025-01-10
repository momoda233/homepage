<?php
// 目标URL
$mainUrl = "https://mp.weixin.qq.com/mp/appmsgalbum?__biz=Mzg3MjcxNTI0NA==&action=getalbum&album_id=2650001004859654145&scene=173&subscene=&sessionid=svr_e0b86ed29ba&enterid=1732550691&from_msgid=2247495098&from_itemidx=1&count=3&nolastread=1#wechat_redirect";
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36');
curl_setopt($ch, CURLOPT_VERBOSE, true);
curl_setopt($ch, CURLOPT_HEADER, true);
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

// 使用 cURL 获取页面内容
function fetchPageContent($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // 跳过SSL验证
    $html = curl_exec($ch);
    curl_close($ch);
    return $html;
}
// 设置请求头
$headers = [
    'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
    'Referer: https://mp.weixin.qq.com/',
    'Cookie: YOUR_VALID_COOKIE_HERE'
];
// Step 1: 获取第一个 <li> 的 data-link 属性值
$html = fetchPageContent($mainUrl,$headers);
libxml_use_internal_errors(true); // 禁用HTML解析错误输出
$dom = new DOMDocument();
$dom->loadHTML($html);
libxml_clear_errors();

$xpath = new DOMXPath($dom);
$elements = $xpath->query("//ul[contains(@class, 'album__list js_album_list')]/li[1]");

if ($elements->length > 0) {
    $dataLink = $elements->item(0)->getAttribute('data-link');
    // echo "第一个 data-link 地址: $dataLink\n\n";

    // Step 2: 获取 data-link 指向页面中的图片地址
    $pageHtml = fetchPageContent($dataLink,$headers);
    
    // 使用 DOMDocument 解析 HTML
    libxml_use_internal_errors(true); // 忽略解析错误
    $dom = new DOMDocument();
    @$dom->loadHTML($pageHtml);
    libxml_clear_errors();
    
    $xpath = new DOMXPath($dom);
    // 提取 h1.rich_media_title 内容
    $titleNode = $xpath->query("//h1[contains(@class, 'rich_media_title')]");
    $title = $titleNode->length > 0 ? trim($titleNode[0]->textContent) : "标题未找到";
    // 查找 class 为 list-paddingleft-1 的 ul 标签
    $ulElements = $xpath->query("//ul[contains(@class, 'list-paddingleft-1')]");
    
    if ($ulElements->length > 0) {
        foreach ($ulElements as $ul) {
            // 查找每个 ul 中的 li 标签
            $liElements = $ul->getElementsByTagName('li');
            foreach ($liElements as $li) {
                $text = '';
                // 遍历 li 的子元素，拼接内容
                foreach ($li->childNodes as $child) {
                    if ($child->nodeType === XML_ELEMENT_NODE || $child->nodeType === XML_TEXT_NODE) {
                        $text .= trim($child->textContent); // 去掉多余空格
                    }
                }
                echo $title . "\n" . $text . "\n"; // 输出每个 li 的拼接内容，并换行
            }
            echo "\n"; // 每个 ul 结束后换行
        }
    } else {
        echo "未找到目标元素1。\n";
    }
} else {
    echo "未找到目标元素2。\n";
}
?>
