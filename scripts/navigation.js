const navButton = document.querySelector('#nav-button');
const navigation = document.querySelector('.navigation');

navButton.addEventListener('click', () => {
  navButton.classList.toggle('show');
  navigation.classList.toggle('show');
});