// Product data lives in JavaScript so the UI can render, filter, and update quickly.
const products = [
  {
    id: 1,
    title: "Aura Wireless Headphones",
    category: "Tech",
    price: 129,
    rating: 4.9,
    featured: true,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    description: "Comfortable over-ear headphones with rich sound, active noise control, and a soft-touch finish for daily focus."
  },
  {
    id: 2,
    title: "Nordic Ceramic Lamp",
    category: "Home",
    price: 84,
    rating: 4.8,
    featured: true,
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80",
    description: "A sculptural ceramic lamp that adds warm ambient light to desks, shelves, and relaxed evening spaces."
  },
  {
    id: 3,
    title: "Flow Smart Water Bottle",
    category: "Wellness",
    price: 46,
    rating: 4.7,
    featured: true,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80",
    description: "A double-wall insulated bottle with hydration reminders, a leak-resistant cap, and a clean minimalist profile."
  },
  {
    id: 4,
    title: "Transit Weekender Pack",
    category: "Travel",
    price: 118,
    rating: 4.8,
    featured: false,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    description: "A durable travel backpack with organized pockets, padded laptop storage, and a weather-friendly shell."
  },
  {
    id: 5,
    title: "Halo Charging Dock",
    category: "Tech",
    price: 72,
    rating: 4.6,
    featured: false,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80",
    description: "A compact wireless charging dock designed for phones, earbuds, and nightstand-ready cable control."
  },
  {
    id: 6,
    title: "Cotton Cloud Throw",
    category: "Home",
    price: 59,
    rating: 4.7,
    featured: false,
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
    description: "A breathable woven throw with a relaxed texture, made for sofa lounging and layered bedroom styling."
  },
  {
    id: 7,
    title: "Pulse Fitness Band",
    category: "Wellness",
    price: 96,
    rating: 4.5,
    featured: false,
    image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=900&q=80",
    description: "A slim fitness band with activity tracking, sleep insights, and a bright display for everyday movement."
  },
  {
    id: 8,
    title: "Orbit Packing Cubes",
    category: "Travel",
    price: 38,
    rating: 4.6,
    featured: false,
    image: "https://images.unsplash.com/photo-1581553680321-4fffae59fccd?auto=format&fit=crop&w=900&q=80",
    description: "Lightweight packing cubes that keep outfits, cables, and small essentials tidy across short or long trips."
  }
];

const storageKeys = {
  cart: "lumaCartItems",
  theme: "lumaCartTheme"
};

const checkoutConfig = {
  vodafoneCashNumber: "01003860939",
  whatsappNumber: "+201003860939"
};
const productsGrid = document.querySelector("#productsGrid");
const featuredGrid = document.querySelector("#featuredGrid");
const emptyState = document.querySelector("#emptyState");
const searchInput = document.querySelector("#searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const cartSidebar = document.querySelector("#cartSidebar");
const cartBackdrop = document.querySelector("#cartBackdrop");
const openCartButton = document.querySelector("#openCart");
const closeCartButton = document.querySelector("#closeCart");
const cartItems = document.querySelector("#cartItems");
const cartTotal = document.querySelector("#cartTotal");
const cartCount = document.querySelector("#cartCount");
const themeToggle = document.querySelector("#themeToggle");
const modalBackdrop = document.querySelector("#modalBackdrop");
const modalClose = document.querySelector("#modalClose");
const modalImage = document.querySelector("#modalImage");
const modalCategory = document.querySelector("#modalCategory");
const modalTitle = document.querySelector("#modalTitle");
const modalDescription = document.querySelector("#modalDescription");
const modalPrice = document.querySelector("#modalPrice");
const modalAddButton = document.querySelector("#modalAddButton");
const toast = document.querySelector("#toast");
const loader = document.querySelector("#loader");
const navToggle = document.querySelector("#navToggle");
const navLinks = document.querySelector("#navLinks");
const navLinkItems = document.querySelectorAll(".nav-links a[href^='#']");
const checkoutButton = document.querySelector("#checkoutButton");
const checkoutBackdrop = document.querySelector("#checkoutBackdrop");
const checkoutClose = document.querySelector("#checkoutClose");
const checkoutItems = document.querySelector("#checkoutItems");
const checkoutTotal = document.querySelector("#checkoutTotal");
const vodafoneNumber = document.querySelector("#vodafoneNumber");
const copyVodafoneNumber = document.querySelector("#copyVodafoneNumber");
const whatsappOrderButton = document.querySelector("#whatsappOrderButton");

let activeCategory = "All";
let cart = loadCart();
let activeModalProductId = null;

document.addEventListener("DOMContentLoaded", () => {
  applySavedTheme();
  renderProducts();
  renderFeaturedProducts();
  renderCart();
  setupCheckoutPayment();
  setupScrollAnimations();
  setupActiveNavigation();
});

window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("hidden"), 350);
});

