// SIMULADOR DE MARCACIÓN Y SOLICITUD DE COTIZACIÓN FORMAL (SIN PRECIOS FIJOS)
// 2 SOLUTIONS S.A.S.

document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_PHONE = '573043726578';

  // 1. SIMULADOR DE MARCACIÓN (INTERACTIVO)
  const simProductSelect = document.getElementById('simProduct');
  const simBottleSideGroup = document.getElementById('simBottleSideGroup');
  const simCustomText = document.getElementById('simCustomText');
  const simLogoSize = document.getElementById('simLogoSize');
  const simMockupImg = document.getElementById('simMockupImg');
  const simMarkingOverlay = document.getElementById('simMarkingOverlay');
  const simBrandText = document.getElementById('simBrandText');
  const simMarkingImg = document.getElementById('simMarkingImg');
  const simTechName = document.getElementById('simTechName');
  const simTechDesc = document.getElementById('simTechDesc');
  const styleButtons = document.querySelectorAll('.btn-style-choice');
  const sideButtons = document.querySelectorAll('.btn-side-choice');
  const btnShareSim = document.getElementById('btnShareSim');

  // Controles de Carga de Logo & Fondo
  const simCustomLogoFile = document.getElementById('simCustomLogoFile');
  const btnRemoveLogo = document.getElementById('btnRemoveLogo');
  const simRemoveBgCheck = document.getElementById('simRemoveBgCheck');

  const termoViews = {
    'central': {
      name: 'Logo Central (Cuerpo Medio)',
      img: 'assets/simulador/termo_cara_central.png',
      overlayPos: 'top: 50%; left: 50%; transform: translate(-50%, -50%);'
    },
    'superior': {
      name: 'Logo Superior (Hombro / Tapa)',
      img: 'assets/simulador/termo_cara_superior.png',
      overlayPos: 'top: 25%; left: 50%; transform: translate(-50%, -50%);'
    },
    'inferior': {
      name: 'Logo Inferior (Base)',
      img: 'assets/simulador/termo_cara_inferior.png',
      overlayPos: 'top: 75%; left: 50%; transform: translate(-50%, -50%);'
    }
  };

  const productsDatabase = {
    'termo': {
      name: 'Termo / Botilito Metálico Acero 650ml',
      img: 'assets/simulador/termo_cara_central.png',
      isBottle: true
    },
    'esfero': {
      name: 'Esfero Ejecutivo Metálico',
      img: 'assets/simulador/base_esfero.jpg',
      isBottle: false
    },
    'camiseta': {
      name: 'Camiseta de Algodón / Textil Corporativo',
      img: 'assets/catalogo_samples/prod_bolsas.jpg',
      isBottle: false
    },
    'agenda': {
      name: 'Agenda & Libreta Corporativa Bambú/Cuero',
      img: 'assets/simulador/base_agenda.jpg',
      isBottle: false
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
  let currentBottleSide = 'central';
  let customLogoDataUrl = null;
  let originalCustomLogoDataUrl = null;

  // FUNCIÓN PARA REMOVER FONDO BLANCO / CLARO CON CANVAS HTML5
  function removeWhiteBackground(dataUrl, callback) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Umbral para blanco o muy claro (R, G, B > 230)
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (r > 230 && g > 230 && b > 230) {
          data[i + 3] = 0; // Transparente
        }
      }

      ctx.putImageData(imgData, 0, 0);
      callback(canvas.toDataURL('image/png'));
    };
    img.src = dataUrl;
  }

  // Manejador de subida de logo
  if (simCustomLogoFile) {
    simCustomLogoFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        originalCustomLogoDataUrl = event.target.result;
        applyLogoProcessing();
        if (btnRemoveLogo) btnRemoveLogo.style.display = 'inline-block';
      };
      reader.readAsDataURL(file);
    });
  }

  if (simRemoveBgCheck) {
    simRemoveBgCheck.addEventListener('change', () => {
      if (originalCustomLogoDataUrl) {
        applyLogoProcessing();
      }
    });
  }

  function applyLogoProcessing() {
    if (!originalCustomLogoDataUrl) return;

    if (simRemoveBgCheck && simRemoveBgCheck.checked) {
      removeWhiteBackground(originalCustomLogoDataUrl, (processedUrl) => {
        customLogoDataUrl = processedUrl;
        if (simMarkingImg) simMarkingImg.src = customLogoDataUrl;
        updateSimulator();
      });
    } else {
      customLogoDataUrl = originalCustomLogoDataUrl;
      if (simMarkingImg) simMarkingImg.src = customLogoDataUrl;
      updateSimulator();
    }
  }

  if (btnRemoveLogo) {
    btnRemoveLogo.addEventListener('click', () => {
      originalCustomLogoDataUrl = null;
      customLogoDataUrl = null;
      if (simCustomLogoFile) simCustomLogoFile.value = '';
      if (simMarkingImg) simMarkingImg.src = 'assets/logo-exacto-2solutions.png';
      btnRemoveLogo.style.display = 'none';
      updateSimulator();
    });
  }

  function updateSimulator() {
    const prodKey = simProductSelect ? simProductSelect.value : 'termo';
    const prod = productsDatabase[prodKey] || productsDatabase['termo'];

    // Mostrar/Ocultar selector de lado del termo
    if (simBottleSideGroup) {
      simBottleSideGroup.style.display = prod.isBottle ? 'block' : 'none';
    }

    if (simMockupImg) {
      if (prod.isBottle) {
        const sideConfig = termoViews[currentBottleSide] || termoViews['central'];
        simMockupImg.src = sideConfig.img;
      } else {
        simMockupImg.src = prod.img;
      }
    }

    // Ubicación del overlay de marcación
    if (simMarkingOverlay) {
      if (prod.isBottle) {
        if (currentBottleSide === 'superior') {
          simMarkingOverlay.style.top = '25%';
        } else if (currentBottleSide === 'inferior') {
          simMarkingOverlay.style.top = '75%';
        } else {
          simMarkingOverlay.style.top = '50%';
        }
      } else {
        simMarkingOverlay.style.top = '50%';
      }
    }

    const textVal = simCustomText ? simCustomText.value.trim() : '2 SOLUTIONS';
    if (simBrandText) {
      simBrandText.textContent = textVal || '';
    }

    const sizeVal = simLogoSize ? simLogoSize.value : 120;
    if (simMarkingImg) {
      simMarkingImg.style.width = `${sizeVal}px`;
      if (!customLogoDataUrl) {
        simMarkingImg.src = 'assets/logo-exacto-2solutions.png';
      }
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
      msg += `▪ *Artículo:* ${prod.name}\n`;
      if (prod.isBottle) {
        const sideConfig = termoViews[currentBottleSide] || termoViews['central'];
        msg += `▪ *Lado / Área de Grabado:* ${sideConfig.name}\n`;
      }
      msg += `▪ *Técnica aplicada:* ${tech.name}\n` +
             `▪ *Texto / Logo simulado:* "${textVal || 'Logo Personalizado'}"\n\n` +
             `Solicito confirmación de valor y tiempo de producción a atención comercial (+57 304 3726578).`;

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

  sideButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sideButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentBottleSide = btn.getAttribute('data-side');
      updateSimulator();
    });
  });

  if (simProductSelect) simProductSelect.addEventListener('change', updateSimulator);
  if (simCustomText) simCustomText.addEventListener('input', updateSimulator);
  if (simLogoSize) simLogoSize.addEventListener('input', updateSimulator);

  updateSimulator();
});
