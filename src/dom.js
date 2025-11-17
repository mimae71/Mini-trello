// ------------------------------
// 3. Helpers DOM
// ------------------------------

// crée l'élément <li> correspondant à une Task
export function createTaskElement(task) {
  const li = document.createElement("li");
  li.classList.add("app-trello__task");
  li.setAttribute("draggable", "true");
  li.dataset.taskId = String(task.id); // lien DOM ↔ objet

  const span = document.createElement("span");
  span.className = "app-trello__task-text";
  span.textContent = task.text;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "app-trello__task-delete";
  deleteBtn.type = "button";
  deleteBtn.textContent = "✕";
  deleteBtn.setAttribute("aria-label", `Supprimer la tâche "${task.text}"`);

  li.append(span, deleteBtn);

  return li;
}

// ------------------------------
// 4. Initialisation
// ------------------------------

// 4.a. On récupère les <li> existantes dans le HTML
export function initTasksFromDom(manager, boardElement) {
  const initialLis = boardElement.querySelectorAll(".app-trello__task-list li");

  initialLis.forEach((oldLi) => {
    const column = oldLi.closest(".app-trello__column");
    if (!column) return;

    const state = column.dataset.column || "todo"; // "todo" / "doing" / "done"
    const text = oldLi.textContent.trim();
    if (!text) {
      oldLi.remove();
      return;
    }

    // On crée l'objet Task
    const task = manager.createTask(text, state);

    // On crée le nouveau DOM propre
    const newLi = createTaskElement(task);

    // On remplace l'ancien <li> par le nouveau
    oldLi.replaceWith(newLi);
  });
}
// ------------------------------
// 5. Gestion des formulaires (ajout de tâches)
// ------------------------------
export function setupFormHandlers(manager, boardElement) {
  const forms = boardElement.querySelectorAll(".app-trello__task-form");

  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const input = form.querySelector("input");
      const text = input.value.trim();
      if (!text) return;

      const column = form.closest(".app-trello__column");
      const state = column?.dataset.column || "todo";

      // 1. Créer l'objet Task
      const task = manager.createTask(text, state);

      // 2. Créer le DOM <li> correspondant
      const li = createTaskElement(task);

      // 3. L'ajouter dans la bonne colonne
      const list = column.querySelector(".app-trello__task-list");
      list.appendChild(li);

      input.value = "";
    });
  });
}
// ------------------------------
// 7. Suppression des tâches (event delegation)
// ------------------------------
export function setupDeleteHandlers(manager, boardElement) {
  boardElement.addEventListener("click", (event) => {
    const deleteBtn = event.target.closest(".app-trello__task-delete");
    if (!deleteBtn) return;

    const taskEl = deleteBtn.closest(".app-trello__task");
    if (!taskEl) return;

    const id = Number(taskEl.dataset.taskId);

    // 1. On supprime du modèle
    manager.deleteTask(id);

    // 2. On supprime du DOM
    taskEl.remove();
  });
}
