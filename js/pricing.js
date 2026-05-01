(() => {
  'use strict';

  const PRICES = {
    starter: { monthly: 19, annual: 16 },
    growth:  { monthly: 59, annual: 49 },
    pro:     { monthly: 149, annual: 124 },
  };

  let mode = 'monthly';

  const monthlyBtn = document.getElementById('toggle-monthly');
  const annualBtn  = document.getElementById('toggle-annual');

  function updatePrices(newMode) {
    mode = newMode;

    monthlyBtn.classList.toggle('active', mode === 'monthly');
    annualBtn.classList.toggle('active',  mode === 'annual');

    Object.entries(PRICES).forEach(([plan, prices]) => {
      const el = document.querySelector(`[data-plan="${plan}"] .price-amount`);
      if (!el) return;

      el.classList.add('flipping');
      el.addEventListener('animationend', () => el.classList.remove('flipping'), { once: true });

      el.textContent = prices[mode];
    });
  }

  if (monthlyBtn && annualBtn) {
    monthlyBtn.addEventListener('click', () => updatePrices('monthly'));
    annualBtn.addEventListener('click',  () => updatePrices('annual'));
  }
})();
