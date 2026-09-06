const FREE_SHIPPING = 150;

let cart = JSON.parse(localStorage.getItem("foot_cart") || "{}");
let reviews = JSON.parse(localStorage.getItem("foot_reviews") || "[]");

const PERMANENT_REVIEWS = [
  {
    name: "Founder",
    title: "Early Review",
    body: "Excited to see this grow.",
    rating: 5
  }
];

document.addEventListener("DOMContentLoaded", () => {
  initShop();
  initCart();
  initReviews();
  initModal();
  initOrderForm();
});

/* CART */

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

function saveCart(){
  localStorage.setItem("foot_cart", JSON.stringify(cart));
  updateCart();
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
    total += p.price * cart[id];

    return `<div>${p.name} x${cart[id]}</div>`;
  }).join("");

  totalEl.textContent = "Total: $" + total;

  if(total === 0){
    progress.innerHTML = "Start your order to unlock FREE shipping over $150 🚚";
  } else if(total < 100){
    progress.innerHTML = `Add $${150-total} more to unlock FREE shipping!`;
  } else if(total < 150){
    progress.innerHTML = `You're so close! Add $${150-total} more for FREE shipping!`;
  } else {
    progress.innerHTML = "✅ FREE SHIPPING unlocked!";
  }
}

/* SHOP */

function initShop(){
  render(PRODUCTS);

  document.querySelectorAll(".filter").forEach(btn=>{
    btn.onclick = ()=>{
      const cat = btn.dataset.category;

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

    div.innerHTML = `
      <h3>${p.name}</h3>
      <p>${p.description}</p>

      ${p.onSale
        ? `<span class="old">$${p.oldPrice}</span> <strong>$${p.price}</strong>`
        : `<strong>$${p.price}</strong>`}

      <br><br>

      <button onclick="openProduct('${p.id}')">View</button>
      <button onclick="addToCart('${p.id}')">Add to Cart</button>
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
    <p>${p.description}</p>
    <strong>$${p.price}</strong>
    <br><br>
    <button onclick="addToCart('${p.id}')">Add to Cart</button>
  `;

  openModal("product-modal");
}

/* ORDER FORM */

function initOrderForm(){
  document.getElementById("order-form").onsubmit = e=>{
    e.preventDefault();

    const subject = encodeURIComponent("Order enquiry");

    const body = encodeURIComponent(
`Name: ${cust-name.value}
Email: ${cust-email.value}
Location: ${location.value}

Product: ${document.getElementById("product-select").value}

Message:
${message.value}`
    );

    window.location.href = `mailto:your@email.com?subject=${subject}&body=${body}`;
  };
}

/* REVIEWS */

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
    <div>
      <strong>${r.name}</strong>
      <p>${"⭐".repeat(r.rating)}</p>
      <p>${r.title}</p>
      <p>${r.body}</p>
    </div>
  `).join("");
}

/* MODAL */

function initModal(){
  document.getElementById("close-product").onclick = () => closeModal("product-modal");
}

function openModal(id){
  document.getElementById(id).classList.remove("hidden");
}

function closeModal(id){
  document.getElementById(id).classList.add("hidden");
}
