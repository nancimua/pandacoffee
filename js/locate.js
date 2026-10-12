document.addEventListener('DOMContentLoaded', function(){
	// 1. 门店操作按钮点击事件（简化判断，提示更自然）
	const actionBtns = document.querySelectorAll('.action-btn');
	actionBtns.forEach(btn =>{
	  btn.onclick = function(){
		let btnType = '';
		if (this.classList.contains('call-btn')){
		  btnType = '打电话';
		} else if (this.classList.contains('nav-btn')){
		  btnType = '熊猫地图导航';
		} else{
		  btnType = '在地图上看';
		}
		const storeName = this.closest('.store-info').querySelector('h3').innerText;
		alert(`【${storeName}】的${btnType}功能正在开发中，敬请期待！`);
	  }
	});
  
	// 2. 暗黑模式适配（优化图标同步，逻辑更简洁）
	const themeToggle = document.getElementById('themeToggle');
	if (themeToggle){
	  // 初始化主题
	  const isDark = localStorage.getItem('storeDarkMode') === 'true';
	  if (isDark){
		document.body.classList.add('dark-mode');
	  }
  
	  // 切换主题并保存偏好
	  themeToggle.onclick = function(){
		const isDarkNow = document.body.classList.toggle('dark-mode');
		localStorage.setItem('storeDarkMode', isDarkNow);
		
		// 可选：如果有太阳/月亮图标，可在此添加切换逻辑
		const sunIcon = this.querySelector('.icon-sun');
		const moonIcon = this.querySelector('.icon-moon');
		if (sunIcon && moonIcon){
		  sunIcon.style.display = isDarkNow ? 'none' : 'block';
		  moonIcon.style.display = isDarkNow ? 'block' : 'none';
		}
	  }
	}
  
	// 3. 购物车按钮点击事件（简化逻辑，合并绑定）
	const cartBtn = document.querySelector('.cart-btn');
	const cartSidebar = document.getElementById('cart-sidebar');
	const cartOverlay = document.getElementById('cart-overlay');
	const closeCart = document.querySelector('.close-cart');
  
	// 关闭购物车函数
	function closeCartSidebar(){
	  cartSidebar.classList.remove('open');
	  cartOverlay.classList.remove('active');
	  document.body.style.overflow = '';
	}
  
	// 打开购物车
	if (cartBtn && cartSidebar && cartOverlay && closeCart){
	  cartBtn.onclick = function(){
		cartSidebar.classList.add('open');
		cartOverlay.classList.add('active');
		document.body.style.overflow = 'hidden';
	  }
  
	  // 绑定关闭事件
	  closeCart.onclick = closeCartSidebar;
	  cartOverlay.onclick = closeCartSidebar;
	}
  
	// 4. 订阅表单提交事件（优化邮箱验证，提示更友好）
	const footerSubscribeForm = document.getElementById('footerSubscribeForm');
	if (footerSubscribeForm){
	  footerSubscribeForm.onsubmit = function(e){
		e.preventDefault();
		const emailInput = this.querySelector('input[type="email"]');
		const email = emailInput.value.trim();
  
		// 先判断空值，再验证格式
		if (!email){
		  alert('请先输入您的邮箱地址！');
		  emailInput.focus();
		  return;
		}
  
		// 简单邮箱格式验证
		const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailReg.test(email)){
		  alert('邮箱格式不对哦，示例：xxx@xxx.com');
		  emailInput.focus();
		  return;
		}
  
		alert(`感谢您的订阅！我们将向 ${email} 发送最新的咖啡资讯和门店活动。`);
		emailInput.value = '';
	  }
	}
  
	// 新增功能5：门店卡片悬停效果（提升交互体验）
	const storeCards = document.querySelectorAll('.store-info');
	storeCards.forEach(card =>{
	  card.onmouseenter = function(){
		this.style.transform = 'translateY(-5px)';
		this.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
		this.style.transition = 'all 0.3s ease';
	  }
	  card.onmouseleave = function(){
		this.style.transform = 'translateY(0)';
		this.style.boxShadow = 'none';
	  }
	});
  
	// 新增功能6：返回顶部按钮（优化长页面体验）
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
  
	// 点击平滑返回顶部
	backToTop.onclick = function(){
	  window.scrollTo({
		top: 0,
		behavior: 'smooth'
	  });
	}
  
	// 新增功能7：门店筛选（按区域快速定位，实用扩展）
	const filterBtns = document.querySelectorAll('.store-filter-btn'); // 可在HTML添加该类名
	const storeLists = document.querySelectorAll('.store-info');
	if (filterBtns.length > 0){
	  filterBtns.forEach(btn =>{
		btn.onclick = function(){
		  // 移除所有按钮激活状态
		  filterBtns.forEach(b => b.classList.remove('active'));
		  this.classList.add('active');
		  
		  const targetArea = this.dataset.area; // HTML添加data-area="XX区域"
		  storeLists.forEach(store =>{
			// 门店卡片添加data-store-area="XX区域" 即可实现筛选
			const storeArea = store.dataset.storeArea;
			if (targetArea === 'all' || storeArea === targetArea){
			  store.style.display = 'block';
			} else{
			  store.style.display = 'none';
			}
		  });
		}
	  });
	}
  });