let allData = [];  
fetch('https://fakestoreapi.com/products')
    .then(response => response.json())
    .then(data => {
        allData = data;
        displayCards(allData);
    })
    .catch(error => console.error('Error fetching products:', error));
function displayCards(cards) {
    let div = document.getElementById('card-items');
    div.innerHTML = ''; 
    cards.forEach(card => {
        div.innerHTML +=`
            <div id='cardDiv' class='flex-item'>
                <img src='${card.image}' width='327px' height='344px'>
                <h3>${card.title.slice(0,11)}${card.title.length > 11 ? '...' : ''}</h3>
                <p class='description'>${card.description.slice(0, 100)}${card.description.length > 100 ? '...' : ''}</p>
                <hr>
                <p class='price'>$${card.price}</p>
                <hr>
                <button class='details'>Details</button>
                <button onclick="addToCart(${card.id}, '${card.title}', ${card.price}, '${card.image}')" class='cart-btn'>Add to Cart</button>
            </div>`;
    });
}
function addToCart(id, title, price, image) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = cart.find(item => item.id === id);
    if (!product) {
        cart.push({ id, title, price, image, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Calculate the total quantity of items in the cart
    const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
    // Update the cart count display
    const cartValue = document.getElementById('cart-value');
    cartValue.textContent = totalQuantity; 
}
function loadCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const checkout = document.getElementById('checkout');
    const emptyCartDiv = document.getElementById('cart');
    const cartValue = document.getElementById('cart-value');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartItemsContainer.innerHTML = "";
    let totalPrice = 0;
    if (cart.length === 0) {
        emptyCartDiv.style.display = 'block'; 
        checkout.style.display = 'none';
        cartItemsContainer .style.display='none'; 
        cartValue.textContent = 0; 
    } else {
        emptyCartDiv.style.display = 'none';
        checkout.style.display = 'block';
        let h3 = document.createElement('h3');
        h3.textContent = 'Item List';
        h3.style.borderBottom = '1px solid #c0bbbb';
        h3.style.backgroundColor='#e5e4e2';
        h3.style.paddingLeft='20px';
        cartItemsContainer.appendChild(h3);
        cart.forEach((item) => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            const cartItem = document.createElement('div');
            cartItem.setAttribute('id', 'cart-flex');
            cartItem.style.borderBottom = '1px solid #c0bbbb';
            cartItem.style.paddingRight = '100px';
            cartItem.style.paddingLeft = '20px';
            cartItem.innerHTML = `
                <div class="row border-bottom py-3 align-items-center">
                    <div class="col-3">
                        <img src="${item.image}" alt="${item.title}" class="img-fluid" style="height:100px;width:100px">
                    </div>
                    <div class="col-5">
                        <p class="mb-1">${item.title}</p>
                    </div>
                    <div class="col-4 text-center">
                        <div class="d-flex justify-content-center align-items-center mb-2 list-item">
                            <button class="btn btn-outline-secondary btn-sm me-2 border-0 bg-transparent text-dark" onclick="changeQuantity(${item.id}, -1)"><b>-</b></button>
                            <span class="mx-2">${item.quantity}</span>
                            <button class="btn btn-outline-secondary btn-sm ms-2 border-0 bg-transparent text-dark" onclick="changeQuantity(${item.id}, 1)"><b>+</b></button>
                        </div>
                        <p class="mb-0 text-muted">${item.quantity} <span class="fw-bold"> x $${item.price.toFixed(2)}</span></p>
                    </div>
                </div>`;
            cartItemsContainer.appendChild(cartItem);
        });
        const shippingCost = 30;
        const finalTotalPrice = totalPrice + shippingCost;
        checkout.innerHTML = `
            <div class="container">
                <div class="row" style='border-bottom:1px solid #c0bbbb; background-color:#e5e4e2';>
                    <div class="col-12">
                        <p class="h4"><strong>Order Summary</strong></p>
                        
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-6">
                        <p>Products (<span>${cart.reduce((acc, item) => acc + item.quantity, 0)}</span>)</p>
                    </div>
                    <div class="col-6 text-end">
                        <p>$${totalPrice.toFixed(2)}</p>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-6">
                        <p>Shipping</p>
                    </div>
                    <div class="col-6 text-end">
                        <p>$${shippingCost.toFixed(2)}</p>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-6">
                        <p><strong>Total Amount:</strong></p>
                    </div>
                    <div class="col-6 text-end">
                        <p id="total-price" class="fw-bold">$${finalTotalPrice.toFixed(2)}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 text-center">
                        <button class="btn btn-dark w-100 checkout">Go to checkout</button>
                    </div>
                </div>
            </div>`;
    }
}
function changeQuantity(id, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex >= 0) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
        updateCartCount(); 
    }
}
function filter(category) {
    const filteredData = category === 'all' ? allData : allData.filter(card => card.category === category);
    displayCards(filteredData);
}
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (document.getElementById('cart-items')) {
        loadCart();
    }
});
//  localStorage.clear();
// nav bar link color

document.addEventListener("DOMContentLoaded", function () {
    const currentPage = window.location.pathname.split("/").pop();
    console.log(currentPage);
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => { 
      if (link.getAttribute("href") === currentPage) {
        
        link.classList.add("active");
      }
    });
});

  