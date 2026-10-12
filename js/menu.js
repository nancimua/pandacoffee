// 从本地存储读取购物车数据（跨页面共享）
let cartItems = JSON.parse(localStorage.getItem('pandaCoffeeCart')) || [];

// 页面DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function(){
  // 1. 主题切换（暗黑模式，优化图标同步+逻辑简化）
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return; // 不存在则直接返回，避免报错
  
  const body = document.body;
  const iconSun = themeToggle.querySelector('.icon-sun');
  const iconMoon = themeToggle.querySelector('.icon-moon');

  // 恢复上次主题状态
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  if (isDarkMode){
    body.classList.add('dark-mode');
    iconSun.style.display = 'none';
    iconMoon.style.display = 'block';
  }

  // 切换主题
  themeToggle.onclick = function(){
    const nowDark = body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', nowDark);
    // 同步图标显示
    iconSun.style.display = nowDark ? 'none' : 'block';
    iconMoon.style.display = nowDark ? 'block' : 'none';
  }

  // 2. 获取购物车相关DOM元素
  const cartBtn = document.getElementById('cartBtn');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartSidebar = document.getElementById('cart-sidebar');
  const closeCart = document.getElementById('closeCart');
  const cartItemsContainer = document.getElementById('cartItems');
  const totalPriceEl = document.getElementById('totalPrice');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const cartCount = document.querySelector('.cart-count');
  const toast = document.getElementById('toast');

  // 初始化购物车
  updateCartCount();
  updateCartUI();

  // 3. 打开购物车侧边栏
  if (cartBtn){
    cartBtn.onclick = function(){
      cartOverlay.classList.add('active');
      cartSidebar.classList.add('active');
      updateCartUI(); // 打开时刷新UI，确保数据最新
    }
  }

  // 4. 关闭购物车侧边栏
  function hideCart(){
    cartOverlay.classList.remove('active');
    cartSidebar.classList.remove('active');
  }

  if (closeCart) closeCart.onclick = hideCart;
  if (cartOverlay) cartOverlay.onclick = hideCart;

  // 5. 加入购物车（新增商品/数量+1，简化逻辑）
  const addCartBtns = document.querySelectorAll('.add-cart-btn');
  addCartBtns.forEach(btn =>{
    btn.onclick = function(){
      const name = this.dataset.name;
      const price = parseFloat(this.dataset.price);
      const img = this.dataset.img;

      // 查找商品是否已存在
      const goodsIndex = cartItems.findIndex(item => item.name === name);
      if (goodsIndex > -1){
        // 已存在，数量+1
        cartItems[goodsIndex].quantity += 1;
      } else{
        // 不存在，添加新商品
        cartItems.push({
          name: name,
          price: price,
          quantity: 1,
          img: img
        });
      }

      // 保存数据并更新UI
      saveCartToLocal();
      updateCartUI();
      updateCartCount();
      showToast(`已加入 ${name} 到购物车`);
    }
  });

  // 6. 更新购物车UI渲染+总价计算
  function updateCartUI(){
    // 计算总金额
    let totalPrice = 0;
    cartItems.forEach(item =>{
      totalPrice += item.price * item.quantity;
    });
    // 更新总价显示
    totalPriceEl.textContent = `¥${totalPrice.toFixed(2)}`;

    // 清空购物车容器
    cartItemsContainer.innerHTML = '';

    // 购物车为空时显示提示
    if (cartItems.length === 0){
      cartItemsContainer.innerHTML = '<p class="empty-cart">您的购物车是空的</p>';
      return;
    }

    // 渲染购物车商品列表
    cartItems.forEach((item, index) =>{
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <img src="${item.img}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">¥${item.price.toFixed(2)}</div>
          <div class="quantity-control">
            <button class="quantity-btn minus" data-index="${index}">-</button>
            <span>${item.quantity}</span>
            <button class="quantity-btn plus" data-index="${index}">+</button>
          </div>
          <button class="remove-item" data-index="${index}">删除</button>
        </div>
      `;
      cartItemsContainer.appendChild(cartItem);
    });

    // 绑定数量加减和删除事件
    bindQuantityEvents();
  }

  // 7. 更新购物车数量角标
  function updateCartCount(){
    let totalItems = 0;
    cartItems.forEach(item =>{
      totalItems += item.quantity;
    });
    cartCount.textContent = totalItems;
  }

  // 8. 购物车商品数量加减+删除（简化事件绑定）
  function bindQuantityEvents(){
    // 减少数量
    document.querySelectorAll('.quantity-btn.minus').forEach(btn =>{
      btn.onclick = function(){
        const index = parseInt(this.dataset.index);
        if (cartItems[index].quantity > 1){
          cartItems[index].quantity--;
        } else{
          // 数量为1时直接删除商品
          cartItems.splice(index, 1);
        }
        saveCartToLocal();
        updateCartUI();
        updateCartCount();
      }
    });

    // 增加数量
    document.querySelectorAll('.quantity-btn.plus').forEach(btn =>{
      btn.onclick = function(){
        const index = parseInt(this.dataset.index);
        cartItems[index].quantity++;
        saveCartToLocal();
        updateCartUI();
        updateCartCount();
      }
    });

    // 删除商品
    document.querySelectorAll('.remove-item').forEach(btn =>{
      btn.onclick = function(){
        const index = parseInt(this.dataset.index);
        cartItems.splice(index, 1);
        saveCartToLocal();
        updateCartUI();
        updateCartCount();
        showToast('商品已删除');
      }
    });
  }

  // 9. 购物车结算（优化提示逻辑）
  if (checkoutBtn){
    checkoutBtn.onclick = function(){
      if (cartItems.length === 0){
        showToast('购物车为空，无法结算！');
        return;
      }

      // 模拟结算成功
      showToast('结算成功！感谢您的购买～');
      // 清空购物车
      cartItems = [];
      saveCartToLocal();
      updateCartUI();
      updateCartCount();
      // 关闭购物车侧边栏
      hideCart();
    }
  }

  // 10. 全局提示框（Toast，简化定时器逻辑）
  function showToast(message){
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('active');
    // 2秒后自动隐藏
    setTimeout(() =>{
      toast.classList.remove('active');
    }, 2000);
  }

  // 新增：统一保存购物车到本地存储（避免重复代码）
  function saveCartToLocal(){
    localStorage.setItem('pandaCoffeeCart', JSON.stringify(cartItems));
  }

  // 新增：商品数量上限限制（防止恶意累加，实用优化）
  function checkQuantityLimit(index, max = 10){
    if (cartItems[index].quantity >= max){
      showToast(`商品最多只能购买${max}件哦`);
      return false;
    }
    return true;
  }
});