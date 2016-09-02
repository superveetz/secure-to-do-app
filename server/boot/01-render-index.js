module.exports = function(server) {  // Install a `/` route that returns server status

  var router = server.loopback.Router();

  router.get('*', function (req, res, next) {
    if (req.url.indexOf('/api/') !== -1) {
      return next();
    } else {
      return res.render('index.ejs');
    }
  });

  server.use(router);
};