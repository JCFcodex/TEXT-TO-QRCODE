const themeCheckBox = document.getElementById('theme-checkbox');
// const themeSwitchLabel = document.getElementById('theme-switch-label');

themeCheckBox.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode');
  // if (themeCheckBox.checked) {
  //   themeSwitchLabel.textContent = 'Light Mode';
  // } else {
  //   themeSwitchLabel.textContent = 'Dark Mode';
  // }
});
