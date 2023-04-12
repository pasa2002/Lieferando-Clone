let currency = "€";

let menu = [
  {
    'name': "Frühlingsrollen",
    'ingredients': "mit Gemüse ",
    'preis': 4.50,
    'amount': 0,
  },
  {
    'name': "Sake Maki",
    'ingredients': "mit Lachs",
    'preis': 8.50,
    'amount': 0,
  },
  {
    'name': "Gyoza",
    'ingredients': " mit Gemüse ",
    'preis': 5.50,
    'amount': 0,
  },
];

let cartName= [];
let cartIngredients=[];
let cartPreis= [];
let cartAmount= [];

load();

function openOverlay() {
  document.getElementById("overlays").classList.remove("d-none");
}

function closeOverlay() {
  document.getElementById("overlays").classList.add("d-none");
}

function disFavoriteShop() {
  document.getElementById("active-likes").classList.remove("d-none");
  document.getElementById("disactive-likes").classList.add("d-none");
}

function favoriteShop() {
  document.getElementById("active-likes").classList.add("d-none");
  document.getElementById("disactive-likes").classList.remove("d-none");
}

function renderMenu() {
  let content = document.getElementById("content");

  content.innerHTML = "";

  for (let i = 0; i < menu.length; i++) {
    const menus = menu[i];

    content.innerHTML += generateCardHtml(menus, i); 
    renderCartHtml();
  
  }

}


function generateCardHtml(menus,i) {
  return `
  <div class="cards">
    <div class="cards-content">
      <h2>
        ${menus["name"]}
      </h2>
      <p>
        ${menus["ingredients"]}
      </p>
      <h2>
        ${menus["preis"] + currency}
      </h2>
      <div class="add-cart" onclick="addCartItem(${i})">
        <i class="fa-solid fa-plus"></i>
      </div>
    </div>
  </div>
`;
}



function save(){
  let menusAsText = JSON.stringify(menu);
  localStorage.setItem('menu',menusAsText)
}

function load(){
  let menusAsText = localStorage.getItem('menu');

  if(menusAsText){
    menu = JSON.parse(menusAsText);
  }
}

function renderCartHtml() {
  let cartContent = document.getElementById('content-cart');
  cartContent.innerHTML = '';

  if (cartName.length == 0) {
     cartContent.innerHTML = renderEmptyCart();
  } else {
    let totalPreis = calculateSum(cartAmount, cartPreis);
    cartContent.innerHTML += renderFullCart(cartPreis, cartAmount, totalPreis);  
   }
}

function renderEmptyCart(){
  return`
  <section class="empty-cart">
    <div class="empty-cart-header">
      <h2>Warenkorb</h2>
    </div>
    <div class="empty-cart-content">
      <i class="fa-solid fa-bags-shopping"></i>
    </div>
    <div>
      Bitte fülle deine Warenkorb auf!!
    </div>
  </section>
  `
}

function renderFullCart(cartPreis, cartAmount, totalPreis) {
  return `
    <section id="cart">
      <div class="cart-header">
        <h2>Warenkorb</h2>
      </div>
      ${itemCart()}

      <div id="total">
      <h3>
        Gesamt Betrag
      </h3>
        ${totalPreis}${currency}
      </div>
    </section>
  `;
}


function itemCart(){
  let htmlText = '';

  for (let j = 0; j < cartName.length; j++) {
    const sum = menu[j].preis * cartAmount[j]
    htmlText += cardCartHtml(sum, j);
  }
  

  return htmlText;
}

function cardCartHtml(sum, index){
  return`
  <div class="cart-content">
  <h3>
    ${cartAmount[index]}
  </h3>
  <div>
    <h2>
      ${cartName[index]}
    </h2>
    <h2>
      ${cartIngredients[index]}
    </h2>
  </div>
  <h2 class="current-preis" id="current-preis${index}">
    ${sum + currency}
  </h2>
  <div class="cart-buttons">
    <button onclick="increase(${index}, ${sum})">
      +
    </button>
    <button onclick="decrease(${index})">
      -
    </button>
  </div>
</div>

  `
}


function addCartItem(i){
  let menus = menu[i];
  let menuName = menus.name;
  let menuIngredients = menus.ingredients;
  let menuPreis = menus.preis;
  let menuAmount = 1;
  let index = cartName.indexOf(menuName);

  if(index== -1){
    cartAmount.push(menuAmount);
    cartName.push(menuName);
    cartIngredients.push(menuIngredients);
    cartPreis.push(menuPreis);
  }else{
    cartAmount[index]++
  }
  renderCartHtml();
}

function increase(index, sum){
  let currentPreis = document.getElementById(`current-preis${index}`);
  currentPreis.innerHTML='';

  currentPreis.innerHTML =` 
    ${sum}${currency}
  `

  cartAmount[index]++;

  renderCartHtml();
}

function decrease(index) {
  let currentPreis = document.getElementById(`current-preis${index}`);
  currentPreis.innerHTML = '';

  if (cartAmount[index] === 1) {
    cartName.splice(index, 1);
    cartAmount.splice(index, 1);
    cartIngredients.splice(index, 1);
    cartPreis.splice(index, 1);
  } else {
    const difference = cartPreis[index] / cartAmount[index];
    cartAmount[index]--;
    currentPreis.innerHTML = `${cartPreis[index] - difference}${currency}`;
  }

  renderCartHtml();
}

function calculateSum(cartPreis, cartAmount){
  if(cartName.length === 0) {
    return NaN;
  }
  let total = cartPreis.reduce((acc, price, index) => {
    return acc + price * cartAmount[index];
  }, 0);
  return total;
}

window.onscroll = function(){

  let cart = document.getElementById('content-cart');
  if(window.scrollY>0){
    cart.style = 'top:0';
  }else{
    cart.style = 'top:157px';
  }
}