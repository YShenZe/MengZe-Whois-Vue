import express from 'express';
import cors from 'cors';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const whois = require('whois');

const app = express();
app.use(cors());

app.get('/api/whois', (req, res) => {
  console.log('[DEBUG] 收到查询请求：', req.query.domain);
  
  if (!req.query.domain) {
    return res.status(400).json({ error: '请输入域名' });
  }

  whois.lookup(req.query.domain, { follow: 3 }, (err, data) => {
    if (err) {
      console.error('[ERROR] WHOIS查询失败：', err);
      return res.status(500).json({ error: err.message });
    }
    console.log('[DEBUG] 查询成功：', req.query.domain);
    res.json({ result: data });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`服务已启动：http://localhost:${PORT}`);
});