import {
  obtenirListeCocktails,
  creerListeCategories,
  filtrerParCategory,
  filtrerParPrix,
  trierCocktails,
  afficherRechercheIngredients,
  chercherIngredients,
  afficherCocktailsAvecIngredients,
  rechercherCocktail,
  trouverCocktail
} from "./modules/affichage.js";

// Fonction pour afficher les cards de tous les cocktails au chargement de la page
document.addEventListener("DOMContentLoaded", async () => {
  await obtenirListeCocktails();
  await creerListeCategories();
});

const boutoningredients = document.querySelector("#recherche-ingredients");
const listecocktail = document.getElementById("lst_cocktails");
const accueil = document.getElementById("lien-accueil");
const rechercheIngredients = document.getElementById("recherche-ingredient");

// Fonction pour détecter si l'utilisateur clique sur le bouton pour chercher par ingrédients et pour afficher le formulaire de recherche
boutoningredients.addEventListener("click", (event) => {
  event.preventDefault();
  listecocktail.classList.add("hidden");
  rechercheIngredients.classList.remove("hidden");
  rechercheIngredients.innerHTML = afficherRechercheIngredients();
  const formulaireiIngredient = document.getElementById("form-perso");

  formulaireiIngredient.addEventListener("submit", async (event) => {
    event.preventDefault();

    const ingredientSaisi = document
      .getElementById("ingredientCherche")
      .value.trim();

    // Gestion si l'ingrédient n'est pas trouvé dans le fichier JSON
    const zoneErreur = document.getElementById("message-erreur");

    // Si des cocktails sont trouvé, on affiche les cards des cocktails correspondant à la recherche
    if (ingredientSaisi !== "") {
      const resultatsTrouves = await chercherIngredients(ingredientSaisi);
      afficherCocktailsAvecIngredients(resultatsTrouves);
      if (resultatsTrouves.length > 0) {
        if (zoneErreur) zoneErreur.innerText = "";
        rechercheIngredients.classList.add("hidden");
        listecocktail.classList.remove("hidden");
      } else {
        rechercheIngredients.classList.remove("hidden");
        listecocktail.classList.add("hidden");
      }
    }
  });
});

// Fonction pour réafficher toutes les cards de tous les cocktails
accueil.addEventListener("click", (event) => {
  event.preventDefault();
  if (inputRecherche) inputRecherche.value = "";
  rechercheIngredients.classList.add("hidden");
  listecocktail.classList.remove("hidden");
  obtenirListeCocktails();
});

// Fonctions pour gérer le formulaire de recherche par nom
const inputRecherche = document.querySelector("#recherche-nom input");
const formRecherche = document.querySelector("#recherche-nom");

inputRecherche.addEventListener("input", () => {
  rechercherCocktail(inputRecherche.value);
  rechercheIngredients.classList.add("hidden"); // Je m'Assure que le formulaire de recherche par ingrédient n'est pas affiché
  listecocktail.classList.remove("hidden");
});

formRecherche.addEventListener("submit", (e) => {
  e.preventDefault();
  rechercherCocktail(inputRecherche.value);
  listecocktail.classList.remove("hidden");
  rechercheIngredients.classList.add("hidden"); // Je m'Assure que le formulaire de recherche par ingrédient n'est pas affiché
});

// Fonctions pour gérer le formulaire de recherche par ID
const inputRechercheID = document.querySelector("#recherche-id input");
const formRechercheID = document.querySelector("#recherche-id");

formRechercheID.addEventListener("submit", async (e) => {
  e.preventDefault();
  const resultatID = await trouverCocktail(inputRechercheID.value);
  if (!resultatID) {
    document.getElementById("lst_cocktails").innerHTML =
      `<h2 class="titre-erreur">Désolé.  Aucun cocktail trouvé avec cet ID.</h2>`; //  Gestion si aucun cocktail ne correspond à l'ID
  } else {
    listecocktail.classList.remove("hidden");
  }
  rechercheIngredients.classList.add("hidden"); // Je m'Assure que le formulaire de recherche par ingrédient n'est pas affiché
});

// Fonction pour que l'utilisateur puisse choisir une catégorie pour le tri
document
  .getElementById("dropdown-categories")
  .addEventListener("click", (e) => {
    const item = e.target.closest("[data-categorie]");
    e.preventDefault();
    filtrerParCategory(item.dataset.categorie);
    rechercheIngredients.classList.add("hidden");
    listecocktail.classList.remove("hidden");
  });

// Fonction pour que l'utilisateur puisse trier les coktails
document.getElementById("dropdown-tri").addEventListener("click", (e) => {
  const item = e.target.closest("[data-champ]");
  e.preventDefault();
  trierCocktails(item.dataset.champ, item.dataset.ordre);
  rechercheIngredients.classList.add("hidden");
  listecocktail.classList.remove("hidden");
});

// Fonction pour permettre à l'utilisateur de filtrer selon les prix
document
  .getElementById("bouton-filtrer-prix")
  .addEventListener("click", (event) => {
    event.preventDefault();
    const de = document.getElementById("prix-min").value;
    const a = document.getElementById("prix-max").value;
    filtrerParPrix(de, a);
    rechercheIngredients.classList.add("hidden");
    listecocktail.classList.remove("hidden");
  });
