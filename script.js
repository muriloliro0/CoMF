const products = [
    {
        id: 1,
        name: "Camiseta Oversized Branca CoMF",
        category: "tshirt",
        price: 149.90,
        tag: "Lançamento",
        image: "lucca2.jpeg"
    },
   {
        id: 2,
        name: "Camiseta Oversized Preta CoMF",
        category: "tshirt",
        price: 149.90,
        tag: "Novo",
        image: "yudi.jpeg"
    },
    {
        id: 3,
        name: "Calça Jogger Graphic Black",
        category: "pants",
        price: 289.90,
        tag: "Tendência",
        image: "calca.jpeg"
    },
      {
        id: 4,
        name: "Jaqueta de Couro CoMF",
        category: "hoodie",
        price: 349.90,
        tag: "Destaque",
        image: "lucca1.jpeg"
    }
];

let cart = [];
let favorites = [];

// Elementos do DOM
const productsGrid = document.getElementById("products-grid");
const filterBtns = document.querySelectorAll(".filter-btn");

const cartBtn = document.getElementById("cart-btn");
const closeCartBtn = document.getElementById("close-cart");
const cartSidebar = document.getElementById("cart-sidebar");

const favBtn = document.getElementById("fav-btn");
const closeFavBtn = document.getElementById("close-fav");
const favSidebar = document.getElementById("fav-sidebar");

const cartOverlay = document.getElementById("cart-overlay");
const cartItemsContainer = document.getElementById("cart-items");
const favItemsContainer = document.getElementById("fav-items");

const cartTotalElement = document.getElementById("cart-total-price");
const cartCountElement = document.getElementById("cart-count");
const favCountElement = document.getElementById("fav-count");

const track = document.getElementById('slider-track');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const dotsContainer = document.getElementById('slider-dots');

let currentSlide = 0;
let slideInterval;

// Renderizar Slides da Vitrine Dinamicamente
function renderHeroSlider() {
    track.innerHTML = "";
    dotsContainer.innerHTML = "";

    // Pega os produtos atuais para a vitrine
    const heroProducts = products.slice(0, 4);

    heroProducts.forEach((product, index) => {
        // Criar Slide
        const slide = document.createElement("div");
        slide.className = "slide";
        slide.onclick = () => scrollToProduct(product.id);
        slide.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="slide-overlay">
                <span class="slide-tag">${product.tag}</span>
                <h3>${product.name}</h3>
                <p>R$ ${product.price.toFixed(2).replace('.', ',')} — Ver Peça &rarr;</p>
            </div>
        `;
        track.appendChild(slide);

        // Criar Dot (Indicador)
        const dot = document.createElement('div');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            goToSlide(index);
            resetAutoSlide();
        });
        dotsContainer.appendChild(dot);
    });
}

// Renderizar Produtos na Grade do Catálogo
function renderProducts(filter = "all") {
    productsGrid.innerHTML = "";
    
    const filteredProducts = filter === "all" 
        ? products 
        : products.filter(p => p.category === filter);

    filteredProducts.forEach(product => {
        const isFav = favorites.some(f => f.id === product.id);
        const card = document.createElement("div");
        card.className = "product-card";
        card.id = `product-${product.id}`;
        card.innerHTML = `
            <div class="product-card-header">
                <img src="${product.image}" alt="${product.name}" class="product-img">
                <button class="btn-fav ${isFav ? 'active' : ''}" onclick="toggleFavorite(${product.id})" title="Favoritar">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
                <button class="btn-add" onclick="addToCart(${product.id})">Adicionar ao Carrinho</button>
            </div>
        `;
        productsGrid.appendChild(card);
    });
}

// Rolar para o produto correspondente
function scrollToProduct(productId) {
    filterBtns.forEach(b => b.classList.remove("active"));
    document.querySelector('.filter-btn[data-category="all"]').classList.add("active");
    renderProducts("all");

    const element = document.getElementById(`product-${productId}`);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('highlight');
        setTimeout(() => {
            element.classList.remove('highlight');
        }, 2000);
    }
}

// Controle do Carrossel
function updateSlider() {
    const dots = document.querySelectorAll('.dot');
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function goToSlide(index) {
    const slidesCount = document.querySelectorAll('.slide').length;
    currentSlide = index;
    if (currentSlide >= slidesCount) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slidesCount - 1;
    updateSlider();
}

function nextSlide() {
    goToSlide(currentSlide + 1);
}

function prevSlide() {
    goToSlide(currentSlide - 1);
}

function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 4000);
}

function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}

nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    nextSlide();
    resetAutoSlide();
});

prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    prevSlide();
    resetAutoSlide();
});

// Filtros
filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderProducts(btn.dataset.category);
    });
});

// Lógica de Favoritos
function toggleFavorite(productId) {
    const index = favorites.findIndex(f => f.id === productId);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        const product = products.find(p => p.id === productId);
        favorites.push(product);
    }
    updateFavorites();
    const activeFilter = document.querySelector(".filter-btn.active").dataset.category;
    renderProducts(activeFilter);
}

function updateFavorites() {
    favCountElement.innerText = favorites.length;
    favItemsContainer.innerHTML = "";

    if (favorites.length === 0) {
        favItemsContainer.innerHTML = "<p style='color: var(--text-muted); font-size: 0.9rem;'>Nenhum item favoritado ainda.</p>";
        return;
    }

    favorites.forEach(item => {
        const favItem = document.createElement("div");
        favItem.className = "cart-item";
        favItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                <button class="cart-item-add-from-fav" onclick="addToCart(${item.id}); closeSidebars(); openCart();">+ Carrinho</button>
                <button class="cart-item-remove" onclick="toggleFavorite(${item.id})">Remover</button>
            </div>
        `;
        favItemsContainer.appendChild(favItem);
    });
}

// Lógica do Carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    updateCart();
    openCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateCart() {
    cartCountElement.innerText = cart.length;
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p style='color: var(--text-muted); font-size: 0.9rem;'>Seu carrinho está vazio.</p>";
    }

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                <button class="cart-item-remove" onclick="removeFromCart(${index})">Remover</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartTotalElement.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Controles das Sidebars
function openCart() {
    closeSidebars();
    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");
}

function openFav() {
    closeSidebars();
    favSidebar.classList.add("active");
    cartOverlay.classList.add("active");
}

function closeSidebars() {
    cartSidebar.classList.remove("active");
    favSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");
}

cartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeSidebars);

favBtn.addEventListener("click", openFav);
closeFavBtn.addEventListener("click", closeSidebars);

cartOverlay.addEventListener("click", closeSidebars);

function checkout() {
    if (cart.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
    alert("Obrigado pelo pedido na CoMF! Redirecionando para o pagamento simulado.");
    cart = [];
    updateCart();
    closeSidebars();
}

// Inicialização
renderHeroSlider();
renderProducts();
updateFavorites();
startAutoSlide();