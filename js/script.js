const WHATSAPP_PHONE = "243820257621";

const PRODUCTS = [
  { id: "p1", name: "LATEX SIMPLE", description: "Quantité: 15 kilogrammes; Propriétés : faible odeur et résistance moyenne, non toxique (zéro COV); Spécifications : usage intérieur, non applicable sur surface métallique; Avantage : pouvoir couvrant moyen, séchage rapide; Durée de vie : minimum 3 ans", price: "Contacter nous par WhatsApp ou Facebook", img: "images/latex-simple.jpg" },
  { id: "p2", name: "LATEX ULTRA", description: "Quantité : 20 kilogrammes; Propriétés : haute adhérence, résistance à l’humidité, rayures et chaleur; Spécifications : usage interne et externe; Avantage : durabilité exceptionnelle; Durée de vie : minimum 8 ans", price: "Contacter nous par WhatsApp ou Facebook", img: "images/latex-ultra.jpg" },
  { id: "p3", name: "MASTIC SIMPLE", description: "Quantité : 15 kilogrammes; Propriétés : élasticité moyenne, bonne adhérence; Avantage : facile à appliquer; Durée de vie : 3 à 5 ans intérieur", price: "Contacter nous par WhatsApp ou Facebook", img: "images/mastic-simple.jpg" },
  { id: "p4", name: "MASTIC EXTRA", description: "Quantité : 20 kilogrammes; Propriétés : haute résistance, adhérence améliorée; Durée de vie : jusqu’à 20 ans intérieur", price: "Contacter nous par WhatsApp ou Facebook", img: "images/mastic-extra.jpg" },
  { id: "p5", name: "EMAILLE SIMPLE", description: "Quantité : 1 litre; Propriétés : film dur, résistance à l’eau; Durée de vie : 15 à 20 ans intérieur", price: "Contacter nous par WhatsApp ou Facebook", img: "images/latex-simple.jpg" },
  { id: "p6", name: "EMAILLE LARGE", description: "Quantité : 1.5 litre; Durée de vie : 25 à 30 ans intérieur", price: "Contacter nous par WhatsApp ou Facebook", img: "images/latex-ultra.jpg" },
  { id: "p7", name: "ANTI ROUILLE", description: "Quantité : 1.5 litre; Propriétés : protège contre la rouille", price: "Contacter nous par WhatsApp ou Facebook", img: "images/mastic-simple.jpg" },
  { id: "p8", name: "VERNIS A BOIS", description: "Quantité : 1 litre; Propriétés : protège le bois contre l’humidité", price: "Contacter nous par WhatsApp ou Facebook", img: "images/mastic-extra.jpg" }
];

// ===== MENU MOBILE =====

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('nav--open');
      menuToggle.setAttribute('aria-expanded', nav.classList.contains('nav--open'));
    });

    // Fermer le menu quand on clique sur un lien
    nav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        nav.classList.remove('nav--open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Initialiser l'année
  setYear();

  // Gestion du partage
  const shareUrl = document.getElementById('shareUrl');
  const copyLink = document.getElementById('copyLink');
  if (shareUrl && copyLink) {
    shareUrl.value = "/catalogue.html";  // Lien relatif pour GitHub Pages
    copyLink.addEventListener('click', () => {
      copyToClipboard(shareUrl.value);
    });
  }

  // Gestion des contacts
  const contactWhatsApp = document.getElementById('contactWhatsApp');
  if (contactWhatsApp) {
    contactWhatsApp.addEventListener('click', () => {
      window.open(`https://wa.me/${WHATSAPP_PHONE}`, '_blank');
    });
  }

  const contactFacebook = document.getElementById('contactFacebook');
  if (contactFacebook) {
    contactFacebook.addEventListener('click', () => {
      window.open('https://www.facebook.com/servipro.drc', '_blank'); // Remplacer par le vrai lien
    });
  }

  const whatsappNumber = document.getElementById('whatsappNumber');
  if (whatsappNumber) {
    whatsappNumber.textContent = WHATSAPP_PHONE;
  }

  // Initialisations spécifiques aux pages
  const page = document.body.dataset.page;
  if (page === 'catalogue') {
    renderProducts();
    renderCart();
    const sendBtn = document.getElementById("sendWhatsApp");
    if (sendBtn) sendBtn.addEventListener('click', openWhatsApp);
    const clearBtn = document.getElementById("clearCart");
    if (clearBtn) clearBtn.addEventListener('click', clearCart);

    // Recherche
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        renderProducts(e.target.value);
      });
    }
  }
});

