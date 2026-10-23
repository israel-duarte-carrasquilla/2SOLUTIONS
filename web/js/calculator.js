document.addEventListener('DOMContentLoaded', () => {
  // Quotation Calculator Logic
  const productSelect = document.getElementById('calcProduct');
  const quantityInput = document.getElementById('calcQty');
  const techniqueSelect = document.getElementById('calcTechnique');
  const customInkCheck = document.getElementById('calcSpecialInk');

  const unitProductElem = document.getElementById('sumUnitProduct');
  const unitPrintElem = document.getElementById('sumUnitPrint');
  const totalSubtotalElem = document.getElementById('sumSubtotal');
  const totalIvaElem = document.getElementById('sumIva');
  const grandTotalElem = document.getElementById('sumGrandTotal');
  const btnSendWhatsApp = document.getElementById('btnSendQuoteWhatsApp');

  // Base sample unit prices COP (estimated from standard catalog pricing)
  const productPrices = {
    'esfero_eco': { name: 'Esfero Ecológico Trigo/Bambú', price: 950 },
    'esfero_metal': { name: 'Esfero Metálico Ejecutivo', price: 4200 },
    'mug_ceramica': { name: 'Mug Cerámico 11oz', price: 5800 },
    'botilito_alu': { name: 'Botilito Aluminio 600ml', price: 11500 },
    'sombrilla_golf': { name: 'Sombrilla Doble Capa Golf', price: 23500 },
    'agenda_eco': { name: 'Agenda Ecológica con Bolígrafo', price: 12900 },
    'lonchera_termica': { name: 'Lonchera Térmica Bento', price: 18500 }
  };

  // Base printing technique costs per unit (tiered by scale)
  const techniqueRates = {
    'tampografia': { name: 'Tampografía (1 tinta)', base: 450, minQty: 100 },
    'laser': { name: 'Grabado Láser de Fibra', base: 950, minQty: 50 },
    'screen': { name: 'Serigrafía Screen', base: 650, minQty: 50 },
    'sublimacion': { name: 'Sublimación Full Color', base: 1200, minQty: 25 },
    'dtf_uv': { name: 'DTF UV con Relieve', base: 1800, minQty: 25 },
    'sin_marca': { name: 'Sin Personalización (Artículo Solo)', base: 0, minQty: 1 }
  };

  function formatCOP(amount) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(amount);
  }

  function calculateQuote() {
    const prodKey = productSelect.value;
    const qty = Math.max(1, parseInt(quantityInput.value) || 100);
    const techKey = techniqueSelect.value;
    const hasSpecialColor = customInkCheck ? customInkCheck.checked : false;

    const prodInfo = productPrices[prodKey] || productPrices['esfero_eco'];
    const techInfo = techniqueRates[techKey] || techniqueRates['tampografia'];

    // Quantity scale discounts on product base
    let discountFactor = 1.0;
    if (qty >= 1000) discountFactor = 0.85;
    else if (qty >= 500) discountFactor = 0.90;
    else if (qty >= 250) discountFactor = 0.95;

    const effectiveUnitPrice = Math.round(prodInfo.price * discountFactor);

    // Quantity scale discount on printing
    let printDiscount = 1.0;
    if (qty >= 1000) printDiscount = 0.75;
    else if (qty >= 500) printDiscount = 0.85;
    else if (qty >= 200) printDiscount = 0.92;

    let effectivePrintPrice = Math.round(techInfo.base * printDiscount);
    if (hasSpecialColor && techKey !== 'sin_marca') {
      effectivePrintPrice += 150; // extra setup cost amortized
    }

    const subtotalProduct = effectiveUnitPrice * qty;
    const subtotalPrinting = effectivePrintPrice * qty;
    const subtotal = subtotalProduct + subtotalPrinting;
    const iva = Math.round(subtotal * 0.19);
    const total = subtotal + iva;

    // Update UI
    unitProductElem.textContent = formatCOP(effectiveUnitPrice);
    unitPrintElem.textContent = formatCOP(effectivePrintPrice);
    totalSubtotalElem.textContent = formatCOP(subtotal);
    totalIvaElem.textContent = formatCOP(iva);
    grandTotalElem.textContent = formatCOP(total);

    // Prepare WhatsApp Message
    const textMsg = encodeURIComponent(
      `Hola 2 SOLUTIONS! Me interesa cotizar:\n` +
      `- Producto: ${prodInfo.name}\n` +
      `- Cantidad: ${qty} unidades\n` +
      `- Marcación: ${techInfo.name}\n` +
      `- Valor Estimado: ${formatCOP(total)} (IVA inc)\n\n` +
      `¿Podrían confirmarme disponibilidad y tiempo de entrega?`
    );
    btnSendWhatsApp.href = `https://wa.me/573015374491?text=${textMsg}`;
  }

  // Event Listeners
  if (productSelect && quantityInput && techniqueSelect) {
    productSelect.addEventListener('change', calculateQuote);
    quantityInput.addEventListener('input', calculateQuote);
    techniqueSelect.addEventListener('change', calculateQuote);
    if (customInkCheck) customInkCheck.addEventListener('change', calculateQuote);

    // Initial calculation
    calculateQuote();
  }

  // Smooth scroll for anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
