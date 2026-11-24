// SIMULADOR DE MARCACIÓN Y SOLICITUD DE COTIZACIÓN FORMAL (SIN PRECIOS FIJOS)
// 2 SOLUTIONS S.A.S.

document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_PHONE = '573043726578';

  // 1. SIMULADOR DE MARCACIÓN (INTERACTIVO)
  const simProductSelect = document.getElementById('simProduct');
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
      img: 'assets/simulador/base_termo.jpg'
    },
    'esfero': {
      name: 'Esfero Ejecutivo Metálico',
      img: 'assets/simulador/base_esfero.jpg'
    },
    'camiseta': {
      name: 'Camiseta de Algodón / Textil Corporativo',
      img: 'assets/catalogo_samples/prod_bolsas.jpg'
    },
    'agenda': {
      name: 'Agenda & Libreta Corporativa Bambú/Cuero',
      img: 'assets/simulador/base_agenda.jpg'
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
    const prodKey = simProductSelect ? simProductSelect.value : 'termo';
    const prod = productsDatabase[prodKey] || productsDatabase['termo'];

    if (simMockupImg && prod.img) {
      simMockupImg.src = prod.img;
    }

    const textVal = simCustomText ? simCustomText.value.trim() : '2 SOLUTIONS';
    if (simBrandText) {
      simBrandText.textContent = textVal || 'TU EMPRESA';
    }

    const sizeVal = simLogoSize ? simLogoSize.value : 120;
    if (simMarkingImg) {
      simMarkingImg.style.width = `${sizeVal}px`;
    }

    const tech = techniquesDatabase[currentTechnique];
    if (simMarkingOverlay && tech) {
      simMarkingOverlay.className = `marking-overlay ${tech.cssClass}`;
      if (simTechName) simTechName.textContent = tech.name;
      if (simTechDesc) simTechDesc.textContent = tech.desc;
    }

    if (btnShareSim) {
      const user = window.AuthManager ? window.AuthManager.getCurrentUser() : null;
      let msg = `*SIMULADOR DE MARCACIÓN - 2 SOLUTIONS S.A.S.*\n`;
      if (user) {
        msg += `▪ *Cliente:* ${user.name} (${user.company || 'Empresa'})\n`;
      }
      msg += `▪ *Artículo simulado:* ${prod.name}\n` +
             `▪ *Técnica aplicada:* ${tech.name}\n` +
             `▪ *Texto / Logo probado:* "${textVal || '2 SOLUTIONS'}"\n\n` +
             `Solicito confirmación de valor y tiempo de producción a Ricardo De La Espriella (+57 304 3726578).`;

      btnShareSim.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
    }
  }

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

  updateSimulator();

  // 2. FORMULARIO DE COTIZACIÓN RÁPIDA (B2B SIN PRECIOS)
  const calcProduct = document.getElementById('calcProduct');
  const calcQty = document.getElementById('calcQty');
  const calcTech = document.getElementById('calcTech');
  const btnSendQuote = document.getElementById('btnSendQuote');

  function updateFastQuote() {
    if (!btnSendQuote || !calcProduct) return;
    const prodName = calcProduct.options[calcProduct.selectedIndex].text;
    const qty = Math.max(1, parseInt(calcQty.value) || 100);
    const techName = calcTech.options[calcTech.selectedIndex].text;
    const user = window.AuthManager ? window.AuthManager.getCurrentUser() : null;

    let msg = `*SOLICITUD DE COTIZACIÓN PERSONALIZADA - 2 SOLUTIONS*\n`;
    if (user) {
      msg += `▪ *Empresa / Cliente:* ${user.name} - ${user.company || 'Corporativo'}\n`;
      msg += `▪ *Email de contacto:* ${user.email}\n`;
    }
    msg += `▪ *Producto:* ${prodName}\n` +
           `▪ *Cantidad estimada:* ${qty} unidades\n` +
           `▪ *Técnica de marca:* ${techName}\n\n` +
           `Por favor confirmar valor unitario por escala y disponibilidad de despacho.`;

    btnSendQuote.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
  }

  if (calcProduct) calcProduct.addEventListener('change', updateFastQuote);
  if (calcQty) calcQty.addEventListener('input', updateFastQuote);
  if (calcTech) calcTech.addEventListener('change', updateFastQuote);
  updateFastQuote();
});
