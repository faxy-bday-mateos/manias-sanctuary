(function () {
  'use strict';

  var PAGE = window.location.pathname.split('/').pop().replace('.html', '') || 'observatory';

  function record(type, action) {
    if (window.parent === window) return;
    var entry = { page: PAGE, type: type };
    if (action) entry.action = String(action).replace(/[^a-zA-Z0-9:_-]/g, '-').slice(0, 80);
    window.parent.postMessage({ type: 'birthday-activity-event', event: entry }, window.location.origin);
  }

  record('page_visit');

  document.addEventListener('click', function (event) {
    if (!(event.target instanceof Element)) return;
    var control = event.target.closest('button, a[href], summary, [role="tab"], [role="button"], [onclick]');
    if (!control) {
      for (var element = event.target; element && element !== document.body; element = element.parentElement) {
        if (window.getComputedStyle(element).cursor === 'pointer') {
          control = element;
          break;
        }
      }
    }
    if (!control || control.closest('[data-activity-ignore]')) return;

    var className = typeof control.className === 'string' ? control.className.split(/\s+/)[0] : '';
    var action = control.getAttribute('data-activity-action') || control.id || className || control.tagName.toLowerCase();
    record('interaction', action);
  });

  document.addEventListener('change', function (event) {
    if (!(event.target instanceof HTMLElement)) return;
    var field = event.target.closest('input, select, textarea');
    if (!field || field.closest('[data-activity-ignore]')) return;
    var identifier = field.id || (field instanceof HTMLInputElement ? field.type : field.tagName.toLowerCase());
    record('interaction', 'changed:' + identifier);
  });

  window.trackActivity = function () {};
})();