searchInput.addEventListener("input", renderProducts);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeCategory = button.dataset.category;
    renderProducts();
  });
});

openCartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
checkoutButton.addEventListener("click", openCheckout);
checkoutClose.addEventListener("click", closeCheckout);
checkoutBackdrop.addEventListener("click", (event) => {
  if (event.target === checkoutBackdrop) closeCheckout();
});
copyVodafoneNumber.addEventListener("click", async () => {
  try {
    await copyTextToClipboard(checkoutConfig.vodafoneCashNumber);
    showToast("Vodafone Cash number copied");
  } catch {
    showToast("Copy the number manually");
  }
});
whatsappOrderButton.addEventListener("click", (event) => {
  if (cart.length === 0) {
    event.preventDefault();
    showToast("Add products before checkout");
  }
});
cartBackdrop.addEventListener("click", closeCart);
modalClose.addEventListener("click", closeProductModal);
modalBackdrop.addEventListener("click", (event) => {
  if (event.target === modalBackdrop) closeProductModal();
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.innerHTML = isDark ? "&#9728;" : "&#9790;";
  localStorage.setItem(storageKeys.theme, isDark ? "dark" : "light");
});

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
    closeProductModal();
    closeCheckout();
  }
});

document.querySelector(".contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.reset();
  showToast("Message sent");
});

modalAddButton.addEventListener("click", () => {
  if (activeModalProductId) {
    addToCart(activeModalProductId);
  }
});

function renderProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm) || product.category.toLowerCase().includes(searchTerm);
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  productsGrid.innerHTML = filteredProducts.map(createProductCard).join("");
  emptyState.hidden = filteredProducts.length > 0;
  bindProductCardEvents(productsGrid);
  observeFadeElements(productsGrid.querySelectorAll(".fade-in"));
}

function renderFeaturedProducts() {
  featuredGrid.innerHTML = products.filter((product) => product.featured).map(createProductCard).join("");
  bindProductCardEvents(featuredGrid);
  observeFadeElements(featuredGrid.querySelectorAll(".fade-in"));
}

function createProductCard(product) {
  return `
    <article class="product-card fade-in" data-product-id="${product.id}">
      <img class="product-image" src="${product.image}" alt="${product.title}" loading="lazy">
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3>${product.title}</h3>
        <div class="price-row">
          <span class="price">${formatCurrency(product.price)}</span>
          <span class="rating">★ ${product.rating}</span>
        </div>
        <div class="card-actions">
          <button class="details-btn" type="button" data-details="${product.id}">Details</button>
          <button class="add-btn" type="button" data-add="${product.id}">Add to Cart</button>
        </div>
      </div>
    </article>
  `;
}

function bindProductCardEvents(container) {
  container.querySelectorAll("[data-add]").forEach((button) => {
    button.addEventListener("click", () => {
      addToCart(Number(button.dataset.add));
      animateProductCard(button.closest(".product-card"));
    });
  });

  container.querySelectorAll("[data-details]").forEach((button) => {
    button.addEventListener("click", () => openProductModal(Number(button.dataset.details)));
  });
}

