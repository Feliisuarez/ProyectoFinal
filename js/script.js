// listas de productos y precios que se usa para imprimir al seleccionar la categoria

let phoneList = []
let tabletList = []
let displayList = []
let tvList = []

//array general
let allProducts = [...phoneList, ...tabletList, ...displayList, ...tvList]

//fetch
fetch('/data/data.json')
    .then((res) => res.json())
    .then((res) => {
        phoneList = res.productos[0].phoneList;
        tabletList = res.productos[1].tabletList;
        displayList = res.productos[2].displayList;
        tvList = res.productos[3].tvList;

        allProducts = [...phoneList, ...tabletList, ...displayList, ...tvList]
    })

//elementos del html

let button = document.querySelectorAll(".categorys-button");

let products = document.querySelector("#products");
let cartList = document.querySelector(".cart-list");
let totalPrice = document.querySelector(".total");

let buyBtn = document.querySelector("#buy");
let reset = document.querySelector("#reset");
let msg = document.querySelector(".msg");

let subtitle = document.querySelector(".subtitle");

let cart = []
let total = 0;

//evento para seleccionar una categoria

button.forEach(btn => {
    btn.addEventListener('click', () => {
        products.innerHTML = ""; //resetea los productos

        //segun el boton que se toque cambia la lista para luego imprimirla

        if (btn.id == "phones") {
            mostrarProductos(phoneList);
            subtitle.innerHTML = "Telefonos"

        } else if (btn.id == "tablets") {
            mostrarProductos(tabletList);
            subtitle.innerHTML = "Tablets"

        } else if (btn.id == "displays") {
            mostrarProductos(displayList);
            subtitle.innerHTML = "Monitores"

        } else if (btn.id == "tvs") {
            mostrarProductos(tvList);
            subtitle.innerHTML = "Televisores"
        }

    });
})

//funcion que muestra la categoria

function mostrarProductos(array) {
    array.forEach(element => {

        const { name: nameList, price: priceList, id: idList, src: srcList } = element; //desestructuracion de objeto

        //imprime el producto

        let li = document.createElement("li");
        li.innerHTML = `<p class="products-text">${nameList} : $${priceList}</p> <img src=${srcList} class="products-imgs"> <i class='bx bx-cart-add bx-md products-btn' id="${idList}" ></i>`;
        li.classList.add('products-product');
        products.appendChild(li);
        li.style.pointerEvents = "none";

        //declara los botones creados
        let btn = document.getElementById(`${idList}`)

        //evento para agregar agregar producto
        btn.addEventListener('click', () => {

            //funciones que reciben el id del boton agregar
            addCart(idList);

            //efecto de color en imagen
            btn.previousElementSibling.style = "background-color: #63be78";
            btn.parentElement.style = "transform: rotateX(30deg); filter: drop-shadow(0 1rem 0.5rem #555);";
            setTimeout(() => {
                btn.previousElementSibling.style = "background-color: #fff";
            }, 150)

            btn.previousElementSibling.previousElementSibling.style = "background-color: #63be78";
            setTimeout(() => {
                btn.previousElementSibling.previousElementSibling.style = "background-color: #fff";
                btn.parentElement.style = "transform: rotateX(0deg); filter: drop-shadow(0 0rem 0.5rem #555);";
            }, 300)

            //actualiza
            cartStatus();
            localStorage.setItem("carrito", JSON.stringify(cart));
            localStorage.setItem("total", JSON.stringify(total));
        })
    })

};

//funcion carrito

function addCart(idList) { //recibe el id
    let yaEsta = cart.find(prod => prod.id == idList) //busca el id en el carrito

    //verifica si esta en el carrito

    if (yaEsta) { //si esta incrementa la cantidad

        yaEsta.cantidad += 1;

        const { name, price, cantidad, id, src } = yaEsta; //desestructuracion de objeto

        //imprime producto
        document.getElementById(`cantidad${id}`).innerHTML = `<span class="quantity">${cantidad}</span> <img src=${src} alt="producto" class="cart-imgs"> ${name} : $${price} <button name="button" onclick=removeF(${id}) class="remove-btn" ><i class='bx bx-trash-alt bx-md'></i></button>`;
        total += price;

        //alertyify
        alertify.set('notifier', 'position', 'bottom-right');
        alertify.success(`<b>${name}</b> se agrego al carrito`);

    } else { //si no esta lo busca con el id en el array general y lo crea
        let productEncontrado = allProducts.find(item => item.id == idList);
        productEncontrado.cantidad = 1; //como no esta le crea la cantidad
        cart.push(productEncontrado); //agrega el producto creado al carrito

        const { name, price, cantidad, id, src } = productEncontrado; //desestructuracion de objeto

        //imprime el producto 

        let li = document.createElement("li");
        li.classList.add('my-product');
        li.setAttribute('id', `cantidad${id}`);
        li.innerHTML = `<span class="quantity">${cantidad}</span> <img src=${src} alt="producto" class="cart-imgs"> ${name} : $${price} <button name="button" onclick=removeF(${id}) class="remove-btn" ><i class='bx bx-trash-alt bx-md'></i></button>`;
        cartList.appendChild(li);
        total += price; //suma el precio

        //alertyify
        alertify.set('notifier', 'position', 'bottom-right');
        alertify.success(`<b>${name}</b> se agrego al carrito`);
    }
    totalPrice.innerHTML = `Total: $ ${total}`;
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
            cartProduct.style = "background-color: #fff"
        }, 300)

        //alertyify    
        alertify.set('notifier', 'position', 'bottom-left');
        alertify.error(`<b>${searchProduct.name}</b> se elimino del carrito`);

    } else { //si no esta repetido lo elimina del array y del html

        let removed = cart.indexOf(searchProduct);
        cart.splice(removed, 1)
        cartProduct.style = "transform: translateX(100%); transition: transform .3s";

        setTimeout(() => {
            cartList.removeChild(cartProduct);
        }, 300)

        //alertyify
        alertify.set('notifier', 'position', 'bottom-left');
        alertify.error(`<b>${searchProduct.name}</b> se elimino del carrito`);
    }

    total -= searchProduct?.price;  //resta el precio
    totalPrice.innerHTML = `Total: $ ${total}`; //imprime el total del precio

    //actualiza
    cartStatus();
    localStorage.setItem("carrito", JSON.stringify(cart));
    localStorage.setItem("total", JSON.stringify(total));
}

//localStorage

let storage = JSON.parse(localStorage.getItem("carrito")) || [];
let storagePrice = JSON.parse(localStorage.getItem("total")) || 0;

//establece el carrito 

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

//funcion de carrito msg compra
function cartStatus() {

    cart.length == 0 ? msg.style.display = "block" : msg.style.display = "none";

}

cartStatus();

const info = document.querySelector('.info');
const lastBuy = document.querySelector('.lastBuy');

//evento para comprar
buyBtn.addEventListener('click', () => {
    if (cart.length == 0) {
        //sweet alert
        Swal.fire({
            icon: 'error',
            title: 'El carrito se encuentra vacio',
        })

        //alertify
        alertify.dismissAll();

        //ultima compra
        lastBuy.innerHTML = "";
        info.style.display = "none";

    } else {
        //sweet alert
        Swal.fire({
            icon: 'success',
            title: 'Compra realizada!',
        })

        //ultima compra
        lastBuy.innerHTML = "";
        info.style.display = "none";

        cart.forEach(element => {
            let li = document.createElement("li");
            li.innerHTML += `${element.name} (${element.cantidad}): $ ${element.price}`;
            lastBuy.appendChild(li);
            info.style.display = "block"
        });

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

    //actualiza
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
