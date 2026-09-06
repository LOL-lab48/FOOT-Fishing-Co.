const FREE_SHIPPING = 150;

let cart = JSON.parse(localStorage.getItem("foot_cart") || "{}");
let reviews = JSON.parse(localStorage.getItem("foot_reviews") || "[]");

const PERMANENT_REVIEWS = [
  {
    name: "Founder",
    title: "Early Review",
    body: "Excited to see this grow.",
    rating: 5
  },
  {
    name: "Jake M.",
    title: "Great beginner rod",
    body: "Super easy to use and feels solid. Good first setup.",
    rating: 5
  },
  {
    name: "Anonymous",
    title: "Good value",
    body: "Does what it says. Shipping was quick too.",
    rating: 4
  }
];

document.addEventListener("DOMContentLoaded", () => {
  initShop();
  initCart();
  initReviews();
  initModal();
  initOrderForm();
});

/* ================= CART ================= */

function initCart(){
  updateCart();

  document.getElementById("cart-button").onclick = () => {
    renderCart();
    openModal("cart-modal");
  };

  document.getElementById("close-cart").onclick = () => {
    closeModal("cart-modal");
  };
}

function addToCart(id){
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
}

function increaseQty(id){
  cart[id]++;
  saveCart();
}

function decreaseQty(id){
  cart[id]--;
  if(cart[id] <= 0) delete cart[id];
  saveCart();
}

function removeFromCart(id){
  delete cart[id];
  saveCart();
}

function saveCart(){
  localStorage.setItem("foot_cart", JSON.stringify(cart));
  updateCart();
  renderCart();
}

function updateCart(){
  const total = Object.values(cart).reduce((a,b)=>a+b,0);
  document.getElementById("cart-count").textContent = total;
}

function renderCart(){
  const box = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const progress = document.getElementById("shipping-progress");

  let total = 0;

  box.innerHTML = Object.keys(cart).map(id=>{
    const p = PRODUCTS.find(x=>x.id===id);
    if(!p) return "";

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
      </div>
    `;
  }).join("");

  totalEl.textContent = "Total: $" + total;

  // SHIPPING MESSAGE
  if(total === 0){
    progress.innerHTML = "Start your order to unlock FREE shipping over $150 🚚";
  } else if(total < 100){
    progress.innerHTML = `Add $${150-total} more to unlock FREE shipping!`;
  } else if(total < 150){
    progress.innerHTML = `You're so close! Add $${150-total} more for FREE shipping!`;
  } else {
    progress.innerHTML = "✅ FREE SHIPPING unlocked!";
  }

  // ✅ CHECKOUT BUTTON
  box.innerHTML += `
    <button class="btn primary" style="width:100%; margin-top:15px;" onclick="checkout()">
      Checkout
    </button>
  `;
}

/* ================= CHECKOUT ================= */

function checkout(){
  alert("Sorry, we're not ready for payments yet.\nPlease fill out the enquiry form and we'll get back to you shortly.");

  closeModal("cart-modal");
  openModal("order-modal");
}

/* ================= SHOP ================= */

function initShop(){
  render(PRODUCTS);

  document.querySelectorAll(".filter").forEach(btn=>{
    btn.onclick = ()=>{
      const cat = btn.dataset.category;

      document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");

      render(cat==="all"
        ? PRODUCTS
        : PRODUCTS.filter(p=>p.category===cat)
      );
    };
  });
}

function render(list){
  const grid = document.getElementById("product-grid");
  const select = document.getElementById("product-select");
  const reviewSelect = document.getElementById("review-product");

  grid.innerHTML = "";
  select.innerHTML = "";
  reviewSelect.innerHTML = "";

  list.forEach(p=>{
    const div = document.createElement("div");
    div.className = "product-card";

    div.innerHTML = `
      ${p.top ? '<div class="badge">🔥 Top Pick</div>' : ''}

      <h3>${p.name}</h3>

      <p>${p.description}</p>

      <div class="rating">⭐⭐⭐⭐⭐</div>

      <div class="price">
        ${p.onSale
          ? `<span class="old">$${p.oldPrice}</span> <strong>$${p.price}</strong>`
          : `<strong>$${p.price}</strong>`}
      </div>

      <p style="color:var(--muted); font-size:13px;">
        Popular with beginner anglers
      </p>

      <div class="card-actions">
        <button class="btn primary" onclick="openProduct('${p.id}')">View</button>
        <button class="btn primary" onclick="addToCart('${p.id}')">Add</button>
      </div>
    `;

    grid.appendChild(div);

    select.innerHTML += `<option>${p.name}</option>`;
    reviewSelect.innerHTML += `<option>${p.name}</option>`;
  });
}

function openProduct(id){
  const p = PRODUCTS.find(x=>x.id===id);

  document.getElementById("product-content").innerHTML = `
    <h2>${p.name}</h2>

    <p><strong>Best for:</strong> ${p.bestFor || "All anglers"}</p>
    <p><strong>Why:</strong> ${p.why || p.description}</p>
    <p><strong>Perfect if:</strong> ${p.perfectFor || "You want reliable gear"}</p>

    <br>

    <strong>$${p.price}</strong>

    <br><br>

    <button class="btn primary" onclick="addToCart('${p.id}')">Add to Cart</button>
  `;

  openModal("product-modal");
}

/* ================= ORDER FORM ================= */

function initOrderForm(){
  const form = document.getElementById("order-form");

  form.onsubmit = e=>{
    e.preventDefault();

    const name = document.getElementById("cust-name").value;
    const email = document.getElementById("cust-email").value;
    const loc = document.getElementById("location").value;
    const product = document.getElementById("product-select").value;
    const msg = document.getElementById("message").value;

    const subject = encodeURIComponent("Order enquiry - " + product);

    const body = encodeURIComponent(
`Name: ${name}
Email: ${email}
Location: ${loc}

Product: ${product}

Message:
${msg}`
    );

    window.location.href = `mailto:Gabe.karekinian@gmail.com?subject=${subject}&body=${body}`;
  };
}

/* ================= REVIEWS ================= */

function initReviews(){
  renderReviews();

  document.getElementById("open-review").onclick = () => openModal("review-modal");
  document.getElementById("close-review").onclick = () => closeModal("review-modal");

  document.getElementById("review-form").onsubmit = e=>{
    e.preventDefault();

    reviews.push({
      name: document.getElementById("review-name").value || "Anonymous",
      title: document.getElementById("review-title").value,
      body: document.getElementById("review-body").value,
      rating: document.getElementById("review-rating").value
    });

    localStorage.setItem("foot_reviews", JSON.stringify(reviews));
    renderReviews();
    closeModal("review-modal");
  };
}

function renderReviews(){
  const list = document.getElementById("review-list");

  const all = [...PERMANENT_REVIEWS, ...reviews];

  list.innerHTML = all.map(r=>`
    <div class="product-card">
      <strong>${r.name}</strong>
      <div class="rating">${"⭐".repeat(r.rating)}</div>
      <h4>${r.title}</h4>
      <p>${r.body}</p>
    </div>
  `).join("");
}

/* ================= MODAL ================= */

function initModal(){
  document.getElementById("close-product").onclick = () => closeModal("product-modal");
}

function openModal(id){
  document.getElementById(id).classList.remove("hidden");
}

function closeModal(id){
  document.getElementById(id).classList.add("hidden");
}
