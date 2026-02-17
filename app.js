(() => {

// ---------- DATA ----------
const recipes=[
{ id:1,title:"Pasta",ingredients:["flour","cheese"],steps:["Boil","Mix"]},
{ id:2,title:"Salad",ingredients:["lettuce","tomato"],steps:["Cut","Serve"]},
{ id:3,title:"Cake",ingredients:["sugar","flour"],steps:["Bake","Decorate"]},
{ id:4,title:"Soup",ingredients:["water","vegetables"],steps:["Cook","Serve"]}
];

// ---------- ELEMENTS ----------
const container=document.getElementById("recipeContainer");
const searchInput=document.getElementById("searchInput");
const sortSelect=document.getElementById("sortSelect");
const favFilter=document.getElementById("favFilter");
const counter=document.getElementById("counter");

// ---------- LOCAL STORAGE ----------
let favorites=JSON.parse(localStorage.getItem("favorites")) || [];

// ---------- DEBOUNCE ----------
function debounce(fn,delay=400){
let timer;
return (...args)=>{
clearTimeout(timer);
timer=setTimeout(()=>fn(...args),delay);
};
}

// ---------- FILTER + SORT ----------
function getProcessedRecipes(){

let list=[...recipes];

// search
const query=searchInput.value.toLowerCase();
if(query){
list=list.filter(r=>
r.title.toLowerCase().includes(query) ||
r.ingredients.some(i=>i.toLowerCase().includes(query))
);
}

// favorites only
if(favFilter.checked){
list=list.filter(r=>favorites.includes(r.id));
}

// sort
if(sortSelect.value==="asc")
list.sort((a,b)=>a.title.localeCompare(b.title));

if(sortSelect.value==="desc")
list.sort((a,b)=>b.title.localeCompare(a.title));

return list;
}

// ---------- RENDER ----------
function render(){

const list=getProcessedRecipes();

container.innerHTML="";

list.forEach(recipe=>{

const card=document.createElement("div");
card.className="card";

const isFav=favorites.includes(recipe.id);

card.innerHTML=`

<div class="titleRow">
<h3>${recipe.title}</h3>
<span class="heart ${isFav?"fav":""}" data-id="${recipe.id}">
${isFav?"❤️":"🤍"}
</span>
</div>

<button class="toggleBtn">Show Details</button>

<div class="details">
<p><b>Ingredients:</b> ${recipe.ingredients.join(", ")}</p>
<p><b>Steps:</b> ${recipe.steps.join(" → ")}</p>
</div>
`;

container.appendChild(card);
});

counter.textContent=`Showing ${list.length} of ${recipes.length} recipes`;

}

// ---------- CLICK HANDLING ----------
container.addEventListener("click",e=>{

// toggle details
if(e.target.classList.contains("toggleBtn")){
const details=e.target.nextElementSibling;
details.classList.toggle("show");
}

// favorite toggle
if(e.target.classList.contains("heart")){

const id=Number(e.target.dataset.id);

if(favorites.includes(id))
favorites=favorites.filter(f=>f!==id);
else
favorites.push(id);

localStorage.setItem("favorites",JSON.stringify(favorites));

render();
}
});

// ---------- EVENTS ----------
searchInput.addEventListener("input",debounce(render));
sortSelect.addEventListener("change",render);
favFilter.addEventListener("change",render);

// ---------- INIT ----------
render();

})();
