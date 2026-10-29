var $=function(i){return document.getElementById(i)},G={},AC,muted=false,idle,saved=false;
function fit(){var s=Math.min(innerWidth/1080,innerHeight/1920),st=$('stage');st.style.setProperty('--s',s);st.style.transform='translate(-50%,-50%) scale('+s+')'}fit();addEventListener('resize',fit);
function sh(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function show(id){document.querySelectorAll('.scr').forEach(function(s){s.classList.remove('on')});var e=$(id);e.classList.add('on');$('codebar').style.display=id=='s-name'||id=='s-end'?'none':'block';rest()}
function rest(){clearTimeout(idle);idle=setTimeout(reset,$('s-end').classList.contains('on')?20000:90000)}
document.addEventListener('pointerdown',function(){rest();if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AC&&AC.state=='suspended')AC.resume()},true);
function tone(f,d,t,v,when){if(muted||!AC)return;try{var o=AC.createOscillator(),g=AC.createGain(),n=AC.currentTime+(when||0);o.type=t||'sine';o.frequency.setValueAtTime(f,n);g.gain.setValueAtTime(v||.15,n);g.gain.exponentialRampToValueAtTime(.001,n+d);o.connect(g);g.connect(AC.destination);o.start(n);o.stop(n+d)}catch(e){}}
var snd={click:function(){tone(900,.05,'square',.05)},good:function(){tone(660,.12,'sine');tone(990,.2,'sine',.15,.1)},bad:function(){tone(180,.3,'sawtooth',.12)},code:function(){tone(520,.1);tone(780,.1,'sine',.15,.1);tone(1040,.25,'sine',.15,.2)},
engine:function(){if(muted||!AC)return;try{var n=AC.currentTime,o=AC.createOscillator(),o2=AC.createOscillator(),g=AC.createGain(),f=AC.createBiquadFilter();o.type='sawtooth';o2.type='square';f.type='lowpass';f.frequency.value=420;o.frequency.setValueAtTime(30,n);o.frequency.linearRampToValueAtTime(48,n+.9);o.frequency.linearRampToValueAtTime(70,n+1.6);o.frequency.linearRampToValueAtTime(52,n+2.4);o2.frequency.setValueAtTime(15,n);o2.frequency.linearRampToValueAtTime(35,n+1.6);g.gain.setValueAtTime(.001,n);g.gain.linearRampToValueAtTime(.35,n+.4);g.gain.linearRampToValueAtTime(.2,n+2.4);g.gain.exponentialRampToValueAtTime(.001,n+2.9);o.connect(f);o2.connect(f);f.connect(g);g.connect(AC.destination);o.start(n);o2.start(n);o.stop(n+3);o2.stop(n+3)}catch(e){}}};
$('mute').onclick=function(){muted=!muted;this.textContent=muted?'🔇':'🔊'};
document.addEventListener('pointerdown',function(e){if(e.target.closest('button'))snd.click()},true);
// Hebrew keyboard (standard Israeli layout)
var rows=['קראטוןםפ','שדגכעיחלךף','זסבהנמצתץ'],nm=$('nm');
rows.forEach(function(r,i){var d=document.createElement('div');d.className='kr'+(i?' o'+i:'');r.split('').forEach(function(c){d.appendChild(key(c,c))});if(i==2)d.appendChild(key('⌫','del','f'));$('kb').appendChild(d)});
var r4=document.createElement('div');r4.className='kr';r4.appendChild(key('רווח','sp','w'));r4.appendChild(key('סיום','dn','d'));$('kb').appendChild(r4);
function key(l,v,c){var b=document.createElement('button');b.className='k '+(c||'');b.textContent=l;b.dataset.v=v;b.addEventListener('pointerdown',function(e){e.preventDefault();b.classList.add('p');typeKey(v)});['pointerup','pointerleave','pointercancel'].forEach(function(t){b.addEventListener(t,function(){b.classList.remove('p')})});return b}
function typeKey(v){nm.focus();var s=nm.selectionStart,e=nm.selectionEnd;if(v=='del'){if(s==e&&s>0){nm.setRangeText('',s-1,s,'end')}else nm.setRangeText('',s,e,'end')}else if(v=='dn'){nm.blur();return}else{if(nm.value.length>=20&&s==e)return;nm.setRangeText(v=='sp'?' ':v,s,e,'end')}chk()}
function chk(){$('go').disabled=!nm.value.trim()}nm.addEventListener('input',chk);nm.addEventListener('focus',function(){});
// game
function reset(){G={};saved=false;nm.value='';chk();$('stage').classList.remove('rev');$('glow').classList.remove('on');show('s-name')}
$('go').onclick=function(){var n=nm.value.trim();if(!n)return;G={name:n.slice(0,20),code:[0,0,0].map(function(){return 1+Math.floor(Math.random()*5)}),pool:sh(Q),pi:0,qi:0,t0:Date.now(),miss:0,ent:[],rev:0};drawBar();var e=$('enter');e.textContent='נכנסים לרכב…';e.style.transition='opacity .5s';e.style.opacity=1;snd.click();setTimeout(function(){tone(90,.25,'square',.2);tone(60,.2,'square',.2,.12)},900);setTimeout(function(){show('s-intro');e.style.opacity=0},1800)};
function drawBar(){var d=$('digs');d.innerHTML='';for(var i=0;i<3;i++){var s=document.createElement('div');s.className='dg'+(i<G.rev?' on':'');s.textContent=i<G.rev?G.code[i]:'?';d.appendChild(s)}}
$('go2').onclick=function(){G.qi=0;ask()};
function ask(){var q=G.pool[G.pi%G.pool.length];G.pi++;$('qt').textContent=q[0];$('qn').textContent='שאלה '+(G.qi+1)+' מתוך 3';$('qs').textContent=q[1];$('fb').textContent='';$('nx').style.display='none';var o=$('opts');o.innerHTML='';sh([[q[2],1]].concat(q[3].map(function(t){return[t,0]}))).forEach(function(a){var b=document.createElement('button');b.className='btn opt';b.textContent=a[0];b.dataset.ok=a[1];b.onclick=function(){pick(b,a[1],q)};o.appendChild(b)});var bx=$('qbox');bx.classList.remove('pop');void bx.offsetWidth;bx.classList.add('pop');show('s-q');G.lock=false}
function pick(b,ok,q){if(G.lock||b.disabled)return;if(ok){G.lock=true;b.classList.add('ok');snd.good();G.rev=G.qi+1;drawBar();$('fb').innerHTML='✔ נכון! נחשפה ספרה בקוד.<br><span style="font-size:36px;opacity:.9">'+q[4]+'</span>';document.querySelectorAll('.opt').forEach(function(x){x.disabled=true});var n=$('nx');n.style.display='block';n.textContent=G.qi<2?'לשאלה הבאה':'לפתוח את לוח ההתנעה'}else{G.lock=true;G.miss++;snd.bad();b.classList.add('bad');document.querySelectorAll('.opt').forEach(function(x){x.disabled=true;if(x.dataset.ok=='1')x.classList.add('ok')});$('fb').innerHTML='✘ תשובה שגויה, לא נחשפה ספרה. שאלה חדשה מגיעה עוד רגע.<br><span style="font-size:36px;opacity:.9">התשובה הנכונה מסומנת בירוק. '+q[4]+'</span>';var g=G;setTimeout(function(){if(G===g&&$('s-q').classList.contains('on'))ask()},3000)}}
$('nx').onclick=function(){if(G.qi<2){G.qi++;ask()}else{G.ent=[];drawEnt();$('pm').textContent='';show('s-pad')}};
// keypad
for(var i=1;i<=5;i++)(function(i){var b=document.createElement('button');b.className='pk';b.textContent=i;b.onclick=function(){if(G.busy||G.ent.length>=3)return;G.ent.push(i);drawEnt();setLed('')};$('pks').appendChild(b)})(i);
function drawEnt(){var e=$('ent'),l=$('led');e.innerHTML='';for(var i=0;i<3;i++){var s=document.createElement('div');s.className='dg';s.textContent=G.ent[i]||'';e.appendChild(s)}e.appendChild(l)}
function setLed(c){$('led').className=c}
$('del').onclick=function(){if(!G.busy){G.ent.pop();drawEnt();setLed('')}};
$('okb').onclick=function(){if(G.busy)return;if(G.ent.length<3){$('pm').textContent='הזינו שלוש ספרות.';return}
 if(G.ent.join('')==G.code.join('')){G.busy=true;G.ms=Date.now()-G.t0;setLed('g');$('pm').textContent='הקוד נכון! מתניעים…';snd.code();$('glow').classList.add('on');setTimeout(function(){$('stage').classList.add('rev');snd.engine()},500);setTimeout(function(){$('stage').classList.remove('rev');finish()},3300)}
 else{G.miss++;setLed('r');snd.bad();$('pm').textContent='הקוד לא נכון. בדקו את הספרות ונסו שוב.';var p=$('pad');p.classList.remove('shake');void p.offsetWidth;p.classList.add('shake');G.ent=[];setTimeout(drawEnt,400)}};
