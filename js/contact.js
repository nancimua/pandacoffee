// 联系我们页面脚本
document.addEventListener('DOMContentLoaded', function(){
    // 1. 初始化购物车数量
    const cartCount = document.querySelector('.cart-count');
    if (cartCount && !cartCount.textContent){
      cartCount.textContent = '0';
    }
  
    // 2. 暗黑模式切换（优化初始化+本地存储记忆）
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle){
      const sunIcon = themeToggle.querySelector('.icon-sun');
      const moonIcon = themeToggle.querySelector('.icon-moon');
  
      // 初始化图标+主题（记住用户上次选择）
      const isDark = localStorage.getItem('contactDarkMode') === 'true';
      if (isDark){
        document.body.classList.add('dark-theme');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'inline-block';
      } else{
        sunIcon.style.display = 'inline-block';
        moonIcon.style.display = 'none';
      }
  
      // 切换主题
      themeToggle.onclick = function(){
        const isDarkNow = document.body.classList.toggle('dark-theme');
        localStorage.setItem('contactDarkMode', isDarkNow);
        if (isDarkNow){
          sunIcon.style.display = 'none';
          moonIcon.style.display = 'inline-block';
        } else{
          sunIcon.style.display = 'inline-block';
          moonIcon.style.display = 'none';
        }
      }
    }
  
    // 3. 购物车侧边栏交互（简化逻辑，合并元素获取）
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.querySelector('.close-cart');
  
    // 关闭购物车函数
    function closeCart(){
      cartSidebar.style.transform = 'translateX(100%)';
      cartOverlay.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  
    // 打开购物车
    if (cartBtn && cartSidebar && cartOverlay){
      cartBtn.onclick = function(){
        cartSidebar.style.transform = 'translateX(0)';
        cartOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
      }
    }
  
    // 绑定关闭事件
    if (closeCartBtn) closeCartBtn.onclick = closeCart;
    if (cartOverlay) cartOverlay.onclick = closeCart;
  
    // 4. FAQ折叠面板（简化事件绑定，去除冗余判断）
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item =>{
      const question = item.querySelector('.faq-question');
      const toggleBtn = item.querySelector('.faq-toggle');
  
      // 折叠/展开切换
      function toggleFaq(){
        item.classList.toggle('active');
      }
  
      if (question) question.onclick = toggleFaq;
      if (toggleBtn){
        toggleBtn.onclick = function(e){
          e.stopPropagation();
          toggleFaq();
        }
      }
    });
  
    // 5. 联系表单提交（优化验证提示，简化逻辑）
    const contactMessageForm = document.getElementById('contactMessageForm');
    if (contactMessageForm){
      contactMessageForm.onsubmit = function(e){
        e.preventDefault();
  
        // 获取表单数据
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const subject = document.getElementById('contactSubject').value;
        const message = document.getElementById('contactMessage').value.trim();
        const agree = document.getElementById('contactAgree').checked;
  
        // 表单验证
        let errorMsg = '';
        if (!name) errorMsg = '请输入您的姓名';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errorMsg = '请输入有效的电子邮箱地址';
        else if (!subject) errorMsg = '请选择消息主题';
        else if (!message) errorMsg = '请输入您的消息内容';
        else if (!agree) errorMsg = '请同意隐私政策以继续提交';
  
        // 验证失败提示
        if (errorMsg){
          alert(errorMsg);
          return;
        }
  
        // 模拟提交成功
        alert(`感谢您的反馈，${name}！\n我们已收到您的消息，将尽快通过邮箱 ${email} 与您联系。`);
        this.reset(); // 重置表单
      }
    }
  
    // 6. 页脚订阅表单（优化空值判断，提示更友好）
    const footerSubscribeForm = document.getElementById('footerSubscribeForm');
    if (footerSubscribeForm){
      footerSubscribeForm.onsubmit = function(e){
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
  
        // 先判断空值，再验证格式
        if (!email){
          alert('请先输入邮箱地址！');
          emailInput.focus();
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
          alert('邮箱格式不正确哦，示例：xxx@xxx.com');
          emailInput.focus();
          return;
        }
  
        // 模拟订阅成功
        alert('订阅成功！我们会定期向您发送最新优惠和活动信息。');
        emailInput.value = '';
      }
    }
  
    // 7. 更多问题按钮（优化滚动体验，提示更自然）
    const moreQuestionBtn = document.querySelector('.more-question-btn');
    if (moreQuestionBtn){
      moreQuestionBtn.onclick = function(){
        // 平滑滚动到联系表单
        const form = document.getElementById('contactMessageForm');
        form.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        // 友好提示
        alert('您可以通过上方表单提交问题，我们会在1-2个工作日内回复您！');
      }
    }
  
    // 8. 修复导航栏"联系我们"链接路径
    const contactLink = document.querySelector('.nav-links-wrap a[href=".html"]');
    if (contactLink){
      contactLink.href = 'contact.html';
    }
  
    // 新增功能9：表单输入框焦点样式（提升交互体验）
    const formInputs = contactMessageForm ? contactMessageForm.querySelectorAll('input, select, textarea') : [];
    formInputs.forEach(input =>{
      input.onfocus = function(){
        this.style.borderColor = '#ff8c00';
        this.style.boxShadow = '0 0 5px rgba(255,140,0,0.2)';
        this.style.transition = 'all 0.2s ease';
      }
      input.onblur = function(){
        this.style.borderColor = '';
        this.style.boxShadow = '';
      }
    });
  
    // 新增功能10：返回顶部按钮（优化长页面使用体验）
    const backToTop = document.createElement('div');
    backToTop.style.cssText = `
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
      font-weight: bold;
    `;
    backToTop.innerText = '↑';
    document.body.appendChild(backToTop);
  
    // 滚动显示/隐藏返回顶部
    window.onscroll = function(){
      backToTop.style.display = window.scrollY > 500 ? 'block' : 'none';
    }
  
    // 点击返回顶部（平滑滚动）
    backToTop.onclick = function(){
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  
    // 新增功能11：FAQ默认展开第一个（提升用户体验）
    if (faqItems.length > 0){
      faqItems[0].classList.add('active');
    }
  });