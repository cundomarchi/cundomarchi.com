/* A short, bilingual project brief. Existing quote transport remains in script.js. */
(function () {
  const root = document.getElementById('wallFormStep');
  if (!root) return;
  const stages = [...root.querySelectorAll('[data-quote-stage]')];
  const back = document.getElementById('quoteBack');
  const next = document.getElementById('quoteNext');
  const send = document.getElementById('wallSubmitBtn');
  const error = document.getElementById('wallFormError');
  let current = 0;
  function show(index, focus) {
    current = index;
    stages.forEach((stage, i) => { stage.hidden = i !== index; });
    root.querySelectorAll('[data-quote-progress]').forEach((item, i) => {
      if (i === index) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
      item.classList.toggle('is-complete', i < index);
    });
    back.hidden = index === 0;
    next.hidden = index === 2;
    send.hidden = index !== 2;
    error.hidden = true;
    error.style.display = 'none';
    reveal();
    if (focus) stages[index].querySelector('h3').focus({ preventScroll: false });
  }
  // Associate branch captions with their selects and make requirements explicit.
  root.querySelectorAll('select:not([hidden])').forEach((select, i) => {
    select.id = select.id || 'quoteSelect' + i;
    const caption = select.previousElementSibling;
    if (caption && caption.classList.contains('step-label')) {
      const label = document.createElement('label');
      [...caption.attributes].forEach(a => label.setAttribute(a.name, a.value));
      label.htmlFor = select.id;
      label.innerHTML = caption.innerHTML;
      caption.replaceWith(label);
      label.classList.add('required-label');
      select.setAttribute('aria-required', 'true');
    }
  });
  // Visual choices use native selects as the single source for submission.
  const choices = [];
  const svg = name => '<svg class="quote-icon" viewBox="0 0 80 80" aria-hidden="true"><use href="images/site/quote-icons.svg#' + name + '"/></svg>';
  root.querySelectorAll('select:not([hidden])').forEach(select => {
    const group = document.createElement('div');
    group.className = 'quote-option-grid';
    group.id = select.id + '-choices';
    group.setAttribute('role', 'group');
    const label = select.previousElementSibling;
    label.id = select.id + '-label';
    group.setAttribute('aria-labelledby', label.id);
    select.dataset.choiceProxy = group.id;
    select.hidden = true;
    select.insertAdjacentElement('afterend', group);
    [...select.options].filter(option => option.value).forEach((option, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'quote-option';
      const labelText = document.createElement('span');
      labelText.textContent = option.textContent;
      if (option.dataset.en) labelText.dataset.en = option.dataset.en;
      if (option.dataset.es) labelText.dataset.es = option.dataset.es;
      let icon = 'people';
      if (select.closest('#artMuralBlock')) icon = ['home','shop','wall'][i];
      if (select.closest('#wallBudgetBlock')) icon = 'budget';
      if (select.closest('#artWorkshopBlock') && choices.filter(x => x.select.closest('#artWorkshopBlock')).length === 0) icon = i ? 'canvas' : 'mural';
      button.innerHTML = svg(icon);
      button.appendChild(labelText);
      button.setAttribute('aria-pressed', String(option.selected));
      button.addEventListener('click', () => {
        select.selectedIndex = option.index;
        select.dispatchEvent(new Event('change', { bubbles:true }));
        group.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
        select.removeAttribute('aria-invalid');
        reveal();
      });
      group.appendChild(button);
    });
    choices.push({select, group, label});
  });
  // Reveal writing only after the relevant visual choices.
  function wrapFollowing(container, anchor, className) {
    const wrap = document.createElement('div');
    wrap.className = className;
    while (anchor.nextSibling) wrap.appendChild(anchor.nextSibling);
    container.appendChild(wrap);
    return wrap;
  }
  const mural = document.getElementById('artMuralBlock');
  const muralWriting = wrapFollowing(mural, mural.querySelector('.quote-option-grid'), 'quote-reveal');
  const ideaWriting = wrapFollowing(stages[1], document.getElementById('wallBudgetBlock'), 'quote-reveal');
  const location = document.getElementById('w-location').closest('.quote-input');
  function reveal() {
    const type = document.getElementById('quoteType').value;
    const block = type && document.getElementById({mural:'artMuralBlock',live:'artLiveBlock',workshop:'artWorkshopBlock'}[type]);
    let ready = !!type;
    if (block) {
      choices.filter(x => block.contains(x.select)).forEach(item => {
        item.label.hidden = !ready;
        item.group.hidden = !ready;
        ready = ready && !!item.select.value;
      });
    }
    muralWriting.hidden = type !== 'mural' || !ready;
    location.hidden = !ready;
    const budgetReady = !!document.querySelector('#wallBudgetBlock select').value;
    ideaWriting.hidden = !budgetReady;
    next.hidden = current === 2 || (current === 0 && !ready) || (current === 1 && !budgetReady);
  }
  const mandatory = ['w-first', 'w-last', 'w-email', 'w-location', 'w-details', 'w-size'];
  mandatory.forEach(id => document.getElementById(id).setAttribute('aria-required', 'true'));
  function validate(index) {
    const controls = [...stages[index].querySelectorAll('input,select,textarea')]
      .filter(el => (el.dataset.choiceProxy ? document.getElementById(el.dataset.choiceProxy).getClientRects().length : (!el.hidden && el.getClientRects().length)) &&
        (mandatory.includes(el.id) || el.tagName === 'SELECT'));
    controls.forEach(el => el.removeAttribute('aria-invalid'));
    let invalid = controls.filter(el => !el.value.trim() || (el.type === 'email' && !el.validity.valid));
    if (index === 0 && !document.getElementById('quoteType').value) {
      invalid.unshift(root.querySelector('[data-quote-type]'));
    }
    invalid.forEach(el => el.setAttribute('aria-invalid', 'true'));
    error.hidden = !invalid.length;
    error.style.display = invalid.length ? 'block' : 'none';
    if (invalid.length) {
      const first = invalid[0];
      (first.dataset.choiceProxy ? document.getElementById(first.dataset.choiceProxy).querySelector('button') : first).focus();
    }
    return !invalid.length;
  }
  window.validateQuoteJourney = function () {
    for (let i = 0; i < stages.length; i++) {
      show(i, false);
      if (!validate(i)) return false;
    }
    return true;
  };
  window.syncQuoteChoices = function (type) {
    root.querySelectorAll('[data-quote-type]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.quoteType === type));
      button.removeAttribute('aria-invalid');
    });
    reveal();
  };
  root.querySelectorAll('[data-quote-type]').forEach(button => {
    button.addEventListener('click', () => {
      const select = document.getElementById('quoteType');
      select.value = button.dataset.quoteType;
      chooseArtTypeSelect(select);
    });
  });
  back.addEventListener('click', () => show(current - 1, true));
  next.addEventListener('click', () => { if (validate(current)) show(current + 1, true); });
  show(0, false);
  window.syncQuoteChoices(document.getElementById('quoteType').value);
}());
