document.addEventListener('DOMContentLoaded', function(){
	// 1. 常见问题折叠面板（单开模式，简化事件绑定）
	const faqItems = document.querySelectorAll('.faq-item');
	faqItems.forEach(item =>{
	  const question = item.querySelector('.faq-question');
	  if (!question) return; // 容错处理：避免不存在question元素报错
  
	  question.onclick = function(){
		// 关闭其他展开的问题
		faqItems.forEach(otherItem =>{
		  if (otherItem !== item){
			otherItem.classList.remove('active');
		  }
		});
		// 切换当前问题展开/折叠状态
		item.classList.toggle('active');
	  }
	});
  
	// 新增：默认展开第一个FAQ项（提升用户体验）
	if (faqItems.length > 0){
	  faqItems[0].classList.add('active');
	}
  
	// 2. 会员注册表单提交（优化多字段验证+手机号校验，提示更友好）
	const registerForm = document.getElementById('vipRegisterForm');
	if (registerForm){
	  registerForm.onsubmit = function(e){
		e.preventDefault();
  
		// 获取表单数据并去除首尾空格
		const name = document.getElementById('name').value.trim();
		const phone = document.getElementById('phone').value.trim();
		const email = document.getElementById('email').value.trim();
		const birthday = document.getElementById('birthday').value.trim();
  
		// 多字段完整性验证（新增：避免空值提交）
		let errorMsg = '';
		if (!name){
		  errorMsg = '请输入您的真实姓名！';
		} else if (!/^1[3-9]\d{9}$/.test(phone)){
		  errorMsg = '请输入有效的11位手机号码！';
		} else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
		  // 邮箱可选填，填了则验证格式
		  errorMsg = '请输入有效的邮箱地址（示例：xxx@xxx.com）！';
		} else if (!birthday){
		  errorMsg = '请选择您的出生日期！';
		}
  
		// 验证失败提示
		if (errorMsg){
		  alert(errorMsg);
		  return;
		}
  
		// 模拟注册成功（生成12位随机会员卡号，格式优化）
		const cardNum = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
		alert(`恭喜 ${name}！您已成功注册为熊猫咖啡铜牌会员。
  会员卡号：${cardNum}
  我们已向 ${phone} 发送了注册成功短信，请注意查收。`);
  
		// 重置表单
		this.reset();
	  }
	}
  
	// 3. 会员等级按钮点击（优化滚动体验+提示语，逻辑更简洁）
	const levelBtns = document.querySelectorAll('.level-btn');
	levelBtns.forEach(btn =>{
	  btn.onclick = function(){
		const levelCard = this.closest('.level-card');
		if (!levelCard) return; // 容错处理
  
		const levelName = levelCard.querySelector('h3')?.innerText || '';
		const price = levelCard.querySelector('.price')?.innerText || '';
  
		if (price === '免费'){
		  // 免费注册：平滑滚动到注册表单（兼容表单不存在的情况）
		  const form = document.getElementById('vipRegisterForm');
		  if (form){
			window.scrollTo({
			  top: form.offsetTop - 100,
			  behavior: 'smooth'
			});
			alert('请填写下方表单，完成铜牌会员免费注册！');
		  } else{
			alert('未找到注册表单，请刷新页面重试！');
		  }
		} else{s
		  // 付费开通：确认后提示开通成功
		  if (levelName && confirm(`确认开通${levelName}吗？\n费用：${price}`)){
			alert(`${levelName}开通成功！您现在可以享受该等级的所有会员权益～`);
		  }
		}
	  }
	});
  
	// 新增功能4：表单输入框焦点样式（提升交互体验）
	if (registerForm){
	  const formInputs = registerForm.querySelectorAll('input');
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
	}
  
	// 新增功能5：返回顶部按钮（优化长页面体验，如多FAQ+会员表单场景）
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
  });