// results
function fmt(ms){var s=Math.round(ms/1000);return Math.floor(s/60)+':'+('0'+s%60).slice(-2)}
var dbc=null,useApi=false,LOC=[];try{LOC=JSON.parse(localStorage.getItem('sc')||'[]')}catch(e){}
(function(){try{if(window.claude)claude.use('db').then(function(d){if(d)dbc=d.collection('scores')}).catch(function(){})}catch(e){}
try{fetch('api/scores').then(function(r){useApi=r.ok}).catch(function(){})}catch(e){}})();
function finish(){G.busy=false;$('res').innerHTML=G.name+' · זמן: <span class="num">'+fmt(G.ms)+'</span> · טעויות: '+G.miss;show('s-end');$('lb').innerHTML='';
 var rec={name:G.name,ms:G.ms,miss:G.miss,ts:Date.now()};if(!saved){saved=true;save(rec)}else load()}
function save(rec){if(dbc)dbc.add(rec).then(load).catch(function(){save2(rec)});else save2(rec)}
function save2(rec){if(useApi)fetch('api/scores',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(rec)}).then(function(r){if(!r.ok)throw 0;load()}).catch(function(){local(rec)});else local(rec)}
function local(r){LOC.push(r);try{localStorage.setItem('sc',JSON.stringify(LOC))}catch(e){}draw(LOC.slice(),false)}
function load(){if(dbc)dbc.orderBy('ms','asc').limit(10).get().then(function(s){draw(s.docs.map(function(d){return d.data()}),true)}).catch(function(){draw(LOC.slice(),false)});else if(useApi)fetch('api/scores').then(function(r){return r.json()}).then(function(a){draw(a,true)}).catch(function(){draw(LOC.slice(),false)});else draw(LOC.slice(),false)}
function draw(a,shared){a.sort(function(x,y){return x.ms-y.ms});a=a.slice(0,8);var h='';a.forEach(function(r,i){var me=r.ts&&G.ms==r.ms&&r.name==G.name;h+='<tr'+(me?' class="me"':'')+'><td><span class="num">'+(i+1)+'</span></td><td>'+esc(r.name)+'</td><td><span class="num">'+fmt(r.ms)+'</span></td></tr>'});$('lb').innerHTML=h;$('lbn').textContent=shared?'הדירוג משותף לכל הטוטמים':'הדירוג שמור במכשיר זה בלבד (אין חיבור למאגר משותף)'}
function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML}
$('again').onclick=reset;
document.addEventListener('dblclick',function(){document.documentElement.requestFullscreen().catch(function(){})});
