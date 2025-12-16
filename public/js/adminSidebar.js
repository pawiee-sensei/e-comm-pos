(function () {
  const sidebar = document.getElementById('adminSidebar');
  const toggleBtn = document.getElementById('sidebarToggle');
  const items = document.querySelectorAll('.sidebar-item');
  const panels = document.querySelectorAll('.admin-panel');

  if (!sidebar || !toggleBtn) return;

  // Collapse / expand sidebar
  toggleBtn.addEventListener('click', function () {
    sidebar.classList.toggle('collapsed');
  });

  // Switch active panel
  items.forEach((item) => {
    item.addEventListener('click', function () {
      const targetPanelId = this.getAttribute('data-panel');
      if (!targetPanelId) return;

      // active nav item
      items.forEach((i) => i.classList.remove('active'));
      this.classList.add('active');

      // show target panel
      panels.forEach((panel) => {
        if (panel.id === targetPanelId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });
})();
