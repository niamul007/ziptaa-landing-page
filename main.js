document.querySelectorAll('.tab').forEach(function(t){
  t.addEventListener('click',function(){
    document.querySelectorAll('.tab').forEach(function(x){x.classList.remove('active')});
    document.querySelectorAll('.ind').forEach(function(x){x.classList.toggle('active',x.dataset.p===t.dataset.t)});
    t.classList.add('active');
    if(t.dataset.t==='dental') restartDentalChat();
    else if(t.dataset.t==='salon') restartSalonChat();
    else if(t.dataset.t==='home') restartHomeChat();
    else if(t.dataset.t==='contractors') restartContractorsChat();
    else if(t.dataset.t==='re') restartReChat();
  });
});
document.querySelectorAll('.ind-item').forEach(function(t){
  t.addEventListener('click',function(){
    document.querySelectorAll('.ind-item').forEach(function(x){x.classList.remove('active')});
    document.querySelectorAll('.ind').forEach(function(x){x.classList.toggle('active',x.dataset.p===t.dataset.t)});
    t.classList.add('active');
    if(t.dataset.t==='dental') restartDentalChat();
    else if(t.dataset.t==='salon') restartSalonChat();
    else if(t.dataset.t==='home') restartHomeChat();
    else if(t.dataset.t==='contractors') restartContractorsChat();
    else if(t.dataset.t==='re') restartReChat();
  });
});
var dentalChatTimeout=null;
function playDentalChat(){
  clearTimeout(dentalChatTimeout);
  var box=document.getElementById('ichat-dental');
  if(!box) return;
  var script=[
    {side:'ai',text:"Thanks for calling Bright Smile Dental, this is Julia. How can I help?"},
    {side:'caller',text:"Hey, I've got a toothache — do you have anything open soon?"},
    {side:'ai',text:"I do — 8am tomorrow just opened up. Want me to book that?"},
    {side:'caller',text:"Yes, please!"},
    {side:'ai',text:"You're all set. I'll text you a confirmation."}
  ];
  var aiAvSvg='<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>';
  var callerAvSvg='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
  var i=0;
  function step(){
    var msg=script[i];
    var row=document.createElement('div');
    row.className='ichat-msg-row '+msg.side;
    var av=document.createElement('span');
    av.className='ichat-av '+msg.side;
    av.innerHTML=msg.side==='ai'?aiAvSvg:callerAvSvg;
    var el=document.createElement('div');
    el.className='ichat-msg '+msg.side+' entering';
    el.textContent=msg.text;
    row.appendChild(av);
    row.appendChild(el);
    box.appendChild(row);
    var rows=box.querySelectorAll('.ichat-msg-row:not(.leaving)');
    if(rows.length>3){
      var oldest=rows[0];
      oldest.style.maxHeight=oldest.offsetHeight+'px';
      oldest.offsetHeight;
      oldest.classList.add('leaving');
      oldest.addEventListener('transitionend',function(){
        if(oldest.parentNode) oldest.parentNode.removeChild(oldest);
      });
    }
    i++;
    if(i<script.length){
      dentalChatTimeout=setTimeout(step,1800);
    }else{
      dentalChatTimeout=setTimeout(function(){
        box.innerHTML='';
        i=0;
        step();
      },2500);
    }
  }
  step();
}
function restartDentalChat(){
  clearTimeout(dentalChatTimeout);
  var box=document.getElementById('ichat-dental');
  if(box) box.innerHTML='';
  playDentalChat();
}
playDentalChat();
var salonChatTimeout=null;
function playSalonChat(){
  clearTimeout(salonChatTimeout);
  var box=document.getElementById('ichat-salon');
  if(!box) return;
  var script=[
    {side:'ai',text:"Thanks for calling Glow Studio, this is Ava speaking."},
    {side:'caller',text:"Hi, I need a color appointment but I'm only free after 6pm."},
    {side:'ai',text:"Let me check evening slots... Thursday at 6:30 works. Does that suit you?"},
    {side:'caller',text:"That works. It's Dana Lee."},
    {side:'ai',text:"Booked for Thursday at 6:30, Dana. I'll text you a confirmation."}
  ];
  var aiAvSvg='<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>';
  var callerAvSvg='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
  var i=0;
  function step(){
    var msg=script[i];
    var row=document.createElement('div');
    row.className='ichat-msg-row '+msg.side;
    var av=document.createElement('span');
    av.className='ichat-av '+msg.side;
    av.innerHTML=msg.side==='ai'?aiAvSvg:callerAvSvg;
    var el=document.createElement('div');
    el.className='ichat-msg '+msg.side+' entering';
    el.textContent=msg.text;
    row.appendChild(av);
    row.appendChild(el);
    box.appendChild(row);
    var rows=box.querySelectorAll('.ichat-msg-row:not(.leaving)');
    if(rows.length>3){
      var oldest=rows[0];
      oldest.style.maxHeight=oldest.offsetHeight+'px';
      oldest.offsetHeight;
      oldest.classList.add('leaving');
      oldest.addEventListener('transitionend',function(){
        if(oldest.parentNode) oldest.parentNode.removeChild(oldest);
      });
    }
    i++;
    if(i<script.length){
      salonChatTimeout=setTimeout(step,1800);
    }else{
      salonChatTimeout=setTimeout(function(){
        box.innerHTML='';
        i=0;
        step();
      },2500);
    }
  }
  step();
}
function restartSalonChat(){
  clearTimeout(salonChatTimeout);
  var box=document.getElementById('ichat-salon');
  if(box) box.innerHTML='';
  playSalonChat();
}
var homeChatTimeout=null;
function playHomeChat(){
  clearTimeout(homeChatTimeout);
  var box=document.getElementById('ichat-home');
  if(!box) return;
  var script=[
    {side:'ai',text:"Rapid Home Solutions, this is Alex — what's going on?"},
    {side:'caller',text:"My water heater is leaking. Can someone come take a look?"},
    {side:'ai',text:"Sorry about that. I can book a visit. Does Thursday at 9am work?"},
    {side:'caller',text:"Yes. It's Sam Ortiz, 412 Birchwood Lane."},
    {side:'ai',text:"Booked for Thursday at 9am, Sam. I'll text you a confirmation."}
  ];
  var aiAvSvg='<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>';
  var callerAvSvg='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
  var i=0;
  function step(){
    var msg=script[i];
    var row=document.createElement('div');
    row.className='ichat-msg-row '+msg.side;
    var av=document.createElement('span');
    av.className='ichat-av '+msg.side;
    av.innerHTML=msg.side==='ai'?aiAvSvg:callerAvSvg;
    var el=document.createElement('div');
    el.className='ichat-msg '+msg.side+' entering';
    el.textContent=msg.text;
    row.appendChild(av);
    row.appendChild(el);
    box.appendChild(row);
    var rows=box.querySelectorAll('.ichat-msg-row:not(.leaving)');
    if(rows.length>3){
      var oldest=rows[0];
      oldest.style.maxHeight=oldest.offsetHeight+'px';
      oldest.offsetHeight;
      oldest.classList.add('leaving');
      oldest.addEventListener('transitionend',function(){
        if(oldest.parentNode) oldest.parentNode.removeChild(oldest);
      });
    }
    i++;
    if(i<script.length){
      homeChatTimeout=setTimeout(step,1800);
    }else{
      homeChatTimeout=setTimeout(function(){
        box.innerHTML='';
        i=0;
        step();
      },2500);
    }
  }
  step();
}
function restartHomeChat(){
  clearTimeout(homeChatTimeout);
  var box=document.getElementById('ichat-home');
  if(box) box.innerHTML='';
  playHomeChat();
}
var contractorsChatTimeout=null;
function playContractorsChat(){
  clearTimeout(contractorsChatTimeout);
  var box=document.getElementById('ichat-contractors');
  if(!box) return;
  var script=[
    {side:'ai',text:"Thanks for calling Turner Builders, this is Sam."},
    {side:'caller',text:"Hi, I want a quote but I'm not totally sure what I need — my kitchen just feels outdated."},
    {side:'ai',text:"No worries, happy to help scope it. Are you thinking new cabinets, countertops, or a full remodel?"},
    {side:'caller',text:"Probably cabinets and counters, not the whole layout."},
    {side:'ai',text:"Got it. I've saved your details and the team has been notified."}
  ];
  var aiAvSvg='<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>';
  var callerAvSvg='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
  var i=0;
  function step(){
    var msg=script[i];
    var row=document.createElement('div');
    row.className='ichat-msg-row '+msg.side;
    var av=document.createElement('span');
    av.className='ichat-av '+msg.side;
    av.innerHTML=msg.side==='ai'?aiAvSvg:callerAvSvg;
    var el=document.createElement('div');
    el.className='ichat-msg '+msg.side+' entering';
    el.textContent=msg.text;
    row.appendChild(av);
    row.appendChild(el);
    box.appendChild(row);
    var rows=box.querySelectorAll('.ichat-msg-row:not(.leaving)');
    if(rows.length>3){
      var oldest=rows[0];
      oldest.style.maxHeight=oldest.offsetHeight+'px';
      oldest.offsetHeight;
      oldest.classList.add('leaving');
      oldest.addEventListener('transitionend',function(){
        if(oldest.parentNode) oldest.parentNode.removeChild(oldest);
      });
    }
    i++;
    if(i<script.length){
      contractorsChatTimeout=setTimeout(step,1800);
    }else{
      contractorsChatTimeout=setTimeout(function(){
        box.innerHTML='';
        i=0;
        step();
      },2500);
    }
  }
  step();
}
function restartContractorsChat(){
  clearTimeout(contractorsChatTimeout);
  var box=document.getElementById('ichat-contractors');
  if(box) box.innerHTML='';
  playContractorsChat();
}
var reChatTimeout=null;
function playReChat(){
  clearTimeout(reChatTimeout);
  var box=document.getElementById('ichat-re');
  if(!box) return;
  var script=[
    {side:'ai',text:"Thanks for calling Skyline Realty, this is Nora."},
    {side:'caller',text:"Hi, I wanted to see the house on Maple St. this weekend."},
    {side:'ai',text:"Happy to pass that to our agent. Can I get your name?"},
    {side:'caller',text:"Tom Reyes."},
    {side:'ai',text:"Thanks, Tom. I've saved your showing request and notified the agent."}
  ];
  var aiAvSvg='<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>';
  var callerAvSvg='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
  var i=0;
  function step(){
    var msg=script[i];
    var row=document.createElement('div');
    row.className='ichat-msg-row '+msg.side;
    var av=document.createElement('span');
    av.className='ichat-av '+msg.side;
    av.innerHTML=msg.side==='ai'?aiAvSvg:callerAvSvg;
    var el=document.createElement('div');
    el.className='ichat-msg '+msg.side+' entering';
    el.textContent=msg.text;
    row.appendChild(av);
    row.appendChild(el);
    box.appendChild(row);
    var rows=box.querySelectorAll('.ichat-msg-row:not(.leaving)');
    if(rows.length>3){
      var oldest=rows[0];
      oldest.style.maxHeight=oldest.offsetHeight+'px';
      oldest.offsetHeight;
      oldest.classList.add('leaving');
      oldest.addEventListener('transitionend',function(){
        if(oldest.parentNode) oldest.parentNode.removeChild(oldest);
      });
    }
    i++;
    if(i<script.length){
      reChatTimeout=setTimeout(step,1800);
    }else{
      reChatTimeout=setTimeout(function(){
        box.innerHTML='';
        i=0;
        step();
      },2500);
    }
  }
  step();
}
function restartReChat(){
  clearTimeout(reChatTimeout);
  var box=document.getElementById('ichat-re');
  if(box) box.innerHTML='';
  playReChat();
}
document.querySelectorAll('.qa button').forEach(function(b){
  b.addEventListener('click',function(){b.parentNode.classList.toggle('open')});
});
(function(){
  var steps=document.querySelectorAll('.step');
  if(!('IntersectionObserver' in window)){steps.forEach(function(s){s.classList.add('play')});return}
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('play');io.unobserve(e.target)}});
  },{threshold:.35});
  steps.forEach(function(s){io.observe(s)});
})();
(function(){
  var cs=document.querySelectorAll('.bt-c2,.bt-c3,.bt-c4,.bt-c5,.bt-c6');
  if(!('IntersectionObserver' in window)){cs.forEach(function(c){c.classList.add('bt-in')});return}
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){e.target.classList.add('bt-in');io.unobserve(e.target)}
    });
  },{threshold:.35});
  cs.forEach(function(c){io.observe(c)});
})();
(function(){
  var hd=document.querySelector('.hd');
  if(!hd)return;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  function pad(n){return n<10?'0'+n:''+n}
  function play(){
    hd.classList.add('hd-in');
    var ns=hd.querySelectorAll('[data-count]');
    [].forEach.call(ns,function(el){
      var raw=el.getAttribute('data-count'),parts=raw.split(':'),isTime=parts.length>1,
          total=isTime?parseInt(parts[0],10)*60+parseInt(parts[1],10):parseInt(raw,10);
      if(reduce){el.textContent=raw;return}
      function fmt(v){return isTime?Math.floor(v/60)+':'+pad(v%60):String(v)}
      var t0=null,dur=1200;
      function tick(ts){
        if(t0===null)t0=ts;
        var p=Math.min((ts-t0)/dur,1),e=1-Math.pow(1-p,3);
        el.textContent=p<1?fmt(Math.round(total*e)):raw;
        if(p<1)requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }
  if(!('IntersectionObserver' in window)){play();return}
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){play();io.unobserve(e.target)}});
  },{threshold:.15});
  io.observe(hd);
})();