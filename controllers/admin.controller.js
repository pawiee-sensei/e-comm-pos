function getAdminDashboard(req, res) {
  res.render('admin/dashboard', {
    user: req.session.user
  });
}

module.exports = {
  getAdminDashboard
};
