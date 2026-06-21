document.getElementById('event-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('event-name').value.trim();
  const date = document.getElementById('event-date').value;
  const guests = document.getElementById('event-guests').value;
  const desc = document.getElementById('event-desc').value.trim();

  if (!name || !date || !guests || !desc) return;

  const formatted = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  const card = document.createElement('div');
  card.className = 'event-card';
  card.innerHTML =
    '<span class="event-date">' + escapeHtml(formatted) + '</span>' +
    '<h3>' + escapeHtml(name) + '</h3>' +
    '<p>' + escapeHtml(desc) + '</p>' +
    '<span class="event-guests">' + escapeHtml(guests) + ' guests</span>';

  document.getElementById('event-list').prepend(card);
  this.reset();
});

function escapeHtml(text) {
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
