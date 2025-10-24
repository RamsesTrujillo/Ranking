// --- Conexión con PocketBase ---
const pb = new PocketBase('http://127.0.0.1:8090');

// --- Sidebar desplegable ---
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggle-menu');

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
});

// --- Secciones ---
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

// --- Usuarios y puntos ---
const createUserBtn = document.getElementById('create-user');
const usernameInput = document.getElementById('username');
const userMessage = document.getElementById('user-message');
const currentUserSpan = document.getElementById('current-user');
const currentPointsSpan = document.getElementById('current-points');
const addPointsBtn = document.getElementById('add-points');
const rankingList = document.getElementById('ranking-list');

let currentUser = null;

// Crear usuario
createUserBtn.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    if (!username) {
        userMessage.textContent = "El nombre de usuario no puede estar vacío";
        return;
    }

    try {
        // Ver si ya existe
        const existing = await pb.collection('usuarios').getList(1, 1, {
            filter: `nombre="${username}"`
        });

        if (existing.items.length === 0) {
            // Crear nuevo usuario
            await pb.collection('usuarios').create({ nombre: username, puntos: 0 });
            userMessage.textContent = `Usuario "${username}" creado`;
        } else {
            userMessage.textContent = `Usuario "${username}" cargado`;
        }

        currentUser = username;
        const userData = await obtenerUsuario(username);
        currentUserSpan.textContent = userData.nombre;
        currentPointsSpan.textContent = userData.puntos;
    } catch (err) {
        console.error(err);
        userMessage.textContent = "Error al crear/cargar usuario";
    }
});

// Obtener usuario por nombre
async function obtenerUsuario(nombre) {
    const res = await pb.collection('usuarios').getList(1, 1, {
        filter: `nombre="${nombre}"`
    });
    return res.items[0];
}

// Sumar puntos
addPointsBtn.addEventListener('click', async () => {
    if (!currentUser) return alert('Primero crea un usuario');

    const user = await obtenerUsuario(currentUser);
    const nuevosPuntos = user.puntos + 1;

    await pb.collection('usuarios').update(user.id, { puntos: nuevosPuntos });

    currentPointsSpan.textContent = nuevosPuntos;
});

// Mostrar ranking
async function updateRanking() {
    try {
        const res = await pb.collection('usuarios').getFullList({
            sort: '-puntos'
        });

        rankingList.innerHTML = '';
        res.forEach(u => {
            const li = document.createElement('li');
            li.textContent = `${u.nombre}: ${u.puntos} pajas`;
            rankingList.appendChild(li);
        });
    } catch (err) {
        console.error(err);
    }
}

// Actualizar ranking al abrir sección
document.querySelector('[data-section="ranking"]').addEventListener('click', updateRanking);
