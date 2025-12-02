// app.js

// Variables globales
let users = JSON.parse(localStorage.getItem('users')) || [];
let editingId = null;
const userForm = document.getElementById('userForm');
const usersList = document.getElementById('usersList');
const noUsers = document.getElementById('noUsers');
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
let userIdToDelete = null;

// Inicializar app
document.addEventListener('DOMContentLoaded', () => {
  renderUsers();
  userForm.addEventListener('submit', saveUser);
  document.getElementById('btnCancel').addEventListener('click', cancelEdit);
  document.getElementById('confirmDelete').addEventListener('click', deleteUserConfirmed);
});

// Renderizar lista de usuarios
function renderUsers() {
  usersList.innerHTML = '';
  if (users.length === 0) {
    noUsers.style.display = 'block';
    return;
  }
  noUsers.style.display = 'none';

  users.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.phone || '—'}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-2 btn-edit" data-id="${user.id}">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${user.id}" data-name="${user.name}">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    usersList.appendChild(row);
  });

  // Añadir eventos a botones dinámicos
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.closest('button').dataset.id;
      editUser(id);
    });
  });

  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.closest('button').dataset.id;
      const name = e.target.closest('button').dataset.name;
      openDeleteModal(id, name);
    });
  });
}

// Guardar o actualizar usuario
function saveUser(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();

  // Validación básica
  if (!name || !email) {
    alert('Por favor, complete todos los campos obligatorios.');
    return;
  }

  if (!validateEmail(email)) {
    alert('Por favor, ingrese un correo electrónico válido.');
    return;
  }

  const userData = { name, email, phone };

  if (editingId) {
    // Actualizar
    const index = users.findIndex(u => u.id == editingId);
    if (index !== -1) {
      users[index] = { ...users[index], ...userData };
    }
    editingId = null;
    document.getElementById('btnCancel').style.display = 'none';
    document.querySelector('.card-header').textContent = 'Agregar Nuevo Usuario';
  } else {
    // Crear nuevo
    const newId = Date.now().toString();
    users.push({ id: newId, ...userData });
  }

  // Guardar en localStorage
  localStorage.setItem('users', JSON.stringify(users));
  renderUsers();
  userForm.reset();
  showAlert('Usuario guardado exitosamente.', 'success');
}

// Editar usuario
function editUser(id) {
  const user = users.find(u => u.id == id);
  if (!user) return;

  editingId = id;
  document.getElementById('userId').value = id;
  document.getElementById('name').value = user.name;
  document.getElementById('email').value = user.email;
  document.getElementById('phone').value = user.phone || '';

  document.querySelector('.card-header').textContent = 'Editar Usuario';
  document.getElementById('btnCancel').style.display = 'inline-block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Cancelar edición
function cancelEdit() {
  editingId = null;
  userForm.reset();
  document.getElementById('btnCancel').style.display = 'none';
  document.querySelector('.card-header').textContent = 'Agregar Nuevo Usuario';
}

// Abrir modal de eliminación
function openDeleteModal(id, name) {
  userIdToDelete = id;
  document.getElementById('userNameToDelete').textContent = name;
  deleteModal.show();
}

// Confirmar eliminación
function deleteUserConfirmed() {
  users = users.filter(u => u.id != userIdToDelete);
  localStorage.setItem('users', JSON.stringify(users));
  renderUsers();
  deleteModal.hide();
  showAlert('Usuario eliminado.', 'info');
}

// Validar email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Mostrar mensaje (puedes mejorar con Toasts si quieres)
function showAlert(message, type = 'info') {
  // En entorno profesional, usarías Bootstrap Toasts
  // Aquí usamos alert para simplicidad, pero puedes reemplazarlo
  console.log(`[${type.toUpperCase()}] ${message}`);
}