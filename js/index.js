axios.get('./data/menu.json')
    .then(result => {
        const menus = result.data;

        // 데이터를 담을 요소를 선택합니다.
        const fastContainer = document.querySelector('.fast');
        const priceContainer = document.querySelector('.price');

        // 데이터를 반복하여 요소를 생성합니다.
        menus.forEach(menu => {
            // 빠른제공순
            const fastDiv = document.createElement('div');
            fastDiv.className = `best${menu.id + 1}`;
            fastDiv.innerHTML = `
                <img src="${menu.image}" alt="best${menu.id + 1}">
                <p>${menu.name}</p>
                <p><b>${menu.price}</b>원</p>
            `;
            fastContainer.appendChild(fastDiv);

            // 가격순
            const priceDiv = document.createElement('div');
            priceDiv.className = `price${menu.id + 1}`;
            priceDiv.innerHTML = `
                <img src="${menu.image}" alt="best${menu.id + 1}">
                <p>${menu.name}</p>
                <p><b>${menu.price}</b>원</p>
            `;
            priceContainer.appendChild(priceDiv);
        });
    })
    .catch(err => {
        console.log('에러 발생 : ', err);
    });