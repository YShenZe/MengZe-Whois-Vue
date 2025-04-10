const whois = require('whois');

const handler = async (event, context) => {
  // 从查询参数中获取域名
  const domain = event.queryStringParameters?.domain;

  console.log('[DEBUG] 收到查询请求：', domain);

  if (!domain) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: '请输入域名' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      }
    };
  }

  try {
    // 将 whois.lookup 转换为 Promise 形式
    const data = await new Promise((resolve, reject) => {
      whois.lookup(domain, { follow: 3 }, (err, data) => {
        err ? reject(err) : resolve(data);
      });
    });

    console.log('[DEBUG] 查询成功：', domain);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ result: data }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      }
    };
  } catch (err) {
    console.error('[ERROR] WHOIS查询失败：', err);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      }
    };
  }
};

module.exports = { handler };