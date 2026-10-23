// TIENDA VIRTUAL & CARRITO DE COTIZACIONES PARA 2 SOLUTIONS
const STORE_PRODUCTS = [
  {
    id: 'prod_esfero_eco',
    name: 'Esfero Ecológico Trigo & Bambú',
    category: 'esferos',
    price: 950,
    desc: 'Bolígrafo promocional 100% biodegradable con pulsador y clip en fibra vegetal.',
    img: 'assets/catalogo_samples/esfero_p7.jpg',
    min: 100
  },
  {
    id: 'prod_esfero_metal',
    name: 'Esfero Metálico Ejecutivo Premier',
    category: 'esferos',
    price: 4200,
    desc: 'Cuerpo de aluminio anodizado apto para grabado láser de alta definición.',
    img: 'assets/catalogo_samples/prod_esferos_metal.jpg',
    min: 50
  },
  {
    id: 'prod_termo_sport',
    name: 'Botilito Metálico Deportivo 650ml',
    category: 'promocionales',
    price: 11900,
    desc: 'Acero inoxidable antiderrame, ideal para marcación láser o DTF UV 3D.',
    img: 'assets/simulador/base_termo.jpg',
    min: 30
  },
  {
    id: 'prod_agenda_bambu',
    name: 'Agenda Corporativa Bambú & Cuero PU',
    category: 'promocionales',
    price: 13500,
    desc: 'Hojas ecológicas rayadas con bolígrafo a juego y banda elástica de cierre.',
    img: 'assets/simulador/base_agenda.jpg',
    min: 25
  },
  {
    id: 'prod_bolsa_cambrel',
    name: 'Bolsa Ecológica Cambrel Gran Resistencia',
    category: 'promocionales',
    price: 2800,
    desc: 'Ideal para ferias, eventos corporativos y material publicitario masivo.',
    img: 'assets/catalogo_samples/prod_bolsas.jpg',
    min: 100
  },
  {
    id: 'prod_mug_ceramica',
    name: 'Mug Cerámico 11oz Sublimable',
    category: 'promocionales',
    price: 5900,
    desc: 'Cerámica de alta blancura y brillo para impresión full color fotográfica.',
    img: 'assets/catalogo_samples/item_mug.jpg',
    min: 36
  },
  {
    id: 'prod_sombrilla_golf',
    name: 'Sombrilla Doble Capa Antiviento Golf',
    category: 'promocionales',
    price: 24500,
    desc: 'Estructura en fibra de vidrio, apertura automática y estampado en serigrafía.',
    img: 'assets/catalogo_samples/item_sombrilla.jpg',
    min: 20
  },
  {
    id: 'prod_lonchera_bento',
    name: 'Lonchera Bento Hermética & Cubiertos',
    category: 'hogar',
    price: 18900,
    desc: 'Tres divisiones en paja de trigo eco-amigable con cubiertos incluidos.',
    img: 'assets/catalogo_samples/hogar_p5.jpg',
    min: 25
  },
  {
    id: 'prod_set_bar_bambu',
    name: 'Cofre Bar & Set Sacacorchos Bambú',
    category: 'hogar',
    price: 34000,
    desc: 'Cofre elegante de madera con accesorios metálicos para regalos ejecutivos.',
    img: 'assets/catalogo_samples/item_hogar_bambu.jpg',
    min: 15
  },
  {
    id: 'prod_camiseta_estampada',
    name: 'Camisetas Cuello Redondo / Polo Estampadas',
    category: 'servicios',
    price: 22000,
    desc: 'Algodón 100% 180gr con estampado DTF Textil a todo color sin límite de diseño.',
    img: 'assets/catalogo_samples/prod_bolsas.jpg',
    min: 20
  },
  {
    id: 'prod_corte_laser_placas',
    name: 'Placas Metálicas & Corte Láser Acrílico',
    category: 'servicios',
    price: 8500,
    desc: 'Corte y grabado industrial para señalización, trofeos y placas de honor.',
    img: 'assets/catalogo_samples/cover_servicios.jpg',
    min: 10
  }
];

let cart = JSON.parse(localStorage.getItem('2solutions_cart') || '[]');

function formatCOP(num) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(num);
}

