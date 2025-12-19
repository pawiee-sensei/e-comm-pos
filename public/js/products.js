/* ======================================================
   PRODUCTS PANEL — ADMIN (STABLE + CATEGORY READY)
====================================================== */

/* =========================
   MODAL HELPER
========================= */
function getModal(id) {
  const el = document.getElementById(id);
  return el ? bootstrap.Modal.getOrCreateInstance(el) : null;
}

/* =========================
   CATEGORY HELPER (SAFE)
========================= */
async function loadCategories(selectEl, selectedId = null) {
  if (!selectEl) return;

  const res = await fetch('/admin/api/categories');
  if (!res.ok) {
    selectEl.innerHTML = `<option value="">Uncategorized</option>`;
    return;
  }

  const categories = await res.json();
  selectEl.innerHTML = `<option value="">Uncategorized</option>`;

  categories.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.name;
    if (String(c.id) === String(selectedId)) opt.selected = true;
    selectEl.appendChild(opt);
  });
}

/* =========================
   LOAD PRODUCTS
========================= */
async function loadProducts() {
  const res = await fetch('/admin/api/products');
  if (!res.ok) return;

  const { items } = await res.json();
  const body = document.getElementById('products-body');
  if (!body) return;

  body.innerHTML = '';

  items.forEach(p => {
    const status =
      p.stock === 0 ? 'OUT' :
      p.stock <= 5 ? 'Low' :
      p.stock <= 20 ? 'Medium' : 'Good';

    body.insertAdjacentHTML('beforeend', `
      <tr>
        <td>
          <img src="/uploads/${p.image || 'no-image.png'}" width="36">
        </td>
        <td>
          ${p.name}<br>
          <small class="text-muted">${p.sku}</small>
        </td>
        <td>${p.stock}</td>
        <td>${status}</td>
        <td>
          <button type="button"
            class="btn btn-sm btn-outline-primary btn-edit"
            data-id="${p.id}">
            Edit
          </button>
          <button type="button"
            class="btn btn-sm btn-outline-danger btn-delete"
            data-id="${p.id}">
            Delete
          </button>
        </td>
      </tr>
    `);
  });
}

/* =========================
   OPEN EDIT MODAL
========================= */
async function openEditModal(id) {
  const res = await fetch(`/admin/api/products/${id}`);
  if (!res.ok) return alert('Failed to load product');

  const p = await res.json();
  const form = document.getElementById('edit-product-form');
  if (!form) return;

  form.id.value = p.id;
  form.name.value = p.name;
  form.price.value = p.price;
  form.stock.value = p.stock;
  form.description.value = p.description || '';

  const img = document.getElementById('edit-product-preview');
  if (img) {
    img.src = p.image ? `/uploads/${p.image}` : '/uploads/no-image.png';
  }

  // Reset file input (prevents phantom uploads)
  const fileInput = form.querySelector('input[name="image"]');
  if (fileInput) fileInput.value = '';

  // Load categories (SAFE)
  loadCategories(
    form.querySelector('select[name="category_id"]'),
    p.category_id
  );

  getModal('editProductModal').show();
}

/* =========================
   DELETE PRODUCT
========================= */
async function confirmDelete() {
  const id = document.getElementById('delete-product-id').value;
  if (!id) return;

  const res = await fetch(`/admin/api/products/${id}`, {
    method: 'DELETE'
  });

  if (!res.ok) return alert('Failed to delete');

  getModal('deleteConfirmModal').hide();
  await loadProducts();
}

/* =========================
   CLICK EVENTS
========================= */
document.addEventListener('click', e => {
  if (e.target.id === 'btn-add-product') {
    const form = document.getElementById('add-product-form');
    loadCategories(form?.querySelector('select[name="category_id"]'));
    getModal('addProductModal').show();
  }

  if (e.target.classList.contains('btn-edit')) {
    openEditModal(e.target.dataset.id);
  }

  if (e.target.classList.contains('btn-delete')) {
    document.getElementById('delete-product-id').value = e.target.dataset.id;
    getModal('deleteConfirmModal').show();
  }

  if (e.target.id === 'btn-confirm-delete') {
    confirmDelete();
  }
});

/* =========================
   ADD PRODUCT SUBMIT
========================= */
document
  .getElementById('add-product-form')
  ?.addEventListener('submit', async e => {
    e.preventDefault();

    const res = await fetch('/admin/api/products', {
      method: 'POST',
      body: new FormData(e.target)
    });

    if (!res.ok) return alert('Failed to add product');

    getModal('addProductModal').hide();
    e.target.reset();
    await loadProducts();
  });

/* =========================
   EDIT PRODUCT SUBMIT (FINAL + IMAGE SAFE)
========================= */
document
  .getElementById('edit-product-form')
  ?.addEventListener('submit', async e => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const id = formData.get('id');

    const imageInput = form.querySelector('input[name="image"]');
    if (!imageInput.files || imageInput.files.length === 0) {
      formData.delete('image'); // 🔑 KEEP OLD IMAGE
    }

    const res = await fetch(`/admin/api/products/${id}`, {
      method: 'PUT',
      body: formData
    });

    if (!res.ok) return alert('Failed to update product');

    getModal('editProductModal').hide();
    await loadProducts();
  });

/* =========================
   IMAGE PREVIEW (SAFE)
========================= */
document.addEventListener('change', e => {
  if (e.target.name === 'image') {
    const file = e.target.files[0];
    if (!file) return;

    const preview = document.getElementById('edit-product-preview');
    if (preview) preview.src = URL.createObjectURL(file);
  }
});

/* =========================
   PANEL INIT
========================= */
document.addEventListener('panel:products', () => {
  const panel = document.getElementById('products-panel');
  if (!panel || panel.dataset.loaded) return;

  panel.dataset.loaded = 'true';
  loadProducts();
});
