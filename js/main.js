
async function getApi() {
  try {
    const data = await fetch('https://fakestoreapi.com/products?limit=6')
    const res = await data.json()
    window.localStorage.setItem("products", JSON.stringify(res));
    return res;

  } catch (error) {
    console.log(error);
  }
}
function events() {
  const header__button_cart = document.querySelector(".header__button_cart");
  const cart = document.querySelector(".cart");
  const modal = document.querySelector(".modal")

  // Menejo de la entrada y salida del Cart en pantalla
  header__button_cart.addEventListener("click", function () {
    cart.classList.toggle("displacement_left");
  });
  modal.addEventListener("click", function() {
    modal.classList.remove("active")
  });

}
function printProducts(db) {
  const productsHTML = document.querySelector(".main__products");
  let html = "";
  for (const product of db.products) {
    html += `
    <div class="main__product">
          <img id="${product["id"]}" class="main__product_img modal_img" src="${product["image"]}" alt="Img_repuesto">
          <div class="main__product_description">
            <h2 class="main__product_title">${product["title"]}</h2>
            <div class="main__product_description_values">
              <p class="main__product_p">${product["category"]}</p>
              <p class="main__product_p">$${product["price"]}</p>
              <p class="main__product_p">Stock: ${product["rating"]["count"]}</p>
              <button id="${product["id"]}" class="main__product_button_add">AGREGAR</button>
            </div>
          </div>
        </div>
    `
  }
  productsHTML.innerHTML = html;
}
function addToCart(db) {
  const productsHTML = document.querySelector('.main__products');
  productsHTML.addEventListener("click", function (event){
    if (event.target.classList.contains("main__product_button_add")) {
      const id = Number(event.target["id"]);
      const productFind = db.products.find (function(product) {
        return product["id"] === id;
      });
      if (db.cart[productFind["id"]]) {
        db.cart[productFind["id"]].amount++;
      } else {
        productFind.amount = 1;
        db.cart[productFind["id"]] = productFind;
      }
      window.localStorage.setItem("cart", JSON.stringify(db.cart));
      printToCart(db);
      totalCart(db);
    }

  });
}
function printToCart(db) {
  const cart_products = document.querySelector(".cart__products");
  let html = "";
  for (const product in db.cart) {
    const { price, title, image, id, amount } = db.cart[product];
    html += `
    <div class="cart__product_container">
      <div class="cart__product">
        <img class="cart__product_img" src="${image}" alt="product">
        <div class="cart__product_title">
            <small class="cart__product_small">Título</small>
            <h3 class="cart__product_h3">${title}</h3>
        </div>
        <div class="cart__product_price">
        <small class="cart__product_small">Precio</small>
        <p class="cart__product_p">$${price}</p>
        </div>
        <div class="cart__product_subtotal">
        <small class="cart__product_small">Subtotal</small>
        <p class="cart__product_p">$${price * amount}</p>
        </div>
        </div>
        <div class="cart__product_amount">
          <p id=${id} class="cart__product_p cart__product_p_amount"><b id=${id} class="b plus">+</b><span class="span">${amount}</span><b id=${id} class="b less">-</b></p>
          <button id=${id} class="cart__product_delete_button"><img class="cart__product_delete_icon delete" src="./img/trash-active.png" alt="icon"></button>
        </div>
    </div>
    `;
  }
  cart_products.innerHTML = html;
}
function handleCart(db) {
  const cart_products = document.querySelector(".cart__products");
  cart_products.addEventListener("click", function(event) {
    if (event.target.classList.contains("plus")) {
      const id = Number(event.target.parentElement.id);
      const productFind = db.products.find(function(product) {
        return product.id === id;
      });
      if (db.cart[productFind.id]) {
        if (productFind["rating"]["count"] === db.cart[productFind.id].amount) {
          return alert("Se ha superado la cantidad actual de productos disponibles en stock");
        }
      }
      db.cart[id].amount++;
    }
    if (event.target.classList.contains("less")) {
      const id = Number(event.target.parentElement.id);
      if (db.cart[id].amount === 1) {
        const response = confirm("¿Estás seguro de querer eliminar este producto?");
        if (!response) {
          return;
        }
        delete db.cart[id];
      } else {
        db.cart[id].amount--;
      }
    }
    if (event.target.classList.contains("delete")) {
      const id = Number(event.target.parentElement.id);
      const response = confirm("¿Estás seguro de querer eliminar este producto?");
      if (!response) {
        return;
      }
      delete db.cart[id];
    }
    window.localStorage.setItem("cart", JSON.stringify(db.cart));
    printToCart(db);
    totalCart(db);
  });
}
function totalCart(db) {
  const info_total = document.querySelector(".cart__info_total");
  const info_amount = document.querySelector(".cart__info_amount")
  
  let totalProducts = 0;
  let amountProducts = 0;

  for ( const product in db.cart) {
    totalProducts += (db.cart[product].amount * db.cart[product].price);
    amountProducts += db.cart[product].amount;
  }

  info_total.textContent = "Total $"+totalProducts;
  info_amount.textContent = "Cantidad: "+amountProducts;
}
function buyCart(db) {
  const btnBuy = document.querySelector(".cart__actions_buy");
  btnBuy.addEventListener("click", function() {
    if (!Object.keys(db.cart).length) {
      return alert("Aún no tienes productos en tu carrito");
    }
    const response = confirm("¿Seguro que quieres realizar esta acción?");
      if (!response) {
        return;
      }
      for (const product of db.products) {
        const cartProduct = db.cart[product.id];
          if (product.id === cartProduct?.id) {
            product.quantity -= cartProduct.amount;
          }
      }
      db.cart = {};
      window.localStorage.setItem("products", JSON.stringify(db.products));
      window.localStorage.setItem("cart", JSON.stringify(db.cart));
      printProducts(db);
      printToCart(db);
      totalCart(db);
  });
}
function deleteCart(db) {
  const btnBuy = document.querySelector(".cart__actions_empty");
  btnBuy.addEventListener("click", function() {
    if (!Object.keys(db.cart).length) {
      return alert("Aún no tienes productos en tu carrito");
    }
    const response = confirm("¿Seguro que quieres realizar esta acción?");
      if (!response) {
        return;
      }
      db.cart = {};
      window.localStorage.setItem("products", JSON.stringify(db.products));
      window.localStorage.setItem("cart", JSON.stringify(db.cart));
      printProducts(db);
      printToCart(db);
      totalCart(db);
  });
}
function modalProduct(db) {
  const productsHTML = document.querySelector('.main__products');
  const modal = document.querySelector(".modal");
  const modal_product = document.querySelector(".modal_product");
  productsHTML.addEventListener("click", function (event){
    if (event.target.classList.contains("modal_img")) {
      const id = Number(event.target["id"]);
      const productFind = db.products.find (function(product) {
        return product["id"] === id;
      });
      modal_product.innerHTML = `
      <div class="modal__product_container">
        <img class="modal__product__img" src="${productFind["image"]}" alt="">
        <div class="modal__product_details">
            <p class="modal__product_price">$${productFind["price"]}</p><p class="modal__product_stock">Stock: ${productFind["rating"]["count"]}</p>
            <p class="modal__product_title">${productFind["title"]}</p>
            <p class="modal__product_description">${productFind["description"]}</p>
        </div>
      </div>
      `;
      modal.classList.add("active");
    }
  });
}

async function main() {
  const db = {
    products: JSON.parse(window.localStorage.getItem("products")) || await getApi(),
    cart: JSON.parse(window.localStorage.getItem("cart")) || {},
  }

  // Se ejecutan los eventos
  events();
  // Imprimimos los productos en la página
  printProducts(db);
  // Se egregan los productos al Cart
  addToCart(db);
  // Se imprimen los productos añadidos al Cart
  printToCart(db);
  // Se gestiona el manejo de las acciones dentro del Cart
  handleCart(db);
  // Se imprime la cantidad total de productos en el carrito y la suma total a pagar
  totalCart(db);
  // Se maneja el evento de la compra
  buyCart(db);
  // Elimina todos los artículos del Cart
  deleteCart(db);
  // Se maneja el evento de la ventana modal
  modalProduct(db);

}

main();