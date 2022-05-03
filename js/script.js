//elementos del html

let products = document.querySelector("#products"); //contenedor de productos

//dentro del carrito
let cartList = document.querySelector(".cart-list");
let totalPrice = document.querySelector(".total");
let buyBtn = document.querySelector("#buy");
let reset = document.querySelector("#reset");
let msg = document.querySelector(".msg");
let cartNum = document.querySelector(".nav-cart-num");

//variables de carrito y precio
let cart = []
let total = 0;

//localStorage

let storage = JSON.parse(localStorage.getItem("carrito")) || [];
let storagePrice = JSON.parse(localStorage.getItem("total")) || 0;

//establece el carrito desde el storage

storage.forEach(element => {

    const { name, price, cantidad, id, src } = element; //desestructuracion de objeto

    cart.push(element);
    let li = document.createElement("li");
    li.classList.add('my-product');
    li.setAttribute('id', `cantidad${id}`);
    li.innerHTML = `<span class="quantity">${cantidad}</span> <img src=${src} class="cart-imgs"> ${name} : $${price} <button name="button" onclick=removeF(${id},${cantidad}) class="remove-btn"><i class='bx bx-trash-alt bx-md'></i></button>`;
    cartList.appendChild(li);

    //precio
    total = storagePrice;
    totalPrice.innerHTML = `Total: $ ${storagePrice}`;
});

//funcion que actualiza la cantidad total de productos en el carrito
let cartNumCount = 0;

function totalQuantity() {
    cartNumCount = 0; //resetea por si se ejecuta mas de una ocacion
    cart.forEach(element => {
        cartNumCount += element.cantidad //suma las cantidades de cada producto en el carrito
    });
    cartNum.innerHTML = cartNumCount //imprime el numero

    //estilos
    cartNum.textContent == 0 ? cartNum.style.display = "none" : cartNum.style.display = "flex";
}

totalQuantity(); //actualiza la cantidad

//funcion de carrito msg compra
function cartStatus() {

    cart.length == 0 ? setTimeout(() => msg.style.filter = "opacity(1)", 500) : msg.style.filter = "opacity(0)";

}
cartStatus();

//funcion que actualiza la cantidad de productos agregados de la lista
function productListQuantity(idList, idRemoved) {
    let productQuantity = cart.find(item => item.id == idList); //busca el producto en el carrito para sacar la cantidad 
    let productsQuantity = document.querySelectorAll(".products-quantity")  //elemento html

    if (productQuantity) { //si se encuentra en el carrito
        productsQuantity.forEach(element => {
            if (productQuantity.id == element.id) { //busca por id al elemento html para actualizarlo 
                element.innerHTML = productQuantity.cantidad; //imprime

                //estilos
                element.style.display = "flex";
            }
        });
    } else { //si se acaba de eliminar del carrito
        productsQuantity.forEach(element => {
            if (element.id == idRemoved) {
                element.innerHTML = 0; //imprime

                //estilos
                element.previousElementSibling.previousElementSibling.style = "background-color: unset"
                element.style.display = "none";
            }
        });
    }
}

//funcion para eliminar producto con evento onclick

function removeF(idList, cantidadStorage) {
    let searchProduct = cart.find(item => item.id == idList); //busca el producto en el array general

    //si se ejecuta desde el storage no habria cantidad, entonces se define
    !searchProduct.cantidad ? searchProduct.cantidad = cantidadStorage : searchProduct.cantidad;
    let cartProduct = document.getElementById(`cantidad${searchProduct?.id}`); //busca el boton por el id creado del producto

    // si hay mas de 1 repetido descuenta 1 de la cantidad y lo cambia en el html
    if (searchProduct.cantidad > 1) {
        searchProduct.cantidad -= 1;

        cartProduct.innerHTML = `<span class="quantity">${searchProduct?.cantidad}</span> <img src=${searchProduct.src} alt="producto en carrito" class="cart-imgs"> ${searchProduct?.name} : $${searchProduct?.price} <button name="button" onclick=removeF(${idList}) class="remove-btn" ><i class='bx bx-trash-alt bx-md'></i></button>`;

        //estilo de eliminar color
        cartProduct.style = "background-color: #db6464"
        setTimeout(() => {
            cartProduct.style = "background-color: unset"
        }, 300)

        //alertyify    
        alertify.set('notifier', 'position', 'bottom-left');
        alertify.error(`<b>${searchProduct.name}</b> se elimino del carrito`);

    } else { //si no esta repetido lo elimina del array y del html

        let removed = cart.indexOf(searchProduct);
        cart.splice(removed, 1)
        cartProduct.style = "transform: translateX(100%); transition: transform .3s;";

        setTimeout(() => {
            cartList.removeChild(cartProduct);
        }, 300)

        //alertyify
        alertify.set('notifier', 'position', 'bottom-left');
        alertify.error(`<b>${searchProduct.name}</b> se elimino del carrito`);

    }

    total -= searchProduct?.price;  //resta el precio
    totalPrice.innerHTML = `Total: $ ${total}`; //imprime el total del precio

    totalQuantity(); //actualiza la cantidad del carrito
    productListQuantity(idList, searchProduct.id); //actualiza la cantidad del producto en la lista

    //actualiza el storage
    cartStatus();
    localStorage.setItem("carrito", JSON.stringify(cart));
    localStorage.setItem("total", JSON.stringify(total));
}

