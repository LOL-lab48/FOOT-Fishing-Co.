let cart = JSON.parse(localStorage.getItem("foot_cart") || "{}");
let reviews = JSON.parse(localStorage.getItem("foot_reviews") || "[]");

// INIT
document.addEventListener("DOMContentLoaded", () => {
  render(PRODUCTS);
  initFilters();
  initCart();
  initReviews();
});

// =======================
// PRODUCTS
// =======================
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
      <p class="category">${p.category}</p>
      <p>${p.description}</p>
      <strong>$${p.price}</strong>
      <button class="btn primary view-btn" data-id="${p.id}">View</button>
    `;

    grid.appendChild(div);

    if (select) {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.name;
      select.appendChild(opt);
    }
  });

  // 🔥 FIX: attach click AFTER rendering
  document.querySelectorAll(".view-btn").forEach(btn => {
    btn.onclick = () => openProduct(btn.dataset.id);
  });
}

// =======================
// FILTERS
// =======================
function initFilters() {
  document.querySelectorAll(".filter").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const cat = btn.dataset.category;
      render(cat === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === cat));
    };
  });
}

// =======================
// PRODUCT MODAL
// =======================
function openProduct(id) {
  const modal = document.getElementById("product-modal");
  const content = document.getElementById("product-content");

  const p = PRODUCTS.find(x => x.id === id);

  content.innerHTML = `
    <h2>${p.name}</h2>
    <p>${p.description}</p>
    <h3>$${p.price}</h3>
    <button class="btn primary add-btn" data-id="${p.id}">Add to cart</button>
  `;

  modal.classList.remove("hidden");

  // 🔥 FIX: attach button AFTER render
  document.querySelector(".add-btn").onclick = () => addToCart(id);
}

// CLOSE PRODUCT MODAL
document.getElementById("close-product").onclick = () => {
  document.getElementById("product-modal").classList.add("hidden");
};

// =======================
// CART
// =======================
function initCart() {
  updateCart();

  document.getElementById("cart-button").onclick = () => {
    renderCart();
    document.getElementById("cart-modal").classList.remove("hidden");
  };

  document.getElementById("close-cart").onclick = () => {
    document.getElementById("cart-modal").classList.add("hidden");
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
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");

  container.innerHTML = "";
  let total = 0;

  Object.keys(cart).forEach(id => {
    const p = PRODUCTS.find(x => x.id === id);
    const qty = cart[id];

    total += p.price * qty;

    const div = document.createElement("div");
    div.innerHTML = `
      ${p.name} x${qty}
      <button class="remove-btn" data-id="${id}">Remove</button>
    `;

    container.appendChild(div);
  });

  totalEl.textContent = "Total: $" + total;

  // 🔥 FIX: attach remove buttons
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.onclick = () => removeFromCart(btn.dataset.id);
  });
}

function removeFromCart(id) {
  delete cart[id];
  localStorage.setItem("foot_cart", JSON.stringify(cart));
  renderCart();
  updateCart();
}

// =======================
// REVIEWS
// =======================
function initReviews() {
  const form = document.getElementById("review-form");

  document.getElementById("open-review").onclick = () => {
    document.getElementById("review-modal").classList.remove("hidden");
  };

  document.getElementById("close-review").onclick = () => {
    document.getElementById("review-modal").classList.add("hidden");
  };

  form.onsubmit = e => {
    e.preventDefault();

    reviews.push({
      product: review-product.value,
      name: review-name.value,
      rating: review-rating.value,
      title: review-title.value,
      body: review-body.value
    });

    localStorage.setItem("foot_reviews", JSON.stringify(reviews));

    renderReviews();
    form.reset();
  };

  renderReviews();
}

function renderReviews() {
  const list = document.getElementById("review-list");

  list.innerHTML = reviews.map((r, i) => `
    <div class="review-card">
      <strong>${r.title}</strong>
      <div>${"★".repeat(r.rating)}</div>
      <p>${r.body}</p>
      <button class="report-btn" data-id="${i}">Report</button>
    </div>
  `).join("");

  // 🔥 FIX: attach report buttons
  document.querySelectorAll(".report-btn").forEach(btn => {
    btn.onclick = () => reportReview(btn.dataset.id);
  });
}

function reportReview(i) {
  reviews.splice(i, 1);
  localStorage.setItem("foot_reviews", JSON.stringify(reviews));
  renderReviews();
}
