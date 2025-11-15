// --- Sélection des éléments du DOM ---

const forms = document.querySelectorAll(".app-trello__task-form");
const lists = document.querySelectorAll(".app-trello__task-list");

// Variable globale qui contiendra la tâche en cours de déplacement
let draggedTask = null;

// --- Fonction utilitaire : création d'une tâche ---

forms.forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const input = form.querySelector("input");
    const txt = input.value.trim();
    if (!txt) {
      return;
    }
    const li = document.createElement("li");
    li.textContent = txt;

    // On rend la nouvelle tâche draggable
    makeTaskDraggable(li);

    //ajouter dans la bonne liste
    form.parentElement.querySelector(".app-trello__task-list").appendChild(li);

    input.value = "";
  });
});

// --- Fonction : rendre une tâche draggable (déplaçable) ---
function makeTaskDraggable(li) {
  // On dit au navigateur : cet élément peut être glissé
  li.setAttribute("draggable", "true");

  // Quand on commence à le glisser
  li.addEventListener("dragstart", () => {
    draggedTask = li; // on garde une référence vers la tâche
    li.classList.add("is-dragging"); // petite classe CSS pour le style
  });

  // Quand on lâche la souris (fin du drag)
  li.addEventListener("dragend", () => {
    draggedTask = null; // on oublie la tâche en cours
    li.classList.remove("is-dragging");
  });
}

// --- Rendre les tâches déjà présentes dans le HTML déplaçables ---
document
  .querySelectorAll(".app-trello__task-list li")
  .forEach((li) => makeTaskDraggable(li));

  
  
// --- Préparer les listes comme zones de dépôt ---
lists.forEach((list) => {
  // dragover est déclenché quand on survole la liste avec un élément en drag
  list.addEventListener("dragover", (event) => {
    // Par défaut, le navigateur n'autorise pas le drop → on doit empêcher ce comportement
    event.preventDefault();

    // On ajoute une classe à la colonne pour la surbrillance
    const column = list.closest(".app-trello__column");
    column.classList.add("app-trello__column--highlight");
  });

  // Quand on quitte la zone de la liste sans déposer
  list.addEventListener("dragleave", () => {
    const column = list.closest(".app-trello__column");
    column.classList.remove("app-trello__column--highlight");
  });

  // Quand on lâche la tâche dans la liste (drop)
  list.addEventListener("drop", (event) => {
    event.preventDefault(); // par sécurité

    if (!draggedTask) return; // si pour une raison quelconque on n'a rien

    // On ajoute la tâche à cette liste
    list.appendChild(draggedTask);

    const column = list.closest(".app-trello__column");
    column.classList.remove("app-trello__column--highlight");
  });
});