/* ============================================
   DATABASE AGENT - LocalStorage Data Layer
   ============================================ */

const DB = {
  /* ---- Default Menu Data ---- */
  defaultMenu: [
    // Starters
    { id: 1,  name: 'Paneer Tikka',        category: 'Starters',    price: 180, icon: 'fa-cheese', desc: 'Grilled cottage cheese with spices' },
    { id: 2,  name: 'Veg Spring Rolls',    category: 'Starters',    price: 150, icon: 'fa-pepper-hot', desc: 'Crispy rolls with vegetable filling' },
    { id: 4,  name: 'Samosa',              category: 'Starters',    price: 60,  icon: 'fa-cookie', desc: 'Golden fried pastry with potato filling', image: 'assets/images/samosa.png' },
    { id: 5,  name: 'Aloo Tikki',          category: 'Starters',    price: 80,  icon: 'fa-cookie-bite', desc: 'Crispy potato patties with chutneys' },
    // Main Course
    { id: 6,  name: 'Paneer Butter Masala', category: 'Main Course', price: 220, icon: 'fa-bowl-food', desc: 'Rich tomato-cream curry with paneer', image: 'assets/images/paneer-butter-masala.png' },
    { id: 7,  name: 'Veg Biryani',         category: 'Main Course', price: 180, icon: 'fa-bowl-rice', desc: 'Fragrant basmati rice with veggies', image: 'assets/images/veg-biryani.png' },
    { id: 9,  name: 'Dal Makhani',         category: 'Main Course', price: 170, icon: 'fa-plate-wheat', desc: 'Slow-cooked black lentils in cream', image: 'assets/images/dal-makhani.png' },
    { id: 10, name: 'Butter Naan',         category: 'Main Course', price: 50,  icon: 'fa-bread-slice', desc: 'Soft tandoori bread with butter' },
    // Fast Food
    { id: 12, name: 'Veg Burger',          category: 'Fast Food',   price: 120, icon: 'fa-burger', desc: 'Crispy veggie patty with cheese' },
    { id: 13, name: 'Margherita Pizza',    category: 'Fast Food',   price: 200, icon: 'fa-pizza-slice', desc: 'Classic pizza with mozzarella & basil', image: 'assets/images/margherita-pizza.png' },
    { id: 14, name: 'French Fries',        category: 'Fast Food',   price: 90,  icon: 'fa-plate-wheat', desc: 'Crispy golden fries with dips' },
    { id: 16, name: 'Pav Bhaji',           category: 'Fast Food',   price: 130, icon: 'fa-bread-slice', desc: 'Spiced mashed veggies with bread rolls' },
    // Drinks
    { id: 17, name: 'Cold Coffee',         category: 'Drinks',      price: 90,  icon: 'fa-mug-hot', desc: 'Chilled coffee with cream', image: 'assets/images/cold-coffee.png' },
    { id: 18, name: 'Mango Lassi',         category: 'Drinks',      price: 80,  icon: 'fa-glass-water', desc: 'Sweet yogurt mango smoothie' },
    { id: 19, name: 'Fresh Lime Soda',     category: 'Drinks',      price: 60,  icon: 'fa-lemon', desc: 'Refreshing lime with soda' },
    { id: 20, name: 'Masala Chai',         category: 'Drinks',      price: 40,  icon: 'fa-mug-saucer', desc: 'Traditional spiced Indian tea' },
    { id: 21, name: 'Virgin Mojito',       category: 'Drinks',      price: 110, icon: 'fa-martini-glass', desc: 'Minty lime soda with crushed ice' },
    // Desserts
    { id: 22, name: 'Gulab Jamun',         category: 'Desserts',    price: 80,  icon: 'fa-cookie', desc: 'Soft milk balls in cardamom syrup', image: 'assets/images/gulab-jamun.png' },
    { id: 23, name: 'Ice Cream Sundae',    category: 'Desserts',    price: 120, icon: 'fa-ice-cream', desc: 'Three scoops with toppings' },
    { id: 24, name: 'Rasmalai',            category: 'Desserts',    price: 100, icon: 'fa-cake-candles', desc: 'Soft paneer discs in saffron milk' },
    { id: 25, name: 'Chocolate Brownie',   category: 'Desserts',    price: 140, icon: 'fa-cookie-bite', desc: 'Warm brownie with vanilla ice cream' },
  ],

  /* ---- Default Admin User ---- */
  defaultAdmin: { username: 'admin', email: 'natvarnand@gmail.com', password: 'admin123', role: 'admin' },

  /* ---- Init ---- */
  init() {
    // Force refresh menu when version changes (e.g. menu items updated)
    const MENU_VERSION = '5';
    if (localStorage.getItem('sg_menu_version') !== MENU_VERSION) {
      localStorage.setItem('sg_menu', JSON.stringify(this.defaultMenu));
      localStorage.setItem('sg_menu_version', MENU_VERSION);
    }
    if (!localStorage.getItem('sg_users')) {
      localStorage.setItem('sg_users', JSON.stringify([this.defaultAdmin]));
    }
    if (!localStorage.getItem('sg_orders'))    localStorage.setItem('sg_orders', JSON.stringify([]));
    if (!localStorage.getItem('sg_customers')) localStorage.setItem('sg_customers', JSON.stringify([]));
    if (!localStorage.getItem('sg_cart'))       localStorage.setItem('sg_cart', JSON.stringify([]));
    if (!localStorage.getItem('sg_nextId'))     localStorage.setItem('sg_nextId', '26');
  },

  /* ---- Generic helpers ---- */
  _get(key)      { return JSON.parse(localStorage.getItem(key) || '[]'); },
  _set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },

  /* ---- Menu ---- */
  getMenu()        { return this._get('sg_menu'); },
  addMenuItem(item) {
    const menu = this.getMenu();
    const nextId = parseInt(localStorage.getItem('sg_nextId') || '100');
    item.id = nextId;
    localStorage.setItem('sg_nextId', String(nextId + 1));
    menu.push(item);
    this._set('sg_menu', menu);
    return item;
  },
  updateMenuItem(id, updates) {
    const menu = this.getMenu().map(i => i.id === id ? { ...i, ...updates } : i);
    this._set('sg_menu', menu);
  },
  deleteMenuItem(id) {
    this._set('sg_menu', this.getMenu().filter(i => i.id !== id));
  },

  /* ---- Cart ---- */
  getCart()  { return this._get('sg_cart'); },
  saveCart(cart) { this._set('sg_cart', cart); },
  clearCart() { this._set('sg_cart', []); },

  /* ---- Users ---- */
  getUsers() { return this._get('sg_users'); },
  addUser(user) {
    const users = this.getUsers();
    if (users.find(u => u.username === user.username || u.email === user.email)) return null;
    user.role = 'customer';
    users.push(user);
    this._set('sg_users', users);
    return user;
  },
  findUser(usernameOrEmail, password) {
    return this.getUsers().find(u =>
      (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password
    );
  },

  /* ---- Session ---- */
  setSession(user) { sessionStorage.setItem('sg_session', JSON.stringify(user)); },
  getSession()     { const s = sessionStorage.getItem('sg_session'); return s ? JSON.parse(s) : null; },
  clearSession()   { sessionStorage.removeItem('sg_session'); },

  /* ---- Orders ---- */
  getOrders() { return this._get('sg_orders'); },
  addOrder(order) {
    const orders = this.getOrders();
    order.id = 'ORD-' + Date.now().toString(36).toUpperCase();
    order.date = new Date().toLocaleString();
    order.status = 'confirmed';
    orders.unshift(order);
    this._set('sg_orders', orders);
    return order;
  },

  /* ---- Customers ---- */
  getCustomers() { return this._get('sg_customers'); },
  addCustomer(cust) {
    const customers = this.getCustomers();
    const existing = customers.find(c => c.email === cust.email);
    if (existing) {
      existing.orderCount = (existing.orderCount || 0) + 1;
      this._set('sg_customers', customers);
      return existing;
    }
    cust.orderCount = 1;
    customers.push(cust);
    this._set('sg_customers', customers);
    return cust;
  },
};

DB.init();
