// Sidebar desplegable
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggle-menu');

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
});

// Secciones
const sections = document.querySelectorAll('.section');
const menuLinks = document.querySelectorAll('.sidebar-menu li a');

menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.dataset.section;
        sections.forEach(sec => sec.classList.remove('active'));
        document.getElementById(target).classList.add('active');
    });
});

// Usuarios y puntos
const createUserBtn = document.getElementById('create-user');
const usernameInput = document.getElementById('username');
const userMessage = document.getElementById('user-message');
const currentUserSpan = document.getElementById('current-user');
const currentPointsSpan = document.getElementById('current-points');
const addPointsBtn = document.getElementById('add-points');
const rankingList = document.getElementById('ranking-list');

// Crear usuario
createUserBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (!username) {
        userMessage.textContent = "El nombre de usuario no puede estar vacío";
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (!users[username]) users[username] = 0;
    localStorage.setItem('users', JSON.stringify(users));

    currentUserSpan.textContent = username;
    currentPointsSpan.textContent = users[username];
    userMessage.textContent = `Usuario "${username}" creado o cargado`;
});

// Sumar puntos
addPointsBtn.addEventListener('click', () => {
    const username = currentUserSpan.textContent;
    if (!username || username === 'Ninguno') return alert('Primero crea un usuario');
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    users[username] += 1;
    localStorage.setItem('users', JSON.stringify(users));
    currentPointsSpan.textContent = users[username];
});

// Mostrar ranking
function updateRanking() {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const sorted = Object.entries(users).sort((a,b) => b[1]-a[1]);
    rankingList.innerHTML = '';
    sorted.forEach(([name, points]) => {
        const li = document.createElement('li');
        li.textContent = `${name}: ${points} puntos`;
        rankingList.appendChild(li);
    });
}

// Actualizar ranking al abrir sección
document.querySelector('[data-section="ranking"]').addEventListener('click', updateRanking);
