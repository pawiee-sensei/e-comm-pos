async function loadProducts() {
  const res = await fetch('/admin/api/products');
  const data = await res.json();

  const body = document.getElementById('products-body');
  if (!body) return;

  body.innerHTML = '';

  data.items.forEach(p => {
    const status =
      p.stock === 0 ? 'OUT' :
      p.stock <= 5 ? 'Low' :
      p.stock <= 20 ? 'Medium' : 'Good';

    body.innerHTML += `
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
          <button class="btn btn-sm btn-outline-primary">Edit</button>
          <button class="btn btn-sm btn-outline-danger">Delete</button>
        </td>
      </tr>
    `;
  });
}

/* =========================
   ADD PRODUCT SUBMIT
========================= */
document.addEventListener('submit', async (e) => {
  if (e.target.id !== 'add-product-form') return;

  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  const res = await fetch('/admin/api/products', {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    alert('Failed to save product');
    return;
  }

  // Close modal
  const modalEl = document.getElementById('addProductModal');
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();

  form.reset();
  loadProducts();
});

/* =========================
   PANEL INIT
========================= */
function initProductsPanel() {
  const panel = document.getElementById('products-panel');
  if (!panel || panel.dataset.loaded) return;

  panel.dataset.loaded = 'true';
  loadProducts();
}

document.addEventListener('panel:products', initProductsPanel);
