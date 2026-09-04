let cart = JSON.parse(localStorage.getItem("foot_cart") || "{}");
let reviews = JSON.parse(localStorage.getItem("foot_reviews") || "[]");

// INIT
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("product-grid")) initShop();
  if (document.getElementById("product-details")) initProductPage();

  initCart();
  initFilters();
  initReviews();
  initModal();
});


// ================= CART =================
function initCart() {
  updateCart();

  const btn = document.getElementById("cart-button");
  const modal = document.getElementById("cart-modal");
  const close = document.getElementById("close-cart");

  btn.onclick = () => {
    renderCart();
    modal.classList.remove("hidden");
  };

  close.onclick = () => modal.classList.add("hidden");
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  localStorage.setItem("foot_cart", JSON.stringify(cart));
  updateCart();
}

function updateCart() {
  const el = document.getElementById("cart-count");
  if (!el) return;
  el.textContent = Object.values(cart).reduce((a, b) => a + b, 0);
}

function renderCart() {
  const box = document.getElementById("cart-items");
  if (!box) return;

  const items = Object.entries(cart);

  if (items.length === 0) {
    box.innerHTML = "<p>Your cart is empty</p>";
    return;
  }

  box.innerHTML = items.map(([id, qty]) => {
    const p = PRODUCTS.find(x => x.id === id);
    return `
      <div>
        <strong>${p?.name || id}</strong>
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
      <button class="view-btn">View rod</button>
    `;

    div.querySelector(".view-btn").onclick = () => {
      openProductPopup(p);
    };

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
      const cat = btn.dataset.category;
      render(cat === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === cat));
    };
  });
}


// ================= PRODUCT POPUP =================
function openProductPopup(p) {
  const modal = document.getElementById("product-modal");
  const box = document.getElementById("product-content");

  box.innerHTML = `
    <h2>${p.name}</h2>
    <p>${p.description}</p>
    <strong>$${p.price}</strong>
    <br><br>
    <button onclick="addToCart('${p.id}')">Add to cart</button>
  `;

  modal.classList.remove("hidden");
}


// ================= REVIEWS =================
function initReviews() {
  const form = document.getElementById("review-form");
  if (!form) return;

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
  const list = document.getElementById("review-list");
  if (!list) return;

  list.innerHTML = reviews.map(r =>
    `<div><strong>${r.title}</strong><p>${r.body}</p></div>`
  ).join("");
}


// ================= MODALS =================
function initModal() {
  const reviewModal = document.getElementById("review-modal");
  const openReview = document.getElementById("open-review");

  const productModal = document.getElementById("product-modal");
  const closeProduct = document.getElementById("close-product");

  const cartModal = document.getElementById("cart-modal");

  openReview.onclick = () => reviewModal.classList.remove("hidden");

  document.querySelectorAll("[data-close-modal]").forEach(btn => {
    btn.onclick = () => reviewModal.classList.add("hidden");
  });

  closeProduct.onclick = () => productModal.classList.add("hidden");
}
