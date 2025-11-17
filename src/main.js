import { TaskManager } from "./model.js";
import {
  initTasksFromDom,
  setupFormHandlers,
  setupDeleteHandlers,
} from "./dom.js";
import { setupDragAndDrop } from "./dragdrop.js";


// Sélectionne le board complet

const board = document.querySelector(".app-trello__container");

// Crée le gestionnaire de taches
const manager = new TaskManager();

//1. Transformer les li existantes en vraies tasks + li propres
initTasksFromDom(manager, board)

//2. Gestion des formulaires (ajout des taches)
setupFormHandlers(manager, board)

//3. Gestion du bouton supprimer
setupDeleteHandlers(manager, board)

//4. Gestion du drag&drop
setupDragAndDrop(manager, board)



