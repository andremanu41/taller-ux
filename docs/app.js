// Elementos del DOM
const noteForm = document.getElementById("note-form");
const noteInput = document.getElementById("note-input");
const submitBtn = document.getElementById("submit-btn");
const notesContainer = document.getElementById("notes-container");
const emptyMessage = document.getElementById("empty-message");
const toastContainer = document.getElementById("toast-container");

// Estado de la aplicación
let notes = [];
let lastDeletedNote = null;
let deleteTimeout = null;

// ==========================================
// PREVENCIÓN DE ERRORES EN TIEMPO REAL
// ==========================================
noteInput.addEventListener("input", () => {
  // Deshabilita el botón de manera activa si solo hay espacios en blanco
  submitBtn.disabled = noteInput.value.trim() === "";
});

// ==========================================
// ATAJO DE TECLADO (Eficiencia de Uso)
// ==========================================
noteInput.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    if (noteInput.value.trim() !== "") {
      e.preventDefault();
      noteForm.requestSubmit();
    }
  }
});

// ==========================================
// LOGICA DE NOTAS
// ==========================================
noteForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = noteInput.value.trim();
  if (text === "") return; // Doble capa de seguridad

  const newNote = {
    id: Date.now().toString(),
    text: text,
  };

  notes.push(newNote);
  renderNotes();
  showToast("Nota agregada correctamente");

  // Limpieza y reseteo del botón
  noteForm.reset();
  submitBtn.disabled = true;
});

function renderNotes() {
  // Limpiar contenedor dejando solo el mensaje vacío si corresponde
  notesContainer.innerHTML = "";

  if (notes.length === 0) {
    notesContainer.appendChild(emptyMessage);
    return;
  }

  notes.forEach((note) => {
    const card = document.createElement("div");
    card.className = "note-card";

    const p = document.createElement("p");
    p.className = "note-text";
    p.textContent = note.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Eliminar";
    // Accesibilidad: El botón anuncia exactamente qué elemento afectará
    deleteBtn.setAttribute(
      "aria-label",
      `Eliminar nota: ${note.text.substring(0, 15)}...`
    );

    deleteBtn.addEventListener("click", () => prepareDelete(note.id));

    card.appendChild(p);
    card.appendChild(deleteBtn);
    notesContainer.appendChild(card);
  });
}

// ==========================================
// FEEDBACK VISIBLE Y ACCIÓN DE DESHACER
// ==========================================
function prepareDelete(id) {
  // Si ya había una nota en espera de ser borrada permanentemente, la borramos ya
  if (deleteTimeout) {
    clearTimeout(deleteTimeout);
    executeDelete();
  }

  // Guardamos la referencia para el Deshacer
  lastDeletedNote = notes.find((n) => n.id === id);
  // La quitamos de la vista temporalmente
  notes = notes.filter((n) => n.id !== id);
  renderNotes();

  showToast("Nota eliminada", true);

  // Espera 5 segundos antes de borrar definitivamente
  deleteTimeout = setTimeout(() => {
    executeDelete();
  }, 5000);
}

function executeDelete() {
  lastDeletedNote = null;
  deleteTimeout = null;
}

function undoDelete() {
  if (lastDeletedNote && deleteTimeout) {
    clearTimeout(deleteTimeout);
    notes.push(lastDeletedNote);
    // Ordenar de nuevo por ID (orden cronológico)
    notes.sort((a, b) => a.id - b.id);
    renderNotes();
    executeDelete();
    showToast("Acción cancelada: Nota restaurada");
  }
}

function showToast(message, showUndo = false) {
  const toast = document.createElement("div");
  toast.className = "toast";

  const span = document.createElement("span");
  span.textContent = message;
  toast.appendChild(span);

  if (showUndo) {
    const undoBtn = document.createElement("button");
    undoBtn.className = "undo-btn";
    undoBtn.textContent = "Deshacer";
    undoBtn.addEventListener("click", () => {
      undoDelete();
      toast.remove();
    });
    toast.appendChild(undoBtn);
  }

  toastContainer.appendChild(toast);

  // Auto eliminar el toast del DOM después de 4 segundos si no es de deshacer
  setTimeout(
    () => {
      if (toast.parentNode) {
        toast.remove();
      }
    },
    showUndo ? 5000 : 3000
  );
}
