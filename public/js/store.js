const toast = document.querySelector('[data-toast]');

const showToast = (message, type = 'ok') => {
    if (!toast) return;
    toast.textContent = message;
    toast.dataset.type = type;
    toast.classList.add('is-visible');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 2800);
};

const readJson = async (response) => {
    const text = await response.text();
    try { return text ? JSON.parse(text) : {}; } catch { return { error: text || 'Ocurrió un error' }; }
};

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
navToggle?.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!open));
    navLinks?.classList.toggle('is-open', !open);
});

document.querySelector('[data-logout]')?.addEventListener('click', async () => {
    const response = await fetch('/api/session/logout', { method: 'POST' });
    if (response.ok) window.location.href = '/login';
    else showToast('No pudimos cerrar la sesión.', 'error');
});

document.querySelectorAll('.js-add-cart').forEach((button) => {
    button.addEventListener('click', async () => {
        const { productId, cartId } = button.dataset;
        if (!cartId) return showToast('Tu usuario todavía no tiene carrito.', 'error');
        button.disabled = true;
        const original = button.textContent;
        button.textContent = 'Agregando…';
        try {
            const response = await fetch(`/api/cart/${cartId}/p/${productId}`, { method: 'POST' });
            const data = await readJson(response);
            if (!response.ok) throw new Error(data.error || 'No se pudo agregar');
            const count = document.querySelector('[data-cart-count]');
            if (count && Number.isFinite(Number(data.count))) count.textContent = data.count;
            button.textContent = 'Agregado ✓';
            showToast('Producto agregado al carrito.');
        } catch (error) {
            button.textContent = original;
            showToast(error.message, 'error');
        } finally {
            window.setTimeout(() => { button.disabled = false; if (button.textContent.includes('✓')) button.textContent = original; }, 900);
        }
    });
});

document.querySelectorAll('.js-remove-cart').forEach((button) => {
    button.addEventListener('click', async () => {
        const { cartId, productId } = button.dataset;
        button.disabled = true;
        const response = await fetch(`/api/cart/${cartId}/p/${productId}`, { method: 'DELETE' });
        const data = await readJson(response);
        if (!response.ok) {
            button.disabled = false;
            return showToast(data.error || 'No se pudo quitar el producto.', 'error');
        }
        window.location.reload();
    });
});

document.querySelector('.js-purchase')?.addEventListener('click', async (event) => {
    const button = event.currentTarget;
    const status = document.querySelector('[data-purchase-status]');
    button.disabled = true;
    button.textContent = 'Procesando…';
    const response = await fetch(`/api/cart/${button.dataset.cartId}/purchase`, { method: 'POST' });
    const data = await readJson(response);
    if (!response.ok) {
        button.disabled = false;
        button.textContent = 'Finalizar compra';
        if (status) status.textContent = data.error || 'No se pudo completar la compra.';
        return;
    }
    const ticket = data.ticket?.code ? ` Ticket ${data.ticket.code.slice(0, 8)}.` : '';
    if (status) status.textContent = `Compra confirmada por $${Number(data.totalAmount || 0).toLocaleString('es-AR')}.${ticket}`;
    button.textContent = 'Compra confirmada ✓';
    showToast('Compra confirmada.');
    window.setTimeout(() => window.location.reload(), 1500);
});

document.querySelectorAll('[data-api-form]').forEach((form) => {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const status = form.querySelector('[data-form-status]');
        const submit = form.querySelector('[type="submit"]');
        const original = submit?.textContent;
        if (submit) { submit.disabled = true; submit.textContent = 'Procesando…'; }
        if (status) status.textContent = '';
        try {
            const payload = Object.fromEntries(new FormData(form).entries());
            const response = await fetch(form.dataset.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await readJson(response);
            if (!response.ok) throw new Error(data.error || data.message || 'No se pudo completar la acción.');
            if (status) status.textContent = data.message || 'Listo.';
            showToast(data.message || 'Listo.');
            if (!form.hasAttribute('data-no-redirect')) {
                window.location.href = data.redirect || form.dataset.success || '/';
            } else {
                form.reset();
            }
        } catch (error) {
            if (status) status.textContent = error.message;
            showToast(error.message, 'error');
        } finally {
            if (submit) { submit.disabled = false; submit.textContent = original; }
        }
    });
});

document.querySelector('[data-reset-form]')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const status = form.querySelector('[data-form-status]');
    const payload = Object.fromEntries(new FormData(form).entries());
    if (payload.password !== payload.confirm_password) {
        status.textContent = 'Las contraseñas no coinciden.';
        return;
    }
    const response = await fetch(`/api/password-reset/reset/${form.dataset.resetToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: payload.password })
    });
    const data = await readJson(response);
    if (!response.ok) {
        status.textContent = data.error || 'No se pudo actualizar la contraseña.';
        return;
    }
    status.textContent = data.message;
    showToast(data.message);
    window.setTimeout(() => { window.location.href = data.redirect || '/login'; }, 900);
});

const revealTargets = document.querySelectorAll('.product-card, .hero-console, .cart-item, .admin-panel, .admin-create');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
    }), { threshold: 0.1 });
    revealTargets.forEach((element, index) => {
        element.classList.add('reveal');
        element.style.setProperty('--delay', `${Math.min(index % 4, 3) * 60}ms`);
        observer.observe(element);
    });
}
