document.addEventListener('DOMContentLoaded', () => {
  // 1. TILT EFFECT 3D ON MOUSE HOVER FOR LOGO CARD
  const tiltCard = document.getElementById('tiltCard');
  if (tiltCard) {
    tiltCard.addEventListener('mousemove', (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    tiltCard.addEventListener('mouseleave', () => {
      tiltCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // 2. PRODUCT DATABASE WITH HIGH QUALITY PREVIEWS
  const productCatalog = {
    'esfero_metal': {
      name: 'Esfero Metálico Ejecutivo con Grabado Láser',
      category: 'escritura',
      price: 4200,
      img: 'assets/catalogo_samples/prod_esferos_metal.jpg',
      badge: 'Línea Ejecutiva'
    },
    'esfero_eco': {
      name: 'Esfero Ecológico Trigo & Bambú Reciclado',
      category: 'escritura',
      price: 950,
      img: 'assets/catalogo_samples/esfero_p7.jpg',
      badge: '100% Ecológico'
    },
    'botilito_sport': {
      name: 'Botilito Metálico & Deportivo 650ml',
      category: 'promos',
      price: 11900,
      img: 'assets/catalogo_samples/prod_botilitos.jpg',
      badge: 'Acero Inoxidable'
    },
    'agenda_ejecutiva': {
      name: 'Agenda Corporativa Premium con Bolígrafo',
      category: 'promos',
      price: 13500,
      img: 'assets/catalogo_samples/prod_agendas.jpg',
      badge: 'Cuero PU / Bambú'
    },
    'bolsa_ecologica': {
      name: 'Bolsa Ecológica Cambrel / Algodón Gran Formato',
      category: 'promos',
      price: 2800,
      img: 'assets/catalogo_samples/prod_bolsas.jpg',
      badge: 'Alta Resistencia'
    },
    'hogar_bento': {
      name: 'Lonchera Bento Hermética & Cubiertos',
      category: 'hogar',
      price: 18900,
      img: 'assets/catalogo_samples/hogar_p5.jpg',
      badge: 'Grado Alimenticio'
    }
  };

  const techniqueRates = {
    'laser': { name: 'Grabado Láser de Fibra', base: 950 },
    'dtf_uv': { name: 'DTF UV Directo con Relieve', base: 1800 },
    'tampografia': { name: 'Tampografía a 1 Tinta', base: 450 },
    'sublimacion': { name: 'Sublimación Digital Full Color', base: 1200 },
    'screen': { name: 'Serigrafía Screen', base: 650 },
    'sin_marca': { name: 'Sin Marcación (Artículo Solo)', base: 0 }
  };

  // DOM Elements
  const productSelect = document.getElementById('calcProduct');
  const quantityInput = document.getElementById('calcQty');
  const techniqueSelect = document.getElementById('calcTechnique');
  const specialInkCheck = document.getElementById('calcSpecialInk');

  const liveMockupImg = document.getElementById('liveMockupImg');
  const liveBadgeOverlay = document.getElementById('liveBadgeOverlay');

  const sumUnitProduct = document.getElementById('sumUnitProduct');
  const sumUnitPrint = document.getElementById('sumUnitPrint');
  const sumSubtotal = document.getElementById('sumSubtotal');
  const sumIva = document.getElementById('sumIva');
  const sumGrandTotal = document.getElementById('sumGrandTotal');
  const btnSendWhatsApp = document.getElementById('btnSendQuoteWhatsApp');

  function formatCOP(num) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(num);
  }

  function updateQuotation() {
    const prodKey = productSelect.value;
    const qty = Math.max(1, parseInt(quantityInput.value) || 100);
    const techKey = techniqueSelect.value;
    const hasSpecialColor = specialInkCheck ? specialInkCheck.checked : false;

    const prod = productCatalog[prodKey] || productCatalog['esfero_metal'];
    const tech = techniqueRates[techKey] || techniqueRates['laser'];

    // Update Live Visual Mockup
    if (liveMockupImg && prod.img) {
      liveMockupImg.src = prod.img;
    }
    if (liveBadgeOverlay) {
      liveBadgeOverlay.textContent = prod.badge;
    }

    // Scale discounts
    let prodDiscount = 1.0;
    if (qty >= 1000) prodDiscount = 0.84;
    else if (qty >= 500) prodDiscount = 0.89;
    else if (qty >= 250) prodDiscount = 0.94;

    let unitProdPrice = Math.round(prod.price * prodDiscount);

    let printDiscount = 1.0;
    if (qty >= 1000) printDiscount = 0.72;
    else if (qty >= 500) printDiscount = 0.82;
    else if (qty >= 200) printDiscount = 0.90;

    let unitPrintPrice = Math.round(tech.base * printDiscount);
    if (hasSpecialColor && techKey !== 'sin_marca') {
      unitPrintPrice += 120;
    }

    const subtotal = (unitProdPrice + unitPrintPrice) * qty;
    const iva = Math.round(subtotal * 0.19);
    const total = subtotal + iva;

    // Display numbers
    sumUnitProduct.textContent = formatCOP(unitProdPrice);
    sumUnitPrint.textContent = formatCOP(unitPrintPrice);
    sumSubtotal.textContent = formatCOP(subtotal);
    sumIva.textContent = formatCOP(iva);
    sumGrandTotal.textContent = formatCOP(total);

    // WhatsApp Message
    const msg = encodeURIComponent(
      `¡Hola 2 SOLUTIONS! Me interesa cotizar este producto corporativo:\n\n` +
      `▪ *Producto:* ${prod.name}\n` +
      `▪ *Cantidad:* ${qty} unidades\n` +
      `▪ *Técnica:* ${tech.name}\n` +
      `▪ *Valor estimado:* ${formatCOP(total)} (IVA inc)\n\n` +
      `¿Podrían confirmarme disponibilidad y tiempos de entrega?`
    );
    btnSendWhatsApp.href = `https://wa.me/573015374491?text=${msg}`;
  }

  // Event Listeners
  if (productSelect && quantityInput && techniqueSelect) {
    productSelect.addEventListener('change', updateQuotation);
    quantityInput.addEventListener('input', updateQuotation);
    techniqueSelect.addEventListener('change', updateQuotation);
    if (specialInkCheck) specialInkCheck.addEventListener('change', updateQuotation);

    // Run initial calculation
    updateQuotation();
  }

  // 3. CATALOG CATEGORY FILTERING TABS
  const catTabs = document.querySelectorAll('.cat-tab');
  const catCards = document.querySelectorAll('.cat-card');

  catTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      catTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      catCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-cat') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
});
