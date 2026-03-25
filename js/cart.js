/* ============================================
   ORDER / CART AGENT - Cart Management
   ============================================ */

function getCartTotal() {
  return DB.getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function updateCartCount() {
  const cart = DB.getCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('cart-count');
  if (badge) badge.textContent = count;
}

function addToCart(itemId) {
  const menu = DB.getMenu();
  const menuItem = menu.find(i => i.id === itemId);
  if (!menuItem) return;

  const cart = DB.getCart();
  const existing = cart.find(c => c.id === itemId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: menuItem.id, name: menuItem.name, price: menuItem.price, icon: menuItem.icon, qty: 1 });
  }
  DB.saveCart(cart);
  updateCartCount();
  bumpCartBadge();
  showNotification(`${menuItem.name} added to cart!`, 'success');
  
  // If we're on the order page, re-render
  const orderPage = document.getElementById('page-order');
  if (orderPage && orderPage.classList.contains('active')) {
    renderCart();
  }
}

function removeFromCart(itemId) {
  const cart = DB.getCart().filter(c => c.id !== itemId);
  DB.saveCart(cart);
  updateCartCount();
  renderCart();
  showNotification('Item removed from cart.', 'info');
}

function changeQty(itemId, delta) {
  const cart = DB.getCart();
  const item = cart.find(c => c.id === itemId);
  if (!item) return;
  
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(itemId);
    return;
  }
  
  DB.saveCart(cart);
  updateCartCount();
  bumpCartBadge();
  renderCart();
}

function renderCart() {
  const cart = DB.getCart();
  const cartItems = document.getElementById('cart-items');
  const cartEmpty = document.getElementById('cart-empty');
  const cartSummary = document.getElementById('cart-summary');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (!cartItems || !cartEmpty) return;

  if (cart.length === 0) {
    cartItems.innerHTML = '';
    cartItems.style.display = 'none';
    cartSummary.style.display = 'none';
    cartEmpty.style.display = 'block';
    return;
  }

  cartItems.style.display = 'block';
  cartSummary.style.display = 'block';
  cartEmpty.style.display = 'none';

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item glass-card" style="margin-bottom:1rem; padding:1rem;">
      <div style="display:flex; align-items:center; gap:1rem;">
        <span style="font-size:2rem;">
          ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">` : `<i class="fa-solid ${item.icon || 'fa-utensils'}"></i>`}
        </span>
        <div style="flex:1">
          <h4 style="margin:0">${item.name}</h4>
          <span style="color:var(--accent); font-weight:600">₹${item.price}</span>
        </div>
        <div class="cart-item-qty" style="display:flex; align-items:center; gap:0.5rem;">
          <button class="btn btn-primary btn-sm" style="padding:0.2rem 0.6rem" onclick="changeQty(${item.id}, -1)">−</button>
          <span style="min-width:20px; text-align:center">${item.qty}</span>
          <button class="btn btn-primary btn-sm" style="padding:0.2rem 0.6rem" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
        <button onclick="removeFromCart(${item.id})" style="background:none; color:var(--danger); font-size:1.2rem;"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>
  `).join('');

  // Summary calculation
  const subtotal = getCartTotal();
  const delivery = subtotal > 500 ? 0 : 40;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + delivery + tax;

  const subtotalEl = document.getElementById('cart-subtotal');
  const deliveryEl = document.getElementById('cart-delivery');
  const taxEl = document.getElementById('cart-tax');
  const totalEl = document.getElementById('cart-total');

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
  if (deliveryEl) deliveryEl.textContent = delivery === 0 ? 'FREE' : `₹${delivery}`;
  if (taxEl) taxEl.textContent = `₹${tax}`;
  if (totalEl) totalEl.textContent = `₹${total}`;
}

function proceedToCheckout() {
  const cart = DB.getCart();
  if (cart.length === 0) {
    showNotification('Your cart is empty!', 'error');
    return;
  }
  
  // Navigate to customer details page
  navigateTo('customer');
}

function submitCustomerForm(e) {
  e.preventDefault();
  
  const customerInfo = {
    name: document.getElementById('cust-name').value,
    phone: document.getElementById('cust-phone').value,
    email: document.getElementById('cust-email').value,
    address: document.getElementById('cust-address').value,
    city: document.getElementById('cust-city').value,
    pincode: document.getElementById('cust-pincode').value,
  };

  sessionStorage.setItem('sg_checkout_customer', JSON.stringify(customerInfo));
  navigateTo('payment');
}
