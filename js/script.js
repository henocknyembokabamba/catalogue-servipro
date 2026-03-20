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
      menuToggle.classList.toggle('menu-toggle--open');
      menuToggle.setAttribute('aria-expanded', nav.classList.contains('nav--open'));
    });

    // Fermer le menu quand on clique sur un lien
    nav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        nav.classList.remove('nav--open');
        menuToggle.classList.remove('menu-toggle--open');
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
      if (confirm("Voulez-vous ouvrir WhatsApp pour contacter SERVIPRO.DRC ?")) {
        openWhatsApp('Bienvenue chez SERVIPRO.DRC. Que faire pour vous ?');
      }
    });
  }

  const contactFacebook = document.getElementById('contactFacebook');
  if (contactFacebook) {
    contactFacebook.addEventListener('click', () => {
      window.open('https://www.facebook.com/servipro.drc', '_blank');
    });
  }

  const whatsappNumber = document.getElementById('whatsappNumber');
  if (whatsappNumber) {
    whatsappNumber.textContent = WHATSAPP_PHONE;
  }

  // Gestion du formulaire de contact
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const message = formData.get('message');
      
      const fullMessage = `Bonjour, je m'appelle ${name}.${email ? ` Mon email: ${email}.` : ''} ${message}`;
      openWhatsApp(fullMessage);
    });
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
  } else if (page === 'access') {
    const shareInput = document.getElementById("shareUrl");
    const copyBtn = document.getElementById("copyLink");
    if (shareInput && copyBtn) {
      shareInput.value = "/catalogue.html";
      copyBtn.addEventListener('click', () => copyToClipboard(shareInput.value));
    }
    const goCatalogue = document.getElementById('goCatalogue');
    if (goCatalogue) {
      goCatalogue.addEventListener('click', () => {
        window.location.href = 'catalogue.html';
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
}

function removeFromCart(id) {
  const cart = getCart();
  delete cart[id];
  saveCart(cart);
  renderCart();
}

function clearCart() {
  localStorage.removeItem("leopardCart");
  renderCart();
}

// ===== PRODUITS =====

function renderProducts() {
  const container = document.getElementById("products");
  if (!container) return;

  container.innerHTML = "";

  PRODUCTS.forEach(product => {
    const card = document.createElement("article");
    card.className = "product";

    card.innerHTML = `
      <img src="${product.img}" alt="${product.name}" onerror="this.style.display='none'">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div>
        <span>${product.price}</span>
        <button data-id="${product.id}">Ajouter</button>
      </div>
    `;

    card.querySelector("button").onclick = () => addToCart(product.id);

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
    div.innerHTML = `
      ${product.name} × ${qty}
      <button data-remove="${id}">❌</button>
    `;

    div.querySelector("button").onclick = () => removeFromCart(id);

    cartItems.appendChild(div);
  });

  sendBtn.disabled = false;
}

// ===== WHATSAPP =====

function buildMessage() {
  const cart = getCart();
  let msg = "Bienvenue chez SERVIPRO.DRC. Que faire pour vous ?\n\nVoici ma commande :\n";

  Object.entries(cart).forEach(([id, qty]) => {
    const p = PRODUCTS.find(x => x.id === id);
    if (p) msg += `${qty} × ${p.name}\n`;
  });

  return msg;
}

function openWhatsApp(customMessage) {
  const messageText = customMessage || buildMessage();
  const safeMessage = encodeURIComponent(messageText);
  const phone = WHATSAPP_PHONE.replace(/\D/g, ''); // Supprimer tout sauf chiffres
  const whatsappUrl = `whatsapp://send?phone=${phone}&text=${safeMessage}`;
  const fallbackUrl = `https://wa.me/${phone}?text=${safeMessage}`;

  // Essayer d'ouvrir l'app WhatsApp, sinon fallback sur wa.me
  window.open(whatsappUrl, '_blank');

  // Si l'app ne s'ouvre pas, on peut ajouter un timeout pour ouvrir le fallback, mais pour simplicité, on laisse comme ça
}

// ===== PAGES =====

function initCatalogue() {
  setYear();
  renderProducts();
  renderCart();

  const sendBtn = document.getElementById("sendWhatsApp");
  const clearBtn = document.getElementById("clearCart");

  if (sendBtn) sendBtn.onclick = openWhatsApp;
  if (clearBtn) clearBtn.onclick = clearCart;
}

function initContact() {
  setYear();

  const btn = document.getElementById("contactWhatsApp");
  if (btn) {
    btn.onclick = () => {
      window.open(`https://wa.me/${WHATSAPP_PHONE}`, "_blank");
    };
  }
}
