// ------------------------------
// 1. Modèle : classe Task
// ------------------------------
export class Task {
  constructor(id, text, state) {
    this.id = id; // identifiant unique
    this.text = text; // contenu de la tâche
    this.state = state; // "todo" | "doing" | "done"
  }

  changeState(newState) {
    const allowedStates = ["todo", "doing", "done"];
    if (!allowedStates.includes(newState)) {
      throw new Error(`État invalide : ${newState}`);
    }
    this.state = newState;
  }
}
// ------------------------------
// 2. Gestionnaire : TaskManager
// ------------------------------
export class TaskManager {
  constructor() {
    this.tasks = []; // toutes les tâches
    this.nextId = 1; // compteur pour générer des id
  }

  createTask(text, state) {
    const task = new Task(this.nextId++, text, state);
    this.tasks.push(task);
    return task;
  }

  getTaskById(id) {
    return this.tasks.find((task) => task.id === id);
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  changeTaskState(id, newState) {
    const task = this.getTaskById(id);
    if (task) {
      task.changeState(newState);
    }
  }
}
