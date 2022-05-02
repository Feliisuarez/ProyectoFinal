
//evento para seleccionar una categoria
let subtitle = document.querySelector(".subtitle");
let button = document.querySelectorAll(".categorys-button");

button.forEach(btn => {
    btn.addEventListener('click', () => {
        products.innerHTML = ""; //resetea los productos

        //segun el boton que se toque cambia la lista para luego imprimirla y cambia el titulo

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

//funcion que actualiza la cantidad total de productos en el carrito
let cartNumCount = 0;

//funcion que muestra la categoria
function mostrarProductos(array) {
    array.forEach(element => {

        const { name: nameList, price: priceList, id: idList, src: srcList } = element; //desestructuracion de objeto

        //imprime el producto

        let li = document.createElement("li");
        li.innerHTML = `<p class="products-name">${nameList}</p> <img src=${srcList} class="products-imgs"> <i class='bx bx-cart-add bx-md products-btn' id="${idList}" ></i> <span class="products-quantity" id="${idList}">0</span> <p class="products-price">$ ${priceList}</p>`;
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

            //actualizadores

            totalQuantity();//actualiza la cantidad del carrito
            productListQuantity(idList); //actualiza la cantidad del producto en la lista

            //actualiza el storage
            cartStatus();
            localStorage.setItem("carrito", JSON.stringify(cart));
            localStorage.setItem("total", JSON.stringify(total));
        })
        productListQuantity(idList); //actualiza la cantidad del producto en la lista
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

