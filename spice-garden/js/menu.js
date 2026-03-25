/* ============================================
   MENU MANAGEMENT AGENT - Display & Filter
   ============================================ */

let currentFilter = 'All';

function renderMenu() {
  const menu = DB.getMenu();
  const grid = document.getElementById('menu-grid');
  const filtersDiv = document.getElementById('menu-filters');

  // Build filter buttons
  const categories = ['All', ...new Set(menu.map(i => i.category))];
  filtersDiv.innerHTML = categories.map(cat => `
    <button class="menu-filter-btn ${cat === currentFilter ? 'active' : ''}" onclick="filterMenu('${cat}')">${cat}</button>
  `).join('');

  // Filter items
  const filtered = currentFilter === 'All' ? menu : menu.filter(i => i.category === currentFilter);

  // Render cards
  grid.innerHTML = filtered.map((item, idx) => `
    <div class="menu-card" style="animation-delay: ${idx * 0.08}s">
      <div class="menu-card-img">
        ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover;">` : `<i class="fa-solid ${item.icon || 'fa-utensils'}"></i>`}
        <span class="menu-card-category">${item.category}</span>
      </div>
      <div class="menu-card-body">
        <h3>${item.name}</h3>
        <p class="menu-card-desc">${item.desc || ''}</p>
        <div class="menu-card-footer">
          <span class="menu-card-price">₹${item.price}</span>
          <button class="add-to-cart-btn" onclick="addToCart(${item.id})">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join('');

  initScrollAnimations();
}

function filterMenu(category) {
  currentFilter = category;
  renderMenu();
}

function renderFeatured() {
  const menu = DB.getMenu();
  const featuredIds = [6, 9, 13, 17, 22, 4];
  const featured = featuredIds.map(id => menu.find(i => i.id === id)).filter(Boolean).slice(0, 6);
  const grid = document.getElementById('featured-grid');

  grid.innerHTML = featured.map(item => `
    <div class="featured-card">
      <div class="featured-card-img">
        ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover;">` : `<i class="fa-solid ${item.icon || 'fa-utensils'}"></i>`}
      </div>
      <div class="featured-card-body">
        <h3>${item.name}</h3>
        <p>${item.desc || ''}</p>
        <span class="featured-card-price">₹${item.price}</span>
      </div>
    </div>
  `).join('');
}
