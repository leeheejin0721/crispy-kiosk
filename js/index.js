document.addEventListener('DOMContentLoaded', function() {
    const bestBox = document.querySelector('.best-box');
    const donut = document.querySelector('.donet');
    const menuItems = document.querySelectorAll('.main-menu a');
    const fastContainer = document.querySelector('.fast');
    const priceContainer = document.querySelector('.price');
    const fastButton = document.querySelector('.submenu li:first-child a');
    const priceButton = document.querySelector('.submenu li:last-child a');
    const bestBoxTitle = document.querySelector('.best-box h2');
    const slideLeftButton = document.querySelector('.slide-left');
    const slideRightButton = document.querySelector('.slide-right');
    const cancelButton = document.getElementById('can');

    // 장바구니 관련 요소 선택
    const cartBox = document.querySelector('.cart-box');
    const cartTxt = document.querySelector('.cart-txt');
    const cartCount = document.querySelector('.cart span');
    const totalElement = document.querySelector('.total h3:last-child');

    let currentMenus = [];
    let currentStartIndex = 0;
    let isFastOrder = true;

    // 장바구니 초기화 함수
    function initializeCart() {
        const cartItems = cartTxt.querySelectorAll('.cart-in');
        cartItems.forEach(item => item.remove());
        
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = '장바구니가 비어있습니다.';
        emptyMessage.className = 'empty-cart-message';
        cartTxt.appendChild(emptyMessage);
        
        updateCartCount();
        updateTotal();
    }

    function updateBestBox(menuItems) {
        currentMenus = [...menuItems];
        currentStartIndex = 0;
        displayMenus();
        updateSlideButtons();
    }

    function displayMenus() {
        const container = isFastOrder ? fastContainer : priceContainer;
        container.innerHTML = '';

        const displayedMenus = isFastOrder ? currentMenus : [...currentMenus].sort((a, b) => a.price - b.price);

        for (let i = 0; i < 4; i++) {
            if (currentStartIndex + i >= displayedMenus.length) break;

            const menu = displayedMenus[currentStartIndex + i];

            const menuDiv = document.createElement('div');
            menuDiv.className = `item${i + 1}`;
            menuDiv.innerHTML = `
                <img src="${menu.image}" alt="item${i + 1}">
                <p>${menu.name}</p>
                <p><b>${menu.price.toLocaleString()}</b>원</p>
            `;

            menuDiv.addEventListener('click', () => addToCart(menu));

            container.appendChild(menuDiv);
        }
    }

    function updateSlideButtons() {
        slideLeftButton.style.display = currentStartIndex > 0 ? 'block' : 'none';
        slideRightButton.style.display = currentStartIndex + 4 < currentMenus.length ? 'block' : 'none';
    }

    function handleMenuClick(menuData, titleText) {
        updateBestBox(menuData);
        bestBoxTitle.textContent = titleText;
    }

    // 장바구니 비우기 함수
    function clearCart() {
        const cartItems = cartTxt.querySelectorAll('.cart-in');
        cartItems.forEach(item => item.remove());
        
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = '장바구니가 비어있습니다.';
        emptyMessage.className = 'empty-cart-message';
        cartTxt.appendChild(emptyMessage);
        
        updateCartCount();
        updateTotal();
    }
    cancelButton.addEventListener('click', function() {
        clearCart();
    });

    // 장바구니에 항목 추가 함수
    function addToCart(menu) {
        const emptyMessage = cartTxt.querySelector('.empty-cart-message');
        if (emptyMessage) {
            cartTxt.removeChild(emptyMessage);
        }

        const existingItem = cartTxt.querySelector(`[data-id="${menu.id}"]`);
        if (existingItem) {
            const countElement = existingItem.querySelector('.count');
            const count = parseInt(countElement.textContent) + 1;
            countElement.textContent = count;
            const priceElement = existingItem.querySelector('.count-price p:last-child b');
            priceElement.textContent = (menu.price * count).toLocaleString();
        } else {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-in';
            cartItem.dataset.id = menu.id;
            cartItem.innerHTML = `
                <img src="${menu.image}" alt="${menu.name}">
                <p class = "menu-name">${menu.name}</p>
                <span class="remove-item">X</span>
                <div class="count-price">
                    <p class = "minus-plus"><span class="minus">-</span><span class="count">1</span><span class="plus">+</span></p>
                    <p class = "menu-price"><b>${menu.price.toLocaleString()}</b>원</p>
                </div>
            `;
            cartTxt.appendChild(cartItem);

            // 삭제 버튼 이벤트 리스너
            cartItem.querySelector('.remove-item').addEventListener('click', () => {
                cartTxt.removeChild(cartItem);
                updateCartCount();
                updateTotal();
            });

            // 수량 조절 이벤트 리스너
            const minusBtn = cartItem.querySelector('.minus');
            const plusBtn = cartItem.querySelector('.plus');
            const countElement = cartItem.querySelector('.count');
            const priceElement = cartItem.querySelector('.count-price p:last-child b');

            minusBtn.addEventListener('click', () => {
                let count = parseInt(countElement.textContent);
                if (count > 1) {
                    count--;
                    countElement.textContent = count;
                    priceElement.textContent = (menu.price * count).toLocaleString();
                    updateTotal();
                }
            });

            plusBtn.addEventListener('click', () => {
                let count = parseInt(countElement.textContent);
                count++;
                countElement.textContent = count;
                priceElement.textContent = (menu.price * count).toLocaleString();
                updateTotal();
            });
        }

        updateCartCount();
        updateTotal();
    }

    // 장바구니 개수 업데이트 함수
    function updateCartCount() {
        const cartItems = document.querySelectorAll('.cart-in');
        cartCount.textContent = cartItems.length;
        
        if (cartItems.length === 0) {
            const emptyMessage = cartTxt.querySelector('.empty-cart-message');
            if (!emptyMessage) {
                const newEmptyMessage = document.createElement('p');
                newEmptyMessage.textContent = '장바구니가 비어있습니다.';
                newEmptyMessage.className = 'empty-cart-message';
                cartTxt.appendChild(newEmptyMessage);
            }
        } else {
            const emptyMessage = cartTxt.querySelector('.empty-cart-message');
            if (emptyMessage) {
                emptyMessage.remove();
            }
        }
    }

    // 장바구니 총액 업데이트 함수
    function updateTotal() {
        const cartItems = document.querySelectorAll('.cart-in');
        let total = 0;
        cartItems.forEach(item => {
            const price = parseInt(item.querySelector('.count-price p:last-child b').textContent.replace(/,/g, ''));
            const count = parseInt(item.querySelector('.count').textContent);
            total += price * count;
        });
        totalElement.textContent = total.toLocaleString() + '원';
    
        // Total이 0일 때도 '0원'으로 표시
        if (total === 0) {
            totalElement.textContent = '0원';
        }
    }

    menuItems.forEach(menuItem => {
        menuItem.addEventListener('click', function(e) {
            e.preventDefault();

            menuItems.forEach(item => item.classList.remove('active'));
            menuItem.classList.add('active');

            const menuText = menuItem.textContent.trim();

            axios.get('./data/menu.json')
                .then(result => {
                    const menus = result.data;

                    if (menuItem.classList.contains('donut-dozen-menu')) {
                        const donutDozenMenus = menus.filter(menu => menu.id >= 0 && menu.id <= 4);
                        handleMenuClick(donutDozenMenus, '🎂도넛 더즌');
                    } else if (menuItem.classList.contains('donut-menu')) {
                        const donutMenus = menus.filter(menu => menu.id >= 6 && menu.id <= 22);
                        handleMenuClick(donutMenus, '🍩도넛 단품');
                    } else if (menuItem.classList.contains('coffee-menu')) {
                        const coffeeMenus = menus.filter(menu => menu.id >= 23 && menu.id <= 28);
                        handleMenuClick(coffeeMenus, '☕커피');
                    } else if (menuItem.classList.contains('drink-menu')) {
                        const drinkMenus = menus.filter(menu => menu.id >= 29 && menu.id <= 37);
                        handleMenuClick(drinkMenus, '🍹아더드링크');
                    } else if (menuText.includes('추천메뉴')) {
                        const recommendedMenus = menus.filter(menu => menu.id < 6);
                        handleMenuClick(recommendedMenus, '👍추천 메뉴');
                    } else {
                        bestBox.style.display = 'none';
                        donut.style.display = 'none';
                    }
                })
                .catch(err => {
                    console.log('에러 발생 : ', err);
                });
        });
    });

    fastButton.addEventListener('click', (e) => {
        e.preventDefault();
        isFastOrder = true;
        fastContainer.style.display = 'grid';
        priceContainer.style.display = 'none';
        fastButton.classList.add('active');
        priceButton.classList.remove('active');
        currentStartIndex = 0;
        displayMenus();
        updateSlideButtons();
    });

    priceButton.addEventListener('click', (e) => {
        e.preventDefault();
        isFastOrder = false;
        fastContainer.style.display = 'none';
        priceContainer.style.display = 'grid';
        priceButton.classList.add('active');
        fastButton.classList.remove('active');
        currentStartIndex = 0;
        displayMenus();
        updateSlideButtons();
    });

    slideLeftButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentStartIndex > 0) {
            currentStartIndex -= 4;
            displayMenus();
            updateSlideButtons();
        }
    });

    slideRightButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentStartIndex + 4 < currentMenus.length) {
            currentStartIndex += 4;
            displayMenus();
            updateSlideButtons();
        }
    });

    // 초기화면 설정
    const initialRecommendedMenu = document.querySelector('.main-menu a:first-child');
    initialRecommendedMenu.classList.add('active');

    bestBox.style.display = 'block';
    fastContainer.style.display = 'grid';
    priceContainer.style.display = 'none';
    donut.style.display = 'none';
    fastButton.classList.add('active');
    priceButton.classList.remove('active');

    // 장바구니 초기화
    initializeCart();

    axios.get('./data/menu.json')
        .then(result => {
            const menus = result.data;
            const recommendedMenus = menus.filter(menu => menu.id < 6);

            updateBestBox(recommendedMenus);
        })
        .catch(err => {
            console.log('에러 발생 : ', err);
        });
});