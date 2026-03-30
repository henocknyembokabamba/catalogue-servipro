const WHATSAPP_PHONE = "243820257621";

// --- CONFIGURATION SUPABASE (prochaine étape: remplacer URL + KEY par vos identifiants Supabase) ---
const SUPABASE_URL = "https://your-project-id.supabase.co";
const SUPABASE_KEY = "your-public-anon-key";
let supabase;

const LOCAL_PRODUCTS = [
  { id: "p1", category: "latex", name: "LATEX SIMPLE", description: "Quantité: 15 kg; Faible odeur; résistant pour l'intérieur; séchage rapide; durée 3 ans", price: "Contacter par WhatsApp/FB", img: "images/latex-simple.jpg" },
  { id: "p2", category: "latex", name: "LATEX ULTRA", description: "Quantité : 20 kg; haute adhérence; résiste à l’humidité et à la chaleur; durabilité 8 ans", price: "Contacter par WhatsApp/FB", img: "images/latex-ultra.jpg" },
  { id: "p3", category: "mastic", name: "MASTIC SIMPLE", description: "Quantité : 15 kg; élasticité moyenne; bonne adhérence; facile à appliquer; durée 3-5 ans", price: "Contacter par WhatsApp/FB", img: "images/mastic-simple.jpg" },
  { id: "p4", category: "mastic", name: "MASTIC EXTRA", description: "Quantité : 20 kg; haute résistance; adhérence renforcée; durée 20 ans", price: "Contacter par WhatsApp/FB", img: "images/mastic-extra.jpg" },
  { id: "p5", category: "emaille", name: "EMAILLE SIMPLE", description: "Quantité : 1 l; film dur, étanche; durée 15-20 ans", price: "Contacter par WhatsApp/FB", img: "images/latex-simple.jpg" },
  { id: "p6", category: "emaille", name: "EMAILLE LARGE", description: "Quantité : 1,5 l; très bonne finition; durée 25-30 ans", price: "Contacter par WhatsApp/FB", img: "images/latex-ultra.jpg" },
  { id: "p7", category: "antirouille", name: "ANTI ROUILLE", description: "Quantité : 1,5 l; protège les métaux des agressions et rouilles", price: "Contacter par WhatsApp/FB", img: "images/mastic-simple.jpg" },
  { id: "p8", category: "vernis", name: "VERNIS A BOIS", description: "Quantité : 1 l; préserve et embellit le bois; résistance à l'eau", price: "Contacter par WhatsApp/FB", img: "images/mastic-extra.jpg" }
];

let searchKeyword = '';
let sortMode = 'name';
let categoryFilter = 'all';
let PRODUCTS = [...LOCAL_PRODUCTS];

// ===== MENU MOBILE =====

document.addEventListener('DOMContentLoaded', async () => {
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

  // Initialisation Supabase et pages
  await initSupabase();

  // Initialisations spécifiques aux pages
  const page = document.body.dataset.page;
  if (page === 'catalogue') {
    await loadProductsFromSupabase();
    renderProducts();
    renderCart();

    const sendBtn = document.getElementById("sendWhatsApp");
    if (sendBtn) sendBtn.addEventListener('click', openWhatsApp);

    const clearBtn = document.getElementById("clearCart");
    if (clearBtn) clearBtn.addEventListener('click', clearCart);

    const searchInput = document.getElementById('searchProducts');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchKeyword = e.target.value;
        renderProducts();
      });
    }

    const sortSelect = document.getElementById('sortProducts');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        sortMode = e.target.value;
        renderProducts();
      });
    }

    const categorySelect = document.getElementById('filterCategory');
    if (categorySelect) {
      categorySelect.addEventListener('change', (e) => {
        categoryFilter = e.target.value;
        renderProducts();
      });
    }

    const loadSupabaseBtn = document.getElementById('loadSupabase');
    if (loadSupabaseBtn) {
      loadSupabaseBtn.addEventListener('click', async () => {
        loadSupabaseBtn.disabled = true;
        loadSupabaseBtn.textContent = 'Chargement...';
        await loadProductsFromSupabase();
        renderProducts();
        loadSupabaseBtn.textContent = 'Charger depuis Supabase';
        loadSupabaseBtn.disabled = false;
      });
    }
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

async function initSupabase() {
  const hasValidConfig = SUPABASE_URL && SUPABASE_KEY && !SUPABASE_URL.includes('your-project-id') && !SUPABASE_KEY.includes('your-public-anon-key');
  if (typeof createClient === 'function' && hasValidConfig) {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    return true;
  }
  return false;
}

async function loadProductsFromSupabase() {
  if (!supabase) return;

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.warn('Supabase products load failed, fallback sur données locales:', error.message);
    return;
  }

  if (data && data.length > 0) {
    PRODUCTS = data.map(item => ({
      id: item.id,
      category: item.category || 'autre',
      name: item.name,
      description: item.description,
      price: item.price || 'Contacter par WhatsApp/FB',
      img: item.img || 'images/placeholder.png'
    }));
  }
}

async function saveOrderToSupabase(orderData) {
  if (!supabase) return;

  const { data, error } = await supabase
    .from('orders')
    .insert([orderData]);

  if (error) {
    console.warn('Impossible de sauvegarder la commande dans Supabase :', error.message);
  } else {
    console.log('Commande sauvegardée Supabase :', data);
  }
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

  let list = [...PRODUCTS];

  if (searchKeyword.trim()) {
    const lower = searchKeyword.trim().toLowerCase();
    list = list.filter(p => (p.name + " " + p.description).toLowerCase().includes(lower));
  }

  if (categoryFilter !== 'all') {
    list = list.filter(p => p.category === categoryFilter);
  }

  if (sortMode === 'name') {
    list.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  } else if (sortMode === 'price') {
    list.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  }

  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = `<p class="empty-state">Aucun produit trouvé pour "${searchKeyword}".</p>`;
    return;
  }

  list.forEach(product => {
    const card = document.createElement("article");
    card.className = "product";

    card.innerHTML = `
      <img src="${product.img}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x300?text=Image+indisponible'">
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

  // Enregistrer la commande dans Supabase (optionnel)
  saveOrderToSupabase({
    message: messageText,
    customer_phone: WHATSAPP_PHONE,
    created_at: new Date().toISOString()
  });

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
