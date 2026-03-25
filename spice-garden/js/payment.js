/* ============================================
   PAYMENT AGENT - Payment Processing
   ============================================ */

function switchPaymentTab(method) {
  // Toggle forms
  document.querySelectorAll('.pay-form').forEach(f => f.classList.remove('active'));
  document.getElementById(`${method}-form`).classList.add('active');
  
  // Update tabs
  document.querySelectorAll('.pay-tab').forEach(t => t.dataset.method === method ? t.classList.add('active') : t.classList.remove('active'));
}

function renderPaymentSummary() {
  const cart = DB.getCart();
  const itemsDiv = document.getElementById('payment-items');
  const totalSpan = document.getElementById('payment-total');

  if (!itemsDiv || !totalSpan) return;

  if (cart.length === 0) {
    itemsDiv.innerHTML = '<p style="color:var(--text-dark-muted)">No items in cart</p>';
    totalSpan.textContent = '₹0';
    return;
  }

  itemsDiv.innerHTML = cart.map(item => `
    <div class="summary-row">
      <span>${item.name} × ${item.qty}</span>
      <span>₹${item.price * item.qty}</span>
    </div>
  `).join('');

  const subtotal = getCartTotal();
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;
  
  totalSpan.textContent = `₹${total}`;
}

function processPayment(e, method) {
  e.preventDefault();
  
  const cart = DB.getCart();
  if (cart.length === 0) {
    showNotification('No items in your order!', 'error');
    return false;
  }

  // Basic validation (more could be added)
  if (method === 'card') {
    const cardNum = document.getElementById('card-number').value.trim();
    if (cardNum.length < 16) {
      showNotification('Please enter a valid card number.', 'error');
      return false;
    }
  } else if (method === 'upi') {
    const upiId = document.getElementById('upi-id').value.trim();
    if (!upiId.includes('@')) {
      showNotification('Please enter a valid UPI ID.', 'error');
      return false;
    }
  }

  // Simulate processing
  const btn = e.submitter;
  const originalText = btn.textContent;
  btn.textContent = 'Processing...';
  btn.disabled = true;

  setTimeout(() => {
    // Generate order
    const customerInfo = JSON.parse(sessionStorage.getItem('sg_checkout_customer') || '{}');
    const subtotal = getCartTotal();
    const deliveryFee = subtotal > 500 ? 0 : 40;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + deliveryFee + tax;

    const order = DB.addOrder({
      items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
      customer: customerInfo,
      subtotal,
      deliveryFee,
      tax,
      total,
      paymentMethod: method,
    });

    // Save customer
    if (customerInfo.email) {
      DB.addCustomer(customerInfo);
    }

    // Clear cart
    DB.clearCart();
    updateCartCount();

    // Show success modal
    const orderIdEl = document.getElementById('modal-order-id');
    if (orderIdEl) orderIdEl.textContent = `Order #SG-${order.id.slice(-5).toUpperCase()}`;
    
    const modal = document.getElementById('payment-success-modal');
    if (modal) modal.classList.add('active');

    btn.textContent = originalText;
    btn.disabled = false;
  }, 1500);

  return false;
}

function closeSuccessModal() {
  const modal = document.getElementById('payment-success-modal');
  if (modal) modal.classList.remove('active');
  navigateTo('home');
}
