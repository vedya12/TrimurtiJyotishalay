import{s as i,f as y,a as u,g as O,i as U,b as j,c as R}from"./supabase-Bz0haH2D.js";let p=new Date;p.setDate(1);let f={},h={},B=new Set,F=[];const A=["जानेवारी","फेब्रुवारी","मार्च","एप्रिल","मे","जून","जुलै","ऑगस्ट","सप्टेंबर","ऑक्टोबर","नोव्हेंबर","डिसेंबर"],z=["रवि","सोम","मंगळ","बुध","गुरु","शुक्र","शनि"],E={pending:"प्रलंबित",confirmed:"निश्चित",completed:"पूर्ण",cancelled:"रद्द"},b=document.createElement("div");b.className="toast";document.body.appendChild(b);let N=null;function l(a,e="success"){b.textContent=a,b.className=`toast ${e} show`,clearTimeout(N),N=setTimeout(()=>b.classList.remove("show"),4e3)}document.querySelectorAll(".tab-btn").forEach(a=>{a.addEventListener("click",()=>{document.querySelectorAll(".tab-btn").forEach(e=>e.classList.remove("active")),document.querySelectorAll(".tab-content").forEach(e=>e.classList.remove("active")),a.classList.add("active"),document.getElementById(`tab-${a.dataset.tab}`).classList.add("active")})});async function g(){const a=p.getFullYear(),e=p.getMonth(),n=new Date(a,e,1).toISOString().split("T")[0],t=new Date(a,e+1,0).toISOString().split("T")[0];try{const[o,c,r]=await Promise.all([i.from("bookings").select("*").gte("event_date",n).lte("event_date",t).neq("status","cancelled"),i.from("events").select("*").gte("event_date",n).lte("event_date",t),i.from("blocked_dates").select("*").gte("block_date",n).lte("block_date",t)]);f={},o.data&&o.data.forEach(s=>{f[s.event_date]||(f[s.event_date]=[]),f[s.event_date].push(s)}),h={},c.data&&c.data.forEach(s=>{h[s.event_date]||(h[s.event_date]=[]),h[s.event_date].push(s)}),B=new Set,r.data&&r.data.forEach(s=>B.add(s.block_date)),Y()}catch{l("कॅलेंडर डेटा लोड करताना त्रुटी.","error")}}function Y(){var r,s;const a=p.getFullYear(),e=p.getMonth();document.getElementById("adminMonthLabel").textContent=`${A[e]} ${a}`;const n=document.getElementById("adminCalendarGrid");n.innerHTML="",z.forEach(m=>{const d=document.createElement("div");d.className="cal-day-name",d.textContent=m,n.appendChild(d)});const t=new Date(a,e,1).getDay(),o=new Date(a,e+1,0).getDate(),c=new Date;c.setHours(0,0,0,0);for(let m=0;m<t;m++){const d=document.createElement("div");d.className="cal-day empty",n.appendChild(d)}for(let m=1;m<=o;m++){const d=`${a}-${String(e+1).padStart(2,"0")}-${String(m).padStart(2,"0")}`,_=new Date(a,e,m);_.setHours(0,0,0,0);const v=document.createElement("div");v.className="cal-day",v.textContent=m,v.dataset.date=d;const I=f[d]&&f[d].length>0,$=h[d]&&h[d].length>0,H=B.has(d);if(I&&$?v.classList.add("has-both"):I?v.classList.add("has-booking"):$?v.classList.add("has-event"):H&&v.classList.add("has-blocked"),I||$||H){const S=(((r=f[d])==null?void 0:r.length)||0)+(((s=h[d])==null?void 0:s.length)||0);if(S>0){const k=document.createElement("span");k.className="cal-day-count",k.textContent=`${S}↓`,v.appendChild(k)}v.addEventListener("click",()=>W(d))}_.getTime()===c.getTime()&&v.classList.add("today"),n.appendChild(v)}}function W(a){const e=document.getElementById("dayDetail"),n=document.getElementById("dayDetailContent"),t=document.getElementById("dayDetailDate");t.textContent=y(a),n.innerHTML="";const o=[];(f[a]||[]).forEach(c=>{o.push({type:"booking",data:c})}),(h[a]||[]).forEach(c=>{o.push({type:"event",data:c})}),B.has(a)&&o.push({type:"blocked",data:{block_date:a}}),o.length===0?n.innerHTML='<p class="empty-state">या दिवशी कोणतेही बुकिंग किंवा कार्यक्रम नाहीत.</p>':o.forEach(c=>{const r=document.createElement("div");if(r.className="detail-item",c.type==="booking"){const s=c.data;r.innerHTML=`
          <span class="di-type booking">बुकिंग</span>
          <div class="di-title">${s.client_name} — ${s.booking_reference}</div>
          <div class="di-time">⏰ ${u(s.start_time)}${s.end_time?" – "+u(s.end_time):""}</div>
          ${s.location?`<div class="di-meta">📍 ${s.location}</div>`:""}
          <div class="di-meta">📞 ${s.client_phone} | ${E[s.status]||s.status}</div>
        `,r.style.cursor="pointer",r.addEventListener("click",()=>openBookingModal(s.id))}else if(c.type==="event"){const s=c.data;r.innerHTML=`
          <span class="di-type event">कार्यक्रम</span>
          <div class="di-title">${s.title}</div>
          <div class="di-time">⏰ ${u(s.start_time)}${s.end_time?" – "+u(s.end_time):""}</div>
          ${s.location?`<div class="di-meta">📍 ${s.location}</div>`:""}
          ${s.contact_person?`<div class="di-meta">👤 ${s.contact_person}${s.contact_phone?" • "+s.contact_phone:""}</div>`:""}
        `}else c.type==="blocked"&&(r.innerHTML=`
          <span class="di-type blocked">सुट्टी</span>
          <div class="di-title">सुट्टीचा दिवस</div>
        `);n.appendChild(r)}),e.style.display="block",e.scrollIntoView({behavior:"smooth",block:"nearest"})}document.getElementById("adminPrevMonth").addEventListener("click",()=>{p.setMonth(p.getMonth()-1),g()});document.getElementById("adminNextMonth").addEventListener("click",()=>{p.setMonth(p.getMonth()+1),g()});async function w(a="all"){const e=document.getElementById("bookingsList");e.innerHTML='<div class="loading-text">बुकिंग लोड होत आहे...</div>';try{let n=i.from("bookings").select("*").order("event_date",{ascending:!1}).order("start_time",{ascending:!0});a!=="all"&&(n=n.eq("status",a));const{data:t,error:o}=await n;if(o)throw o;F=t||[],V(t||[]),G(t||[])}catch{e.innerHTML='<p class="empty-state">बुकिंग लोड करताना त्रुटी.</p>'}}function G(a){if(a===F){const e=a.filter(t=>t.status==="pending").length,n=document.getElementById("pendingBadge");e>0?(n.textContent=e,n.style.display="inline-flex"):n.style.display="none"}}function V(a){const e=document.getElementById("bookingsList");if(a.length===0){e.innerHTML='<p class="empty-state">कोणतेही बुकिंग नाहीत.</p>';return}e.innerHTML="",a.forEach(n=>{var s;const t=document.createElement("div");t.className=`booking-card status-${n.status}`;const o=n.event_date?n.event_date.split("-"):"",c=o?o[2]:"",r=o?(s=A[parseInt(o[1])-1])==null?void 0:s.slice(0,3):"";t.innerHTML=`
      <div class="booking-date-box">
        <div class="bd-day">${c}</div>
        <div class="bd-month">${r}</div>
      </div>
      <div class="booking-info">
        <div class="bi-ref">${n.booking_reference}</div>
        <div class="bi-name">${n.client_name}</div>
        <div class="bi-service">⏰ ${u(n.start_time)}${n.location?" • 📍 "+n.location:""}</div>
        <div class="bi-meta">📞 ${n.client_phone}${n.client_email?" • "+n.client_email:""}</div>
        <div class="booking-actions">
          <button class="btn-view" onclick="openBookingModal('${n.id}')">📋 तपशील</button>
        </div>
      </div>
      <span class="status-badge ${n.status}">${E[n.status]||n.status}</span>
    `,e.appendChild(t)})}document.getElementById("bookingFilter").addEventListener("change",a=>{w(a.target.value)});window.openBookingModal=async function(a){try{const{data:e,error:n}=await i.from("bookings").select("*, services(name, name_mr)").eq("id",a).maybeSingle();if(n||!e){l("बुकिंग तपशील लोड करताना त्रुटी.","error");return}const t=e.services?e.services.name_mr||e.services.name:"—",o=document.getElementById("bookingModalContent");o.innerHTML=`
      <div class="bm-header">
        <div>
          <h3>${e.client_name}</h3>
          <div style="font-size:.78rem;color:var(--brown-lt);font-family:'Courier New',monospace;">${e.booking_reference}</div>
        </div>
        <button class="bm-close" onclick="document.getElementById('bookingModalOverlay').style.display='none'">✕</button>
      </div>

      <div class="bm-section">
        <h4>बुकिंग तपशील</h4>
        <div class="bm-row"><span class="label">सेवा:</span><span class="value">${t}</span></div>
        <div class="bm-row"><span class="label">तारीख:</span><span class="value">${y(e.event_date)}</span></div>
        <div class="bm-row"><span class="label">वेळ:</span><span class="value">${u(e.start_time)}${e.end_time?" – "+u(e.end_time):""}</span></div>
        ${e.location?`<div class="bm-row"><span class="label">स्थान:</span><span class="value">${e.location}</span></div>`:""}
        <div class="bm-row"><span class="label">स्थिती:</span><span class="value"><span class="status-badge ${e.status}">${E[e.status]||e.status}</span></span></div>
      </div>

      <div class="bm-section">
        <h4>क्लायंट माहिती</h4>
        <div class="bm-row"><span class="label">नाव:</span><span class="value">${e.client_name}</span></div>
        <div class="bm-row"><span class="label">फोन:</span><span class="value">${e.client_phone}</span></div>
        ${e.client_email?`<div class="bm-row"><span class="label">ईमेल:</span><span class="value">${e.client_email}</span></div>`:""}
      </div>

      ${e.notes?`<div class="bm-section"><h4>क्लायंट सूचना</h4><p style="font-size:.88rem;color:var(--brown);padding:8px;background:var(--cream-dk);border-radius:8px;">${e.notes}</p></div>`:""}

      <div class="bm-admin-notes">
        <h4>व्यवस्थापक सूचना</h4>
        <textarea id="adminNotesField" placeholder="येथे तुमच्या सूचना लिहा...">${e.admin_notes||""}</textarea>
      </div>

      <div class="bm-status-actions">
        <button class="bm-btn-confirm" onclick="updateBookingStatus('${e.id}', 'confirmed')">✓ निश्चित करा</button>
        <button class="bm-btn-complete" onclick="updateBookingStatus('${e.id}', 'completed')">✓ पूर्ण करा</button>
        <button class="bm-btn-cancel" onclick="updateBookingStatus('${e.id}', 'cancelled')">✕ रद्द करा</button>
        <button class="bm-btn-delete" onclick="deleteBooking('${e.id}')">🗑 हटवा</button>
      </div>

      <div style="margin-top:12px;display:flex;gap:8px;">
        <button class="btn-secondary" style="flex:1;" onclick="saveAdminNotes('${e.id}')">सूचना जतन करा</button>
        <a href="https://wa.me/91${e.client_phone}?text=${encodeURIComponent(`नमस्कार ${e.client_name}, तुमची बुकिंग (${e.booking_reference}) ${y(e.event_date)} रोजी ${u(e.start_time)} वाजता नोंदणी झाली आहे. - त्रिमूर्ती ज्योतिषालय`)}" target="_blank" rel="noopener" class="btn-primary" style="flex:1;text-align:center;text-decoration:none;">💬 WhatsApp</a>
      </div>
    `,document.getElementById("bookingModalOverlay").style.display="flex"}catch{l("त्रुटी आली.","error")}};window.updateBookingStatus=async function(a,e){try{const{error:n}=await i.from("bookings").update({status:e,updated_at:new Date().toISOString()}).eq("id",a);if(n)throw n;l(`बुकिंग ${E[e]} केले.`),document.getElementById("bookingModalOverlay").style.display="none",w(document.getElementById("bookingFilter").value),g()}catch{l("स्थिती अद्ययावत करताना त्रुटी.","error")}};window.saveAdminNotes=async function(a){const e=document.getElementById("adminNotesField").value.trim();try{const{error:n}=await i.from("bookings").update({admin_notes:e,updated_at:new Date().toISOString()}).eq("id",a);if(n)throw n;l("सूचना जतन झाल्या.")}catch{l("सूचना जतन करताना त्रुटी.","error")}};window.deleteBooking=async function(a){if(confirm("हे बुकिंग कायमचे हटवायचे आहे का?"))try{const{error:e}=await i.from("bookings").delete().eq("id",a);if(e)throw e;l("बुकिंग हटवले."),document.getElementById("bookingModalOverlay").style.display="none",w(document.getElementById("bookingFilter").value),g()}catch{l("बुकिंग हटवताना त्रुटी.","error")}};async function L(){const a=document.getElementById("eventsList");a.innerHTML='<div class="loading-text">कार्यक्रम लोड होत आहे...</div>';try{const{data:e,error:n}=await i.from("events").select("*").order("event_date",{ascending:!0});if(n)throw n;if(!e||e.length===0){a.innerHTML='<p class="empty-state">कोणतेही कार्यक्रम नाहीत. "नवीन कार्यक्रम" बटण क्लिक करा.</p>';return}a.innerHTML="",e.forEach(t=>{const o=document.createElement("div");o.className="event-card",o.innerHTML=`
        <div class="event-info">
          <span class="ei-type">${t.event_type||"कार्यक्रम"}</span>
          <div class="ei-title">${t.title}</div>
          <div class="ei-meta">📅 ${y(t.event_date)} | ⏰ ${u(t.start_time)}${t.end_time?" – "+u(t.end_time):""}</div>
          ${t.location?`<div class="ei-meta">📍 ${t.location}</div>`:""}
          ${t.contact_person?`<div class="ei-meta">👤 ${t.contact_person}${t.contact_phone?" • "+t.contact_phone:""}</div>`:""}
        </div>
        <div class="event-actions">
          <button class="btn-edit" onclick="openEventModal('${t.id}')">✏ संपादन</button>
          <button class="btn-del" onclick="deleteEvent('${t.id}')">🗑</button>
        </div>
      `,a.appendChild(o)})}catch{a.innerHTML='<p class="empty-state">कार्यक्रम लोड करताना त्रुटी.</p>'}}window.openEventModal=async function(a){const e=document.getElementById("eventModalOverlay");if(document.getElementById("eventForm").reset(),document.getElementById("eventId").value="",a){document.getElementById("eventModalTitle").textContent="कार्यक्रम संपादन";try{const{data:t,error:o}=await i.from("events").select("*").eq("id",a).maybeSingle();if(o||!t)return;document.getElementById("eventId").value=t.id,document.getElementById("eventTitle").value=t.title,document.getElementById("eventType").value=t.event_type||"Other",document.getElementById("eventDate").value=t.event_date,document.getElementById("eventStartTime").value=t.start_time,document.getElementById("eventEndTime").value=t.end_time||"",document.getElementById("eventLocation").value=t.location||"",document.getElementById("eventContact").value=t.contact_person||"",document.getElementById("eventPhone").value=t.contact_phone||"",document.getElementById("eventNotes").value=t.notes||""}catch{l("कार्यक्रम तपशील लोड करताना त्रुटी.","error")}}else document.getElementById("eventModalTitle").textContent="नवीन कार्यक्रम";e.style.display="flex"};window.closeEventModal=function(){document.getElementById("eventModalOverlay").style.display="none"};document.getElementById("eventForm").addEventListener("submit",async a=>{a.preventDefault();const e=document.getElementById("eventId").value,n={title:document.getElementById("eventTitle").value.trim(),event_type:document.getElementById("eventType").value,event_date:document.getElementById("eventDate").value,start_time:document.getElementById("eventStartTime").value,end_time:document.getElementById("eventEndTime").value||null,location:document.getElementById("eventLocation").value.trim()||null,contact_person:document.getElementById("eventContact").value.trim()||null,contact_phone:document.getElementById("eventPhone").value.trim()||null,notes:document.getElementById("eventNotes").value.trim()||null};try{if(e){const{error:t}=await i.from("events").update(n).eq("id",e);if(t)throw t;l("कार्यक्रम अद्ययावत झाला.")}else{const{error:t}=await i.from("events").insert(n);if(t)throw t;l("नवीन कार्यक्रम जोडला.")}closeEventModal(),L(),g()}catch{l("कार्यक्रम जतन करताना त्रुटी.","error")}});window.deleteEvent=async function(a){if(confirm("हा कार्यक्रम हटवायचा आहे का?"))try{const{error:e}=await i.from("events").delete().eq("id",a);if(e)throw e;l("कार्यक्रम हटवला."),L(),g()}catch{l("कार्यक्रम हटवताना त्रुटी.","error")}};async function T(){const a=document.getElementById("blockedList");a.innerHTML='<div class="loading-text">सुट्टी दिवस लोड होत आहे...</div>';try{const{data:e,error:n}=await i.from("blocked_dates").select("*").order("block_date",{ascending:!0});if(n)throw n;if(!e||e.length===0){a.innerHTML='<p class="empty-state">कोणतेही सुट्टी दिवस नाहीत.</p>';return}a.innerHTML="",e.forEach(t=>{const o=document.createElement("div");o.className="blocked-card",o.innerHTML=`
        <div>
          <div class="bl-date">📅 ${y(t.block_date)}</div>
          ${t.reason?`<div class="bl-reason">${t.reason}</div>`:""}
        </div>
        <button class="btn-del" onclick="deleteBlocked('${t.id}')">🗑 हटवा</button>
      `,a.appendChild(o)})}catch{a.innerHTML='<p class="empty-state">सुट्टी दिवस लोड करताना त्रुटी.</p>'}}window.openBlockModal=function(){document.getElementById("blockForm").reset(),document.getElementById("blockModalOverlay").style.display="flex"};window.closeBlockModal=function(){document.getElementById("blockModalOverlay").style.display="none"};document.getElementById("blockForm").addEventListener("submit",async a=>{a.preventDefault();const e=document.getElementById("blockDate").value,n=document.getElementById("blockReason").value.trim();try{const{error:t}=await i.from("blocked_dates").insert({block_date:e,reason:n||null});if(t){if(t.code==="23505")l("हा दिवस आधीच ब्लॉक केला आहे.","error");else throw t;return}l("सुट्टी दिवस जोडला."),closeBlockModal(),T(),g()}catch{l("दिवस ब्लॉक करताना त्रुटी.","error")}});window.deleteBlocked=async function(a){if(confirm("हा सुट्टी दिवस हटवायचा आहे का?"))try{const{error:e}=await i.from("blocked_dates").delete().eq("id",a);if(e)throw e;l("सुट्टी दिवस हटवला."),T(),g()}catch{l("हटवताना त्रुटी.","error")}};async function C(){const a=document.getElementById("adminServicesList");a.innerHTML='<div class="loading-text">सेवा लोड होत आहे...</div>';try{const{data:e,error:n}=await i.from("services").select("*").order("sort_order",{ascending:!0});if(n)throw n;if(!e||e.length===0){a.innerHTML='<p class="empty-state">कोणत्याही सेवा नाहीत.</p>';return}a.innerHTML="",e.forEach(t=>{const o=document.createElement("div");o.className="service-admin-card",o.innerHTML=`
        <div class="sa-name">${t.name_mr||t.name}</div>
        <div class="sa-meta">⏱ ${t.duration_minutes} मिनिटे | 📋 क्रम ${t.sort_order} ${t.is_active?"":"| निष्क्रिय"}</div>
        <div class="sa-price">₹${t.base_price}</div>
        <div class="sa-actions">
          <button class="btn-edit" onclick="openServiceModal('${t.id}')">✏ संपादन</button>
          <button class="btn-del" onclick="deleteService('${t.id}')">🗑</button>
        </div>
      `,a.appendChild(o)})}catch{a.innerHTML='<p class="empty-state">सेवा लोड करताना त्रुटी.</p>'}}window.openServiceModal=async function(a){if(document.getElementById("serviceForm").reset(),document.getElementById("svcId").value="",a){document.getElementById("serviceModalTitle").textContent="सेवा संपादन";try{const{data:n,error:t}=await i.from("services").select("*").eq("id",a).maybeSingle();if(t||!n)return;document.getElementById("svcId").value=n.id,document.getElementById("svcName").value=n.name,document.getElementById("svcNameMr").value=n.name_mr||"",document.getElementById("svcDesc").value=n.description||"",document.getElementById("svcDuration").value=n.duration_minutes,document.getElementById("svcPrice").value=n.base_price,document.getElementById("svcSort").value=n.sort_order}catch{l("सेवा तपशील लोड करताना त्रुटी.","error")}}else document.getElementById("serviceModalTitle").textContent="नवीन सेवा";document.getElementById("serviceModalOverlay").style.display="flex"};window.closeServiceModal=function(){document.getElementById("serviceModalOverlay").style.display="none"};document.getElementById("serviceForm").addEventListener("submit",async a=>{a.preventDefault();const e=document.getElementById("svcId").value,n={name:document.getElementById("svcName").value.trim(),name_mr:document.getElementById("svcNameMr").value.trim()||null,description:document.getElementById("svcDesc").value.trim()||null,duration_minutes:parseInt(document.getElementById("svcDuration").value)||60,base_price:parseFloat(document.getElementById("svcPrice").value)||0,sort_order:parseInt(document.getElementById("svcSort").value)||0,is_active:!0};try{if(e){const{error:t}=await i.from("services").update(n).eq("id",e);if(t)throw t;l("सेवा अद्ययावत झाली.")}else{const{error:t}=await i.from("services").insert(n);if(t)throw t;l("नवीन सेवा जोडली.")}closeServiceModal(),C()}catch{l("सेवा जतन करताना त्रुटी.","error")}});window.deleteService=async function(a){if(confirm("ही सेवा हटवायची आहे का?"))try{const{error:e}=await i.from("services").delete().eq("id",a);if(e)throw e;l("सेवा हटवली."),C()}catch{l("सेवा हटवताना त्रुटी.","error")}};async function J(){if(!await O()){window.location.href="/login.html";return}if(!await U()){window.location.href="/dashboard.html";return}const n=await j();document.getElementById("adminName").textContent=(n==null?void 0:n.full_name)||"",document.getElementById("redirectScreen").style.display="none",document.getElementById("navbar").style.display="flex",document.getElementById("tabBar").style.display="flex",document.getElementById("adminLogoutBtn").addEventListener("click",R),g(),w(),L(),T(),C(),K(),Q(),D(),x()}J();async function K(){var a,e;try{const n=new Date().toISOString().split("T")[0],[t,o,c,r]=await Promise.all([i.from("bookings").select("*").eq("event_date",n).neq("status","cancelled"),i.from("bookings").select("*",{count:"exact",head:!0}).eq("status","pending"),i.from("events").select("*").gte("event_date",n).order("event_date",{ascending:!0}).limit(5),i.from("profiles").select("*",{count:"exact",head:!0})]);document.getElementById("ovTodayCount").textContent=((a=t.data)==null?void 0:a.length)||0,document.getElementById("ovPending").textContent=o.count||0,document.getElementById("ovEvents").textContent=((e=c.data)==null?void 0:e.length)||0,document.getElementById("ovClients").textContent=r.count||0;const s=document.getElementById("ovTodayBookings");t.data&&t.data.length>0?s.innerHTML=t.data.sort((d,_)=>d.start_time.localeCompare(_.start_time)).map(d=>`
        <div class="booking-card status-${d.status}" style="cursor:pointer;" onclick="openBookingModal('${d.id}')">
          <div class="booking-info">
            <div class="bi-ref">${d.booking_reference}</div>
            <div class="bi-name">${d.client_name}</div>
            <div class="bi-service">⏰ ${u(d.start_time)}${d.location?" • 📍 "+d.location:""}</div>
            <div class="bi-meta">📞 ${d.client_phone}</div>
          </div>
          <span class="status-badge ${d.status}">${E[d.status]||d.status}</span>
        </div>
      `).join(""):s.innerHTML='<p class="empty-state">आज कोणतीही बुकिंग नाही.</p>';const m=document.getElementById("ovUpcomingEvents");c.data&&c.data.length>0?m.innerHTML=c.data.map(d=>`
        <div class="event-card">
          <div class="event-info">
            <span class="ei-type">${d.event_type||"कार्यक्रम"}</span>
            <div class="ei-title">${d.title}</div>
            <div class="ei-meta">📅 ${y(d.event_date)} | ⏰ ${u(d.start_time)}</div>
            ${d.location?`<div class="ei-meta">📍 ${d.location}</div>`:""}
          </div>
        </div>
      `).join(""):m.innerHTML='<p class="empty-state">कोणतेही आगामी कार्यक्रम नाहीत.</p>'}catch{}}let M=[];async function Q(){const a=document.getElementById("clientsList");try{const{data:e,error:n}=await i.from("profiles").select("*").order("created_at",{ascending:!1});if(n)throw n;M=e||[],q(M),document.getElementById("clientSearch").addEventListener("input",t=>{const o=t.target.value.trim().toLowerCase(),c=M.filter(r=>(r.full_name||"").toLowerCase().includes(o)||(r.phone||"").includes(o));q(c)})}catch{a.innerHTML='<p class="empty-state">क्लायंट लोड करताना त्रुटी.</p>'}}async function q(a){const e=document.getElementById("clientsList");if(a.length===0){e.innerHTML='<p class="empty-state">कोणतेही क्लायंट नाहीत.</p>';return}const n=await Promise.all(a.map(async t=>{const{count:o}=await i.from("bookings").select("*",{count:"exact",head:!0}).eq("client_id",t.id);return{...t,bookingCount:o||0}}));e.innerHTML=n.map(t=>{var c;const o=(t.full_name||"?").charAt(0).toUpperCase();return`
      <div class="client-card" onclick="openClientModal('${t.id}')">
        <div class="client-avatar">${o}</div>
        <div class="client-info">
          <div class="ci-name">${t.full_name||"Unknown"}</div>
          <div class="ci-meta">📞 ${t.phone||"—"}</div>
          <div class="ci-since">नोंदणी: ${y((c=t.created_at)==null?void 0:c.split("T")[0])}</div>
        </div>
        <span class="client-bookings">${t.bookingCount} बुकिंग</span>
      </div>
    `}).join("")}window.openClientModal=async function(a){try{const{data:e,error:n}=await i.from("profiles").select("*").eq("id",a).maybeSingle();if(n||!e)return;const{data:t}=await i.from("bookings").select("*, services(name, name_mr)").eq("client_id",a).order("event_date",{ascending:!1}),{data:o}=await i.from("documents").select("*").eq("client_id",a).order("created_at",{ascending:!1}),c=t&&t.length>0?t.map(s=>{const m=s.services?s.services.name_mr||s.services.name:"—";return`<div class="bm-row"><span class="label">${y(s.event_date)}</span><span class="value">${m} — ${E[s.status]||s.status}</span></div>`}).join(""):'<p class="empty-state">कोणतीही बुकिंग नाही.</p>',r=o&&o.length>0?o.map(s=>{var m;return`<div class="bm-row"><span class="label">${s.title}</span><span class="value">${y((m=s.created_at)==null?void 0:m.split("T")[0])}</span></div>`}).join(""):'<p class="empty-state">कोणतेही दस्तऐवज नाही.</p>';document.getElementById("clientModalContent").innerHTML=`
      <div class="bm-header">
        <div>
          <h3>${e.full_name||"Client"}</h3>
          <div style="font-size:.82rem;color:var(--brown-lt);">📞 ${e.phone||"—"}</div>
        </div>
        <button class="bm-close" onclick="document.getElementById('clientModalOverlay').style.display='none'">✕</button>
      </div>
      <div class="bm-section">
        <h4>बुकिंग इतिहास (${(t==null?void 0:t.length)||0})</h4>
        ${c}
      </div>
      <div class="bm-section">
        <h4>दस्तऐवज (${(o==null?void 0:o.length)||0})</h4>
        ${r}
      </div>
      <div class="bm-status-actions">
        <a href="https://wa.me/91${e.phone}?text=${encodeURIComponent("नमस्कार "+(e.full_name||""))}" target="_blank" rel="noopener" class="btn-primary" style="text-decoration:none;">💬 WhatsApp</a>
        <button class="btn-secondary" onclick="openDocModalForClient('${e.id}')">📄 दस्तऐवज जोडा</button>
      </div>
    `,document.getElementById("clientModalOverlay").style.display="flex"}catch{l("क्लायंट तपशील लोड करताना त्रुटी.","error")}};async function D(){const a=document.getElementById("adminDocList");try{const{data:e,error:n}=await i.from("documents").select("*, profiles:client_id(full_name, phone)").order("created_at",{ascending:!1});if(n)throw n;if(!e||e.length===0){a.innerHTML='<p class="empty-state">कोणतेही दस्तऐवज नाहीत.</p>';return}a.innerHTML=e.map(t=>{var o,c;return`
      <div class="doc-admin-card">
        <div class="doc-admin-info">
          <div class="dai-title">${t.title}</div>
          <div class="dai-client">👤 ${((o=t.profiles)==null?void 0:o.full_name)||"—"}</div>
          <div class="dai-date">📅 ${y((c=t.created_at)==null?void 0:c.split("T")[0])}</div>
        </div>
        <div class="doc-admin-actions">
          ${t.file_url?`<a href="${t.file_url}" target="_blank" rel="noopener" class="btn-secondary" style="padding:6px 12px;font-size:.76rem;text-decoration:none;">⬇</a>`:""}
          <button class="btn-del" onclick="deleteDoc('${t.id}')">🗑</button>
        </div>
      </div>
    `}).join("")}catch{a.innerHTML='<p class="empty-state">दस्तऐवज लोड करताना त्रुटी.</p>'}}window.openDocModal=async function(){await P(),document.getElementById("docForm").reset(),document.getElementById("docModalOverlay").style.display="flex"};window.openDocModalForClient=async function(a){document.getElementById("clientModalOverlay").style.display="none",await P(),document.getElementById("docForm").reset(),document.getElementById("docClient").value=a,document.getElementById("docModalOverlay").style.display="flex"};async function P(){const a=document.getElementById("docClient"),{data:e}=await i.from("profiles").select("id, full_name, phone").order("full_name",{ascending:!0});a.innerHTML='<option value="">-- क्लायंट निवडा --</option>',e&&e.forEach(n=>{a.innerHTML+=`<option value="${n.id}">${n.full_name||"Unknown"} ${n.phone?"("+n.phone+")":""}</option>`})}window.closeDocModal=function(){document.getElementById("docModalOverlay").style.display="none"};document.getElementById("docForm").addEventListener("submit",async a=>{a.preventDefault();const e=await O(),n={client_id:document.getElementById("docClient").value,uploaded_by:(e==null?void 0:e.id)||null,title:document.getElementById("docTitle").value.trim(),doc_type:document.getElementById("docType").value,file_url:document.getElementById("docUrl").value.trim()||null,notes:document.getElementById("docNotes").value.trim()||null};try{const{error:t}=await i.from("documents").insert(n);if(t)throw t;l("दस्तऐवज जोडला."),closeDocModal(),D()}catch{l("दस्तऐवज जतन करताना त्रुटी.","error")}});window.deleteDoc=async function(a){if(confirm("हा दस्तऐवज हटवायचा आहे का?"))try{const{error:e}=await i.from("documents").delete().eq("id",a);if(e)throw e;l("दस्तऐवज हटवला."),D()}catch{l("हटवताना त्रुटी.","error")}};async function x(){const a=document.getElementById("adminMuhurtaList");try{const{data:e,error:n}=await i.from("muhurtas").select("*").order("muhurta_date",{ascending:!0});if(n)throw n;if(!e||e.length===0){a.innerHTML='<p class="empty-state">कोणतेही मुहूर्त नाहीत.</p>';return}const t={marriage:"विवाह",griha_pravesh:"गृहप्रवेश",business:"व्यवसाय",naming:"नामकरण",vehicle:"वाहन खरेदी",other:"इतर"};a.innerHTML=e.map(o=>`
      <div class="muhurta-admin-card">
        <div class="muhurta-admin-info">
          <span class="mai-cat">${t[o.category]||o.category}</span>
          <div class="mai-date">📅 ${y(o.muhurta_date)} ${o.start_time?"| ⏰ "+u(o.start_time):""}</div>
          ${o.description?`<div class="mai-desc">${o.description}</div>`:""}
        </div>
        <div class="muhurta-admin-actions">
          <button class="btn-edit" onclick="openMuhurtaModal('${o.id}')">✏</button>
          <button class="btn-del" onclick="deleteMuhurta('${o.id}')">🗑</button>
        </div>
      </div>
    `).join("")}catch{a.innerHTML='<p class="empty-state">मुहूर्त लोड करताना त्रुटी.</p>'}}window.openMuhurtaModal=async function(a){if(document.getElementById("muhurtaForm").reset(),document.getElementById("muhurtaId").value="",a)try{const{data:n,error:t}=await i.from("muhurtas").select("*").eq("id",a).maybeSingle();if(t||!n)return;document.getElementById("muhurtaId").value=n.id,document.getElementById("muhurtaCategory").value=n.category,document.getElementById("muhurtaDate").value=n.muhurta_date,document.getElementById("muhurtaStart").value=n.start_time||"",document.getElementById("muhurtaEnd").value=n.end_time||"",document.getElementById("muhurtaDesc").value=n.description||""}catch{}document.getElementById("muhurtaModalOverlay").style.display="flex"};window.closeMuhurtaModal=function(){document.getElementById("muhurtaModalOverlay").style.display="none"};document.getElementById("muhurtaForm").addEventListener("submit",async a=>{a.preventDefault();const e=document.getElementById("muhurtaId").value,n={category:document.getElementById("muhurtaCategory").value,muhurta_date:document.getElementById("muhurtaDate").value,start_time:document.getElementById("muhurtaStart").value||null,end_time:document.getElementById("muhurtaEnd").value||null,description:document.getElementById("muhurtaDesc").value.trim()||null,is_active:!0};try{if(e){const{error:t}=await i.from("muhurtas").update(n).eq("id",e);if(t)throw t;l("मुहूर्त अद्ययावत झाला.")}else{const{error:t}=await i.from("muhurtas").insert(n);if(t)throw t;l("नवीन मुहूर्त जोडला.")}closeMuhurtaModal(),x()}catch{l("मुहूर्त जतन करताना त्रुटी.","error")}});window.deleteMuhurta=async function(a){if(confirm("हा मुहूर्त हटवायचा आहे का?"))try{const{error:e}=await i.from("muhurtas").delete().eq("id",a);if(e)throw e;l("मुहूर्त हटवला."),x()}catch{l("हटवताना त्रुटी.","error")}};
