/* ============================================
   ADMIN PANEL AGENT - Dashboard & CRUD
   ============================================ */

function adminLogin(e) {
  e.preventDefault();
  const user = document.getElementById('admin-user').value.trim();
  const pass = document.getElementById('admin-pass').value;

  if (user === 'admin' && pass === 'admin123') {
    document.getElementById('admin-login-screen').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'flex';
    renderDashboard();
    showNotification('Logged in as Admin.', 'success');
  } else {
    showNotification('Invalid admin credentials.', 'error');
  }
  return false;
}

function adminLogout() {
  document.getElementById('admin-dashboard').style.display = 'none';
  document.getElementById('admin-login-screen').style.display = 'block';
  showNotification('Logged out from admin panel.', 'info');
}

function switchAdminPanel(panel) {
  // Toggle panels
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(`panel-${panel}`).classList.add('active');
  
  // Toggle nav buttons
  document.querySelectorAll('.admin-nav-btn').forEach(b => b.dataset.panel === panel ? b.classList.add('active') : b.classList.remove('active'));

  // Update title
  const title = document.getElementById('admin-panel-title');
  if (title) title.textContent = panel.charAt(0).toUpperCase() + panel.slice(1).replace('-', ' ');

  // Render specific data
  if (panel === 'dashboard') renderDashboard();
  else if (panel === 'menu-mgmt') renderMenuTable();
  else if (panel === 'orders') renderOrdersTable();
  else if (panel === 'customers') renderCustomersTable();
}

function renderDashboard() {
  const orders = DB.getOrders();
  const customers = DB.getCustomers();
  const menu = DB.getMenu();
  const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);

  // Update stats
  const stats = {
    'stat-orders': orders.length,
    'stat-revenue': `₹${revenue.toLocaleString()}`,
    'stat-customers': customers.length,
    'stat-items': menu.length,
  };

  for (const [id, val] of Object.entries(stats)) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  // Recent orders table
  const tbody = document.getElementById('recent-orders-body');
  if (!tbody) return;

  const recent = orders.slice(0, 5);
  if (recent.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--text-dark-muted)">No orders yet</td></tr>';
    return;
  }

  tbody.innerHTML = recent.map(o => `
    <tr>
      <td><strong>${o.id}</strong></td>
      <td>${o.customer?.name || 'Guest'}</td>
      <td>${o.items?.length || 0} items</td>
      <td>₹${o.total}</td>
      <td><span class="status-badge ${o.status}">${o.status}</span></td>
    </tr>
  `).join('');
}

function renderMenuTable() {
  const menu = DB.getMenu();
  const tbody = document.getElementById('menu-table-body');
  if (!tbody) return;

  tbody.innerHTML = menu.map(item => `
    <tr>
      <td><span style="font-size:1.5rem;"><i class="fa-solid ${item.icon || 'fa-utensils'}"></i></span></td>
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>₹${item.price}</td>
      <td>
        <button class="btn btn-sm" style="margin-right:0.5rem" onclick="openEditItemModal(${item.id})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteMenuItemAdmin(${item.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

function renderOrdersTable() {
  const orders = DB.getOrders();
  const tbody = document.getElementById('all-orders-body');
  if (!tbody) return;

  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--text-dark-muted)">No orders yet</td></tr>';
    return;
  }

  tbody.innerHTML = orders.map(o => `
    <tr>
      <td><strong>${o.id}</strong></td>
      <td>${o.customer?.name || 'Guest'}</td>
      <td>${o.items?.map(i => `${i.name} ×${i.qty}`).join(', ')}</td>
      <td>₹${o.total}</td>
      <td>${o.paymentMethod?.toUpperCase() || 'N/A'}</td>
      <td><span class="status-badge ${o.status}">${o.status}</span></td>
    </tr>
  `).join('');
}

function renderCustomersTable() {
  const customers = DB.getCustomers();
  const tbody = document.getElementById('customers-body');
  if (!tbody) return;

  if (customers.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--text-dark-muted)">No customers yet</td></tr>';
    return;
  }

  tbody.innerHTML = customers.map(c => `
    <tr>
      <td>${c.name}</td>
      <td>${c.email}</td>
      <td>${c.phone}</td>
      <td>${c.city || 'N/A'}</td>
      <td>${c.orderCount || 0}</td>
    </tr>
  `).join('');
}

// Modal Handlers
function openAddItemModal() {
  document.getElementById('item-modal-title').textContent = 'Add Menu Item';
  document.getElementById('item-form').reset();
  document.getElementById('item-edit-id').value = '';
  document.getElementById('item-modal').classList.add('active');
}

function openEditItemModal(id) {
  const menu = DB.getMenu();
  const item = menu.find(i => i.id === id);
  if (!item) return;

  document.getElementById('item-modal-title').textContent = 'Edit Menu Item';
  document.getElementById('item-name').value = item.name;
  document.getElementById('item-price').value = item.price;
  document.getElementById('item-category').value = item.category;
  document.getElementById('item-icon').value = item.icon || '';
  document.getElementById('item-edit-id').value = id;
  document.getElementById('item-modal').classList.add('active');
}

function closeItemModal() {
  document.getElementById('item-modal').classList.remove('active');
}

function saveMenuItem(e) {
  e.preventDefault();
  const id = document.getElementById('item-edit-id').value;
  const name = document.getElementById('item-name').value;
  const price = parseInt(document.getElementById('item-price').value);
  const category = document.getElementById('item-category').value;
  const icon = document.getElementById('item-icon').value;

  if (id) {
    DB.updateMenuItem(parseInt(id), { name, price, category, icon });
    showNotification('Item updated!', 'success');
  } else {
    DB.addMenuItem({ name, price, category, icon });
    showNotification('Item added!', 'success');
  }

  closeItemModal();
  renderMenuTable();
  if (typeof renderMenu === 'function') renderMenu();
}

function deleteMenuItemAdmin(id) {
  if (confirm('Are you sure you want to delete this item?')) {
    DB.deleteMenuItem(id);
    showNotification('Item deleted!', 'success');
    renderMenuTable();
    if (typeof renderMenu === 'function') renderMenu();
  }
}