function addToCart(productId) {
  const existingItem = cart.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart();
  renderCart();
  setupCheckoutPayment();
  showToast("Added to cart");
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  renderCart();
  setupCheckoutPayment();
}

function updateQuantity(productId, change) {
  const item = cart.find((cartItem) => cartItem.id === productId);
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCart();
  renderCart();
  setupCheckoutPayment();
}

function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="cart-empty">Your cart is empty.</p>`;
  } else {
    cartItems.innerHTML = cart.map(createCartItem).join("");
  }

  cartItems.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => removeFromCart(Number(button.dataset.remove)));
  });

  cartItems.querySelectorAll("[data-increase]").forEach((button) => {
    button.addEventListener("click", () => updateQuantity(Number(button.dataset.increase), 1));
  });

  cartItems.querySelectorAll("[data-decrease]").forEach((button) => {
    button.addEventListener("click", () => updateQuantity(Number(button.dataset.decrease), -1));
  });

  const total = cart.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartTotal.textContent = formatCurrency(total);
  cartCount.textContent = itemCount;
  checkoutButton.disabled = cart.length === 0;
  if (checkoutBackdrop.classList.contains("active")) {
    renderCheckout();
  }
}

function createCartItem(item) {
  const product = products.find((entry) => entry.id === item.id);
  if (!product) return "";

  return `
    <article class="cart-item">
      <img src="${product.image}" alt="${product.title}" loading="lazy">
      <div>
        <h3>${product.title}</h3>
        <p>${formatCurrency(product.price)} each</p>
        <div class="quantity-controls" aria-label="Quantity controls for ${product.title}">
          <button type="button" data-decrease="${product.id}" aria-label="Decrease quantity">&minus;</button>
          <strong>${item.quantity}</strong>
          <button type="button" data-increase="${product.id}" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <button class="remove-item" type="button" data-remove="${product.id}" aria-label="Remove ${product.title}">&times;</button>
    </article>
  `;
}

function setupCheckoutPayment() {
  vodafoneNumber.textContent = checkoutConfig.vodafoneCashNumber;
  renderCheckout();
}

function getCartDetails() {
  return cart
    .map((item) => {
      const product = products.find((entry) => entry.id === item.id);
      return product ? { ...product, quantity: item.quantity } : null;
    })
    .filter(Boolean);
}

function getCartTotalValue(cartDetails = getCartDetails()) {
  return cartDetails.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderCheckout() {
  const cartDetails = getCartDetails();
  const total = getCartTotalValue(cartDetails);

  if (cartDetails.length === 0) {
    checkoutItems.innerHTML = `<p class="cart-empty">Your cart is empty.</p>`;
  } else {
    checkoutItems.innerHTML = cartDetails.map(createCheckoutItem).join("");
  }

  checkoutTotal.textContent = formatCurrency(total);
  updateWhatsAppOrderLink(cartDetails, total);
}

function createCheckoutItem(item) {
  return `
    <article class="checkout-item">
      <img src="${item.image}" alt="${item.title}" loading="lazy">
      <div>
        <h4>${item.title}</h4>
        <p>${formatCurrency(item.price)} x ${item.quantity}</p>
      </div>
      <span class="checkout-line-total">${formatCurrency(item.price * item.quantity)}</span>
    </article>
  `;
}

function updateWhatsAppOrderLink(cartDetails, total) {
  if (cartDetails.length === 0) {
    whatsappOrderButton.href = "#";
    whatsappOrderButton.classList.add("disabled");
    whatsappOrderButton.setAttribute("aria-disabled", "true");
    return;
  }

  const message = buildWhatsAppOrderMessage(cartDetails, total);
  whatsappOrderButton.href = `https://wa.me/${checkoutConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
  whatsappOrderButton.classList.remove("disabled");
  whatsappOrderButton.removeAttribute("aria-disabled");
}

