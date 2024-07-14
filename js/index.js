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
    const payButton = document.getElementById('pay');

    const cartBox = document.querySelector('.cart-box');
    const cartTxt = document.querySelector('.cart-txt');
    const cartCount = document.querySelector('.cart span');
    const totalElement = document.querySelector('.total h3:last-child');

    let currentMenus = [];
    let currentStartIndex = 0;
    let isFastOrder = true;

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
                <img src="${menu.image}" alt="item${i + 1}" class = "menu-img">
                <p class="main-name">${menu.name}</p>
                <p class="main-price"><b>${menu.price.toLocaleString()}</b>원</p>
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

    function clearCart() {
        const cartItems = cartTxt.querySelectorAll('.cart-in');
        cartItems.forEach(item => item.remove());
        
        // 장바구니가 비어있지 않은 경우에만 메시지를 추가합니다.
        if (cartItems.length > 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = '장바구니가 비어있습니다.';
            emptyMessage.className = 'empty-cart-message';
            cartTxt.appendChild(emptyMessage);
        }
        
        updateCartCount();
        updateTotal();
    }
    
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

    function createRemoveButton() {
        const removeButton = document.createElement('div');
        removeButton.className = 'remove-item';
        removeButton.innerHTML = '<span></span><span></span>';
        removeButton.addEventListener('click', function(e) {
            e.stopPropagation();
            const cartItem = this.closest('.cart-in');
            cartTxt.removeChild(cartItem);
            updateCartCount();
            updateTotal();
        });
        removeButton.addEventListener('mouseenter', function() {
            this.querySelectorAll('span').forEach(span => span.style.backgroundColor = 'red');
        });
        removeButton.addEventListener('mouseleave', function() {
            this.querySelectorAll('span').forEach(span => span.style.backgroundColor = 'black');
        });
        return removeButton;
    }

    function createQuantityControls(menu) {
        const quantityControls = document.createElement('div');
        quantityControls.className = 'count-price';
        quantityControls.innerHTML = `
            <p class="minus-plus">
                <span class="minus quantity-btn">-</span>
                <span class="count">1</span>
                <span class="plus quantity-btn">+</span>
            </p>
            <p class="menu-price"><b>${menu.price.toLocaleString()}</b>원</p>
        `;

        const minusBtn = quantityControls.querySelector('.minus');
        const plusBtn = quantityControls.querySelector('.plus');
        const countElement = quantityControls.querySelector('.count');
        const priceElement = quantityControls.querySelector('.menu-price b');

        [minusBtn, plusBtn].forEach(btn => {
            btn.addEventListener('mousedown', function() {
                this.classList.add('active');
            });
            btn.addEventListener('mouseup', function() {
                this.classList.remove('active');
            });
            btn.addEventListener('mouseleave', function() {
                this.classList.remove('active');
            });
        });

        minusBtn.addEventListener('click', () => {
            let count = parseInt(countElement.textContent);
            if (count > 1) {
                count--;
                countElement.textContent = count;
                priceElement.textContent = (menu.price * count).toLocaleString();
                updateTotal();
            } else {
                const cartItem = quantityControls.closest('.cart-in');
                if (cartItem) {
                    cartTxt.removeChild(cartItem);
                    updateCartCount();
                    updateTotal();
                }
            }
        });

        plusBtn.addEventListener('click', () => {
            let count = parseInt(countElement.textContent);
            count++;
            countElement.textContent = count;
            priceElement.textContent = (menu.price * count).toLocaleString();
            updateTotal();
        });

        return quantityControls;
    }

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
            const priceElement = existingItem.querySelector('.menu-price b');
            priceElement.textContent = (menu.price * count).toLocaleString();
        } else {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-in';
            cartItem.dataset.id = menu.id;
            
            const itemImage = document.createElement('img');
            itemImage.src = menu.image;
            itemImage.alt = menu.name;

            const itemName = document.createElement('p');
            itemName.className = 'menu-name';
            itemName.textContent = menu.name;

            const removeButton = createRemoveButton();
            const quantityControls = createQuantityControls(menu);

            cartItem.appendChild(itemImage);
            cartItem.appendChild(itemName);
            cartItem.appendChild(removeButton);
            cartItem.appendChild(quantityControls);

            cartTxt.appendChild(cartItem);
        }

        updateCartCount();
        updateTotal();
    }

    function updateCartCount() {
        const cartItems = document.querySelectorAll('.cart-in');
        cartCount.textContent = cartItems.length;
        
        if (cartItems.length === 0) {
            const emptyMessage = cartTxt.querySelector('.empty-cart-message');
            if (!emptyMessage) {
                const newEmptyMessage = document.createElement('p');
                newEmptyMessage.textContent = 'Your cart is empty';
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

    function updateTotal() {
        const cartItems = document.querySelectorAll('.cart-in');
        let total = 0;
        cartItems.forEach(item => {
            const price = parseInt(item.querySelector('.menu-price b').textContent.replace(/,/g, ''));
            const count = parseInt(item.querySelector('.count').textContent);
            total += price * count;
        });
        totalElement.textContent = total.toLocaleString() + '원';
    
        if (total === 0) {
            totalElement.textContent = '0원';
        }
    }

    function resetToInitialScreen() {
        const initialRecommendedMenu = document.querySelector('.main-menu a:first-child');
        initialRecommendedMenu.click();
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

    cancelButton.addEventListener('click', function() {
        clearCart();
    });

    payButton.addEventListener('click', function() {
        if (confirm('정말로 결제하시겠습니까?')) {
            alert('결제가 완료되었습니다.');
            clearCart();
            resetToInitialScreen();
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