// The mural enquiry stays on the service page, including every form step.
function requestWall(index) {
  const type = document.getElementById('quoteType');
  type.value = 'mural';
  chooseArtTypeSelect(type);
  const select = document.querySelector('#artMuralBlock select');
  const proxy = document.getElementById(select.dataset.choiceProxy);
  const button = proxy && proxy.querySelectorAll('button')[index - 1];
  if (button) button.click();
  document.getElementById('quote').scrollIntoView({behavior:'smooth'});
}
if (!document.getElementById('quoteType').value) {
  document.getElementById('quoteType').value = 'mural';
  chooseArtTypeSelect(document.getElementById('quoteType'));
}
