(function () {
  const sidebar = document.getElementById('adminSidebar');
  const toggleBtn = document.getElementById('sidebarToggle');
  const items = document.querySelectorAll('.sidebar-item');
  const panels = document.querySelectorAll('.admin-panel');

  if (!sidebar || !toggleBtn) return;

  /* ===============================
     COLLAPSE / EXPAND SIDEBAR
     =============================== */
  toggleBtn.addEventListener('click', function () {
    sidebar.classList.toggle('collapsed');
  });

  /* ===============================
     SWITCH ACTIVE PANEL
     =============================== */
  items.forEach((item) => {
    item.addEventListener('click', function () {
      const targetPanelId = this.getAttribute('data-panel');
      if (!targetPanelId) return;

      // Highlight active nav item
      items.forEach((i) => i.classList.remove('active'));
      this.classList.add('active');

      // Show target panel only
      panels.forEach((panel) => {
        if (panel.id === targetPanelId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });

      /* ===============================
         PANEL-SPECIFIC EVENTS
         =============================== */
      if (targetPanelId === 'products-panel') {
        document.dispatchEvent(new Event('panel:products'));
      }

      // (future-safe placeholders)
      if (targetPanelId === 'pos-panel') {
        document.dispatchEvent(new Event('panel:pos'));
      }

      if (targetPanelId === 'strategy-panel') {
        document.dispatchEvent(new Event('panel:strategy'));
      }
    });
  });
})();