// ===== UTILITAIRES =====

function setYear() {
  document.querySelectorAll("#year, #year2, #year3, #year4").forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert("Lien copié !");
  }).catch(() => {
    prompt("Copiez ce lien :", text);
  });
}

// ===== PANIER =====

function getCart() {
  return JSON.parse(localStorage.getItem("leopardCart") || "{}");
}

function saveCart(cart) {
  localStorage.setItem("leopardCart", JSON.stringify(cart));
}

function addToCart(id) {
  const cart = getCart();
  cart[id] = (cart[id] || 0) + 1;
  saveCart(cart);
  renderCart();
  showNotification("Produit ajouté au panier !");
}

function removeFromCart(id) {
  const cart = getCart();
  delete cart[id];
  saveCart(cart);
  renderCart();
  showNotification("Produit retiré du panier.");
}

function clearCart() {
  if (confirm("Êtes-vous sûr de vouloir vider le panier ?")) {
    localStorage.removeItem("leopardCart");
    renderCart();
  }
}

// ===== PRODUITS =====

function renderProducts(filter = '') {
  const container = document.getElementById("products");
  if (!container) return;

  const cart = getCart();

  container.innerHTML = "";

  const filteredProducts = PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(filter.toLowerCase()) ||
    product.description.toLowerCase().includes(filter.toLowerCase())
  );

  filteredProducts.forEach(product => {
    const qty = cart[product.id] || 0;
    const card = document.createElement("article");
    card.className = "product";

    card.innerHTML = `
      <img src="${product.img}" alt="${product.name}" onerror="this.style.display='none'">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="product-footer">
        <span class="product-price">${product.price}</span>
        <div class="quantity-controls">
          <button class="qty-btn" data-action="decrease" data-id="${product.id}">-</button>
          <span class="qty-display" data-id="${product.id}">${qty}</span>
          <button class="qty-btn" data-action="increase" data-id="${product.id}">+</button>
        </div>
      </div>
    `;

    card.querySelectorAll('.qty-btn').forEach(btn => {
      btn.onclick = () => {
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        if (action === 'increase') {
          addToCart(id);
        } else if (action === 'decrease') {
          const currentQty = cart[id] || 0;
          if (currentQty > 0) {
            removeFromCart(id);
          }
        }
      };
    });

    container.appendChild(card);
  });
}

// ===== PANIER =====

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const sendBtn = document.getElementById("sendWhatsApp");

  if (!cartItems || !sendBtn) return;

  const cart = getCart();
  const entries = Object.entries(cart);

  cartItems.innerHTML = "";

  if (entries.length === 0) {
    cartItems.innerHTML = "Votre panier est vide.";
    sendBtn.disabled = true;
    return;
  }

  entries.forEach(([id, qty]) => {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <span>${product.name} × ${qty}</span>
      <button data-remove="${id}">❌</button>
    `;

    div.querySelector("button").onclick = () => removeFromCart(id);

    cartItems.appendChild(div);
  });

  sendBtn.disabled = false;

  // Mettre à jour les affichages de quantité dans les produits
  updateProductQuantities();
}

// ===== WHATSAPP =====

function buildMessage() {
  const cart = getCart();
  let msg = "Bonjour, je souhaite commander :\n";

  Object.entries(cart).forEach(([id, qty]) => {
    const p = PRODUCTS.find(x => x.id === id);
    if (p) msg += `${qty} × ${p.name}\n`;
  });

  return msg;
}

function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 2000);
}
