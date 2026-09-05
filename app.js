let cart = JSON.parse(localStorage.getItem("foot_cart") || "{}");

// INIT
document.addEventListener("DOMContentLoaded", () => {
  render(PRODUCTS);
  initFilters();
  initCart();
});

// RENDER PRODUCTS
function render(list) {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";

  list.forEach(p => {
    const div = document.createElement("div");
    div.className = "product-card";

    div.innerHTML = `
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <strong>$${p.price}</strong>
      <button onclick="openProduct('${p.id}')">View</button>
    `;

    grid.appendChild(div);
  });
}

// FILTERS
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

// PRODUCT MODAL
function openProduct(id) {
  const modal = document.getElementById("product-modal");
  const content = document.getElementById("product-content");

  const p = PRODUCTS.find(x => x.id === id);

  content.innerHTML = `
    <h2>${p.name}</h2>
    <p>${p.description}</p>
    <h3>$${p.price}</h3>
    <button onclick="addToCart('${p.id}')">Add to cart</button>
  `;

  modal.classList.remove("hidden");
}

// CLOSE PRODUCT
document.addEventListener("click", e => {
  if (e.target.id === "close-product") {
    document.getElementById("product-modal").classList.add("hidden");
  }
});

// CART
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

// RENDER CART
function renderCart() {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");

  container.innerHTML = "";
  let total = 0;

  Object.keys(cart).forEach(id => {
    const product = PRODUCTS.find(p => p.id === id);
    const qty = cart[id];

    total += product.price * qty;

    const div = document.createElement("div");
    div.innerHTML = `
      ${product.name} x${qty}
      <button onclick="removeFromCart('${id}')">Remove</button>
    `;

    container.appendChild(div);
  });

  totalEl.textContent = "Total: $" + total;
}

// REMOVE ITEM
function removeFromCart(id) {
  delete cart[id];
  localStorage.setItem("foot_cart", JSON.stringify(cart));
  renderCart();
  updateCart();
}
