// PANEL DE ADMINISTRACIÓN & CRM B2B CORPORATIVO
// 2 SOLUTIONS S.A.S.

const CRM_INITIAL_COMPANIES = [
  {
    id: 'comp_1',
    name: 'Grupo Bolívar & Seguros',
    nit: '860.002.503-2',
    city: 'Bogotá / Barranquilla',
    sector: 'Financiero & Seguros',
    assignedTo: 'Ricardo De La Espriella',
    status: 'Cliente Activo',
    notes: 'Campañas anuales de bolígrafos de alta gama y agendas corporativas.'
  },
  {
    id: 'comp_2',
    name: 'Constructora Marval S.A.',
    nit: '800.187.940-1',
    city: 'Bucaramanga / Costa',
    sector: 'Construcción & Inmobiliario',
    assignedTo: 'Israel Duarte',
    status: 'En Negociación',
    notes: 'Dotaciones de termos en acero inoxidable, gorras y chalecos estampados.'
  },
  {
    id: 'comp_3',
    name: 'Distribuciones Farmacéuticas del Caribe',
    nit: '900.542.110-5',
    city: 'Barranquilla',
    sector: 'Salud & Farma',
    assignedTo: 'Ricardo De La Espriella',
    status: 'Lead Calificado',
    notes: 'Interés en artículos promocionales ecológicos y cajas Bento para médicos.'
  }
];

const CRM_INITIAL_CONTACTS = [
  {
    id: 'cont_1',
    name: 'Carlos Mendoza',
    email: 'cmendoza@bolivar.com.co',
    phone: '+57 310 445 2210',
    companyId: 'comp_1',
    companyName: 'Grupo Bolívar & Seguros',
    role: 'Director de Compras',
    registeredAt: '2026-10-15'
  },
  {
    id: 'cont_2',
    name: 'María Alejandra Ramos',
    email: 'mramos@marval.com.co',
    phone: '+57 300 812 4433',
    companyId: 'comp_2',
    companyName: 'Constructora Marval S.A.',
    role: 'Coordinadora de Mercadeo',
    registeredAt: '2026-11-02'
  },
  {
    id: 'cont_3',
    name: 'Dr. Fernando Gutiérrez',
    email: 'fgutierrez@caribefarma.com',
    phone: '+57 315 900 1288',
    companyId: 'comp_3',
    companyName: 'Distribuciones Farmacéuticas del Caribe',
    role: 'Gerente Comercial',
    registeredAt: '2026-11-18'
  }
];

