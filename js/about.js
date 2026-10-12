document.addEventListener('DOMContentLoaded', function(){
  // 1. 页脚订阅表单（优化验证提示，简化书写）
  const subscribeForm = document.getElementById('footerSubscribeForm');
  if (subscribeForm){
    subscribeForm.onsubmit = function(e){
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email){
        alert('请先输入邮箱地址！');
        emailInput.focus();
        return;
      }
      if (!emailRegex.test(email)){
        alert('邮箱格式不对哦，比如输入 xxx@xxx.com');
        emailInput.focus();
        return;
      }

      alert('订阅成功！最新咖啡优惠会第一时间推送给你～');
      emailInput.value = '';
    }
  }

  // 2. 品质承诺按钮（新增跳转可选，优化提示语）
  const promiseBtn = document.querySelector('.promise-btn');
  if (promiseBtn){
    promiseBtn.onclick = function(){
      alert('熊猫咖啡始终坚持：精选全球优质咖啡豆，现磨现做，严控每一道工序！');
    }
  }

  // 3. 购物车侧边栏开关（优化显示逻辑，新增禁止页面滚动）
  const cartBtn = document.getElementById('cartBtn');
  const closeCartBtn = document.querySelector('.close-cart');
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartOverlay = document.getElementById('cart-overlay');

  // 打开购物车
  if (cartBtn){
    cartBtn.onclick = function(){
      cartSidebar.style.transform = 'translateX(0)';
      cartOverlay.style.display = 'block';
      document.body.style.overflow = 'hidden'; // 新增：防止背景滚动
    }
  }

  // 关闭购物车（新增：遮罩层点击也可关闭）
  function closeCart(){
    cartSidebar.style.transform = 'translateX(100%)';
    cartOverlay.style.display = 'none';
    document.body.style.overflow = ''; // 恢复页面滚动
  }

  if (closeCartBtn) closeCartBtn.onclick = closeCart;
  if (cartOverlay) cartOverlay.onclick = closeCart; // 新增：遮罩点击关闭

  // 4. 暗黑模式切换（优化本地存储，记住用户偏好）
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle){
    // 新增：初始化暗黑模式（记住上次选择）
    const isDark = localStorage.getItem('aboutDarkMode') === 'true';
    const sunIcon = themeToggle.querySelector('.icon-sun');
    const moonIcon = themeToggle.querySelector('.icon-moon');
    if (isDark){
      document.body.classList.add('dark-theme');
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    }

    // 切换暗黑模式
    themeToggle.onclick = function(){
      const isDarkNow = document.body.classList.toggle('dark-theme');
      // 新增：保存用户偏好到本地
      localStorage.setItem('aboutDarkMode', isDarkNow);
      // 切换图标
      if (isDarkNow){
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      } else{
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      }
    }
  }

  // 新增功能5：咖啡师卡片悬停效果（提升页面交互）
  const baristaCards = document.querySelectorAll('.barista-card');
  baristaCards.forEach(card =>{
    card.onmouseenter = function(){
      this.style.transform = 'translateY(-8px)';
      this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
      this.style.transition = 'all 0.3s ease';
    }
    card.onmouseleave = function(){
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = 'none';
    }
  });

  // 新增功能6：页面平滑滚动（锚点跳转更流畅）
  document.querySelectorAll('a[href^="#"]').forEach(anchor =>{
    anchor.onclick = function(e){
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetEle = document.querySelector(targetId);
      if (targetEle){
        window.scrollTo({
          top: targetEle.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    }
  });

  // 新增功能7：关于我们板块滚动高亮（导航对应板块提示）
  const navLinks = document.querySelectorAll('.nav-links-wrap a');
  const sections = document.querySelectorAll('.about-section'); // 给页面板块添加该类名即可
  window.onscroll = function(){
    let currentSection = '';
    sections.forEach(section =>{
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop){
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link =>{
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSection){
        link.classList.add('active');
      }
    });
  }

  // 新增功能8：返回顶部按钮（优化长页面体验）
  const backToTopBtn = document.createElement('div');
  backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 40px;
    height: 40px;
    background: #ff8c00;
    color: #fff;
    text-align: center;
    line-height: 40px;
    border-radius: 50%;
    cursor: pointer;
    display: none;
    z-index: 999;
  `;
  backToTopBtn.innerText = '↑';
  document.body.appendChild(backToTopBtn);

  // 滚动显示/隐藏返回顶部按钮
  window.onscroll = function(){
    if (window.scrollY > 500){
      backToTopBtn.style.display = 'block';
    } else{
      backToTopBtn.style.display = 'none';
    }
  }

  // 点击返回顶部
  backToTopBtn.onclick = function(){
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
});