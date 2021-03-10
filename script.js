const postsContainer = document.getElementById('posts-container');
const loading = document.querySelector('.loader');
const filter = document.getElementById('filter');

//limite le nombre de posts
let limit = 5;
//initialise la page
let page = 1;

// Récupérer des faux posts via une API
async function getPosts() {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`
  );

  const data = await response.json();

  return data;
}

//Affiche les posts dans le dom
async function showPosts() {
  const posts = await getPosts()
  
  posts.forEach(post => {

    //on créé une div avec la methode createElement
    const postElement = document.createElement('div')
    //on lui ajoute une classe post via la méthode classList
    postElement.classList.add('post')
    //on lui insère du HTML via la methode innerHTML + on utilise les backticks pour insérer des variables 
    postElement.innerHTML = `
      <div class="number">${post.id}</div>
      <div class="post-info">
        <h2 class="post-title">${post.title}</h2>
        <p class="post-body">${post.body}</p>
      </div>
    `
    //on l'insère au dom via la méthode appendChild
    postsContainer.appendChild(postElement)

  })
}

//Affiche le loader et montre + de posts
function showLoading() {
  //on utilise la méthode classList pour ajouter la classe de show à notre élément afin que son opacity soit de 1 et qu'il soit ainsi visible, nous avons stylé ça dans le css
  loading.classList.add('show')

  //on créé un timeout pour faire disparaitre les petits cercles au bout d'une seconde en utilisant la propriété remove de la methode classList
  setTimeout(() => {
  loading.classList.remove('show')

    //On ajoute un autre timeout pour faire une requête à l'API afin d'afficher la suite des posts
    setTimeout(() => {
      page++
      showPosts()
    }, 300)
  }, 1000)
}

//filtrer les posts en fonction de l'input
function filterPosts(e) {

  //on veut ce qui est dans l'input et on le met en uppercase pour retirer toute sensibilité à la casse
  const term = e.target.value.toUpperCase()
  //on selectionne tous les posts
  const posts = document.querySelectorAll('.post')

  //on boucle dans les titres et les contenus des posts et on les met en uppercase pour la raison citée + haut
  posts.forEach(post => {
    const title = post.querySelector('.post-title').innerText.toUpperCase()
    const body = post.querySelector('.post-body').innerText.toUpperCase()

    //on compare le body et le contenu à ce qu'on a reçu dans l'input, si il y a quelque chose de similaire on affiche, sinon on affiche pas
    //On regarde si c'est supérieur à -1 car c'est comme cela que fonctionne la methode indexOf, si c'est -1 = c'est pas dedans
    if(title.indexOf(term) > -1 || body.indexOf(term) > -1){
      post.style.display = 'flex'
    } else {
      post.style.display = 'none'
    }
  })
}

//on appelle la fonction showPosts
showPosts()

//on ajoute l'écouteur d'évenement au document
window.addEventListener('scroll', () => {
  //on utilise le destructuring pour récupérer plusieurs éléments à la fois
  //scrollTop = mesure de la distance entre le sommet de l'élément et son contenu le plus visible. Lorsque le contenu d'un élément ne génère pas de barre de défilement verticale, sa valeur scrollTop est égale à 0.
  //clientHeight = renvoie la hauteur intérieure d'un élément en pixels, y compris le padding, mais pas la hauteur de la barre de défilement horizontale, la bordure ou la marge.
  //scrollHeight = mesure de la hauteur du contenu d'un élément, y compris le contenu non visible à l'écran (overflow).
  //voir https://stackoverflow.com/questions/22675126/what-is-offsetheight-clientheight-scrollheight pour + de détails
  const {scrollTop, scrollHeight, clientHeight} = document.documentElement

  //condition trouvé sur stackoverflow
  if(scrollTop + clientHeight >= scrollHeight - 5) {
    showLoading()
  }
})

filter.addEventListener('input', filterPosts)