function renderStore(filter = 'all') {
  const container = document.getElementById('storeGrid');
  if (!container) return;

  const filtered = filter === 'all' 
    ? STORE_PRODUCTS 
    : STORE_PRODUCTS.filter(p => p.category === filter);

  container.innerHTML = filtered.map(item => `
    <div class="product-card" data-cat="${item.category}">
      <div class="product-img-box">
        <img src="${item.img}" alt="${item.name}">
        <span class="product-badge-cat">${item.category}</span>
      </div>
      <div class="product-body">
        <h4 class="product-name">${item.name}</h4>
        <p class="product-desc">${item.desc}</p>
        <div class="product-pricing">
          <span class="price-label">Precio Unit. Ref:</span>
          <span class="price-amount">${formatCOP(item.price)}</span>
        </div>
        <div class="product-actions">
          <input type="number" id="qty_${item.id}" class="qty-input-small" value="${item.min}" min="${item.min}" step="10">
          <button class="btn-add-quote" onclick="addToQuoteCart('${item.id}')">
            <i class="fa-solid fa-cart-plus"></i> Cotizar
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function addToQuoteCart(productId) {
  const product = STORE_PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const qtyInput = document.getElementById(`qty_${productId}`);
  const qty = parseInt(qtyInput ? qtyInput.value : product.min) || product.min;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...product, qty });
  }

  saveCart();
  updateCartUI();
  openCartDrawer();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('2solutions_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const countBadge = document.getElementById('cartCountBadge');
  const itemsList = document.getElementById('cartItemsList');
  const cartSubtotal = document.getElementById('cartDrawerSubtotal');
  const cartIva = document.getElementById('cartDrawerIva');
  const cartTotal = document.getElementById('cartDrawerTotal');
  const btnSendWhatsAppCart = document.getElementById('btnSendWhatsAppCart');

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  if (countBadge) countBadge.textContent = cart.length;

  if (itemsList) {
    if (cart.length === 0) {
      itemsList.innerHTML = `
        <div style="text-align: center; color: #94a3b8; padding: 2rem 0;">
          <i class="fa-solid fa-box-open" style="font-size: 2.5rem; margin-bottom: 1rem; color: #cbd5e1;"></i>
          <p>Tu lista de cotización está vacía.<br>Agrega artículos de la tienda para cotizar.</p>
        </div>
      `;
    } else {
      itemsList.innerHTML = cart.map(item => `
        <div class="cart-item">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p>${item.qty} und x ${formatCOP(item.price)} = <strong>${formatCOP(item.qty * item.price)}</strong></p>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" title="Quitar">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `).join('');
    }
  }

  const subtotal = cart.reduce((acc, item) => acc + (item.qty * item.price), 0);
  const iva = Math.round(subtotal * 0.19);
  const total = subtotal + iva;

  if (cartSubtotal) cartSubtotal.textContent = formatCOP(subtotal);
  if (cartIva) cartIva.textContent = formatCOP(iva);
  if (cartTotal) cartTotal.textContent = formatCOP(total);

  // WhatsApp formatted string
  if (btnSendWhatsAppCart) {
    let msg = `¡Hola Ricardo (2 SOLUTIONS)! Deseo solicitar formalmente esta cotización empresarial:\n\n`;
    cart.forEach(item => {
      msg += `▪ ${item.name}\n  Cantidad: ${item.qty} und | Ref: ${formatCOP(item.qty * item.price)}\n`;
    });
    msg += `\n*Subtotal estimado:* ${formatCOP(subtotal)}`;
    msg += `\n*IVA (19%):* ${formatCOP(iva)}`;
    msg += `\n*TOTAL APROX.:* ${formatCOP(total)}`;
    msg += `\n\n¿Podrías indicarme disponibilidad y tiempo de entrega en Barranquilla/Colombia?`;

    btnSendWhatsAppCart.href = `https://wa.me/573043726578?text=${encodeURIComponent(msg)}`;
  }
}

function openCartDrawer() {
  const modal = document.getElementById('cartModal');
  if (modal) modal.classList.add('open');
}

function closeCartDrawer() {
  const modal = document.getElementById('cartModal');
  if (modal) modal.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  renderStore();
  updateCartUI();

  // Filtros de categoría de la tienda
  const storeFilters = document.querySelectorAll('.store-filter-btn');
  storeFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      storeFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderStore(btn.getAttribute('data-store-cat'));
    });
  });

  // Modal open / close handlers
  const floatingBtn = document.getElementById('floatingQuoteBtn');
  const btnCloseCart = document.getElementById('btnCloseCart');
  const cartModal = document.getElementById('cartModal');

  if (floatingBtn) floatingBtn.addEventListener('click', openCartDrawer);
  if (btnCloseCart) btnCloseCart.addEventListener('click', closeCartDrawer);
  if (cartModal) {
    cartModal.addEventListener('click', (e) => {
      if (e.target === cartModal) closeCartDrawer();
    });
  }
});
