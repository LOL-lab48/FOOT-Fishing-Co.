let cart = JSON.parse(localStorage.getItem("foot_cart") || "{}");
let reviews = JSON.parse(localStorage.getItem("foot_reviews") || "[]");

document.addEventListener("DOMContentLoaded", () => {
  initShop();
  initCart();
  initReviews();
  initModal();
});

/* ================= CART ================= */

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
  renderCart();
}

function removeFromCart(id) {
  delete cart[id];
  localStorage.setItem("foot_cart", JSON.stringify(cart));
  updateCart();
  renderCart();
}

/* 🔥 FIXED CART COUNT BUG HERE */
function updateCart() {
  const el = document.getElementById("cart-count");

  let total = Object.values(cart).reduce((a, b) => a + b, 0);

  // FIX: remove ghost values
  if (!total || total < 0) {
    cart = {};
    localStorage.setItem("foot_cart", "{}");
    total = 0;
  }

  if (el) el.textContent = total;
}

function renderCart() {
  const box = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");

  if (!box) return;

  let total = 0;

  box.innerHTML = Object.keys(cart).map(id => {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return "";

    total += p.price * cart[id];

    return `
      <div class="cart-item">
        <strong>${p.name}</strong>
        <span>${cart[id]} x $${p.price}</span>
        <button class="btn" onclick="removeFromCart('${id}')">Remove</button>
      </div>
    `;
  }).join("");

  totalEl.textContent = "Total: $" + total;
}

/* ================= SHOP ================= */

function initShop() {
  render(PRODUCTS);

  document.querySelectorAll(".filter").forEach(btn => {
    btn.onclick = () => {
      const cat = btn.dataset.category;

      document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      render(
        cat === "all"
          ? PRODUCTS
          : PRODUCTS.filter(p => p.category === cat)
      );
    };
  });
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
      <br><br>
      <button class="btn primary" onclick="openProduct('${p.id}')">View</button>
    `;

    grid.appendChild(div);

    if (select) {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.name;
      select.appendChild(opt);
    }
  });
}

function openProduct(id) {
  const p = PRODUCTS.find(x => x.id === id);
  const box = document.getElementById("product-content");

  box.innerHTML = `
    <h2>${p.name}</h2>
    <p>${p.description}</p>
    <strong>$${p.price}</strong>
    <br><br>
    <button class="btn primary" onclick="addToCart('${p.id}')">Add to cart</button>
  `;

  openModal("product-modal");
}

/* ================= REVIEWS ================= */

function initReviews() {
  const form = document.getElementById("review-form");

  document.getElementById("open-review").onclick = () => {
    openModal("review-modal");
  };

  document.getElementById("close-review").onclick = () => {
    closeModal("review-modal");
  };

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

    form.reset();
    closeModal("review-modal");
    renderReviews();
  };

  renderReviews();
}

function renderReviews() {
  const list = document.getElementById("review-list");

  list.innerHTML = reviews.map(r => `
    <div class="product-card">
      <strong>${r.title}</strong>
      <p>${"⭐".repeat(r.rating)}</p>
      <p>${r.body}</p>
    </div>
  `).join("");
}

/* ================= MODALS ================= */

function initModal() {
  document.getElementById("close-product").onclick = () => {
    closeModal("product-modal");
  };
}

function openModal(id) {
  document.getElementById(id).classList.remove("hidden");
}

function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}
