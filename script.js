document.getElementById("tarih").value=new Date().toLocaleString("tr-TR");
document.getElementById("servisno").value="SRV-"+Date.now();

const canvas=document.getElementById("imza");
const ctx=canvas.getContext("2d");
let draw=false;
canvas.onmousedown=e=>{draw=true;ctx.beginPath();ctx.moveTo(e.offsetX,e.offsetY)};
canvas.onmousemove=e=>{if(draw){ctx.lineTo(e.offsetX,e.offsetY);ctx.stroke()}};
canvas.onmouseup=()=>draw=false;

document.getElementById("pdfBtn").onclick=async()=>{
  const clone=document.getElementById("form").cloneNode(true);
  const sign=document.createElement("img");
  sign.src=canvas.toDataURL("image/png");
  sign.style.width="300px";
  clone.appendChild(sign);

  html2pdf().set({
    filename:"ServisFormu.pdf",
    html2canvas:{scale:2,useCORS:true},
    jsPDF:{unit:"mm",format:"a4"}
  }).from(clone).save();
};

document.getElementById("waBtn").onclick=()=>{
  const msg=`TEKNİK SERVİS FORMU
Müşteri:${ad.value}
Tel:${tel.value}
Cihaz:${cihaz.value}
Ücret:${ucret.value}₺`;
  window.open("https://wa.me/?text="+encodeURIComponent(msg));
};
