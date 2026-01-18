
// Tarih & Servis No
document.getElementById("tarih").value = new Date().toLocaleString("tr-TR");
document.getElementById("servisno").value = "SRV-" + Date.now();

// İmza
const canvas = document.getElementById("imza");
const ctx = canvas.getContext("2d");
ctx.lineWidth = 2; ctx.lineCap = "round";
let ciz = false;
function basla(x,y){ ctx.beginPath(); ctx.moveTo(x,y); ciz=true; }
function cizim(x,y){ if(!ciz) return; ctx.lineTo(x,y); ctx.stroke(); }
function bitir(){ ciz=false; }

canvas.addEventListener("mousedown", e=> basla(e.offsetX,e.offsetY));
canvas.addEventListener("mousemove", e=> cizim(e.offsetX,e.offsetY));
canvas.addEventListener("mouseup", bitir);
canvas.addEventListener("mouseleave", bitir);
canvas.addEventListener("touchstart", e=> { const t=e.touches[0]; basla(t.clientX-canvas.offsetLeft,t.clientY-canvas.offsetTop); });
canvas.addEventListener("touchmove", e=> { const t=e.touches[0]; cizim(t.clientX-canvas.offsetLeft,t.clientY-canvas.offsetTop); });
canvas.addEventListener("touchend", bitir);

// PDF oluşturma
document.getElementById("btnPDF").addEventListener("click", async () => {
  const formEl = document.getElementById("form");
  const files = document.getElementById("fotolar").files;
  const imgs = [];

  for (let i=0;i<files.length;i++){
    const data = await new Promise(res=>{
      const reader=new FileReader();
      reader.onload=e=>res(e.target.result);
      reader.readAsDataURL(files[i]);
    });
    const img=document.createElement("img");
    img.src=data; img.className="foto";
    imgs.push(img);
  }

  const clone=formEl.cloneNode(true);
  imgs.forEach(img=> clone.appendChild(img));

  const signImg=document.createElement("img");
  signImg.src=canvas.toDataURL("image/png");
  signImg.style.width="300px";
  signImg.style.height="150px";
  signImg.style.display="block";
  signImg.style.marginTop="10px";
  clone.appendChild(signImg);

  html2pdf().set({
    margin:10,
    filename:`ServisForm_${Date.now()}.pdf`,
    image:{type:'jpeg',quality:0.95},
    html2canvas:{scale:2,useCORS:true},
    jsPDF:{unit:'mm',format:'a4',orientation:'portrait'}
  }).from(clone).save();
});

// WhatsApp Gönder
document.getElementById("btnWA").addEventListener("click", () => {
  const ad=document.getElementById("ad").value;
  const tel=document.getElementById("tel").value;
  const cihaz=document.getElementById("cihaz").value;
  const model=document.getElementById("model").value;
  const ucret=document.getElementById("ucret").value;
  const islem=document.getElementById("islem").value;

  const mesaj=`TEKNİK SERVİS FORMU
Müşteri: ${ad}
Tel: ${tel}
Cihaz: ${cihaz}
Model: ${model}
Ücret: ${ucret} ₺
Yapılacak İşlem: ${islem}`;

  window.open("https://wa.me/?text=" + encodeURIComponent(mesaj), "_blank");
});