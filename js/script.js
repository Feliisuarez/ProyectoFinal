// listas de productos y precios que se usa para imprimir al seleccionar la categoria

let phoneList = []
let tabletList = []
let displayList = []
let tvList = []

//array general
let allProducts = [...phoneList, ...tabletList, ...displayList, ...tvList]

//fetch
fetch('data/data.json')
    .then((res) => res.json())
    .then((res) => {
        phoneList = res.productos[0].phoneList;
        tabletList = res.productos[1].tabletList;
        displayList = res.productos[2].displayList;
        tvList = res.productos[3].tvList;

        allProducts = [...phoneList, ...tabletList, ...displayList, ...tvList]
    })

//elementos del html

let products = document.querySelector("#products");
let cartList = document.querySelector(".cart-list");
let totalPrice = document.querySelector(".total");

let buyBtn = document.querySelector("#buy");
let reset = document.querySelector("#reset");
let msg = document.querySelector(".msg");

let cart = []
let cartNum = document.querySelector(".nav-cart-num");

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

//evento para comprar

const info = document.querySelector('.last-buy-container');
const lastBuy = document.querySelector('.lastBuy');

const infoTotal = document.querySelector('.info-total');

let lastTotal = 0;


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

        //ultima compra
        lastBuy.innerHTML = "";
        infoTotal.innerHTML = "";
        info.style.display = "none";

    } else {
        //sweet alert
        Swal.fire({
            icon: 'success',
            title: 'Compra realizada!',
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

            lastTotal += element.price * element.cantidad; //acumula el total
            infoTotal.innerHTML = ""; //resetea el texto del total
            infoTotal.innerHTML += `Total: $ ${lastTotal}`;
        });
        lastTotal = 0; //resetea el total

        //alertify
        alertify.dismissAll();
        alertify.warning('Se a vaciado el carrito');
    }

    resetBtn()
})

//evento vaciar carrito
reset.addEventListener('click', () => {
    resetBtn()
    msg.innerHTML = "El carrito se encuentra vacio";

    //ultima compra
    lastBuy.innerHTML = "";
    infoTotal.innerHTML = "";
    info.style.display = "none";

    //alertify
    alertify.dismissAll();
    alertify.warning('Se a vaciado el carrito');
})

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

    //actualiza el storage
    cartStatus();
    localStorage.setItem("carrito", JSON.stringify(cart));
    localStorage.setItem("total", JSON.stringify(total));
}

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
