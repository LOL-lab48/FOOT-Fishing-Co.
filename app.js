let cart = JSON.parse(localStorage.getItem("foot_cart") || "{}");
let reviews = JSON.parse(localStorage.getItem("foot_reviews") || "[]");

const FREE_SHIPPING = 150;

document.addEventListener("DOMContentLoaded", () => {
  initShop();
  initCart();
  initReviews();
  initModal();
});

/* CART */

function initCart() {
  updateCart();

  cart-button.onclick = () => {
    renderCart();
    openModal("cart-modal");
  };

  close-cart.onclick = () => closeModal("cart-modal");
}

function addToCart(id){
  cart[id]=(cart[id]||0)+1;
  saveCart();
}

function increaseQty(id){cart[id]++;saveCart();}
function decreaseQty(id){
  cart[id]--;
  if(cart[id]<=0) delete cart[id];
  saveCart();
}
function removeFromCart(id){
  delete cart[id];
  saveCart();
}

function saveCart(){
  localStorage.setItem("foot_cart",JSON.stringify(cart));
  updateCart();
  renderCart();
}

function updateCart(){
  let total = Object.values(cart).reduce((a,b)=>a+b,0);
  if(!total){cart={};localStorage.setItem("foot_cart","{}");}
  cart-count.textContent = total;
}

function renderCart(){
  let box = document.getElementById("cart-items");
  let totalEl = document.getElementById("cart-total");
  let progress = document.getElementById("shipping-progress");

  let total = 0;

  box.innerHTML = Object.keys(cart).map(id=>{
    let p = PRODUCTS.find(x=>x.id===id);
    total += p.price * cart[id];

    return `
    <div class="cart-item">
      <div>
        <strong>${p.name}</strong>
        <p>$${p.price}</p>
      </div>

      <div class="qty-controls">
        <button onclick="decreaseQty('${id}')">−</button>
        <span>${cart[id]}</span>
        <button onclick="increaseQty('${id}')">+</button>
      </div>

      <button onclick="removeFromCart('${id}')">✕</button>
    </div>`;
  }).join("");

  totalEl.textContent = "Total: $" + total;

  /* 🔥 SHIPPING LOGIC */
  if(total >= FREE_SHIPPING){
    progress.className="shipping-progress shipping-success";
    progress.innerHTML="✅ FREE SHIPPING unlocked!";
  }else{
    let remain = FREE_SHIPPING - total;
    let percent = Math.min((total/FREE_SHIPPING)*100,100);

    progress.className="shipping-progress";
    progress.innerHTML=`
      You're $${remain} away from FREE shipping!<br>
      Add $${remain} bait to unlock it!

      <div class="progress-bar">
        <div class="progress-fill" style="width:${percent}%"></div>
      </div>
    `;
  }
}

/* SHOP */

function initShop(){
  render(PRODUCTS);

  document.querySelectorAll(".filter").forEach(btn=>{
    btn.onclick=()=>{
      let cat=btn.dataset.category;

      document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");

      render(cat==="all"?PRODUCTS:PRODUCTS.filter(p=>p.category===cat));
    };
  });
}

function render(list){
  let grid=document.getElementById("product-grid");
  let select=document.getElementById("review-product");

  grid.innerHTML="";
  if(select) select.innerHTML="";

  list.forEach(p=>{
    let div=document.createElement("div");
    div.className="product-card";

    div.innerHTML=`
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <small>${p.type} • ${p.category}</small>

      <p class="rating">⭐⭐⭐⭐⭐</p>

      ${p.top?'<span class="badge">🔥 Top Pick</span>':''}

      <strong>$${p.price}</strong><br><br>

      <button class="btn primary" onclick="openProduct('${p.id}')">View</button>
    `;

    grid.appendChild(div);

    if(select){
      let opt=document.createElement("option");
      opt.value=p.id;
      opt.textContent=p.name;
      select.appendChild(opt);
    }
  });
}

function openProduct(id){
  let p=PRODUCTS.find(x=>x.id===id);

  product-content.innerHTML=`
    <h2>${p.name}</h2>
    <p>${p.description}</p>
    <strong>$${p.price}</strong><br><br>
    <button class="btn primary" onclick="addToCart('${p.id}')">Add to cart</button>
  `;

  openModal("product-modal");
}

/* REVIEWS */

function initReviews(){
  open-review.onclick=()=>openModal("review-modal");
  close-review.onclick=()=>closeModal("review-modal");

  review-form.onsubmit=e=>{
    e.preventDefault();

    reviews.push({
      title:review-title.value,
      body:review-body.value,
      rating:review-rating.value
    });

    localStorage.setItem("foot_reviews",JSON.stringify(reviews));
    review-form.reset();
    closeModal("review-modal");
    renderReviews();
  };

  renderReviews();
}

function renderReviews(){
  review-list.innerHTML=reviews.map(r=>`
    <div class="product-card">
      <strong>${r.title}</strong>
      <p>${"⭐".repeat(r.rating)}</p>
      <p>${r.body}</p>
    </div>
  `).join("");
}

/* MODALS */

function initModal(){
  close-product.onclick=()=>closeModal("product-modal");
}

function openModal(id){
  document.getElementById(id).classList.remove("hidden");
}

function closeModal(id){
  document.getElementById(id).classList.add("hidden");
}
