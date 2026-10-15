/* Standalone shim for the Level Up app.
 * The app calls window.vellum.fetch("/v1/x/level-up") to load its
 * self-improvement history. Outside the host there is no bridge and no
 * backend route, so this shim serves the same envelope with an empty
 * event log. Everything else degrades the same way the app already
 * handles an empty history file. */
(function () {
  if (window.vellum) return;

  var HISTORY_ROUTE = "/v1/x/level-up";
  var EMPTY_HISTORY = JSON.stringify({ version: 1, events: [] });

  window.vellum = {
    fetch: function (path) {
      if (path === HISTORY_ROUTE) {
        console.warn(
          "[vellum-shim] No backend route for " +
            path +
            " - serving empty history."
        );
        return Promise.resolve({
          ok: true,
          status: 200,
          json: function () {
            return Promise.resolve(JSON.parse(EMPTY_HISTORY));
          },
        });
      }
      console.warn("[vellum-shim] vellum.fetch has no backend: " + path);
      return Promise.resolve({
        ok: false,
        status: 404,
        json: function () {
          return Promise.resolve({});
        },
      });
    },
    route: null,
    openLink: function (url) {
      window.open(url, "_blank");
    },
  };
})();
