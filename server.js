// שרת קטן ללא תלויות: מגיש את המשחק ושומר דירוג משותף בקובץ scores.json
const http=require('http'),fs=require('fs'),path=require('path');
const PORT=process.env.PORT||3000,ROOT=__dirname,DB=path.join(ROOT,'data','scores.json');
const T={'.html':'text/html;charset=utf-8','.css':'text/css;charset=utf-8','.js':'text/javascript;charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.woff2':'font/woff2'};
fs.mkdirSync(path.dirname(DB),{recursive:true});
const read=()=>{try{return JSON.parse(fs.readFileSync(DB,'utf8'))}catch(e){return[]}};
http.createServer((q,s)=>{
 let u;try{u=new URL(q.url,'http://x')}catch(e){s.statusCode=400;return s.end()}
 if(u.pathname==='/api/scores'){
  s.setHeader('Content-Type','application/json;charset=utf-8');s.setHeader('Cache-Control','no-store');
  if(q.method==='GET'){return s.end(JSON.stringify(read().sort((a,b)=>a.ms-b.ms).slice(0,50)))}
  if(q.method==='POST'){let b='';q.on('data',c=>{b+=c;if(b.length>2000)q.destroy()});q.on('end',()=>{
   try{const r=JSON.parse(b),n=String(r.name||'').trim().slice(0,20),ms=Number(r.ms);
    if(!n||!(ms>0)||ms>36e5)throw 0;
    const a=read();a.push({name:n,ms:Math.round(ms),miss:Math.max(0,Math.min(99,+r.miss||0)),ts:Date.now()});
    fs.writeFileSync(DB,JSON.stringify(a.slice(-5000)));s.end('{"ok":true}')}
   catch(e){s.statusCode=400;s.end('{"ok":false}')}});return}
  s.statusCode=405;return s.end('{}')}
 let f;try{f=path.join(ROOT,decodeURIComponent(u.pathname==='/'?'/index.html':u.pathname))}catch(e){s.statusCode=400;return s.end()}
 if(!f.startsWith(ROOT)||f.startsWith(path.join(ROOT,'data'))||f.endsWith('server.js')){s.statusCode=403;return s.end()}
 fs.readFile(f,(e,d)=>{if(e){s.statusCode=404;return s.end('404')}s.setHeader('Content-Type',T[path.extname(f)]||'application/octet-stream');s.end(d)})
}).listen(PORT,()=>console.log('המשחק פועל בכתובת http://localhost:'+PORT));
