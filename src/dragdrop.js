// ------------------------------
// 6. Drag & drop (event delegation sur le board)
// ------------------------------
export function setupDragAndDrop(manager, boardElement) {
  let draggedTaskElement = null;
  // début du drag
  boardElement.addEventListener("dragstart", (event) => {
    const taskEl = event.target.closest(".app-trello__task");
    if (!taskEl) return;

    draggedTaskElement = taskEl;
    taskEl.classList.add("is-dragging");
  });

  // fin du drag
  boardElement.addEventListener("dragend", (event) => {
    const taskEl = event.target.closest(".app-trello__task");
    if (!taskEl) return;

    draggedTaskElement = null;
    taskEl.classList.remove("is-dragging");
  });

  // survol d'une liste pendant le drag
  boardElement.addEventListener("dragover", (event) => {
    const list = event.target.closest(".app-trello__task-list");
    if (!list) return;

    // autorise le drop dans cette liste
    event.preventDefault();

    // reset des surbrillances
    document
      .querySelectorAll(".app-trello__column--highlight")
      .forEach((col) => col.classList.remove("app-trello__column--highlight"));

    const column = list.closest(".app-trello__column");
    if (column) {
      column.classList.add("app-trello__column--highlight");
    }
  });

  // dépôt de la tâche
  boardElement.addEventListener("drop", (event) => {
    const list = event.target.closest(".app-trello__task-list");
    if (!list || !draggedTaskElement) return;

    event.preventDefault();

    // On ajoute visuellement
    list.appendChild(draggedTaskElement);

    // On met à jour l'état du modèle (TaskManager)
    const id = Number(draggedTaskElement.dataset.taskId);
    const column = list.closest(".app-trello__column");
    const newState = column?.dataset.column || "todo";

    manager.changeTaskState(id, newState);

    // On enlève la surbrillance
    document
      .querySelectorAll(".app-trello__column--highlight")
      .forEach((col) => col.classList.remove("app-trello__column--highlight"));
  });
}
