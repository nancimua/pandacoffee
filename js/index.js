document.addEventListener('DOMContentLoaded', function(){
  // 获取页面核心元素
  const themeToggle = document.getElementById('themeToggle');
  const cartBtn = document.getElementById('cartBtn');
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartOverlay = document.getElementById('cart-overlay');
  const closeCart = document.getElementById('closeCart');
  const cartItemsContainer = document.getElementById('cartItems');
  const totalPriceElement = document.getElementById('totalPrice');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const cartCount = document.querySelector('.cart-count');
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  const navLinks = document.querySelectorAll('.nav-links-wrap a');
  const navbar = document.querySelector('.navbar-wrap');
  const subscribeForm = document.getElementById('subscribeForm');
  const footerSubscribeForm = document.getElementById('footerSubscribeForm');
  const drinkCards = document.querySelectorAll('.drink-card');
  // 新增：获取筛选按钮
  const filterBtns = document.querySelectorAll('.filter-btn');

  // 1. 暗黑模式切换（保留原有功能，简化逻辑）
  function initDarkMode(){
    const darkModeStatus = localStorage.getItem('darkMode') === 'true';
    if (darkModeStatus){
      document.body.classList.add('dark-mode');
    }
  }

  if (themeToggle){
    initDarkMode();
    themeToggle.onclick = function(){
      const isDark = document.body.classList.toggle('dark-mode');
      localStorage.setItem('darkMode', isDark);
    }
  }

  // 2. 新增：导航栏滚动高亮+样式变化
  window.onscroll = function(){
    // 导航栏背景样式切换
    if (window.scrollY > 50){
      navbar.classList.add('scroll');
    } else{
      navbar.classList.remove('scroll');
    }

    // 导航链接自动高亮（匹配当前页面板块）
    let currentNav = '';
    const sections = ['hero-wrap', 'special-drinks-wrap', 'membership-wrap', 'reviews-wrap', 'subscribe-wrap'];
    sections.forEach(sectionName =>{
      const section = document.querySelector('.' + sectionName);
      if (!section) return;
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight){
        currentNav = sectionName;
      }
    });

    // 移除所有激活状态，添加当前板块对应高亮
    navLinks.forEach(link =>{
      link.classList.remove('active');
      // 首页默认高亮（顶部）
      if (window.scrollY < 300){
        navLinks[0].classList.add('active');
        return;
      }
      // 菜单链接匹配特色饮品板块
      if (link.getAttribute('href') === 'menu.html' && currentNav === 'special-drinks-wrap'){
        link.classList.add('active');
      }
    });
  }

  // 3. 新增：商品卡片悬停精细控制（图片放大过渡优化）
  drinkCards.forEach(card =>{
    const cardImg = card.querySelector('img');
    card.onmouseenter = function(){
      cardImg.style.transform = 'scale(1.1)';
      cardImg.style.transition = 'transform 0.6s ease';
    }
    card.onmouseleave = function(){
      cardImg.style.transform = 'scale(1)';
      cardImg.style.transition = 'transform 0.4s ease';
    }
  })

  // 4. 购物车核心逻辑（新增本地存储+库存限制）
  const cart ={
    items: JSON.parse(localStorage.getItem('pandaCart')) || [],
    // 添加商品（新增库存限制，最多10件）
    addItem(product){
      const stockMax = 10;
      const existingItem = this.items.find(item => item.name === product.name);
      if (existingItem){
        if (existingItem.quantity >= stockMax){
          this.showTip(`抱歉，${product.name} 最多只能买${stockMax}件哦`);
          return;
        }
        existingItem.quantity += 1;
      } else{
        this.items.push({...product, quantity: 1});
      }
      this.updateCart();
      this.saveCart();
      this.showTip(`${product.name} 已加入购物车`);
    },
    // 减少商品数量
    minusQty(name){
      const item = this.items.find(item => item.name === name);
      if (!item) return;
      item.quantity -= 1;
      if (item.quantity <= 0){
        this.delItem(name);
      }
      this.updateCart();
      this.saveCart();
    },
    // 增加商品数量（新增库存限制）
    plusQty(name){
      const stockMax = 10;
      const item = this.items.find(item => item.name === name);
      if (!item) return;
      if (item.quantity >= stockMax){
        this.showTip(`抱歉，该商品最多只能买${stockMax}件`);
        return;
      }
      item.quantity += 1;
      this.updateCart();
      this.saveCart();
    },
    // 删除商品
    delItem(name){
      this.items = this.items.filter(item => item.name !== name);
      this.updateCart();
      this.saveCart();
    },
    // 计算总价
    getTotal(){
      let total = 0;
      this.items.forEach(item =>{
        total += item.price * item.quantity;
      });
      return total;
    },
    // 更新购物车UI
    updateCart(){
      cartItemsContainer.innerHTML = '';
      if (this.items.length === 0){
        cartItemsContainer.innerHTML = '<p class="empty-cart">您的购物车是空的</p>';
        totalPriceElement.textContent = '¥0.00';
        cartCount.textContent = '0';
        return;
      }

      this.items.forEach(item =>{
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">¥${item.price.toFixed(2)}</div>
            <div class="quantity-control">
              <button class="quantity-btn minus">-</button>
              <span class="quantity">${item.quantity}</span>
              <button class="quantity-btn plus">+</button>
            </div>
            <button class="remove-item">删除</button>
          </div>
        `;
        // 绑定数量调整和删除事件
        cartItem.querySelector('.minus').onclick = () => this.minusQty(item.name);
        cartItem.querySelector('.plus').onclick = () => this.plusQty(item.name);
        cartItem.querySelector('.remove-item').onclick = () => this.delItem(item.name);
        cartItemsContainer.appendChild(cartItem);
      });

      const total = this.getTotal();
      totalPriceElement.textContent = `¥${total.toFixed(2)}`;
      // 计算商品总数量
      let totalCount = 0;
      this.items.forEach(item =>{
        totalCount += item.quantity;
      });
      cartCount.textContent = totalCount;
    },
    // 结算订单
    checkout(){
      if (this.items.length === 0){
        alert('购物车是空的，无法结算！');
        return;
      }
      const total = this.getTotal();
      const confirmBuy = confirm(`共有 ${cartCount.textContent} 件商品，总计 ¥${total.toFixed(2)}，是否确认结算？`);
      if (confirmBuy){
        alert(`订单提交成功！\n订单编号：${Date.now().toString().slice(-8)}\n支付金额：¥${total.toFixed(2)}`);
        this.items = [];
        this.updateCart();
        this.saveCart();
        closeCartSidebar();
      }
    },
    // 购物车提示
    showTip(msg){
      // 先移除已存在的提示，避免重复
      const oldTip = document.querySelector('.cart-notification');
      if (oldTip) oldTip.remove();

      const tip = document.createElement('div');
      tip.className = 'cart-notification';
      tip.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #ff8c00;
        color: #fff;
        padding: 12px 20px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(255,140,0,0.3);
        z-index: 9999;
        animation: slideIn 0.3s ease, slideOut 0.3s ease 2s forwards;
      `;
      tip.textContent = msg;
      document.body.appendChild(tip);
      setTimeout(() =>{
        tip.remove();
      }, 2500);
    },
    // 新增：保存购物车到本地存储（刷新不丢失）
    saveCart(){
      localStorage.setItem('pandaCart', JSON.stringify(this.items));
    }
  };

  // 5. 购物车侧边栏开关
  function openCartSidebar(){
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCartSidebar(){
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (cartBtn) cartBtn.onclick = openCartSidebar;
  if (closeCart) closeCart.onclick = closeCartSidebar;
  if (cartOverlay) cartOverlay.onclick = closeCartSidebar;
  if (checkoutBtn) checkoutBtn.onclick = () => cart.checkout();

  // 6. 绑定加入购物车按钮
  addToCartButtons.forEach(btn =>{
    btn.onclick = function(){
      const card = this.closest('.drink-card');
      const product ={
        name: card.querySelector('h3').innerText,
        price: parseFloat(card.querySelector('.price').innerText.replace('¥', '')),
        image: card.querySelector('img').src
      };
      cart.addItem(product);
    }
  });

  // 7. 新增：表单邮箱正则校验
  function checkEmail(email){
    // 简单实用的邮箱正则
    const reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return reg.test(email);
  }

  function handleSubscribe(e){
    e.preventDefault();
    const emailInput = e.target.querySelector('input[type="email"]');
    const email = emailInput.value.trim();

    if (!email){
      alert('请输入您的邮箱地址！');
      emailInput.focus();
      return;
    }

    if (!checkEmail(email)){
      alert('请输入有效的邮箱地址（例如：xxx@xxx.com）！');
      emailInput.focus();
      return;
    }

    alert(`订阅成功！我们会向 ${email} 发送最新的咖啡优惠信息`);
    e.target.reset();
  }

  if (subscribeForm) subscribeForm.onsubmit = handleSubscribe;
  if (footerSubscribeForm) footerSubscribeForm.onsubmit = handleSubscribe;

  // 8. 新增：页面平滑滚动（锚点跳转更流畅）
  document.querySelectorAll('a[href^="#"]').forEach(anchor =>{
    anchor.onclick = function(e){
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEle = document.querySelector(targetId);
      if (targetEle){
        window.scrollTo({
          top: targetEle.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    }
  });

  function filterDrinks(type) {
    // 遍历所有饮品卡片，根据类型筛选
    drinkCards.forEach(card => {
      // 若你的饮品卡片有对应data-type属性，可取消下面注释使用
      // const cardType = card.dataset.type;
      // 若无data-type，默认：all显示全部，其他类型可根据卡片名称自定义匹配
      if (type === 'all') {
        // 显示所有卡片
        card.style.display = 'block';
      } else {
        // 自定义匹配逻辑：根据卡片名称判断
        const cardName = card.querySelector('h3').innerText.toLowerCase();
        const isCoffee = cardName.includes('咖啡') || cardName.includes('espresso');
        const isMilk = cardName.includes('奶') || cardName.includes('拿铁') || cardName.includes('卡布奇诺');
        const isNonCoffee = !isCoffee && !isMilk;

        switch(type) {
          case 'coffee':
            card.style.display = isCoffee && !isMilk ? 'block' : 'none';
            break;
          case 'milk':
            card.style.display = isMilk ? 'block' : 'none';
            break;
          case 'non-coffee':
            card.style.display = isNonCoffee ? 'block' : 'none';
            break;
          default:
            card.style.display = 'block';
        }
      }
    });
  }

  // 绑定筛选按钮点击事件
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.onclick = function() {
        // 1. 切换按钮激活状态
        filterBtns.forEach(item => item.classList.remove('active'));
        this.classList.add('active');
      }
        // 2. 获取当前筛选类型
        const currentType = this.getAttribute('data-type');

        // 3. 执行筛选逻辑
        filterDrinks(currentType);
    });
  }

  // 初始化购物车
  cart.updateCart();

  // 添加提示框动画
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn{
      from{ transform: translateX(100%); opacity: 0; }
      to{ transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut{
      from{ transform: translateX(0); opacity: 1; }
      to{ transform: translateX(100%); opacity: 0; }
    }
    .navbar-wrap.scroll{
      background: #fff;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    body.dark-mode .navbar-wrap.scroll{
      background: #222;
    }
  `;
  document.head.appendChild(style);
});