// =============================================================================
// serveur.js — Serveur Node.js avec Express
// Cours : 420-931-MA (Développement Web)
// Description : Serveur Express qui expose des routes pour les cocktails
//               et sert les fichiers statiques du client.
// =============================================================================

// -----------------------------------------------------------------------------
// Importation des modules (syntaxe ES6+)
// -----------------------------------------------------------------------------
import express from "express"; // Module externe — Framework web pour Node.js
import { readFile, writeFile } from "node:fs/promises"; // Module natif — Lecture de fichiers asynchrone avec async/await
import path, { dirname } from "node:path"; // Module natif — Manipulation des chemins de fichiers
import { fileURLToPath } from "node:url"; // Module natif — Conversion de l'URL du module en chemin fichier

// Reconstruction de __dirname (non disponible nativement avec les modules ES6+)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// -----------------------------------------------------------------------------
// Configuration de l'application Express
// -----------------------------------------------------------------------------
const app = express();
const PORT = process.env.PORT || 3000; // Port d'écoute (variable d'env ou 3000 par défaut)

// -----------------------------------------------------------------------------
// Chemins importants
// -----------------------------------------------------------------------------
// Répertoire contenant les fichiers statiques du client (HTML, CSS, JS, images…)
const REPERTOIRE_CLIENT = path.join(__dirname, "client");

// Fichier JSON contenant la liste des cocktails
const FICHIER_COCKTAILS = path.join(
  __dirname,
  "serveur",
  "donnees",
  "cocktails.json",
);

// -----------------------------------------------------------------------------
// Middleware
// -----------------------------------------------------------------------------

// Permet à Express de lire les corps de requêtes au format JSON (POST / PUT)
app.use(express.json());

// Sert automatiquement tous les fichiers du dossier « client/ » en tant que
// ressources statiques (index.html, style.css, app.js, images, etc.)
app.use(express.static(REPERTOIRE_CLIENT));

async function lireFichierCocktails() {
  const contenu = await readFile(FICHIER_COCKTAILS, "utf-8");
  return JSON.parse(contenu);
}

async function ecrireFichierCocktails(tabCocktails) {
  const contenu = JSON.stringify(tabCocktails, null, 2);
  await writeFile(FICHIER_COCKTAILS, contenu, "utf-8");
}

// Une fonction qui utilise la fonctione ecrireFichierCocktails pour ajouter des id et des prix dans le fichier JSON
async function ajouterIDetPrix() {
  const cocktails = await lireFichierCocktails();

  const cocktailsMisAJour = cocktails.map((cocktail, index) => {
    return {
      ...cocktail,
      id: index + 1,
      prix: ((cocktail.ingredients?.length || 0) * 5).toFixed(2),
    };
  });

  await ecrireFichierCocktails(cocktailsMisAJour);
}

// ajouterIDetPrix().then(() => {
//   console.log("Fichier JSON mis à jour avec les ID et les prix.");
// });
// J'ai appelé ma fonction une seule fois, et maintenant, je n'en ai plus besoin.

// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------

// GET / — Retourne la page principale index.html.
app.get("/", (req, res) => {
  res.sendFile(path.join(REPERTOIRE_CLIENT, "index.html"));
});

// GET /cocktails — Retourne la liste complète des cocktails en JSON.
app.get("/cocktails", async (req, res) => {
  try {
    const cocktails = await lireFichierCocktails();
    res.json(cocktails);
  } catch (erreur) {
    console.error("Erreur lors de la lecture des cocktails :", erreur);
    res.status(500).json({ message: "Impossible de charger les films." });
  }
});

// -----------------------------------------------------------------------------
// Démarrage du serveur
// -----------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log(`  Serveur démarré avec succès !`);
  console.log(`  Adresse : http://localhost:${PORT}`);
  console.log("=".repeat(50));
});
