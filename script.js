// current year
document.getElementById('year').textContent = new Date().getFullYear();

// dark/light mode
const root = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
function applyTheme(t){
  if(t==='dark'){ root.setAttribute('data-theme','dark'); themeBtn.textContent='☀️'; }
  else { root.removeAttribute('data-theme'); themeBtn.textContent='🌙'; }
}
let saved = 'light';
try{ saved = localStorage.getItem('quyen-theme') || 'light'; }catch(e){}
applyTheme(saved);
themeBtn.addEventListener('click', ()=>{
  const next = root.getAttribute('data-theme')==='dark' ? 'light' : 'dark';
  applyTheme(next);
  try{ localStorage.setItem('quyen-theme', next); }catch(e){}
});

// hamburger menu
const header = document.getElementById('siteHeader');
const hamburger = document.getElementById('hamburger');
hamburger.addEventListener('click', ()=>{
  const open = header.getAttribute('data-open') === 'true';
  header.setAttribute('data-open', open ? 'false' : 'true');
});
document.querySelectorAll('.nav-link').forEach(link=>{
  link.addEventListener('click', ()=> header.setAttribute('data-open','false'));
});

// avatar change
const avatarImg = document.getElementById('avatarImg');
const avatarInput = document.getElementById('avatarInput');
avatarImg.addEventListener('click', ()=> avatarInput.click());
avatarInput.addEventListener('change', (e)=>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ev=>{
    avatarImg.src = ev.target.result;
    try{ localStorage.setItem('quyen-avatar', ev.target.result); }catch(err){}
  };
  reader.readAsDataURL(file);
});
try{
  const savedAvatar = localStorage.getItem('quyen-avatar');
  if(savedAvatar) avatarImg.src = savedAvatar;
}catch(e){}

// project search + tag filter
const projGrid = document.getElementById('projGrid');
const cards = Array.from(projGrid.querySelectorAll('.proj-card'));
const searchInput = document.getElementById('projSearch');
const tagBtns = document.querySelectorAll('.tag-btn');
const noResult = document.getElementById('noResult');
let activeTag = 'all';
function filterProjects(){
  const q = searchInput.value.trim().toLowerCase();
  let visible = 0;
  cards.forEach(card=>{
    const text = (card.textContent + ' ' + card.dataset.tags).toLowerCase();
    const matchesTag = activeTag==='all' || card.dataset.tags.includes(activeTag);
    const matchesQuery = q==='' || text.includes(q);
    const show = matchesTag && matchesQuery;
    card.style.display = show ? '' : 'none';
    if(show) visible++;
  });
  noResult.style.display = visible===0 ? 'block' : 'none';
}
searchInput.addEventListener('input', filterProjects);
tagBtns.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    tagBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    activeTag = btn.dataset.tag;
    filterProjects();
  });
});

// character counter
const message = document.getElementById('message');
const charCount = document.getElementById('charCount');
message.addEventListener('input', ()=>{ charCount.textContent = message.value.length; });

// form validation
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
function setErr(id, msg){ document.getElementById('err-'+id).textContent = msg; }
form.addEventListener('submit', (e)=>{
  e.preventDefault();
  let valid = true;
  const fullname = document.getElementById('fullname').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const msg = message.value.trim();

  if(fullname.length < 2){ setErr('fullname','Vui lòng nhập họ và tên hợp lệ.'); valid=false; } else setErr('fullname','');
  if(!/^0\d{9}$/.test(phone)){ setErr('phone','Số điện thoại phải gồm 10 số, bắt đầu bằng 0.'); valid=false; } else setErr('phone','');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ setErr('email','Email không đúng định dạng.'); valid=false; } else setErr('email','');
  if(msg.length < 5){ setErr('message','Lời nhắn cần ít nhất 5 kí tự.'); valid=false; } else setErr('message','');

  if(valid){
    formStatus.textContent = '';
    const toast = document.getElementById('toast');
    document.getElementById('toastText').textContent = 'Đã gửi tin nhắn thành công! Cảm ơn ' + fullname + ', mình sẽ phản hồi sớm nhất có thể.';
    toast.classList.add('show');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(()=> toast.classList.remove('show'), 4000);
    form.reset();
    charCount.textContent = '0';
  } else {
    formStatus.textContent = '';
  }
});

// scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){ entry.target.classList.add('visible'); io.unobserve(entry.target); }
  });
}, {threshold:0.15});
revealEls.forEach(el=> io.observe(el));
