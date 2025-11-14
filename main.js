// --- Sélection des éléments du DOM ---

const form = document.querySelectorAll(".app-tello__task-form");

// --- Fonction utilitaire : création d'une tâche ---

form.forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const input = form.querySelector("input");
    const txt = input.value.trim();
    if (!txt) {
      return;
    }
    const li = document.createElement("li");
    li.textContent = txt;

    //ajouter dans la bonne liste
    form.parentElement.querySelector(".app-tello__task-list").appendChild(li);

    input.value = "";
  });
});
