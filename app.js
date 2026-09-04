let cart = JSON.parse(localStorage.getItem("foot_cart") || "{}");
let reviews = JSON.parse(localStorage.getItem("foot_reviews") || "[]");

document.addEventListener("DOMContentLoaded", () => {
  initShop();
  initCart();
  initFilters();
  initReviews();
});


// ================= CART =================
function initCart() {
  updateCart();

  document.getElementById("cart-button").onclick = () => {
    renderCart();
    openModal("cart-modal");
  };

  document.getElementById("close-cart").onclick = () => {
    closeModal("cart-modal");
  };
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  localStorage.setItem("foot_cart", JSON.stringify(cart));
  updateCart();
}

function updateCart() {
  document.getElementById("cart-count").textContent =
    Object.values(cart).reduce((a, b) => a + b, 0);
}

function renderCart() {
  const box = document.getElementById("cart-items");
  const items = Object.entries(cart);

  if (items.length === 0) {
    box.innerHTML = "<p>Your cart is empty</p>";
    return;
  }

  box.innerHTML = items.map(([id, qty]) => {
    const p = PRODUCTS.find(x => x.id === id);
    return `
      <div>
        <strong>${p?.name}</strong>
        <p>Qty: ${qty}</p>
      </div>
    `;
  }).join("");
}


// ================= SHOP =================
function initShop() {
  render(PRODUCTS);
}

function render(list) {
  const grid = document.getElementById("product-grid");
  const select = document.getElementById("review-product");

  grid.innerHTML = "";
  if (select) select.innerHTML = "";

  list.forEach(p => {
    const div = document.createElement("div");
    div.className = "product-card";

    div.innerHTML = `
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <strong>$${p.price}</strong>
      <button>View rod</button>
    `;

    div.querySelector("button").onclick = () => openProduct(p);

    grid.appendChild(div);

    if (select) {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.name;
      select.appendChild(opt);
    }
  });
}


// ================= FILTERS =================
function initFilters() {
  document.querySelectorAll(".filter").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const cat = btn.dataset.category;
      render(cat === "all"
        ? PRODUCTS
        : PRODUCTS.filter(p => p.category === cat));
    };
  });
}


// ================= PRODUCT POPUP =================
function openProduct(p) {
  document.getElementById("product-content").innerHTML = `
    <h2>${p.name}</h2>
    <p>${p.description}</p>
    <strong>$${p.price}</strong>
    <br><br>
    <button onclick="addToCart('${p.id}')">Add to cart</button>
  `;

  openModal("product-modal");
}


// ================= REVIEWS =================
function initReviews() {
  const form = document.getElementById("review-form");

  form.onsubmit = e => {
    e.preventDefault();

    reviews.push({
      product: document.getElementById("review-product").value,
      name: document.getElementById("review-name").value,
      rating: document.getElementById("review-rating").value,
      title: document.getElementById("review-title").value,
      body: document.getElementById("review-body").value
    });

    localStorage.setItem("foot_reviews", JSON.stringify(reviews));
    renderReviews();
  };

  renderReviews();
}

function renderReviews() {
  document.getElementById("review-list").innerHTML =
    reviews.map(r => `
      <div class="review-card">
        <strong>${r.title}</strong>
        <p>${r.body}</p>
      </div>
    `).join("");
}


// ================= MODALS =================
function openModal(id) {
  document.getElementById(id).classList.add("show");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("show");
}
