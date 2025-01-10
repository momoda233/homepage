let str =
  "人民日报每日金句摘抄【城市治理】 城市，让生活更美好。在建设数字孪生城市的过程中，积极推进物理空间和数字空间一体建设、协同发展，让技术手段和人文关怀共同进步、相得益彰，就能让城市不断满足人民日益增长的美好生活需要，把发展成果不断转化为生活品质。----《人民日报》2023年05月31日 人民日报每日金句摘抄【城市治理】 城市治理是一门科学。更好地认识、尊重和顺应城市发展规律，更加注重在细微处下功夫、见成效，必能不断提升城市环境质量、人民生活质量、城市竞争力，不断满足人民群众对美好生活的需要。----《人民日报》2023年06月14日 人民日报每日金句摘抄【城市治理】 文化是城市的灵魂。如今，城市公共文化服务“缺不缺、够不够”问题总体上得到解决，“好不好、精不精”问题越来越凸显。让城市成为“开放的艺术馆”，让文化流淌在城市的毛细血管，用艺术滋养城市的神经末梢，将更好满足人们的精神文化需求。一座座充盈着艺术韵味趣味的城市，也必将收获更多的认可认同，释放更多的自信活力。----《人民日报》2023年06月08日";

function parseQuotes(input) {
  // 匹配金句正则
  const regex = /人民日报每日金句摘抄【[^】]+】\s+([^----]+)----(《[^》]+》\d{4}年\d{2}月\d{2}日)/g;
  const matches = [];
  let match;

  while ((match = regex.exec(input)) !== null) {
    const [_, content, date] = match;
    const titleMatch = input.match(/人民日报每日金句摘抄【[^】]+】/); // 提取标题
    const title = titleMatch ? titleMatch[0] : "未知标题";

    matches.push({
      title: title.trim(),
      content: content.trim(),
      date: `----${date.trim()}`, // 保留完整的日期部分
    });
  }

  return matches;
}

const result = parseQuotes(str);
console.log(result);
// 随机B站小姐姐视频
export const getBVSisterVideo = async () => {
  const IDArr =['2054530954','3262571154','3289036254','3398398454','3417778254'];
  const randomId = IDArr[Math.floor(Math.random()*IDArr.length)];
  const res = await fetch("https://api.bilibili.com/x/v3/fav/resource/list?media_id="+randomId+"&pn=5&ps=5&keyword=&order=mtime&type=0&tid=0&platform=web&jsonp=jsonp",
    {
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
  }
  );
  const resJson = await res.json();
  resJson.data.medias.forEach(item => {
    // console.log(item.title,'item.title');
  });
  console.log(resJson.data.medias,'resres');
};
getBVSisterVideo()