// Funcionalidades avançadas para o Loberiam Shop

// Carrinho de Compras
document.addEventListener('DOMContentLoaded', function() {
  // Elementos do carrinho
  const cartButtons = document.querySelectorAll('.btn-add-carrinho');
  const cartIcon = document.querySelector('.cart-icon');
  const cartOverlay = document.querySelector('.cart-overlay');
  const cartSidebar = document.querySelector('.cart-sidebar');
  const closeCartBtn = document.querySelector('.close-cart');
  const cartItemsContainer = document.querySelector('.cart-items');
  const cartCount = document.querySelector('.cart-count');
  const subtotalElement = document.querySelector('.subtotal-value');
  
  // Estado do carrinho
  let cart = [];
  
  // Inicializar carrinho do localStorage se existir
  function initCart() {
    const savedCart = localStorage.getItem('loberiam_cart');
    if (savedCart) {
      cart = JSON.parse(savedCart);
      updateCartUI();
    }
  }
  
  // Adicionar evento aos botões de adicionar ao carrinho
  if (cartButtons) {
    cartButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Obter informações do produto
        const productCard = this.closest('.product-card') || this.closest('.produto-info-compra');
        if (!productCard) return;
        
        let productName, productPrice, productImage;
        
        if (this.closest('.produto-info-compra')) {
          // Página de produto detalhado
          productName = document.querySelector('.produto-info-compra h1').textContent;
          productPrice = document.querySelector('.preco-atual').textContent.replace('R$ ', '').split(' ')[0];
          productImage = document.getElementById('imagemPrincipalProduto').src;
        } else {
          // Card de produto na listagem
          productName = productCard.querySelector('.product-name').textContent;
          productPrice = productCard.querySelector('.product-price').textContent.replace('R$ ', '').split(' ')[0];
          productImage = productCard.querySelector('.product-image').src;
        }
        
        // Adicionar ao carrinho
        addToCart(productName, parseFloat(productPrice.replace(',', '.')), productImage);
        
        // Mostrar notificação
        showNotification('Produto adicionado ao carrinho!', 'success');
        
        // Abrir carrinho
        openCart();
      });
    });
  }
  
  // Abrir carrinho ao clicar no ícone
  if (cartIcon) {
    cartIcon.addEventListener('click', function(e) {
      e.preventDefault();
      openCart();
    });
  }
  
  // Fechar carrinho
  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', closeCart);
  }
  
  // Fechar carrinho ao clicar fora
  if (cartOverlay) {
    cartOverlay.addEventListener('click', function(e) {
      if (e.target === cartOverlay) {
        closeCart();
      }
    });
  }
  
  // Adicionar produto ao carrinho
  function addToCart(name, price, image) {
    // Verificar se o produto já está no carrinho
    const existingItemIndex = cart.findIndex(item => item.name === name);
    
    if (existingItemIndex > -1) {
      // Incrementar quantidade
      cart[existingItemIndex].quantity += 1;
    } else {
      // Adicionar novo item
      cart.push({
        name: name,
        price: price,
        image: image,
        quantity: 1
      });
    }
    
    // Salvar no localStorage
    saveCart();
    
    // Atualizar UI
    updateCartUI();
  }
  
  // Remover produto do carrinho
  function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
    showNotification('Produto removido do carrinho', 'info');
  }
  
  // Atualizar quantidade de produto
  function updateQuantity(index, newQuantity) {
    if (newQuantity < 1) return;
    
    cart[index].quantity = newQuantity;
    saveCart();
    updateCartUI();
  }
  
  // Salvar carrinho no localStorage
  function saveCart() {
    localStorage.setItem('loberiam_cart', JSON.stringify(cart));
  }
  
  // Atualizar UI do carrinho
  function updateCartUI() {
    // Atualizar contador
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCount) {
      cartCount.textContent = totalItems;
    }
    
    // Atualizar lista de itens
    if (cartItemsContainer) {
      if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
          <div class="cart-empty">
            <i class="fas fa-shopping-cart"></i>
            <p>Seu carrinho está vazio</p>
            <p>Adicione produtos para continuar comprando</p>
          </div>
        `;
      } else {
        cartItemsContainer.innerHTML = cart.map((item, index) => `
          <div class="cart-item">
            <div class="cart-item-image">
              <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
              <h4 class="cart-item-name">${item.name}</h4>
              <p class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</p>
              <div class="cart-item-controls">
                <div class="quantity-control">
                  <button class="quantity-btn minus" data-index="${index}">-</button>
                  <input type="text" class="quantity-input" value="${item.quantity}" data-index="${index}" readonly>
                  <button class="quantity-btn plus" data-index="${index}">+</button>
                </div>
                <button class="remove-item" data-index="${index}">Remover</button>
              </div>
            </div>
          </div>
        `).join('');
        
        // Adicionar eventos aos botões
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
          btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            updateQuantity(index, cart[index].quantity - 1);
          });
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
          btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            updateQuantity(index, cart[index].quantity + 1);
          });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
          btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            removeFromCart(index);
          });
        });
      }
    }
    
    // Atualizar subtotal
    if (subtotalElement) {
      const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      subtotalElement.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    }
  }
  
  // Abrir carrinho
  function openCart() {
    if (cartOverlay) cartOverlay.style.display = 'block';
    if (cartSidebar) cartSidebar.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  // Fechar carrinho
  function closeCart() {
    if (cartOverlay) cartOverlay.style.display = 'none';
    if (cartSidebar) cartSidebar.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  // Inicializar carrinho
  initCart();
  
  // Botão de finalizar compra
  const checkoutBtn = document.querySelector('.checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      if (cart.length === 0) {
        showNotification('Adicione produtos ao carrinho para continuar', 'error');
        return;
      }
      
      showNotification('Funcionalidade de checkout em desenvolvimento', 'info');
      // Aqui seria redirecionado para a página de checkout
    });
  }
  
  // Botão de continuar comprando
  const continueShoppingBtn = document.querySelector('.continue-shopping');
  if (continueShoppingBtn) {
    continueShoppingBtn.addEventListener('click', closeCart);
  }
});

// Login/Registro
document.addEventListener('DOMContentLoaded', function() {
  // Elementos de autenticação
  const loginLinks = document.querySelectorAll('a[href="conta.html"]');
  const authModal = document.querySelector('.auth-modal');
  const authTabs = document.querySelectorAll('.auth-tab');
  const authForms = document.querySelectorAll('.auth-form');
  const closeAuthBtn = document.querySelector('.close-auth');
  const loginForm = document.querySelector('#login-form');
  const registerForm = document.querySelector('#register-form');
  
  // Abrir modal de autenticação
  if (loginLinks) {
    loginLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        if (authModal) {
          authModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });
  }
  
  // Fechar modal de autenticação
  if (closeAuthBtn) {
    closeAuthBtn.addEventListener('click', function() {
      if (authModal) {
        authModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
  
  // Fechar modal ao clicar fora
  if (authModal) {
    authModal.addEventListener('click', function(e) {
      if (e.target === authModal) {
        authModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
  
  // Alternar entre abas
  if (authTabs) {
    authTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // Remover classe active de todas as abas
        authTabs.forEach(t => t.classList.remove('active'));
        // Adicionar classe active à aba clicada
        this.classList.add('active');
        
        // Mostrar formulário correspondente
        const target = this.dataset.target;
        authForms.forEach(form => {
          form.classList.remove('active');
          if (form.id === target) {
            form.classList.add('active');
          }
        });
      });
    });
  }
  
  // Processar formulário de login
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = this.querySelector('input[type="email"]').value;
      const password = this.querySelector('input[type="password"]').value;
      
      // Validação simples
      if (!email || !password) {
        showNotification('Preencha todos os campos', 'error');
        return;
      }
      
      // Simulação de login
      showNotification('Login realizado com sucesso!', 'success');
      
      // Fechar modal
      if (authModal) {
        authModal.classList.remove('active');
        document.body.style.overflow = '';
      }
      
      // Atualizar UI para usuário logado
      updateLoggedInUI(email);
    });
  }
  
  // Processar formulário de registro
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = this.querySelector('input[name="name"]').value;
      const email = this.querySelector('input[type="email"]').value;
      const password = this.querySelector('input[name="password"]').value;
      const confirmPassword = this.querySelector('input[name="confirm_password"]').value;
      
      // Validação simples
      if (!name || !email || !password || !confirmPassword) {
        showNotification('Preencha todos os campos', 'error');
        return;
      }
      
      if (password !== confirmPassword) {
        showNotification('As senhas não coincidem', 'error');
        return;
      }
      
      // Simulação de registro
      showNotification('Conta criada com sucesso!', 'success');
      
      // Fechar modal
      if (authModal) {
        authModal.classList.remove('active');
        document.body.style.overflow = '';
      }
      
      // Atualizar UI para usuário logado
      updateLoggedInUI(name);
    });
  }
  
  // Atualizar UI para usuário logado
  function updateLoggedInUI(name) {
    const accountLinks = document.querySelectorAll('a[href="conta.html"]');
    if (accountLinks) {
      accountLinks.forEach(link => {
        const iconSpan = link.querySelector('i');
        const textSpan = link.querySelector('span');
        
        if (textSpan) {
          textSpan.textContent = name.split(' ')[0];
        }
      });
    }
  }
});

// Galeria de Imagens na Página de Produto
document.addEventListener('DOMContentLoaded', function() {
  const productImage = document.getElementById('imagemPrincipalProduto');
  const thumbnails = document.querySelectorAll('.thumbnail');
  
  if (productImage && thumbnails.length > 0) {
    // Galeria de imagens
    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', function() {
        // Remover classe active de todos os thumbnails
        thumbnails.forEach(t => t.classList.remove('active'));
        // Adicionar classe active ao thumbnail clicado
        this.classList.add('active');
        
        // Atualizar imagem principal
        const newSrc = this.getAttribute('onclick').match(/'([^']+)'/)[1];
        productImage.src = newSrc;
      });
    });
    
    // Modal de galeria
    productImage.addEventListener('click', function() {
      openGalleryModal(this.src, thumbnails);
    });
  }
  
  function openGalleryModal(currentSrc, thumbnails) {
    // Criar modal se não existir
    let galleryModal = document.querySelector('.image-gallery-modal');
    
    if (!galleryModal) {
      galleryModal = document.createElement('div');
      galleryModal.className = 'image-gallery-modal';
      
      const galleryHTML = `
        <div class="gallery-container">
          <div class="gallery-image">
            <img src="${currentSrc}" alt="Imagem ampliada">
          </div>
          <button class="gallery-control gallery-prev"><i class="fas fa-chevron-left"></i></button>
          <button class="gallery-control gallery-next"><i class="fas fa-chevron-right"></i></button>
          <button class="close-gallery"><i class="fas fa-times"></i></button>
          <div class="gallery-thumbnails"></div>
        </div>
      `;
      
      galleryModal.innerHTML = galleryHTML;
      document.body.appendChild(galleryModal);
      
      // Adicionar thumbnails
      const galleryThumbnails = galleryModal.querySelector('.gallery-thumbnails');
      thumbnails.forEach((thumb, index) => {
        const thumbSrc = thumb.getAttribute('onclick').match(/'([^']+)'/)[1];
        const thumbImg = document.createElement('div');
        thumbImg.className = 'gallery-thumbnail';
        if (thumbSrc === currentSrc) {
          thumbImg.classList.add('active');
        }
        thumbImg.innerHTML = `<img src="${thumbSrc}" alt="Thumbnail ${index + 1}">`;
        thumbImg.dataset.src = thumbSrc;
        galleryThumbnails.appendChild(thumbImg);
      });
      
      // Eventos dos thumbnails
      galleryModal.querySelectorAll('.gallery-thumbnail').forEach(thumb => {
        thumb.addEventListener('click', function() {
          galleryModal.querySelectorAll('.gallery-thumbnail').forEach(t => t.classList.remove('active'));
          this.classList.add('active');
          galleryModal.querySelector('.gallery-image img').src = this.dataset.src;
        });
      });
      
      // Evento de navegação
      const prevBtn = galleryModal.querySelector('.gallery-prev');
      const nextBtn = galleryModal.querySelector('.gallery-next');
      
      prevBtn.addEventListener('click', function() {
        navigateGallery(-1);
      });
      
      nextBtn.addEventListener('click', function() {
        navigateGallery(1);
      });
      
      // Evento de fechar
      const closeBtn = galleryModal.querySelector('.close-gallery');
      closeBtn.addEventListener('click', function() {
        galleryModal.classList.remove('active');
        document.body.style.overflow = '';
      });
      
      // Fechar ao clicar fora
      galleryModal.addEventListener('click', function(e) {
        if (e.target === galleryModal) {
          galleryModal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
      
      // Navegação por teclado
      document.addEventListener('keydown', function(e) {
        if (!galleryModal.classList.contains('active')) return;
        
        if (e.key === 'ArrowLeft') {
          navigateGallery(-1);
        } else if (e.key === 'ArrowRight') {
          navigateGallery(1);
        } else if (e.key === 'Escape') {
          galleryModal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
      
      function navigateGallery(direction) {
        const thumbnails = galleryModal.querySelectorAll('.gallery-thumbnail');
        const activeThumb = galleryModal.querySelector('.gallery-thumbnail.active');
        let currentIndex = Array.from(thumbnails).indexOf(activeThumb);
        
        currentIndex += direction;
        
        if (currentIndex < 0) {
          currentIndex = thumbnails.length - 1;
        } else if (currentIndex >= thumbnails.length) {
          currentIndex = 0;
        }
        
        thumbnails.forEach(t => t.classList.remove('active'));
        thumbnails[currentIndex].classList.add('active');
        galleryModal.querySelector('.gallery-image img').src = thumbnails[currentIndex].dataset.src;
      }
    }
    
    // Mostrar modal
    galleryModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
});

// Notificações
function showNotification(message, type = 'info') {
  // Remover notificação existente
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Criar nova notificação
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  let icon;
  switch (type) {
    case 'success':
      icon = 'fas fa-check-circle';
      break;
    case 'error':
      icon = 'fas fa-exclamation-circle';
      break;
    default:
      icon = 'fas fa-info-circle';
  }
  
  notification.innerHTML = `
    <i class="${icon}"></i>
    <span class="notification-message">${message}</span>
    <button class="close-notification"><i class="fas fa-times"></i></button>
  `;
  
  document.body.appendChild(notification);
  
  // Mostrar notificação
  setTimeout(() => {
    notification.classList.add('active');
  }, 10);
  
  // Fechar notificação
  const closeBtn = notification.querySelector('.close-notification');
  closeBtn.addEventListener('click', function() {
    notification.classList.remove('active');
    setTimeout(() => {
      notification.remove();
    }, 300);
  });
  
  // Auto-fechar após 5 segundos
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.classList.remove('active');
      setTimeout(() => {
        if (document.body.contains(notification)) {
          notification.remove();
        }
      }, 300);
    }
  }, 5000);
}

// Accordion para FAQ
document.addEventListener('DOMContentLoaded', function() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  
  if (accordionItems) {
    accordionItems.forEach(item => {
      const header = item.querySelector('.accordion-header');
      if (header) {
        header.addEventListener('click', function() {
          const currentlyActive = document.querySelector('.accordion-item.active');
          if (currentlyActive && currentlyActive !== item) {
            currentlyActive.classList.remove('active');
            const content = currentlyActive.querySelector('.accordion-content');
            content.style.maxHeight = '0px';
          }
          
          item.classList.toggle('active');
          const content = item.querySelector('.accordion-content');
          
          if (item.classList.contains('active')) {
            content.style.maxHeight = content.scrollHeight + 'px';
          } else {
            content.style.maxHeight = '0px';
          }
        });
      }
    });
  }
});

// Tabs para Políticas
document.addEventListener('DOMContentLoaded', function() {
  const politicaTabs = document.querySelectorAll('.politica-tab');
  const politicaContents = document.querySelectorAll('.politica-content');
  
  if (politicaTabs && politicaContents) {
    politicaTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // Remover classe active de todas as abas
        politicaTabs.forEach(t => t.classList.remove('active'));
        // Adicionar classe active à aba clicada
        this.classList.add('active');
        
        // Mostrar conteúdo correspondente
        const target = this.dataset.target;
        politicaContents.forEach(content => {
          content.classList.remove('active');
          if (content.id === target) {
            content.classList.add('active');
          }
        });
      });
    });
  }
});

// Carrossel
document.addEventListener('DOMContentLoaded', function() {
  const carousel = document.querySelector('.carousel');
  
  if (carousel) {
    const slides = carousel.querySelectorAll('.slide');
    const prevBtn = carousel.querySelector('.prev');
    const nextBtn = carousel.querySelector('.next');
    const indicators = carousel.querySelector('.carousel-indicators');
    
    let currentSlide = 0;
    const slideCount = slides.length;
    
    // Criar indicadores
    if (indicators) {
      for (let i = 0; i < slideCount; i++) {
        const indicator = document.createElement('button');
        indicator.className = 'indicator';
        if (i === 0) {
          indicator.classList.add('active');
        }
        indicator.addEventListener('click', function() {
          goToSlide(i);
        });
        indicators.appendChild(indicator);
      }
    }
    
    // Função para ir para um slide específico
    function goToSlide(n) {
      slides[currentSlide].classList.remove('active');
      if (indicators) {
        indicators.children[currentSlide].classList.remove('active');
      }
      
      currentSlide = (n + slideCount) % slideCount;
      
      slides[currentSlide].classList.add('active');
      if (indicators) {
        indicators.children[currentSlide].classList.add('active');
      }
    }
    
    // Eventos dos botões
    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        goToSlide(currentSlide - 1);
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        goToSlide(currentSlide + 1);
      });
    }
    
    // Auto-play
    let slideInterval = setInterval(function() {
      goToSlide(currentSlide + 1);
    }, 5000);
    
    // Pausar auto-play ao passar o mouse
    carousel.addEventListener('mouseenter', function() {
      clearInterval(slideInterval);
    });
    
    carousel.addEventListener('mouseleave', function() {
      slideInterval = setInterval(function() {
        goToSlide(currentSlide + 1);
      }, 5000);
    });
  }
});

// Contagem regressiva
document.addEventListener('DOMContentLoaded', function() {
  const countdownTimer = document.querySelector('.countdown-timer');
  
  if (countdownTimer) {
    const daysEl = countdownTimer.querySelector('.countdown-item:nth-child(1) .countdown-value');
    const hoursEl = countdownTimer.querySelector('.countdown-item:nth-child(2) .countdown-value');
    const minsEl = countdownTimer.querySelector('.countdown-item:nth-child(3) .countdown-value');
    const secsEl = countdownTimer.querySelector('.countdown-item:nth-child(4) .countdown-value');
    
    // Data final (1 dia a partir de agora)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);
    
    function updateCountdown() {
      const now = new Date();
      const diff = endDate - now;
      
      if (diff <= 0) {
        // Tempo esgotado
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minsEl.textContent = '00';
        secsEl.textContent = '00';
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      
      daysEl.textContent = days < 10 ? `0${days}` : days;
      hoursEl.textContent = hours < 10 ? `0${hours}` : hours;
      minsEl.textContent = mins < 10 ? `0${mins}` : mins;
      secsEl.textContent = secs < 10 ? `0${secs}` : secs;
    }
    
    // Atualizar a cada segundo
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
});

// Responsividade do Menu
document.addEventListener('DOMContentLoaded', function() {
  const dropdownToggles = document.querySelectorAll('.dropdown > a');
  
  if (dropdownToggles) {
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', function(e) {
        if (window.innerWidth < 769) {
          e.preventDefault();
          const parentLi = this.parentElement;
          parentLi.classList.toggle('open');
        }
      });
    });
  }
  
  // Adicionar botão de menu mobile
  const navFlex = document.querySelector('.nav-flex');
  if (navFlex && window.innerWidth < 769 && !document.querySelector('.mobile-menu-toggle')) {
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    navFlex.prepend(mobileMenuToggle);
    
    mobileMenuToggle.addEventListener('click', function() {
      const navLinks = document.querySelector('.nav-links');
      navLinks.classList.toggle('active');
      this.innerHTML = navLinks.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
  }
});

// Inicializar todos os componentes
document.addEventListener('DOMContentLoaded', function() {
  // Adicionar estruturas HTML necessárias se não existirem
  
  // Carrinho
  if (!document.querySelector('.cart-overlay')) {
    const cartHTML = `
      <div class="cart-overlay">
        <div class="cart-sidebar">
          <div class="cart-header">
            <h3>Seu Carrinho</h3>
            <button class="close-cart"><i class="fas fa-times"></i></button>
          </div>
          <div class="cart-items">
            <div class="cart-empty">
              <i class="fas fa-shopping-cart"></i>
              <p>Seu carrinho está vazio</p>
              <p>Adicione produtos para continuar comprando</p>
            </div>
          </div>
          <div class="cart-footer">
            <div class="cart-subtotal">
              <span>Subtotal:</span>
              <span class="subtotal-value">R$ 0,00</span>
            </div>
            <div class="cart-actions">
              <button class="btn btn-primary checkout-btn">Finalizar Compra</button>
              <button class="btn btn-outline continue-shopping">Continuar Comprando</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', cartHTML);
  }
  
  // Modal de autenticação
  if (!document.querySelector('.auth-modal')) {
    const authHTML = `
      <div class="auth-modal">
        <div class="auth-container">
          <button class="close-auth"><i class="fas fa-times"></i></button>
          <div class="auth-tabs">
            <button class="auth-tab active" data-target="login-form">Login</button>
            <button class="auth-tab" data-target="register-form">Cadastro</button>
          </div>
          <div class="auth-content">
            <form id="login-form" class="auth-form active">
              <h3>Entrar na sua conta</h3>
              <div class="form-group">
                <label for="login-email">E-mail</label>
                <input type="email" id="login-email" required>
              </div>
              <div class="form-group">
                <label for="login-password">Senha</label>
                <input type="password" id="login-password" required>
              </div>
              <div class="form-options">
                <label class="remember-me">
                  <input type="checkbox"> Lembrar-me
                </label>
                <a href="#" class="forgot-password">Esqueceu a senha?</a>
              </div>
              <button type="submit" class="btn btn-primary auth-btn">Entrar</button>
              <div class="social-login">
                <p>Ou entre com</p>
                <div class="social-login-buttons">
                  <button type="button" class="social-btn"><i class="fab fa-google"></i></button>
                  <button type="button" class="social-btn"><i class="fab fa-facebook-f"></i></button>
                  <button type="button" class="social-btn"><i class="fab fa-apple"></i></button>
                </div>
              </div>
            </form>
            <form id="register-form" class="auth-form">
              <h3>Criar uma conta</h3>
              <div class="form-group">
                <label for="register-name">Nome completo</label>
                <input type="text" id="register-name" name="name" required>
              </div>
              <div class="form-group">
                <label for="register-email">E-mail</label>
                <input type="email" id="register-email" required>
              </div>
              <div class="form-group">
                <label for="register-password">Senha</label>
                <input type="password" id="register-password" name="password" required>
              </div>
              <div class="form-group">
                <label for="register-confirm-password">Confirmar senha</label>
                <input type="password" id="register-confirm-password" name="confirm_password" required>
              </div>
              <button type="submit" class="btn btn-primary auth-btn">Cadastrar</button>
              <div class="social-login">
                <p>Ou cadastre-se com</p>
                <div class="social-login-buttons">
                  <button type="button" class="social-btn"><i class="fab fa-google"></i></button>
                  <button type="button" class="social-btn"><i class="fab fa-facebook-f"></i></button>
                  <button type="button" class="social-btn"><i class="fab fa-apple"></i></button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', authHTML);
  }
});
