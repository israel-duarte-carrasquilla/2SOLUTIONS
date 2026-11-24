// PANEL DE ADMINISTRACIÓN & CRM B2B CORPORATIVO
// 2 SOLUTIONS S.A.S.

const AdminPanel = {
  _baseCompanies: [],
  _baseLoaded: false,
  _loadingPromise: null,
  _lastImportStats: null,

  _normText(s) {
    return (s || '').toString().trim().replace(/\s+/g, ' ').toUpperCase();
  },

  _normNit(s) {
    return (s || '').toString().replace(/[^0-9A-Za-z]/g, '').toUpperCase();
  },

  async ensureBaseLoaded() {
    if (this._baseLoaded) return;
    if (this._loadingPromise) return this._loadingPromise;

    this._loadingPromise = (async () => {
      try {
        const res = await fetch('data/crm_clientes.json?v=2026.4');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const rows = await res.json();
        this._baseCompanies = rows.map((r, idx) => ({
          id: 'base_' + idx,
          name: r[0] || '',
          nit: r[1] || 'N/A',
          city: r[2] || 'Colombia',
          sector: r[3] || 'Comercial',
          phone: r[4] || '',
          email: r[5] || '',
          address: r[6] || '',
          contact: r[7] || '',
          status: 'Prospecto Activo',
          assignedTo: 'Equipo Comercial 2 SOLUTIONS'
        }));
        this._baseLoaded = true;
      } catch (err) {
        console.error('Error cargando base de clientes CRM:', err);
        if (window.CRM_INITIAL_COMPANIES && window.CRM_INITIAL_COMPANIES.length > 0) {
          this._baseCompanies = window.CRM_INITIAL_COMPANIES;
          this._baseLoaded = true;
        }
      } finally {
        this._loadingPromise = null;
      }
    })();

    return this._loadingPromise;
  },

  getCustomCompanies() {
    try {
      return JSON.parse(localStorage.getItem('2solutions_crm_custom_companies') || '[]');
    } catch {
      return [];
    }
  },

  saveCustomCompanies(list) {
    try {
      localStorage.setItem('2solutions_crm_custom_companies', JSON.stringify(list));
    } catch (e) {
      console.error('Error guardando empresas personalizadas:', e);
      alert('No se pudieron guardar más registros en el almacenamiento local del navegador.');
    }
  },

  getDeletedIds() {
    try {
      return new Set(JSON.parse(localStorage.getItem('2solutions_crm_deleted_ids') || '[]'));
    } catch {
      return new Set();
    }
  },

  addDeletedId(id) {
    const set = this.getDeletedIds();
    set.add(id);
    localStorage.setItem('2solutions_crm_deleted_ids', JSON.stringify(Array.from(set)));
  },

  getCompanies() {
    const deleted = this.getDeletedIds();
    const custom = this.getCustomCompanies();
    const all = [...custom, ...this._baseCompanies];
    return deleted.size > 0 ? all.filter(c => !deleted.has(c.id)) : all;
  },

  getContacts() {
    let data = localStorage.getItem('2solutions_crm_contacts');
    if (!data) {
      data = JSON.stringify([]);
      localStorage.setItem('2solutions_crm_contacts', data);
    }
    return JSON.parse(data);
  },

  getQuotes() {
    return JSON.parse(localStorage.getItem('2solutions_crm_quotes') || '[]');
  },

  saveContacts(list) {
    localStorage.setItem('2solutions_crm_contacts', JSON.stringify(list));
  },

  saveQuotes(list) {
    localStorage.setItem('2solutions_crm_quotes', JSON.stringify(list));
  },

  async open() {
    const modal = document.getElementById('adminModal');
    if (modal) {
      modal.style.display = 'flex';
      modal.classList.add('active');
      const statsGrid = document.getElementById('adminStatsSummary');
      if (statsGrid && !this._baseLoaded) {
        statsGrid.innerHTML = `<div class="crm-stat-card" style="grid-column: 1 / -1; text-align:center;"><div class="crm-stat-val"><i class="fa-solid fa-spinner fa-spin"></i></div><div class="crm-stat-lbl">Cargando directorio completo de clientes...</div></div>`;
      }
      await this.ensureBaseLoaded();
      this.renderDashboard();
      if (document.getElementById('pane_companies')?.classList.contains('active')) {
        this.renderCompanies();
      }
    }
  },

  close() {
    const modal = document.getElementById('adminModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('active');
    }
  },

  async switchTab(tabName) {
    document.querySelectorAll('.admin-nav-item').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.admin-view-pane').forEach(p => p.classList.remove('active'));

    const btn = document.querySelector(`[data-admin-tab="${tabName}"]`);
    const pane = document.getElementById(`pane_${tabName}`);
    if (btn) btn.classList.add('active');
    if (pane) pane.classList.add('active');

    await this.ensureBaseLoaded();

    if (tabName === 'companies') this.renderCompanies();
    if (tabName === 'contacts') this.renderContacts();
    if (tabName === 'quotes') this.renderQuotes();
    if (tabName === 'dashboard') this.renderDashboard();
  },

  renderDashboard() {
    const companies = this.getCompanies();
    const contacts = this.getContacts();
    const quotes = this.getQuotes();
    const contactsInCompanies = companies.filter(c => c.email || c.phone).length;

    const statsGrid = document.getElementById('adminStatsSummary');
    if (statsGrid) {
      statsGrid.innerHTML = `
        <div class="crm-stat-card">
          <div class="crm-stat-val">${companies.length.toLocaleString()}</div>
          <div class="crm-stat-lbl">Empresas Únicas (Sin Duplicados)</div>
        </div>
        <div class="crm-stat-card">
          <div class="crm-stat-val">${(contacts.length + contactsInCompanies).toLocaleString()}</div>
          <div class="crm-stat-lbl">Contactos & Canales Directos</div>
        </div>
        <div class="crm-stat-card">
          <div class="crm-stat-val">${quotes.length.toLocaleString()}</div>
          <div class="crm-stat-lbl">Solicitudes de Cotización</div>
        </div>
        <div class="crm-stat-card" style="border-color: rgba(37,211,102,0.4)">
          <div class="crm-stat-val" style="color: #25D366"><i class="fa-solid fa-cloud-arrow-up"></i> Sincronizado</div>
          <div class="crm-stat-lbl">Base Deduplicada Lista</div>
        </div>
      `;
    }

    const recent = document.getElementById('adminRecentActivity');
    if (recent) {
      recent.innerHTML = `
        <h4 style="color:#ffffff; margin-bottom: 1rem; font-size: 1.05rem;">Resumen Ejecutivo de Gestión</h4>
        <div style="font-size: 0.88rem; color:#cbd5e1; line-height: 1.6;">
          <p>• Directorio corporativo unificado con <strong>${companies.length.toLocaleString()} empresas únicas</strong> (deduplicadas automáticamente por NIT y razón social).</p>
          <p>• Puedes <strong>Exportar a CSV / Excel</strong> la base completa o <strong>Importar nuevos CSV</strong> con deduplicación automática desde la pestaña de Empresas.</p>
          <p>• Canales comerciales vinculados directamente a WhatsApp corporativo (+57 304 3726578).</p>
        </div>
      `;
    }
  },

  companySearchTerm: '',
  companyPage: 1,
  pageSize: 25,

  filterCompanies() {
    const input = document.getElementById('crmCompanySearch');
    if (input) {
      this.companySearchTerm = input.value.toLowerCase().trim();
      this.companyPage = 1;
      this.renderCompanies();
    }
  },

  _getFilteredCompanies() {
    const all = this.getCompanies();
    if (!this.companySearchTerm) return all;
    const term = this.companySearchTerm;
    return all.filter(c =>
      (c.name && c.name.toLowerCase().includes(term)) ||
      (c.nit && c.nit.toLowerCase().includes(term)) ||
      (c.city && c.city.toLowerCase().includes(term)) ||
      (c.sector && c.sector.toLowerCase().includes(term)) ||
      (c.email && c.email.toLowerCase().includes(term))
    );
  },

  renderCompanies() {
    const tbody = document.getElementById('tableCompaniesBody');
    if (!tbody) return;

    const filtered = this._getFilteredCompanies();
    const total = filtered.length;
    const start = (this.companyPage - 1) * this.pageSize;
    const paginated = filtered.slice(start, start + this.pageSize);

    const pageIndicator = document.getElementById('crmCompanyPageInfo');
    if (pageIndicator) {
      const totalPages = Math.ceil(total / this.pageSize) || 1;
      pageIndicator.textContent = `Página ${this.companyPage} de ${totalPages.toLocaleString()} (${total.toLocaleString()} empresas encontradas)`;
    }

    if (paginated.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem; color:#94a3b8">No se encontraron empresas con el término "${this.companySearchTerm}".</td></tr>`;
      return;
    }

    tbody.innerHTML = paginated.map(comp => {
      const cleanPhone = (comp.phone || '').replace(/[^0-9]/g, '');
      const waPhone = cleanPhone.length === 10 ? '57' + cleanPhone : (cleanPhone.startsWith('57') ? cleanPhone : '57' + cleanPhone);
      return `
        <tr>
          <td>
            <strong>${comp.name}</strong><br>
            <small style="color:#94a3b8">NIT: ${comp.nit || 'N/A'}</small>
            ${comp.email ? `<br><small style="color:#60a5fa">${comp.email}</small>` : ''}
          </td>
          <td>${comp.city || 'Colombia'}</td>
          <td><span class="crm-badge-sector">${comp.sector || 'Comercial'}</span></td>
          <td>
            ${comp.contact ? `<strong>${comp.contact}</strong><br>` : ''}
            ${comp.phone ? `<small style="color:#25D366"><i class="fa-solid fa-phone"></i> ${comp.phone}</small>` : '<small style="color:#64748b">Sin teléfono</small>'}
          </td>
          <td><span class="crm-status-tag ${comp.status === 'Cliente Activo' ? 'active' : 'lead'}">${comp.status || 'Prospecto'}</span></td>
          <td>${comp.assignedTo || 'Equipo Comercial'}</td>
          <td>
            <div style="display:flex; gap: 6px;">
              ${cleanPhone ? `<a href="https://wa.me/${waPhone}?text=Hola,%20nos%20comunicamos%20de%202%20SOLUTIONS%20respecto%20a%20art%C3%ADculos%20promocionales" target="_blank" class="btn-table-action" style="color:#25D366" title="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>` : ''}
              <button class="btn-table-action" onclick="AdminPanel.deleteCompany('${comp.id}')" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  nextCompanyPage() {
    const total = this._getFilteredCompanies().length;
    if (this.companyPage * this.pageSize < total) {
      this.companyPage++;
      this.renderCompanies();
    }
  },

  prevCompanyPage() {
    if (this.companyPage > 1) {
      this.companyPage--;
      this.renderCompanies();
    }
  },

  renderContacts() {
    const manualContacts = this.getContacts();
    const companies = this.getCompanies();
    const tbody = document.getElementById('tableContactsBody');
    if (!tbody) return;

    const combined = [
      ...manualContacts,
      ...companies.filter(c => c.email || c.phone).slice(0, 50).map(c => ({
        id: c.id,
        name: c.contact || 'Contacto Corporativo',
        role: c.sector || 'Compras / Gerencia',
        email: c.email || 'Sin correo',
        phone: c.phone || 'N/A',
        companyName: c.name,
        provider: 'Base CRM'
      }))
    ];

    if (combined.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem; color:#94a3b8">No hay contactos registrados aún.</td></tr>`;
      return;
    }

    tbody.innerHTML = combined.slice(0, 50).map(c => `
      <tr>
        <td><strong>${c.name}</strong><br><small style="color:#94a3b8">${c.role || 'Contacto'}</small></td>
        <td>${c.email && c.email !== 'Sin correo' ? `<a href="mailto:${c.email}" style="color:#60a5fa">${c.email}</a>` : '<span style="color:#64748b">Sin correo</span>'}</td>
        <td>${c.phone || 'N/A'}</td>
        <td><span class="crm-badge-company">${c.companyName || 'Empresa General'}</span></td>
        <td><span class="crm-badge-prov">${c.provider || 'Directo'}</span></td>
        <td>
          <button class="btn-table-action" onclick="AdminPanel.deleteContact('${c.id}')" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>
    `).join('');
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
    const name = prompt('Nombre de la Empresa / Razón Social:');
    if (!name) return;
    const nit = prompt('NIT de la empresa:');
    const city = prompt('Ciudad sede:', 'Barranquilla');
    const sector = prompt('Sector económico:', 'Industrial / Comercial');

    const nitKey = this._normNit(nit);
    const nameKey = this._normText(name);
    const existing = this.getCompanies();
    const isDuplicate = existing.some(c =>
      (nitKey.length >= 5 && this._normNit(c.nit) === nitKey) ||
      this._normText(c.name) === nameKey
    );

    if (isDuplicate) {
      alert('Esta empresa ya existe en el CRM (duplicado detectado por NIT o Razón Social).');
      return;
    }

    const custom = this.getCustomCompanies();
    custom.unshift({
      id: 'comp_' + Date.now(),
      name: name.trim(),
      nit: (nit || 'Por definir').trim(),
      city: (city || 'Barranquilla').trim(),
      sector: (sector || 'General').trim(),
      assignedTo: 'Equipo Comercial 2 SOLUTIONS',
      status: 'Cliente Activo'
    });
    this.saveCustomCompanies(custom);
    this.renderCompanies();
    this.renderDashboard();
    alert('Empresa vinculada exitosamente.');
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
    companies.slice(0, 10).forEach((co, idx) => {
      compMsg += `${idx + 1}. ${co.name}\n`;
    });
    const choice = parseInt(prompt(compMsg, '1')) - 1;
    const chosenCompany = companies[choice] || companies[0];

    const contacts = this.getContacts();
    contacts.unshift({
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
    alert('Contacto agregado y vinculado.');
  },

  deleteCompany(id) {
    if (confirm('¿Seguro que deseas eliminar esta empresa del CRM?')) {
      if (id.startsWith('base_')) {
        this.addDeletedId(id);
      } else {
        const list = this.getCustomCompanies().filter(c => c.id !== id);
        this.saveCustomCompanies(list);
      }
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
  },

  // EXPORTAR A CSV USANDO BLOB (SOPORTA 50,000+ FILAS SIN LÍMITE DE URL)
  exportToCSV() {
    const companies = this.getCompanies();
    if (companies.length === 0) {
      alert('No hay información de empresas para exportar.');
      return;
    }

    const clean = (val) => '"' + (val || '').toString().replace(/"/g, '""') + '"';
    const rows = ['ID,EMPRESA,NIT,CIUDAD,SECTOR,DIRECCION,TELEFONO,EMAIL,ESTADO,ASIGNADO'];

    for (let i = 0; i < companies.length; i++) {
      const c = companies[i];
      rows.push([
        clean(c.id),
        clean(c.name),
        clean(c.nit),
        clean(c.city),
        clean(c.sector),
        clean(c.address),
        clean(c.phone),
        clean(c.email),
        clean(c.status),
        clean(c.assignedTo)
      ].join(','));
    }

    const blob = new Blob(['\ufeff' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `2SOLUTIONS_CRM_EMPRESAS_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },

  // IMPORTAR DESDE CSV CON DEDUPLICACIÓN AUTOMÁTICA
  importFromCSV(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        await this.ensureBaseLoaded();
        const text = e.target.result;
        const lines = text.split(/\r\n|\n/);
        if (lines.length < 2) {
          alert('El archivo CSV parece estar vacío.');
          return;
        }

        const existing = this.getCompanies();
        const seenNits = new Set();
        const seenNames = new Set();
        existing.forEach(c => {
          const nk = this._normNit(c.nit);
          if (nk.length >= 5) seenNits.add(nk);
          const nm = this._normText(c.name);
          if (nm) seenNames.add(nm);
        });

        const newCompanies = [];
        let duplicatesSkipped = 0;

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/^"|"$/g, '').trim());
          if (cols.length >= 2) {
            const name = (cols[3] || cols[1] || cols[0] || '').trim();
            if (!name) continue;
            const nit = (cols[4] || cols[2] || '').trim();
            const nitKey = this._normNit(nit);
            const nameKey = this._normText(name);

            if ((nitKey.length >= 5 && seenNits.has(nitKey)) || seenNames.has(nameKey)) {
              duplicatesSkipped++;
              continue;
            }
            if (nitKey.length >= 5) seenNits.add(nitKey);
            seenNames.add(nameKey);

            newCompanies.push({
              id: 'comp_imp_' + Date.now() + '_' + i,
              name,
              nit: nit || 'N/A',
              city: cols[2] ? cols[2] + (cols[1] ? ' (' + cols[1] + ')' : '') : (cols[3] || 'Colombia'),
              sector: cols[0] || 'Comercial',
              phone: cols[6] || '',
              email: cols[7] || '',
              address: cols[8] || '',
              contact: cols[5] || '',
              status: 'Prospecto Importado',
              assignedTo: 'Equipo Comercial 2 SOLUTIONS'
            });
          }
        }

        if (newCompanies.length > 0) {
          const custom = this.getCustomCompanies();
          this.saveCustomCompanies([...newCompanies, ...custom]);
          this.renderCompanies();
          this.renderDashboard();
        }
        alert(`Importación completada:\n• ${newCompanies.length} empresas nuevas agregadas.\n• ${duplicatesSkipped} registros duplicados omitidos.`);
      } catch (err) {
        console.error('Error al importar CSV:', err);
        alert('Hubo un error al leer el archivo CSV. Verifica el formato.');
      } finally {
        event.target.value = '';
      }
    };
    reader.readAsText(file);
  }
};

window.AdminPanel = AdminPanel;