//funcion vaciar carrito
function resetBtn() {
    cart = [];
    cartList.innerHTML = "";
    total = 0;
    totalPrice.innerHTML = `Total: $ ${total}`;

    totalQuantity();//actualiza la cantidad

    //resetea todas las cantidades de los productos en lista
    let productsQuantity = document.querySelectorAll(".products-quantity")
    productsQuantity.forEach(element => {
        element.innerHTML = 0;
        //estilos
        element.style.display = "none";
        element.previousElementSibling.previousElementSibling.style = "background-color: unset"
    });

    cartStatus();
    //actualiza el storage
    localStorage.setItem("carrito", JSON.stringify(cart));
    localStorage.setItem("total", JSON.stringify(total));
}

//evento para comprar

const info = document.querySelector('.last-buy-container');
const lastBuy = document.querySelector('.lastBuy');
const infoTotal = document.querySelector('.info-total');

buyBtn.addEventListener('click', () => {
    if (cart.length == 0) {
        //sweet alert
        Swal.fire({
            icon: 'error',
            title: 'El carrito se encuentra vacio',
            confirmButtonColor: "var(--secondary-color)",
        })

        //alertify
        alertify.dismissAll();

    } else {

        //sweet alert

        Swal.fire({
            icon: 'success',
            title: 'Gracias por su compra',
            confirmButtonColor: "var(--secondary-color)",
        })

        //ultima compra
        lastBuy.innerHTML = "";
        infoTotal.innerHTML = "";
        info.style.display = "none";

        //imprime la ultima compra
        cart.forEach(element => {
            let src = allProducts.find(item => item.id == element.id); //busca por id en el array general para conseguir la imagen

            let li = document.createElement("li");
            li.innerHTML += `<span class="quantity">${element?.cantidad}</span> <img src=${src.src} alt="producto en carrito" class="cart-imgs"> ${element?.name} : $${element?.price}`;
            li.classList.add('my-product');
            lastBuy.appendChild(li);
            info.style.display = "flex";

            infoTotal.innerHTML = `Total: $ ${total}`;
        });

        //alertify
        alertify.dismissAll();
        alertify.warning('Se a vaciado el carrito');
        resetBtn()
    }
}

)

//evento vaciar carrito
reset.addEventListener('click', () => {
    resetBtn()
    msg.innerHTML = "El carrito se encuentra vacio";

    //alertify
    alertify.dismissAll();
    alertify.warning('Se a vaciado el carrito');
})

//menu 

const menuBtn = document.querySelector('.nav-menu'); //menu icono para abrir
const menu = document.querySelector('.categorys-container'); //todo el menu

//agrega y saca clase para transladar el menu al hacer click
menuBtn.addEventListener('click', () => {
    menu.classList.toggle('show');
})

//cart

const showCart = document.querySelector('.nav-cart'); //boton del icono del carrito para abrir
const cartContainer = document.querySelector('.cart-container'); //todo el carrito

//agrega o saca clase para desplegar el carrito al hacer click
showCart.addEventListener('click', () => {
    cartContainer.classList.toggle('open')

    //alertify
    alertify.dismissAll();
})

//evento para cerrar menu y carrito al hacer click en cualquier lugar de la pantalla exeptuando el icono y cualquier parte del contenido en caso del carrito
window.addEventListener('click', (e) => {
    if (e.target !== menuBtn) {
        menu.classList.remove('show');
    }

    if (e.target !== showCart && e.target !== cartContainer && e.target !== buyBtn && e.target !== reset && e.target.name !== "button") {
        cartContainer.classList.remove('open')
    }

    //efecto de desenfoque a la pagina si el menu o el carrito se encuentra abierto 
    if (cartContainer.classList.contains('open') || menu.classList.contains('show')) {
        products.style = "filter: blur(2px)";
    } else {
        products.style = "filter: blur(0)";
    }
})

// guarda el id en el localStorage para luego cargar la tienda con la opcion elegida
let initBtn = document.querySelectorAll('.init-btn');

initBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        localStorage.setItem('init', btn.id)
    })
});