export class Cocktail {
  // Déclaration des variables privées
  #name;
  #glass;
  #category;
  #ingredients;
  #garnish;
  #preparation;
  #image;
  #id;
  #prix;

  // Constructeur de la classe Cocktail
  constructor(
    name,
    glass,
    category,
    ingredients,
    garnish,
    preparation,
    image,
    id,
    prix
  ) {
    this.#name = name;
    this.#glass = glass;
    this.#category = category;
    this.#ingredients = ingredients;
    this.#garnish = garnish;
    this.#preparation = preparation;
    this.#image = image;
    this.#id = id;
    this.#prix = prix;
  }

  // Getters
  get name() {
    return this.#name;
  }
  get glass() {
    return this.#glass;
  }
  get category() {
    return this.#category ? this.#category : "<br>"; // On gère les cas où la catégorie est absente dans le fichier .json
  }
  get ingredients() {
    return this.#ingredients;
  }
  get garnish() {
    return this.#garnish;
  }
  get preparation() {
    if (!this.#preparation) return ""; // Pour gérer les cas où il n'y aurait pas de préparation fournie

    return this.#preparation.length <= 80
      ? this.#preparation
      : this.#preparation.slice(0, 80) + "..."; // On gère les cas où les paragraphes de préparation sont trop longs.
  }
  get image() {
    return this.#image;
  }
  get id() {
    return this.#id;
  }
  get prix() {
    return this.#prix;
  }
  // Setters
  set name(name) {
    this.#name = name;
  }
  set glass(glass) {
    this.#glass = glass;
  }
  set category(category) {
    this.#category = category;
  }
  set ingredients(ingredients) {
    this.#ingredients = ingredients;
  }
  set garnish(garnish) {
    this.#garnish = garnish;
  }
  set preparation(preparation) {
    this.#preparation = preparation;
  }
  set image(image) {
    this.#image = image;
  }
  set id(id) {
    this.#id = id;
  }
  set prix(prix) {
    this.#prix = prix;
  }

  toString = () => {
    return `${this.#name} - ${this.#category} - ${this.#prix}`;
  };

  obtenirCardCocktail = () => {
    return `
        <div class="cocktail-card" style="width: 18rem;">
        <img src="${this.image}" class="card-img-top" alt="${this.name}">
        <div class="card-body">
            <h5 class="card-title">${this.id} - ${this.name}</h5>
            <p class="card-text">${this.category}</p>
            <p class="card-text">Ingrédient principal : ${this.ingredients[0].ingredient}</p>
            <p class="card-text">${this.preparation}</p>
            <p class="card-text">Prix : ${this.prix} $</p>
            <a href="#" class="btn btn-primary btn-perso">Voir la recette</a>
            <a href="#" class="btn btn-secondary btn-sm btn-second-perso"><i class="fa-solid fa-share"></i></a>
        </div>
        </div>`;
  };
}
