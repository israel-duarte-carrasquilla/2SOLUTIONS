// SISTEMA DE AUTENTICACIÓN MULTIPROVEEDOR (GOOGLE, MICROSOFT & EMAIL) Y GESTIÓN DE ROLES
// 2 SOLUTIONS S.A.S.

const AUTH_CONFIG = {
  SUPERUSER_EMAIL: 'israel.duarte.carrasquilla@gmail.com',
  ADMIN_EMAIL: 'ricardo.delaespriella@outlook.es'
};

const AuthManager = {
  getCurrentUser() {
    const data = localStorage.getItem('2solutions_auth_user');
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser(user) {
    if (user) {
      // Normalizar roles
      const emailLower = (user.email || '').toLowerCase().trim();
      if (emailLower === AUTH_CONFIG.SUPERUSER_EMAIL.toLowerCase()) {
        user.role = 'SUPERUSER';
        user.roleLabel = 'Superusuario General';
      } else if (emailLower === AUTH_CONFIG.ADMIN_EMAIL.toLowerCase()) {
        user.role = 'ADMIN';
        user.roleLabel = 'Administrador Comercial';
      } else {
        user.role = user.role || 'CLIENT';
        user.roleLabel = 'Cliente Corporativo';
      }
      localStorage.setItem('2solutions_auth_user', JSON.stringify(user));
      this.syncWithCRM(user);
    } else {
      localStorage.removeItem('2solutions_auth_user');
    }
    this.updateAuthNavUI();
  },

  syncWithCRM(user) {
    // Si el usuario es un cliente, asegurar que exista en el CRM
    if (user.role === 'CLIENT') {
      try {
        let clients = JSON.parse(localStorage.getItem('2solutions_crm_contacts') || '[]');
        const exists = clients.find(c => c.email.toLowerCase() === user.email.toLowerCase());
        if (!exists) {
          clients.push({
            id: 'cli_' + Date.now(),
            name: user.name || 'Usuario Corporativo',
            email: user.email,
            company: user.company || 'Empresa Independiente',
            phone: user.phone || 'Por registrar',
            provider: user.provider || 'email',
            registeredAt: new Date().toISOString(),
            status: 'Activo',
            quotesCount: 0
          });
          localStorage.setItem('2solutions_crm_contacts', JSON.stringify(clients));
        }
      } catch (e) {
        console.error('Error sincronizando con CRM', e);
      }
    }
  },

  loginWithGoogle() {
    // Simulación de OAuth 2.0 Google Identity Services
    const userName = prompt('Inicio con Google:\nIngresa tu Nombre completo:', 'Israel Duarte');
    if (!userName) return;
    const userEmail = prompt('Ingresa tu cuenta de Google (ej: Israel.Duarte.Carrasquilla@gmail.com):', AUTH_CONFIG.SUPERUSER_EMAIL);
    if (!userEmail) return;

    const user = {
      id: 'g_' + Date.now(),
      name: userName,
      email: userEmail,
      provider: 'Google',
      avatar: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png',
      company: 'Corporativo Google Partner'
    };

    this.setCurrentUser(user);
    alert(`¡Bienvenido ${user.name}! Has iniciado sesión con Google.`);
    this.redirectOrRefresh();
  },

  loginWithMicrosoft() {
    // Simulación de Microsoft MSAL OAuth
    const userName = prompt('Inicio con Microsoft:\nIngresa tu Nombre completo:', 'Ricardo De La Espriella');
    if (!userName) return;
    const userEmail = prompt('Ingresa tu cuenta Microsoft (ej: Ricardo.Delaespriella@outlook.es):', AUTH_CONFIG.ADMIN_EMAIL);
    if (!userEmail) return;

    const user = {
      id: 'ms_' + Date.now(),
      name: userName,
      email: userEmail,
      provider: 'Microsoft',
      avatar: 'https://cdn-icons-png.flaticon.com/512/732/732221.png',
      company: '2 SOLUTIONS S.A.S.'
    };

    this.setCurrentUser(user);
    alert(`¡Bienvenido ${user.name}! Has iniciado sesión con Microsoft.`);
    this.redirectOrRefresh();
  },

  loginWithEmail(email, password, name, company, phone) {
    if (!email || !email.includes('@')) {
      alert('Por favor introduce un correo electrónico válido.');
      return false;
    }
    const user = {
      id: 'em_' + Date.now(),
      name: name || email.split('@')[0],
      email: email.trim(),
      provider: 'Email',
      company: company || 'Empresa Cliente',
      phone: phone || '',
      avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
    };
    this.setCurrentUser(user);
    alert(`¡Sesión iniciada con éxito!`);
    this.redirectOrRefresh();
    return true;
  },

  logout() {
    if (confirm('¿Deseas cerrar tu sesión?')) {
      this.setCurrentUser(null);
      window.location.reload();
    }
  },

  redirectOrRefresh() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.style.display = 'none';
    const user = this.getCurrentUser();
    if (user && (user.role === 'SUPERUSER' || user.role === 'ADMIN')) {
      if (confirm('Tienes permisos de gestión. ¿Deseas abrir el Panel de Administración & CRM?')) {
        window.location.href = '#admin-panel';
        if (window.AdminPanel) window.AdminPanel.open();
      }
    }
    this.updateAuthNavUI();
  },

  updateAuthNavUI() {
    const user = this.getCurrentUser();
    const authContainer = document.getElementById('navAuthStatus');
    if (!authContainer) return;

    if (user) {
      const isStaff = user.role === 'SUPERUSER' || user.role === 'ADMIN';
      authContainer.innerHTML = `
        <div class="user-pill-logged">
          <img src="${user.avatar}" alt="Avatar" class="user-avatar-sm">
          <div class="user-pill-info">
            <span class="user-pill-name">${user.name}</span>
            <span class="user-pill-role ${user.role.toLowerCase()}">${user.roleLabel}</span>
          </div>
          ${isStaff ? `<button class="btn-staff-panel" onclick="AdminPanel.open()" title="Abrir Panel CRM"><i class="fa-solid fa-chart-line"></i> Panel CRM</button>` : ''}
          <button class="btn-logout-icon" onclick="AuthManager.logout()" title="Cerrar sesión"><i class="fa-solid fa-arrow-right-from-bracket"></i></button>
        </div>
      `;
    } else {
      authContainer.innerHTML = `
        <button class="btn btn-login-nav" onclick="openLoginModal()">
          <i class="fa-solid fa-user-lock"></i> Acceso Clientes / Admin
        </button>
      `;
    }
  }
};

window.AuthManager = AuthManager;
