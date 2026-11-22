(function () {
  'use strict';
  if (window.FeatureFlags && !window.FeatureFlags.get('interactions')) return;

  // Click-level events are recorded by activity-tracker.js. Do not retain
  // typed values, answer details, wish text, or a duplicate event queue here.
  window.Interactions = {
    record: function () {}
  };
})();