const AdminPanel = {
  getCompanies() {
    let data = localStorage.getItem('2solutions_crm_companies');
    if (!data) {
      data = JSON.stringify(CRM_INITIAL_COMPANIES);
      localStorage.setItem('2solutions_crm_companies', data);
    }
    return JSON.parse(data);
  },

  getContacts() {
    let data = localStorage.getItem('2solutions_crm_contacts');
    if (!data) {
      data = JSON.stringify(CRM_INITIAL_CONTACTS);
      localStorage.setItem('2solutions_crm_contacts', data);
    }
    return JSON.parse(data);
  },

  getQuotes() {
    return JSON.parse(localStorage.getItem('2solutions_crm_quotes') || '[]');
  },

  saveCompanies(list) {
    localStorage.setItem('2solutions_crm_companies', JSON.stringify(list));
  },

  saveContacts(list) {
    localStorage.setItem('2solutions_crm_contacts', JSON.stringify(list));
  },

  saveQuotes(list) {
    localStorage.setItem('2solutions_crm_quotes', JSON.stringify(list));
  },

  open() {
    const user = AuthManager.getCurrentUser();
    if (!user || (user.role !== 'SUPERUSER' && user.role !== 'ADMIN')) {
      alert('Acceso restringido: Se requieren permisos de Superusuario (Israel.Duarte.Carrasquilla@gmail.com) o Administrador (Ricardo.Delaespriella@outlook.es).');
      return;
    }

    const modal = document.getElementById('adminModal');
    if (modal) {
      modal.style.display = 'flex';
      this.renderDashboard();
    }
  },

  close() {
    const modal = document.getElementById('adminModal');
    if (modal) modal.style.display = 'none';
  },

  switchTab(tabName) {
    document.querySelectorAll('.admin-nav-item').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.admin-view-pane').forEach(p => p.classList.remove('active'));

    const btn = document.querySelector(`[data-admin-tab="${tabName}"]`);
    const pane = document.getElementById(`pane_${tabName}`);
    if (btn) btn.classList.add('active');
    if (pane) pane.classList.add('active');

    if (tabName === 'companies') this.renderCompanies();
    if (tabName === 'contacts') this.renderContacts();
    if (tabName === 'quotes') this.renderQuotes();
    if (tabName === 'dashboard') this.renderDashboard();
  },

  renderDashboard() {
    const companies = this.getCompanies();
    const contacts = this.getContacts();
    const quotes = this.getQuotes();
    const user = AuthManager.getCurrentUser();

    const statsElem = document.getElementById('adminStatsSummary');
    if (statsElem) {
      statsElem.innerHTML = `
        <div class="crm-stat-card">
          <div class="stat-icon"><i class="fa-solid fa-building"></i></div>
          <div class="stat-val">${companies.length}</div>
          <div class="stat-lbl">Empresas en CRM</div>
        </div>
        <div class="crm-stat-card">
          <div class="stat-icon"><i class="fa-solid fa-users"></i></div>
          <div class="stat-val">${contacts.length}</div>
          <div class="stat-lbl">Contactos Vinculados</div>
        </div>
        <div class="crm-stat-card">
          <div class="stat-icon"><i class="fa-solid fa-file-invoice"></i></div>
          <div class="stat-val">${quotes.length}</div>
          <div class="stat-lbl">Cotizaciones Registradas</div>
        </div>
        <div class="crm-stat-card">
          <div class="stat-icon"><i class="fa-solid fa-shield-halved"></i></div>
          <div class="stat-val">${user.role === 'SUPERUSER' ? 'Superadmin' : 'Admin'}</div>
          <div class="stat-lbl">${user.email}</div>
        </div>
      `;
    }

    // Actividad reciente
    const recentElem = document.getElementById('adminRecentActivity');
    if (recentElem) {
      recentElem.innerHTML = `
        <h4><i class="fa-solid fa-clock-rotate-left"></i> Resumen de Gestión Reciente</h4>
        <p>Sesión activa iniciada por <strong>${user.name}</strong> (${user.roleLabel}).</p>
        <div class="activity-timeline">
          <div class="act-item">
            <span class="act-dot"></span>
            <div><strong>Catálogo Promocionales 2026:</strong> Actualizado sin precios públicos para cotización formal.</div>
          </div>
          <div class="act-item">
            <span class="act-dot"></span>
            <div><strong>Contacto comercial asignado:</strong> Ricardo De La Espriella (+57 304 3726578).</div>
          </div>
          <div class="act-item">
            <span class="act-dot"></span>
            <div><strong>Superusuario del Sistema:</strong> Israel Duarte Carrasquilla.</div>
          </div>
        </div>
      `;
    }
  },

  renderCompanies() {
    const list = this.getCompanies();
    const contacts = this.getContacts();
    const tbody = document.getElementById('tableCompaniesBody');
    if (!tbody) return;

    tbody.innerHTML = list.map(comp => {
      const compContacts = contacts.filter(c => c.companyId === comp.id || (c.companyName && c.companyName.toLowerCase() === comp.name.toLowerCase()));
      return `
        <tr>
          <td><strong>${comp.name}</strong><br><small style="color:#94a3b8">NIT: ${comp.nit || 'N/A'}</small></td>
          <td>${comp.city || 'Barranquilla'}</td>
          <td><span class="crm-badge-sector">${comp.sector || 'General'}</span></td>
          <td>
            <strong>${compContacts.length} contactos</strong>
            <div style="font-size: 0.75rem; color:#94a3b8;">
              ${compContacts.map(c => `• ${c.name} (${c.email})`).slice(0, 2).join('<br>')}
              ${compContacts.length > 2 ? '<br>y más...' : ''}
            </div>
          </td>
          <td><span class="crm-status-tag ${comp.status === 'Cliente Activo' ? 'active' : 'lead'}">${comp.status}</span></td>
          <td>${comp.assignedTo || 'Ricardo D.'}</td>
          <td>
            <button class="btn-table-action" onclick="AdminPanel.deleteCompany('${comp.id}')" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>
      `;
    }).join('');
  },

  renderContacts() {
    const contacts = this.getContacts();
    const companies = this.getCompanies();
    const tbody = document.getElementById('tableContactsBody');
    if (!tbody) return;

    tbody.innerHTML = contacts.map(c => {
      const comp = companies.find(co => co.id === c.companyId) || { name: c.companyName || 'Empresa General' };
      return `
        <tr>
          <td><strong>${c.name}</strong><br><small style="color:#94a3b8">${c.role || 'Contacto'}</small></td>
          <td><a href="mailto:${c.email}" style="color:#60a5fa">${c.email}</a></td>
          <td>${c.phone || 'N/A'}</td>
          <td><span class="crm-badge-company">${comp.name}</span></td>
          <td><span class="crm-badge-prov">${c.provider || 'Directo'}</span></td>
          <td>
            <button class="btn-table-action" onclick="AdminPanel.deleteContact('${c.id}')" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>
      `;
    }).join('');
  },

  renderQuotes() {
    const quotes = this.getQuotes();
    const tbody = document.getElementById('tableQuotesBody');
    if (!tbody) return;

    if (quotes.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem; color:#94a3b8">No hay solicitudes de cotización recibidas aún.</td></tr>`;
      return;
    }

    tbody.innerHTML = quotes.map(q => `
      <tr>
        <td><strong>#${q.id}</strong><br><small>${new Date(q.date).toLocaleDateString()}</small></td>
        <td>${q.clientName}<br><small style="color:#94a3b8">${q.clientEmail}</small></td>
        <td>${q.company || 'Particular'}</td>
        <td><strong>${q.itemsCount} productos</strong></td>
        <td><span class="crm-status-tag lead">${q.status || 'Pendiente confirmación'}</span></td>
        <td>
          <a href="https://wa.me/573043726578?text=${encodeURIComponent('Hola ' + q.clientName + ', te escribo de 2 SOLUTIONS respecto a tu cotización #' + q.id)}" target="_blank" class="btn-table-action" style="color:#25D366" title="Responder por WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
        </td>
      </tr>
    `).join('');
  },

  showAddCompanyModal() {
    const name = prompt('Nombre de la Empresa:');
    if (!name) return;
    const nit = prompt('NIT de la empresa:');
    const city = prompt('Ciudad sede:', 'Barranquilla');
    const sector = prompt('Sector económico:', 'Industrial / Comercial');

    const companies = this.getCompanies();
    companies.push({
      id: 'comp_' + Date.now(),
      name,
      nit: nit || 'Por definir',
      city: city || 'Barranquilla',
      sector: sector || 'General',
      assignedTo: 'Ricardo De La Espriella',
      status: 'Cliente Activo'
    });
    this.saveCompanies(companies);
    this.renderCompanies();
    this.renderDashboard();
  },

  showAddContactModal() {
    const companies = this.getCompanies();
    if (companies.length === 0) {
      alert('Primero debes registrar al menos una empresa.');
      return;
    }

    const name = prompt('Nombre completo del contacto:');
    if (!name) return;
    const email = prompt('Correo corporativo:');
    if (!email) return;
    const phone = prompt('Teléfono / WhatsApp:', '+57 ');
    const role = prompt('Cargo en la empresa:', 'Coordinador de Compras');

    let compMsg = 'Selecciona la empresa asignándole el número:\n';
    companies.forEach((co, idx) => {
      compMsg += `${idx + 1}. ${co.name}\n`;
    });
    const choice = parseInt(prompt(compMsg, '1')) - 1;
    const chosenCompany = companies[choice] || companies[0];

    const contacts = this.getContacts();
    contacts.push({
      id: 'cont_' + Date.now(),
      name,
      email,
      phone: phone || '',
      role: role || 'Contacto',
      companyId: chosenCompany.id,
      companyName: chosenCompany.name,
      provider: 'CRM Manual'
    });
    this.saveContacts(contacts);
    this.renderContacts();
    this.renderDashboard();
  },

  deleteCompany(id) {
    if (confirm('¿Seguro que deseas eliminar esta empresa del CRM?')) {
      const list = this.getCompanies().filter(c => c.id !== id);
      this.saveCompanies(list);
      this.renderCompanies();
      this.renderDashboard();
    }
  },

  deleteContact(id) {
    if (confirm('¿Seguro que deseas eliminar este contacto del CRM?')) {
      const list = this.getContacts().filter(c => c.id !== id);
      this.saveContacts(list);
      this.renderContacts();
      this.renderDashboard();
    }
  }
};

window.AdminPanel = AdminPanel;
