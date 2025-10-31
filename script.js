// Basit yardımcılar
function $(selector, root = document) { return root.querySelector(selector); }
function loadJson(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function saveJson(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

// Yıl
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Navbar: mobil menü otomatik kapanış
const navToggle = $('#nav-toggle');
document.addEventListener('click', (e) => {
    const nav = e.target.closest('.nav');
    if (!nav && navToggle && navToggle.checked) navToggle.checked = false;
    if (e.target.matches('.nav-links a')) navToggle && (navToggle.checked = false);
});

// Görüş & Öneri
const form = $('#feedback-form');
const commentsUl = $('#comments');
const clearBtn = $('#clear-feedback');
const STORAGE_KEY = 'durakComments';

function renderComments(items) {
    if (!commentsUl) return;
    commentsUl.innerHTML = '';
    if (!items.length) {
        const li = document.createElement('li');
        li.className = 'comment';
        li.textContent = 'Henüz yorum yok. İlk yorumu yazın!';
        commentsUl.appendChild(li);
        return;
    }
    for (const item of items) {
        const li = document.createElement('li');
        li.className = 'comment';
        li.dataset.id = item.id;

        const header = document.createElement('div');
        header.className = 'comment-header';
        const name = document.createElement('div');
        name.className = 'comment-name';
        name.textContent = item.name || 'Misafir';
        const date = document.createElement('div');
        date.className = 'comment-date';
        date.textContent = new Date(item.createdAt).toLocaleString('tr-TR');
        header.appendChild(name);
        header.appendChild(date);

        const text = document.createElement('p');
        text.textContent = item.message;

        const actions = document.createElement('div');
        actions.className = 'comment-actions';
        const del = document.createElement('button');
        del.className = 'btn';
        del.type = 'button';
        del.textContent = 'Sil';
        del.addEventListener('click', () => {
            const current = loadJson(STORAGE_KEY, []);
            const next = current.filter(x => x.id !== item.id);
            saveJson(STORAGE_KEY, next);
            renderComments(next);
        });
        actions.appendChild(del);

        li.appendChild(header);
        li.appendChild(text);
        li.appendChild(actions);
        commentsUl.appendChild(li);
    }
}

function initComments() {
    const items = loadJson(STORAGE_KEY, []);
    renderComments(items);
}

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = $('#name').value.trim();
        const phone = $('#phone').value.trim();
        const message = $('#message').value.trim();
        if (!message) return;
        const item = {
            id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
            name,
            phone,
            message,
            createdAt: Date.now()
        };
        const current = loadJson(STORAGE_KEY, []);
        current.unshift(item);
        saveJson(STORAGE_KEY, current);
        form.reset();
        renderComments(current);
    });
}

if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        if (confirm('Tüm yorumlar silinsin mi?')) {
            saveJson(STORAGE_KEY, []);
            renderComments([]);
        }
    });
}

initComments();


