const { createRequire } = require('module');
const require = createRequire(import.meta.url);
const whois = require('whois');

const setCorsHeaders = (event, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  };

  if (event.httpMethod === 'OPTIONS') {
    response.statusCode = 204;
    callback(null, response);
  } else {
    callback(null, null);
  }
};

exports.handler = async (event, context, callback) => {
  setCorsHeaders(event, callback);

  try {
    const domain = new URLSearchParams(event.queryStringParameters || '').get('domain');
    
    console.log('[DEBUG] 收到查询请求：', domain);
    
    if (!domain) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: '请输入域名' }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        }
      };
    }
    
    return new Promise((resolve, reject) => {
      whois.lookup(domain, { follow: 3 }, (err, data) => {
        if (err) {
          console.error('[ERROR] WHOIS查询失败：', err);
          return resolve({
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            }
          });
        }
        
        console.log('[DEBUG] 查询成功：', domain);
        resolve({
          statusCode: 200,
          body: JSON.stringify({ result: data }),
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          }
        });
      });
    });
    
  } catch (error) {
    console.error('[ERROR] 服务器错误：', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '服务器错误' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      }
    };
  }
};