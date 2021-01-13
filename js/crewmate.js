const crewmate = document.querySelector('#crewmate')
let randomTop = Math.floor(Math.random() * (document.documentElement.clientHeight - 160))+ 80;
crewmate.setAttribute('style', `top: ${randomTop}px`);

crewmate.onanimationiteration = () => {
  randomTop = Math.floor(Math.random() * (document.documentElement.clientHeight - 160)) + 80;
  crewmate.setAttribute('style', `top: ${randomTop}px`);
}