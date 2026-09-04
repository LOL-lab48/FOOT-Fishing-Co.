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

// CART
function initCart() {
  updateCart();

  const btn = document.getElementById("cart-button");
  if (btn) {
    btn.onclick = () => alert("Cart:\n" + JSON.stringify(cart, null, 2));
  }
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  localStorage.setItem("foot_cart", JSON.stringify(cart));
  updateCart();
}

function updateCart() {
  const el = document.getElementById("cart-count");
  if (el) el.textContent = Object.values(cart).reduce((a,b)=>a+b,0);
}

// SHOP
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

    div.innerHTML = `
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <strong>$${p.price}</strong>
      <a href="product.html?id=${p.id}">View</a>
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

// FILTERS
function initFilters() {
  document.querySelectorAll(".filter").forEach(btn => {
    btn.onclick = () => {
      const cat = btn.dataset.category;
      render(cat === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === cat));
    };
  });
}

// PRODUCT PAGE
function initProductPage() {
  const id = new URLSearchParams(location.search).get("id");
  const p = PRODUCTS.find(x => x.id === id);

  const box = document.getElementById("product-details");
  if (!p) return;

  box.innerHTML = `
    <h1>${p.name}</h1>
    <p>${p.description}</p>
    <strong>$${p.price}</strong>
    <button onclick="addToCart('${p.id}')">Add to cart</button>
  `;

  renderProductReviews(id);
}

// REVIEWS
function initReviews() {
  const form = document.getElementById("review-form");
  if (!form) return;

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

function renderProductReviews(id) {
  const list = document.getElementById("product-review-list");
  if (!list) return;

  list.innerHTML = reviews
    .filter(r => r.product === id)
    .map(r => `<div><strong>${r.title}</strong><p>${r.body}</p></div>`)
    .join("");
}

// MODAL
function initModal() {
  const modal = document.getElementById("review-modal");
  const open = document.getElementById("open-review");

  if (open) open.onclick = () => modal.classList.remove("hidden");

  modal.onclick = e => {
    if (e.target.dataset.closeModal !== undefined) {
      modal.classList.add("hidden");
    }
  };
}
