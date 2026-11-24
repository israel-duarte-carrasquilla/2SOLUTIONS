// TIENDA VIRTUAL & CARRITO DE COTIZACIONES B2B PARA 2 SOLUTIONS
// POLÍTICA COMERCIAL: SIN PRECIOS PÚBLICOS - TODO SUJETO A CONFIRMACIÓN DE VALOR

const STORE_PRODUCTS = [
  {
    id: 'prod_esfero_eco',
    name: 'Esfero Ecológico Trigo & Bambú Reciclado',
    category: 'esferos',
    desc: 'Bolígrafo promocional 100% biodegradable con pulsador y clip en fibra vegetal. Apto para tampografía y serigrafía.',
    img: 'assets/catalogo_samples/esfero_p7.jpg',
    min: 100,
    specs: 'Mínimo: 100 unidades | Colores variados | Tinta negra o azul'
  },
  {
    id: 'prod_esfero_metal',
    name: 'Esfero Metálico Ejecutivo Premier',
    category: 'esferos',
    desc: 'Cuerpo de aluminio anodizado de alta gama, ideal para grabado láser de fibra permanente.',
    img: 'assets/catalogo_samples/prod_esferos_metal.jpg',
    min: 50,
    specs: 'Mínimo: 50 unidades | Grabable con láser | Estuche opcional'
  },
  {
    id: 'prod_termo_sport',
    name: 'Botilito Metálico Deportivo 650ml en Acero',
    category: 'promocionales',
    desc: 'Acero inoxidable antiderrame de doble pared. Marcación sugerida: Láser de fibra o DTF UV 3D.',
    img: 'assets/simulador/base_termo.jpg',
    min: 30,
    specs: 'Mínimo: 30 unidades | 650ml | Acero grado alimenticio'
  },
  {
    id: 'prod_agenda_bambu',
    name: 'Agenda Corporativa Bambú & Cuero PU',
    category: 'promocionales',
    desc: 'Hojas ecológicas rayadas con bolígrafo a juego y banda elástica de cierre. Personalizable en bajo relieve o grabado.',
    img: 'assets/simulador/base_agenda.jpg',
    min: 25,
    specs: 'Mínimo: 25 unidades | 80 hojas | Incluye bolígrafo'
  },
  {
    id: 'prod_bolsa_cambrel',
    name: 'Bolsa Ecológica Cambrel Gran Resistencia',
    category: 'promocionales',
    desc: 'Bolsa reutilizable termo sellada para eventos masivos, ferias y material publicitario.',
    img: 'assets/catalogo_samples/prod_bolsas.jpg',
    min: 100,
    specs: 'Mínimo: 100 unidades | 80 gramos | Serigrafía 1 a 4 tintas'
  },
  {
    id: 'prod_mug_ceramica',
    name: 'Mug Cerámico 11oz Sublimable Brillante',
    category: 'promocionales',
    desc: 'Cerámica triple A de máxima blancura. Impresión full color fotográfica horneada a alta temperatura.',
    img: 'assets/catalogo_samples/item_mug.jpg',
    min: 36,
    specs: 'Mínimo: 36 unidades | 11oz | Sublimación full color'
  },
  {
    id: 'prod_sombrilla_golf',
    name: 'Sombrilla Doble Capa Antiviento Golf',
    category: 'promocionales',
    desc: 'Estructura en fibra de vidrio reforzada con apertura automática y alta resistencia.',
    img: 'assets/catalogo_samples/item_sombrilla.jpg',
    min: 20,
    specs: 'Mínimo: 20 unidades | 30 pulgadas | Mango ergonómico'
  },
  {
    id: 'prod_lonchera_bento',
    name: 'Lonchera Bento Hermética & Cubiertos',
    category: 'hogar',
    desc: 'Tres divisiones en paja de trigo eco-amigable con cubiertos incluidos y bandas de seguridad.',
    img: 'assets/catalogo_samples/hogar_p5.jpg',
    min: 25,
    specs: 'Mínimo: 25 unidades | Libre de BPA | Apto microondas'
  },
  {
    id: 'prod_set_bar_bambu',
    name: 'Cofre Bar & Set Sacacorchos Bambú',
    category: 'hogar',
    desc: 'Cofre elegante de madera con accesorios metálicos para regalos corporativos de fin de año.',
    img: 'assets/catalogo_samples/item_hogar_bambu.jpg',
    min: 15,
    specs: 'Mínimo: 15 unidades | Madera natural | Grabado láser en tapa'
  },
  {
    id: 'prod_camiseta_estampada',
    name: 'Camisetas Cuello Redondo / Polo Estampadas',
    category: 'servicios',
    desc: 'Algodón 100% 180gr con estampado DTF Textil o serigrafía a todo color sin límite de diseño.',
    img: 'assets/catalogo_samples/prod_bolsas.jpg',
    min: 20,
    specs: 'Mínimo: 20 unidades | Tallas S a XXL | DTF / Serigrafía'
  },
  {
    id: 'prod_corte_laser_placas',
    name: 'Placas Metálicas & Corte Láser Acrílico',
    category: 'servicios',
    desc: 'Corte y grabado industrial para señalización corporativa, trofeos y placas de reconocimiento.',
    img: 'assets/catalogo_samples/cover_servicios.jpg',
    min: 10,
    specs: 'Mínimo: 10 unidades | Acrílico / MDF / Acero | Medidas a solicitud'
  }
];

