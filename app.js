document.getElementById('event-form').addEventListener('submit', function (e) {
  e.preventDefault();
  this.classList.add('hidden');
  document.getElementById('confirmation').classList.remove('hidden');
});
