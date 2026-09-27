import { req_getListeCocktails } from "./requetes.js";
import { Cocktail } from "./Cocktail.js";

let tabObjCocktails = [];

// Fonction unique pour obtenir la liste des cockails par requetes.js et le serveur, et créer des instances de la classe Cocktail
export const obtenirListeCocktails = async () => {
  const tabCocktails = await req_getListeCocktails();
  tabObjCocktails = []; // On réinitialise le tableau chaque fois que la fonction est appelée
  tabCocktails.forEach((cocktail) => {
    tabObjCocktails.push(
      new Cocktail(
        cocktail.name,
        cocktail.glass,
        cocktail.category,
        cocktail.ingredients,
        cocktail.garnish,
        cocktail.preparation,
        cocktail.image,
        cocktail.id,
        cocktail.prix
      )
    );
  });
  afficherListeCocktails(tabObjCocktails);
};

// Fonction pour afficher les cards de tous les cocktails
export const afficherListeCocktails = async (tabAAfficher) => {
  let listeCards = `<div class="row">`;
  tabAAfficher.forEach((unCocktail) => {
    listeCards += unCocktail.obtenirCardCocktail();
  });
  listeCards += `</div>`;
  document.getElementById("lst_cocktails").innerHTML = listeCards;
};

// Fonction pour afficher le formulaire de recherche des ingrédients
export const afficherRechercheIngredients = () => {
  return `
  <div class="container-sm">
    <form class="formulaire-perso" id="form-perso">
    <div class="mb-3">
      <label for="ingredientCherche" class="form-label nom-recherche">Chercher un ingrédient : </label>
      <input type="text" class="form-control" id="ingredientCherche" aria-describedby="emailHelp">
    </div>
    <p id="message-erreur"></p>
    <button type="submit" id="bouton-recherche" class="btn btn-primary btn-perso">Recherche</button>
  </form>
</div>
  `;
};
// Fonction pour chercher l'ingrédient tapé par l'utilisateur dans le fichier JSON
export const chercherIngredients = async (ingredient) => {
  const cocktailsIngredient = tabObjCocktails.filter((cocktail) => {
    if (!cocktail.ingredients) return false;

    return cocktail.ingredients.some((ing) =>
      ing?.ingredient?.toLowerCase().includes(ingredient.toLowerCase())
    );
  });
  return cocktailsIngredient;
};

// Fonction pour afficher les cards des cocktails qui incluent l'ingrédient cherché par l'utilisateur
export const afficherCocktailsAvecIngredients = (cocktailsIngredient) => {
  if (!cocktailsIngredient || cocktailsIngredient.length === 0) {
    document.getElementById("message-erreur").innerText =
      "Désolé.  Aucun cocktail avec cet ingrédient.";
    document.getElementById("lst_cocktails").innerHTML = "";
  } else {
    document.getElementById("message-erreur").innerText = "";

    let listeCardsIngredient = `<div class="row">`;
    cocktailsIngredient.forEach((unCocktail) => {
      listeCardsIngredient += unCocktail.obtenirCardCocktail();
    });

    listeCardsIngredient += `</div>`;
    document.getElementById("lst_cocktails").innerHTML = listeCardsIngredient;
  }
};

// Fonction pour rechercher les cocktails par nom
export const rechercherCocktail = (nom) => {
  const terme = nom.toLowerCase().trim();
  if (!terme) {
    afficherListeCocktails(tabObjCocktails);
    return;
  }

  const cocktailsFiltres = tabObjCocktails.filter((cocktail) =>
    (cocktail.name || "").toLowerCase().includes(terme)
  );
  afficherListeCocktails(cocktailsFiltres);
};

// Fonction pour rechercher les cocktails par ID
export const trouverCocktail = (id) => {
  const numero = parseInt(id.trim());
  if (!numero) {
    afficherListeCocktails(tabObjCocktails);
    return tabObjCocktails;
  }

  const cocktailTrouve = tabObjCocktails.filter(
    (cocktail) => cocktail.id === numero
  );
  afficherListeCocktails(cocktailTrouve);
  return cocktailTrouve.length > 0 ? cocktailTrouve : null;
};

// Fonction pour créer les catégories dans le menu déroulant
export const creerListeCategories = async () => {
  if (tabObjCocktails.length === 0) return;
  const categories = new Set();
  tabObjCocktails.forEach((cocktail) => {
    if (cocktail.category && cocktail.category !== "<br>") {
      // Pour éviter les erreurs avec le getter de category
      cocktail.category.split(",").forEach((cat) => {
        categories.add(cat.trim());
      });
    }
  });
  const tabCategs = [...categories].sort();

  const dropdown = document.getElementById("dropdown-categories");
  dropdown.innerHTML =
    `<li><a class="dropdown-item" href="#" data-categorie="Tous">Tous</a></li>` +
    `<li><hr class="dropdown-divider"></li>`;
  tabCategs.forEach((cat) => {
    dropdown.innerHTML += `<li><a class="dropdown-item" href="#" data-categorie="${cat}">${cat}</a></li>`;
  });
};

// Fonction pour filtrer les coctails par catégorie
export const filtrerParCategory = (category) => {
  if (category === "Tous") {
    afficherListeCocktails(tabObjCocktails);
    return;
  }
  const tabCocktailsCategory = tabObjCocktails.filter((cocktail) => {
    if (!cocktail.category || cocktail.category === "<br>") {
      return false;
    }
    const categsCocktail = cocktail.category.split(",");
    const listeCategs = categsCocktail.map((ctg) => ctg.trim().toLowerCase());
    return listeCategs.includes(category.toLowerCase());
  });
  afficherListeCocktails(tabCocktailsCategory);
};

// Fonction pour trier les cocktails
export const trierCocktails = (champ, ordre) => {
  const copieTabCocktails = [...tabObjCocktails].sort((a, b) => {
    let valA, valB;
    if (champ === "prix") {
      valA = parseFloat(a.prix) || 0;
      valB = parseFloat(b.prix) || 0;
      return ordre === "asc" ? valA - valB : valB - valA;
    } else if (champ === "nb_ing") {
      valA = a.ingredients.length || 0;
      valB = b.ingredients.length || 0;
      return ordre === "asc" ? valA - valB : valB - valA;
    } else {
      valA = a[champ] || "";
      valB = b[champ] || "";
      return ordre === "asc"
        ? valA.localeCompare(valB, undefined, { sensitivity: "base" })
        : valB.localeCompare(valA, undefined, { sensitivity: "base" });
    }
  });
  afficherListeCocktails(copieTabCocktails);
};

// Fonction pour filtrer les cocktails par prix
export const filtrerParPrix = (de, a) => {
  let prixMin = parseFloat(de) || 0;
  let prixMax = parseFloat(a) || 9999;

  // Je gère les cas où l'utilisateur entre un montant plus gros pour prixMin que pour prixMax.  C'est pourquoi j'ai déclaré prixMin et prixMax comme des let.
  if (prixMin > prixMax) {
    [prixMin, prixMax] = [prixMax, prixMin];
  }

  const cocktailsTriesPrix = tabObjCocktails.filter((cocktail) => {
    const prix = parseFloat(cocktail.prix) || 0;
    return prix >= prixMin && prix <= prixMax;
  });
  afficherListeCocktails(cocktailsTriesPrix);
};