let cart = JSON.parse(localStorage.getItem('2solutions_cart') || '[]');

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
        
        <!-- POLÍTICA SIN PRECIOS PÚBLICOS -->
        <div class="product-pricing b2b-quote-only">
          <div class="b2b-price-tag">
            <i class="fa-solid fa-lock"></i>
            <span>Valor Sujeto a Cotización</span>
          </div>
          <small class="b2b-specs">${item.specs}</small>
        </div>

        <div class="product-actions">
          <div class="qty-wrap">
            <label class="qty-label">Cantidad:</label>
            <input type="number" id="qty_${item.id}" class="qty-input-small" value="${item.min}" min="${item.min}" step="10">
          </div>
          <button class="btn-add-quote" onclick="addToQuoteCart('${item.id}')">
            <i class="fa-solid fa-file-invoice"></i> Solicitar Valor
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
  const btnSendWhatsAppCart = document.getElementById('btnSendWhatsAppCart');

  if (countBadge) countBadge.textContent = cart.length;

  if (itemsList) {
    if (cart.length === 0) {
      itemsList.innerHTML = `
        <div style="text-align: center; color: #94a3b8; padding: 2.5rem 0;">
          <i class="fa-solid fa-file-signature" style="font-size: 2.8rem; margin-bottom: 1rem; color: #cbd5e1;"></i>
          <p style="font-size: 1rem; color: #ffffff; font-weight: 700;">Tu lista de cotización está vacía</p>
          <p style="font-size: 0.85rem;">Agrega los artículos que deseas cotizar para tu empresa y Ricardo te enviará la propuesta oficial.</p>
        </div>
      `;
    } else {
      itemsList.innerHTML = cart.map(item => `
        <div class="cart-item">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p><i class="fa-solid fa-boxes-stacked"></i> Cantidad: <strong>${item.qty} und</strong></p>
            <span class="cart-price-notice"><i class="fa-solid fa-calculator"></i> Pendiente confirmación de valor por volumen</span>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" title="Quitar de cotización">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `).join('');
    }
  }

  // Generación del mensaje a WhatsApp y registro en CRM
  if (btnSendWhatsAppCart) {
    const user = (window.AuthManager && window.AuthManager.getCurrentUser()) || null;
    let msg = `*SOLICITUD FORMAL DE COTIZACIÓN - 2 SOLUTIONS S.A.S.*\n`;
    if (user) {
      msg += `▪ *Cliente:* ${user.name}\n▪ *Empresa:* ${user.company || 'Corporativo'}\n▪ *Email:* ${user.email}\n\n`;
    } else {
      msg += `▪ *Solicitante:* Cliente Corporativo (Web)\n\n`;
    }

    msg += `*Artículos seleccionados para confirmación de precio:*\n`;
    cart.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.name} -> *${item.qty} unidades*\n`;
    });

    msg += `\n*Nota comercial:* Todos los valores requieren confirmación oficial según técnicas de marcación y tiempo de entrega.\n`;
    msg += `Contacto directo asignado: *Ricardo De La Espriella* (+57 304 3726578).`;

    btnSendWhatsAppCart.href = `https://wa.me/573043726578?text=${encodeURIComponent(msg)}`;

    // Registrar en CRM
    btnSendWhatsAppCart.onclick = function() {
      if (cart.length > 0) {
        try {
          const quotes = JSON.parse(localStorage.getItem('2solutions_crm_quotes') || '[]');
          quotes.unshift({
            id: 'COT-' + Math.floor(1000 + Math.random() * 9000),
            date: new Date().toISOString(),
            clientName: user ? user.name : 'Visitante Web',
            clientEmail: user ? user.email : 'No registrado',
            company: user ? user.company : 'Por registrar',
            itemsCount: cart.length,
            items: cart.map(i => ({ name: i.name, qty: i.qty })),
            status: 'Pendiente confirmación'
          });
          localStorage.setItem('2solutions_crm_quotes', JSON.stringify(quotes));
        } catch(e) {}
      }
    };
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

  const storeFilters = document.querySelectorAll('.store-filter-btn');
  storeFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      storeFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderStore(btn.getAttribute('data-store-cat'));
    });
  });

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
