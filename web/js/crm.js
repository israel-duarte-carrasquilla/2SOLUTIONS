// PANEL DE ADMINISTRACIÓN & CRM B2B CORPORATIVO
// 2 SOLUTIONS S.A.S.

const AdminPanel = {
  getCompanies() {
    let data = localStorage.getItem('2solutions_crm_companies');
    if (!data) {
      if (window.CRM_INITIAL_COMPANIES && window.CRM_INITIAL_COMPANIES.length > 0) {
        data = JSON.stringify(window.CRM_INITIAL_COMPANIES);
      } else {
        data = JSON.stringify([
          {
            id: 'comp_1',
            name: 'Cruz Roja Colombiana Seccional Atlántico',
            nit: '890102064',
            city: 'Barranquilla (Atlántico)',
            sector: 'Salud / IPS',
            assignedTo: 'Asesor Comercial 2 SOLUTIONS',
            status: 'Cliente Activo',
            address: 'Calle 65 No.34-33',
            phone: '3695320',
            email: 'enfermerajefe@cruzrojaatlantico.org'
          },
          {
            id: 'comp_2',
            name: 'Comfamiliar Atlántico',
            nit: '890101994',
            city: 'Barranquilla (Atlántico)',
            sector: 'Caja de Compensación',
            assignedTo: 'Asesor Comercial 2 SOLUTIONS',
            status: 'Cliente Activo',
            address: 'Calle 47 no. 43-57',
            phone: '6053966590',
            email: 'salud@comfamiliar.com.co'
          }
        ]);
      }
      localStorage.setItem('2solutions_crm_companies', data);
    }
    return JSON.parse(data);
  },

  getContacts() {
    let data = localStorage.getItem('2solutions_crm_contacts');
    if (!data) {
      if (window.CRM_INITIAL_CONTACTS && window.CRM_INITIAL_CONTACTS.length > 0) {
        data = JSON.stringify(window.CRM_INITIAL_CONTACTS);
      } else {
        data = JSON.stringify([]);
      }
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
    const modal = document.getElementById('adminModal');
    if (modal) {
      modal.style.display = 'flex';
      modal.classList.add('active');
      this.renderDashboard();
    }
  },

  close() {
    const modal = document.getElementById('adminModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('active');
    }
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

    const statsGrid = document.getElementById('adminStatsSummary');
    if (statsGrid) {
      statsGrid.innerHTML = `
        <div class="crm-stat-card">
          <div class="crm-stat-val">${companies.length.toLocaleString()}</div>
          <div class="crm-stat-lbl">Empresas en Directorio CRM</div>
        </div>
        <div class="crm-stat-card">
          <div class="crm-stat-val">${contacts.length.toLocaleString()}</div>
          <div class="crm-stat-lbl">Usuarios & Contactos Vinculados</div>
        </div>
        <div class="crm-stat-card">
          <div class="crm-stat-val">${quotes.length.toLocaleString()}</div>
          <div class="crm-stat-lbl">Solicitudes de Cotización</div>
        </div>
        <div class="crm-stat-card" style="border-color: rgba(37,211,102,0.4)">
          <div class="crm-stat-val" style="color: #25D366"><i class="fa-solid fa-cloud-arrow-up"></i> Sincronizado</div>
          <div class="crm-stat-lbl">Base de Datos Lista para Exportar</div>
        </div>
      `;
    }

    const recent = document.getElementById('adminRecentActivity');
    if (recent) {
      recent.innerHTML = `
        <h4 style="color:#ffffff; margin-bottom: 1rem; font-size: 1.05rem;">Resumen Ejecutivo de Gestión</h4>
        <div style="font-size: 0.88rem; color:#cbd5e1; line-height: 1.6;">
          <p>• Directorio corporativo activo con <strong>${companies.length.toLocaleString()} empresas</strong> registradas y vinculadas por departamento y ciudad.</p>
          <p>• Puedes <strong>Exportar a CSV / Excel</strong> o <strong>Cargar nuevas bases masivas</strong> desde la pestaña de Empresas.</p>
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

  renderCompanies() {
    const all = this.getCompanies();
    const contacts = this.getContacts();
    const tbody = document.getElementById('tableCompaniesBody');
    if (!tbody) return;

    let filtered = all;
    if (this.companySearchTerm) {
      filtered = all.filter(c => 
        (c.name && c.name.toLowerCase().includes(this.companySearchTerm)) ||
        (c.nit && c.nit.toLowerCase().includes(this.companySearchTerm)) ||
        (c.city && c.city.toLowerCase().includes(this.companySearchTerm)) ||
        (c.sector && c.sector.toLowerCase().includes(this.companySearchTerm))
      );
    }

    const total = filtered.length;
    const start = (this.companyPage - 1) * this.pageSize;
    const paginated = filtered.slice(start, start + this.pageSize);

    // Actualizar indicador de paginación
    const pageIndicator = document.getElementById('crmCompanyPageInfo');
    if (pageIndicator) {
      const totalPages = Math.ceil(total / this.pageSize) || 1;
      pageIndicator.textContent = `Página ${this.companyPage} de ${totalPages} (${total.toLocaleString()} empresas encontradas)`;
    }

    if (paginated.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem; color:#94a3b8">No se encontraron empresas con el término "${this.companySearchTerm}".</td></tr>`;
      return;
    }

    tbody.innerHTML = paginated.map(comp => {
      const compContacts = contacts.filter(c => c.companyId === comp.id || (c.companyName && c.companyName.toLowerCase() === comp.name.toLowerCase()));
      return `
        <tr>
          <td>
            <strong>${comp.name}</strong><br>
            <small style="color:#94a3b8">NIT: ${comp.nit || 'N/A'}</small>
            ${comp.email ? `<br><small style="color:#60a5fa">${comp.email}</small>` : ''}
          </td>
          <td>${comp.city || 'Barranquilla'}</td>
          <td><span class="crm-badge-sector">${comp.sector || 'Comercial'}</span></td>
          <td>
            <strong>${compContacts.length > 0 ? compContacts.length + ' usuarios' : (comp.contactsCount || 0) + ' asignados'}</strong>
            ${comp.phone ? `<br><small style="color:#25D366"><i class="fa-solid fa-phone"></i> ${comp.phone}</small>` : ''}
          </td>
          <td><span class="crm-status-tag ${comp.status === 'Cliente Activo' ? 'active' : 'lead'}">${comp.status || 'Prospecto'}</span></td>
          <td>${comp.assignedTo || 'Equipo Comercial'}</td>
          <td>
            <div style="display:flex; gap: 6px;">
              ${comp.phone ? `<a href="https://wa.me/57${comp.phone.replace(/[^0-9]/g, '')}?text=Hola,%20nos%20comunicamos%20de%202%20SOLUTIONS%20respecto%20a%20art%C3%ADculos%20promocionales" target="_blank" class="btn-table-action" style="color:#25D366" title="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>` : ''}
              <button class="btn-table-action" onclick="AdminPanel.deleteCompany('${comp.id}')" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  nextCompanyPage() {
    const all = this.getCompanies();
    const total = this.companySearchTerm ? all.filter(c => c.name.toLowerCase().includes(this.companySearchTerm)).length : all.length;
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
    const contacts = this.getContacts();
    const companies = this.getCompanies();
    const tbody = document.getElementById('tableContactsBody');
    if (!tbody) return;

    if (contacts.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem; color:#94a3b8">No hay contactos registrados aún.</td></tr>`;
      return;
    }

    tbody.innerHTML = contacts.slice(0, 50).map(c => {
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
    const name = prompt('Nombre de la Empresa / Razón Social:');
    if (!name) return;
    const nit = prompt('NIT de la empresa:');
    const city = prompt('Ciudad sede:', 'Barranquilla');
    const sector = prompt('Sector económico:', 'Industrial / Comercial');

    const companies = this.getCompanies();
    companies.unshift({
      id: 'comp_' + Date.now(),
      name,
      nit: nit || 'Por definir',
      city: city || 'Barranquilla',
      sector: sector || 'General',
      assignedTo: 'Equipo Comercial 2 SOLUTIONS',
      status: 'Cliente Activo'
    });
    this.saveCompanies(companies);
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
  },

  // EXPORTAR A CSV
  exportToCSV() {
    const companies = this.getCompanies();
    if (companies.length === 0) {
      alert('No hay información de empresas para exportar.');
      return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'ID,EMPRESA,NIT,CIUDAD,SECTOR,DIRECCION,TELEFONO,EMAIL,ESTADO,ASIGNADO\n';

    companies.forEach(c => {
      const clean = (val) => '"' + (val || '').toString().replace(/"/g, '""') + '"';
      const row = [
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
      ].join(',');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `2SOLUTIONS_CRM_EMPRESAS_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // IMPORTAR DESDE CSV
  importFromCSV(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split(/\r\n|\n/);
        if (lines.length < 2) {
          alert('El archivo CSV parece estar vacío.');
          return;
        }

        const newCompanies = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          // Separación simple respetando comillas básicas
          const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/^"|"$/g, '').trim());
          if (cols.length >= 2) {
            newCompanies.push({
              id: 'comp_imp_' + Date.now() + '_' + i,
              name: cols[3] || cols[1] || cols[0],
              nit: cols[4] || cols[2] || '',
              city: cols[2] ? cols[2] + ' (' + cols[1] + ')' : (cols[3] || 'Barranquilla'),
              sector: cols[0] || 'Comercial',
              phone: cols[6] || '',
              email: cols[7] || '',
              address: cols[8] || '',
              status: 'Prospecto Importado',
              assignedTo: 'Equipo Comercial 2 SOLUTIONS'
            });
          }
        }

        if (newCompanies.length > 0) {
          const current = AdminPanel.getCompanies();
          const combined = [...newCompanies, ...current];
          AdminPanel.saveCompanies(combined);
          AdminPanel.renderCompanies();
          AdminPanel.renderDashboard();
          alert(`¡Se han importado exitosamente ${newCompanies.length} empresas al CRM!`);
        } else {
          alert('No se pudieron procesar filas válidas en el CSV.');
        }
      } catch (err) {
        console.error('Error al importar CSV:', err);
        alert('Hubo un error al leer el archivo CSV. Verifica el formato.');
      }
    };
    reader.readAsText(file);
  }
};

window.AdminPanel = AdminPanel;
