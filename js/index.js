document.addEventListener('DOMContentLoaded', function() {
    const bestBox = document.querySelector('.best-box');
    const donut = document.querySelector('.donet');
    const menuItems = document.querySelectorAll('.main-menu a');
    const fastContainer = document.querySelector('.fast');
    const priceContainer = document.querySelector('.price');
    const fastButton = document.querySelector('.submenu li:first-child a');
    const priceButton = document.querySelector('.submenu li:last-child a');
    const bestBoxTitle = document.querySelector('.best-box h2');

    function updateBestBox(menuItems) {
        fastContainer.innerHTML = '';
        priceContainer.innerHTML = '';

        const sortedByPrice = [...menuItems].sort((a, b) => a.price - b.price);

        menuItems.forEach((menu, index) => {
            const fastDiv = document.createElement('div');
            fastDiv.className = `best${index + 1}`;
            fastDiv.innerHTML = `
                <img src="${menu.image}" alt="best${index + 1}">
                <p>${menu.name}</p>
                <p><b>${menu.price.toLocaleString()}</b>원</p>
            `;
            fastContainer.appendChild(fastDiv);
        });

        sortedByPrice.forEach((menu, index) => {
            const priceDiv = document.createElement('div');
            priceDiv.className = `price${index + 1}`;
            priceDiv.innerHTML = `
                <img src="${menu.image}" alt="price${index + 1}">
                <p>${menu.name}</p>
                <p><b>${menu.price.toLocaleString()}</b>원</p>
            `;
            priceContainer.appendChild(priceDiv);
        });
    }
    
    function handleMenuClick(menuData, titleText) {
        updateBestBox(menuData);
        bestBoxTitle.textContent = titleText;
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
                        const donutMenus = menus.filter(menu => menu.id >= 6 && menu.id <= 23);
                        handleMenuClick(donutMenus, '🍩도넛 단품');
                    } else if (menuItem.classList.contains('coffee-menu')) {
                        const coffeeMenus = menus.filter(menu => menu.id >= 24 && menu.id <= 29);
                        handleMenuClick(coffeeMenus, '☕커피 메뉴');
                    } else if (menuItem.classList.contains('drink-menu')) {
                        const drinkMenus = menus.filter(menu => menu.id >= 30 && menu.id <= 38);
                        handleMenuClick(drinkMenus, '🍹아더드링크 메뉴');
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
        fastContainer.style.display = 'grid';
        priceContainer.style.display = 'none';
        fastButton.classList.add('active');
        priceButton.classList.remove('active');
    });

    priceButton.addEventListener('click', (e) => {
        e.preventDefault();
        fastContainer.style.display = 'none';
        priceContainer.style.display = 'grid';
        priceButton.classList.add('active');
        fastButton.classList.remove('active');
    });

    // 초기화면 설정
    const initialRecommendedMenu = document.querySelector('.main-menu a:first-child');
    initialRecommendedMenu.classList.add('active'); // 초기 상태에서 추천메뉴를 빨간색으로 강조

    bestBox.style.display = 'block';
    fastContainer.style.display = 'grid';
    priceContainer.style.display = 'none';
    donut.style.display = 'none';
    fastButton.classList.add('active');
    priceButton.classList.remove('active');

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