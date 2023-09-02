function events() {
  const header__button_cart = document.querySelector(".header__button_cart");
  const cart = document.querySelector(".cart");

  // Menejo de la entrada y salida del Cart en pantalla
  header__button_cart.addEventListener("click", function() {
    cart.classList.toggle("displacement_left");
});

}

function addToCart () {

  const productsHTML = document.querySelector('.main__products');
  productsHTML.addEventListener("click", function (event){
    if (event.target.classList.contains("main__product_button_add")) {
      const id = Number(event.target["id"]);
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

function main() {

  // Se ejecutan los eventos
  events();

}

main();