// ------------------------------
// 1. Modèle : Task + TaskManager
// ------------------------------

// Constructeur d'une tâche
function Task(id, text, state) {
  this.id = id;      // identifiant unique
  this.text = text;  // contenu de la tâche
  this.state = state; // "todo" | "doing" | "done"
}

// Méthode partagée par toutes les tâches pour changer d'état
Task.prototype.changeState = function (newState) {
  const allowedStates = ["todo", "doing", "done"];

  if (!allowedStates.includes(newState)) {
    throw new Error("État invalide : " + newState);
  }

  this.state = newState;
};

// Gestionnaire de tâches (le "cerveau" de l'appli)
function TaskManager() {
  this.tasks = [];    // tableau de Task
  this.idCounter = 1; // pour générer des ids uniques
}

// Ajouter une tâche
TaskManager.prototype.addTask = function (text, state) {
  const task = new Task(this.idCounter++, text, state);
  this.tasks.push(task);
  return task;
};

// Retrouver une tâche par son id
TaskManager.prototype.getTaskById = function (id) {
  return this.tasks.find((t) => t.id === id);
};

// Modifier l'état d'une tâche
TaskManager.prototype.setTaskState = function (id, newState) {
  const task = this.getTaskById(id);
  if (task) {
    task.changeState(newState);
  }
};

// Supprimer une tâche
TaskManager.prototype.deleteTask = function (id) {
  this.tasks = this.tasks.filter((t) => t.id !== id);
};

// ------------------------------
// 2. Sélection des éléments du DOM
// ------------------------------

const board = document.querySelector(".app-trello__container");
const forms = document.querySelectorAll(".app-trello__task-form");
const lists = document.querySelectorAll(".app-trello__task-list");

// Instance unique du TaskManager
const taskManager = new TaskManager();

// Référence vers la <li> qu'on est en train de dragger
let draggedTaskElement = null;

// ------------------------------
// 3. Fonctions utilitaires DOM
// ------------------------------

// Crée un élément <li> complet pour une tâche
function createTaskElement(task) {
  const li = document.createElement("li");
  li.classList.add("app-trello__task");
  li.setAttribute("draggable", "true");
  li.dataset.taskId = String(task.id); // lien DOM ↔ objet Task

  const span = document.createElement("span");
  span.className = "app-trello__task-text";
  span.textContent = task.text;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "app-trello__task-delete";
  btn.textContent = "✕";
  btn.setAttribute("aria-label", `Supprimer la tâche "${task.text}"`);

  li.append(span, btn);
  return li;
}

// Retourne l'état ("todo" | "doing" | "done") d'une colonne
function getColumnStateFromElement(columnElement) {
  return columnElement.dataset.column;
}

// ------------------------------
// 4. Initialisation : convertir les <li> existants en Task
// ------------------------------

// Pour chaque liste, on parcourt les <li> présents dans le HTML
lists.forEach((list) => {
  const column = list.closest(".app-trello__column");
  const state = getColumnStateFromElement(column);

  const existingLis = Array.from(list.querySelectorAll("li"));

  // On vide la liste pour reconstruire avec notre structure
  list.innerHTML = "";

  existingLis.forEach((oldLi) => {
    const text = oldLi.textContent.trim();
    if (!text) return;

    // 1) on crée un objet Task
    const task = taskManager.addTask(text, state);
    // 2) on crée l'élément <li> correspondant
    const li = createTaskElement(task);
    // 3) on l'ajoute dans la liste
    list.appendChild(li);
  });
});

// ------------------------------
// 5. Ajout de nouvelles tâches via les formulaires
// ------------------------------

forms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const input = form.querySelector("input");
    const text = input.value.trim();
    if (!text) return;

    // On récupère l'état de la colonne (todo / doing / done)
    const column = form.closest(".app-trello__column");
    const state = getColumnStateFromElement(column);

    // 1) On crée l'objet Task
    const task = taskManager.addTask(text, state);

    // 2) On crée le DOM correspondant
    const li = createTaskElement(task);

    // 3) On l'ajoute dans la bonne liste
    const list = column.querySelector(".app-trello__task-list");
    list.appendChild(li);

    input.value = "";
    input.focus();
  });
});

// ------------------------------
// 6. Drag & drop (event delegation sur le board)
// ------------------------------

// Démarrage du drag
board.addEventListener("dragstart", (event) => {
  const li = event.target.closest(".app-trello__task");
  if (!li) return;

  draggedTaskElement = li;
  li.classList.add("is-dragging");
});

// Fin du drag
board.addEventListener("dragend", (event) => {
  const li = event.target.closest(".app-trello__task");
  if (!li) return;

  draggedTaskElement = null;
  li.classList.remove("is-dragging");
});

// Survol d'une liste pendant le drag
board.addEventListener("dragover", (event) => {
  const list = event.target.closest(".app-trello__task-list");
  if (!list) return;

  // Autorise explicitement le drop
  event.preventDefault();

  // Retire la surbrillance de toutes les colonnes
  document
    .querySelectorAll(".app-trello__column--highlight")
    .forEach((col) => col.classList.remove("app-trello__column--highlight"));

  // Ajoute la surbrillance à la colonne survolée
  const column = list.closest(".app-trello__column");
  column.classList.add("app-trello__column--highlight");
});

// Drop : on dépose la tâche dans une nouvelle colonne
board.addEventListener("drop", (event) => {
  const list = event.target.closest(".app-trello__task-list");
  if (!list || !draggedTaskElement) return;

  event.preventDefault();

  // On ajoute la <li> dans la nouvelle liste
  list.appendChild(draggedTaskElement);

  // On met à jour l'état de l'objet Task correspondant
  const id = Number(draggedTaskElement.dataset.taskId);
  const column = list.closest(".app-trello__column");
  const newState = getColumnStateFromElement(column);

  taskManager.setTaskState(id, newState);

  // On enlève la surbrillance partout
  document
    .querySelectorAll(".app-trello__column--highlight")
    .forEach((col) => col.classList.remove("app-trello__column--highlight"));
});

// ------------------------------
// 7. Suppression d'une tâche (event delegation)
// ------------------------------

board.addEventListener("click", (event) => {
  const deleteBtn = event.target.closest(".app-trello__task-delete");
  if (!deleteBtn) return;

  const li = deleteBtn.closest(".app-trello__task");
  if (!li) return;

  const id = Number(li.dataset.taskId);

  // 1) On supprime côté "modèle" (TaskManager)
  taskManager.deleteTask(id);

  // 2) On supprime côté DOM
  li.remove();
});
