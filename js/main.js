let carrito = [];

const listaProductos = document.querySelector("#productos");
const contentCarrito = document.querySelector('#carrito tbody');
const totalCompraElement = document.querySelector('#total-compra');
const botonVaciarCarrito = document.getElementById("vaciar-carrito");
const btnComprar = document.querySelector('#comprar');



document.addEventListener('DOMContentLoaded', () => {

    fetch('js/productos.json')
        .then((res)=>{
            return res.json()
        })
        .then((data)=>{
            dibujarProductos(data)
        })
        .catch((err)=>{
            console.log(err)
        });

    function dibujarProductos(productos){
        const contenido = document.querySelector('#productos')
        let html = ""
        productos.forEach((producto)=>{
            html += `
            <div class="producto col-sm-2 col-md-4 col-xl-3 text-center shadow-lg rounded">
                        <img class="img-fluid imgproductos" src="assets/img/${producto.img}" alt="">
                        <div class="descripcion">
                            <div id="name-product">
                                <p>${producto.nombre}</p>
                                <p>${producto.marca}</p>
                            </div>
                            <div id="precio-product">
                                <p><span>$${producto.precio}</span></p>
                            </div>
                            <button class="agregar text-light" id="${producto.id}">Agregar producto</button>
                        </div>
                    </div>
            `
        })
        contenido.innerHTML = html
    };
        
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    dibujarCarritoHTML();
    
    listaProductos.addEventListener('click', agregarProducto);

    function agregarProducto(evt) {
        evt.preventDefault();
        if (evt.target.classList.contains('agregar')) {
            const producto = evt.target.parentElement.parentElement;
            infoProducto(producto);
            Toastify({
                text: "Producto agregado al carrito",
                duration: 1000,
                destination: "https://github.com/apvarun/toastify-js",
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                  background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
                onClick: function(){}
              }).showToast();
        };
    };

    function infoProducto(item) {
        const readProduct = {
            imagen: item.querySelector('img').src,
            nombre: item.querySelector('#name-product').textContent,
            precio: item.querySelector('#precio-product').textContent,
            id: item.querySelector('button').getAttribute('id'),
            cantidad: 1,
        };

        if (carrito.some(prod => prod.id === readProduct.id)) {
            const productos = carrito.map(producto => {
                if (producto.id === readProduct.id) {
                    let cantidad = parseInt(producto.cantidad)
                    cantidad += 1
                    producto.cantidad = cantidad
                    return producto
                } else {
                    return producto
                }
            });

            carrito = productos.slice()
            } else {
                carrito.push(readProduct)
            };
            totalCompraElement.textContent = `$${calcularTotalCompra()}`;

        dibujarCarritoHTML();
    };

    function dibujarCarritoHTML() {
        limpiarCarrito();


        carrito.forEach((producto, index) => {
            const fila = document.createElement('tr')
            fila.innerHTML = `
                <td><img src="${producto.imagen}" width="100"/></td>
                <td>${producto.nombre}</td>
                <td>${producto.precio}</td>
                <td>${producto.cantidad}</td>
                <td>
                    <i class="bi bi-trash-fill delete-product " data-index="${index}"></i>
                </td>
            `
            contentCarrito.appendChild(fila);
        })
        sincronizarStorage()
    };

    function limpiarCarrito() {
        while (contentCarrito.firstChild) {
            contentCarrito.removeChild(contentCarrito.firstChild);
        }
    };

    contentCarrito.addEventListener('click', function(evt) {
        if (evt.target.classList.contains('delete-product')) {
            const index = evt.target.getAttribute('data-index');
            eliminarProducto(index);
            totalCompraElement.textContent = `$${calcularTotalCompra()}`;

            dibujarCarritoHTML();
        }
    });

    function eliminarProducto(index) {
        carrito.splice(index, 1);
    };

    function vaciarCarrito() {
        carrito = [];
        dibujarCarritoHTML();
        sincronizarStorage();
        totalCompraElement.textContent = "$0.00";
        Swal.fire(
            '¿Estas seguro?',
            'Se eliminarán todos los productos',
            'question'
          )
    };
    botonVaciarCarrito.addEventListener("click", vaciarCarrito);

    function comprarCarrito() {
        carrito = [];
        dibujarCarritoHTML();
        sincronizarStorage();
        totalCompraElement.textContent = "$0.00";
        Swal.fire({
            position: 'relative',
            icon: 'success',
            title: 'Compra realizada con exito',
            showConfirmButton: false,
            timer: 2000
          })
    };
    btnComprar.addEventListener("click", comprarCarrito);


    function calcularTotalCompra() {
        let total = 0;
        carrito.forEach(producto => {
            const precioNumerico = parseFloat(producto.precio.replace('$', '').trim());
            total += precioNumerico * producto.cantidad;
        });
    
        return total.toFixed(2);
    };
    totalCompraElement.textContent = `$${calcularTotalCompra()}`;
    
});


function sincronizarStorage(){
    localStorage.setItem('carrito', JSON.stringify(carrito));
};