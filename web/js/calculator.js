document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_PHONE = '573043726578';

  // 1. SIMULADOR DE MARCACIÓN (INTERACTIVO)
  const simProductSelect = document.getElementById('simProduct');
  const simTechniqueSelect = document.getElementById('simTechnique');
  const simCustomText = document.getElementById('simCustomText');
  const simLogoSize = document.getElementById('simLogoSize');
  const simMockupImg = document.getElementById('simMockupImg');
  const simMarkingOverlay = document.getElementById('simMarkingOverlay');
  const simBrandText = document.getElementById('simBrandText');
  const simMarkingImg = document.getElementById('simMarkingImg');
  const simTechName = document.getElementById('simTechName');
  const simTechDesc = document.getElementById('simTechDesc');
  const styleButtons = document.querySelectorAll('.btn-style-choice');
  const btnShareSim = document.getElementById('btnShareSim');

  const productsDatabase = {
    'termo': {
      name: 'Termo Metálico / Botilito Acero 650ml',
      img: 'assets/simulador/base_termo.jpg',
      ideal: 'laser'
    },
    'esfero': {
      name: 'Esfero Ejecutivo Metálico',
      img: 'assets/simulador/base_esfero.jpg',
      ideal: 'laser'
    },
    'camiseta': {
      name: 'Camiseta de Algodón / Textil Corporativo',
      img: 'assets/catalogo_samples/prod_bolsas.jpg', // Representación textil
      ideal: 'estampado'
    },
    'agenda': {
      name: 'Agenda & Libreta Corporativa Bambú/Cuero',
      img: 'assets/simulador/base_agenda.jpg',
      ideal: 'dtfuv'
    }
  };

  const techniquesDatabase = {
    'laser': {
      name: 'Grabado Láser de Fibra',
      cssClass: 'marking-mode-laser',
      desc: 'Acabado indeleble de alta gama en relieve plateado/acero para metales y anodizados.'
    },
    'dtfuv': {
      name: 'DTF UV con Barniz y Relieve 3D',
      cssClass: 'marking-mode-dtfuv',
      desc: 'Impresión full color táctil con acabado brillante y máxima resistencia mecánica.'
    },
    'estampado': {
      name: 'Estampado Textil / DTF Textil / Screen',
      cssClass: 'marking-mode-estampado',
      desc: 'Pigmentos vibrantes fijados a calor sobre camisetas, gorras y material textil.'
    },
    'gold': {
      name: 'Foil / Marcación Metalizada Oro',
      cssClass: 'marking-mode-gold',
      desc: 'Brillo metálico dorado reflectivo de lujo para agendas y estuches ejecutivos.'
    }
  };

  let currentTechnique = 'laser';

  function updateSimulator() {
    const prodKey = simProductSelect.value;
    const prod = productsDatabase[prodKey] || productsDatabase['termo'];

    // Cambiar imagen base del artículo
    if (simMockupImg && prod.img) {
      simMockupImg.src = prod.img;
    }

    // Actualizar texto personalizado
    const textVal = simCustomText.value.trim();
    if (simBrandText) {
      simBrandText.textContent = textVal || 'TU EMPRESA';
    }

    // Tamaño del logo simulado
    const sizeVal = simLogoSize.value;
    if (simMarkingImg) {
      simMarkingImg.style.width = `${sizeVal}px`;
    }

    // Aplicar técnica visual
    const tech = techniquesDatabase[currentTechnique];
    if (simMarkingOverlay && tech) {
      simMarkingOverlay.className = `marking-overlay ${tech.cssClass}`;
      if (simTechName) simTechName.textContent = tech.name;
      if (simTechDesc) simTechDesc.textContent = tech.desc;
    }

    // Preparar mensaje WhatsApp con la simulación
    if (btnShareSim) {
      const msg = encodeURIComponent(
        `¡Hola 2 SOLUTIONS! Estuve en su simulador de marcación:\n\n` +
        `▪ *Artículo probado:* ${prod.name}\n` +
        `▪ *Técnica simulada:* ${tech.name}\n` +
        `▪ *Texto/Marca:* ${textVal || '2 SOLUTIONS'}\n\n` +
        `¿Podrían cotizarme este tipo de marcación para mi empresa?`
      );
      btnShareSim.href = `https://wa.me/${WHATSAPP_PHONE}?text=${msg}`;
    }
  }

  // Escuchadores de botones de técnica
  styleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      styleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTechnique = btn.getAttribute('data-tech');
      updateSimulator();
    });
  });

  if (simProductSelect) simProductSelect.addEventListener('change', updateSimulator);
  if (simCustomText) simCustomText.addEventListener('input', updateSimulator);
  if (simLogoSize) simLogoSize.addEventListener('input', updateSimulator);

  // Inicializar simulador
  updateSimulator();

  // 2. COTIZADOR RÁPIDO
  const calcProduct = document.getElementById('calcProduct');
  const calcQty = document.getElementById('calcQty');
  const calcTech = document.getElementById('calcTech');
  const calcSubtotal = document.getElementById('calcSubtotal');
  const calcIva = document.getElementById('calcIva');
  const calcTotal = document.getElementById('calcTotal');
  const btnSendQuote = document.getElementById('btnSendQuote');

  const pricing = {
    'esferos': { base: 1200, name: 'Esferos Corporativos' },
    'camisetas': { base: 19500, name: 'Estampado de Camisetas' },
    'termos': { base: 14500, name: 'Botilitos / Termos de Acero' },
    'corte_laser': { base: 8500, name: 'Corte Láser & Placas' },
    'impresion': { base: 18000, name: 'Gran Formato & Vinilos' },
    'agendas': { base: 13500, name: 'Agendas Ejecutivas' }
  };

  const techCosts = {
    'laser': 1100,
    'dtf': 2200,
    'estampado': 1800,
    'screen': 750,
    'sublimacion': 1400
  };

  function updateQuote() {
    if (!calcProduct) return;
    const prodKey = calcProduct.value;
    const qty = Math.max(1, parseInt(calcQty.value) || 100);
    const techKey = calcTech.value;

    const p = pricing[prodKey] || pricing['esferos'];
    const t = techCosts[techKey] || 1000;

    let discount = 1.0;
    if (qty >= 1000) discount = 0.82;
    else if (qty >= 500) discount = 0.88;
    else if (qty >= 200) discount = 0.94;

    const unitPrice = Math.round((p.base + t) * discount);
    const subtotal = unitPrice * qty;
    const iva = Math.round(subtotal * 0.19);
    const total = subtotal + iva;

    function formatCOP(n) {
      return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
    }

    if (calcSubtotal) calcSubtotal.textContent = formatCOP(subtotal);
    if (calcIva) calcIva.textContent = formatCOP(iva);
    if (calcTotal) calcTotal.textContent = formatCOP(total);

    if (btnSendQuote) {
      const qMsg = encodeURIComponent(
        `¡Hola Ricardo / 2 SOLUTIONS! Me gustaría formalizar esta cotización:\n\n` +
        `▪ *Servicio/Producto:* ${p.name}\n` +
        `▪ *Cantidad:* ${qty} und\n` +
        `▪ *Total estimado:* ${formatCOP(total)} (IVA inc)\n\n` +
        `Quedo atento para coordinar arte gráfico y entrega.`
      );
      btnSendQuote.href = `https://wa.me/${WHATSAPP_PHONE}?text=${qMsg}`;
    }
  }

  if (calcProduct) calcProduct.addEventListener('change', updateQuote);
  if (calcQty) calcQty.addEventListener('input', updateQuote);
  if (calcTech) calcTech.addEventListener('change', updateQuote);
  updateQuote();
});