function buildWhatsAppOrderMessage(cartDetails, total) {
  const orderLines = cartDetails.map((item) => `- ${item.title} x${item.quantity} = ${formatCurrency(item.price * item.quantity)}`);

  return [
    "Hello, I want to confirm this order:",
    "",
    "Products ordered:",
    ...orderLines,
    "",
    `Total: ${formatCurrency(total)}`,
    `Vodafone Cash transfer number: ${checkoutConfig.vodafoneCashNumber}`,
    "",
    "I will send the Vodafone Cash transfer screenshot here."
  ].join("\n");
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const input = document.createElement("input");
  input.value = text;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  input.remove();
}
function openProductModal(productId) {
  const product = products.find((entry) => entry.id === productId);
  if (!product) return;

  activeModalProductId = productId;
  modalImage.src = product.image;
  modalImage.alt = product.title;
  modalCategory.textContent = product.category;
  modalTitle.textContent = product.title;
  modalDescription.textContent = product.description;
  modalPrice.textContent = formatCurrency(product.price);
  modalBackdrop.classList.add("active");
  modalBackdrop.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

function closeProductModal() {
  modalBackdrop.classList.remove("active");
  modalBackdrop.setAttribute("aria-hidden", "true");
  activeModalProductId = null;
  if (!cartSidebar.classList.contains("open") && !checkoutBackdrop.classList.contains("active")) {
    document.body.classList.remove("no-scroll");
  }
}

function openCheckout() {
  if (cart.length === 0) {
    showToast("Add products before checkout");
    return;
  }

  renderCheckout();
  closeCart();
  checkoutBackdrop.classList.add("active");
  checkoutBackdrop.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

function closeCheckout() {
  checkoutBackdrop.classList.remove("active");
  checkoutBackdrop.setAttribute("aria-hidden", "true");
  if (!cartSidebar.classList.contains("open") && !modalBackdrop.classList.contains("active")) {
    document.body.classList.remove("no-scroll");
  }
}
function openCart() {
  cartSidebar.classList.add("open");
  cartSidebar.setAttribute("aria-hidden", "false");
  cartBackdrop.classList.add("active");
  document.body.classList.add("no-scroll");
}

function closeCart() {
  cartSidebar.classList.remove("open");
  cartSidebar.setAttribute("aria-hidden", "true");
  cartBackdrop.classList.remove("active");
  if (!modalBackdrop.classList.contains("active") && !checkoutBackdrop.classList.contains("active")) {
    document.body.classList.remove("no-scroll");
  }
}

function setupScrollAnimations() {
  observeFadeElements(document.querySelectorAll(".fade-in"));
}

function setupActiveNavigation() {
  const navSections = Array.from(navLinkItems)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const setActiveLink = (sectionId) => {
    navLinkItems.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${sectionId}`;
      link.classList.toggle("active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const updateActiveLink = () => {
    const scrollPosition = window.scrollY + 120;
    let activeSectionId = navSections[0]?.id;

    navSections.forEach((section) => {
      if (scrollPosition >= section.offsetTop) {
        activeSectionId = section.id;
      }
    });

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 8) {
      activeSectionId = navSections[navSections.length - 1]?.id;
    }

    if (activeSectionId) {
      setActiveLink(activeSectionId);
    }
  };

  updateActiveLink();
  window.addEventListener("scroll", updateActiveLink, { passive: true });
  window.addEventListener("resize", updateActiveLink);
}
function observeFadeElements(elements) {
  const animationObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  elements.forEach((element) => animationObserver.observe(element));
}

function animateProductCard(card) {
  if (!card) return;
  card.classList.remove("added");
  void card.offsetWidth;
  card.classList.add("added");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => toast.classList.remove("show"), 1600);
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem(storageKeys.theme);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const useDark = savedTheme ? savedTheme === "dark" : prefersDark;

  document.body.classList.toggle("dark", useDark);
  themeToggle.innerHTML = useDark ? "&#9728;" : "&#9790;";
}

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(storageKeys.cart)) || [];
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(storageKeys.cart, JSON.stringify(cart));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}
