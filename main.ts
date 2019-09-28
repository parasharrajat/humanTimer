import { TimeCalculator } from ".";

const timeP = document.querySelector('p.time');
const showMoreBtn = document.querySelector('#showMore');
const mainContent = document.querySelector('main');

let currentTime = undefined;

window.addEventListener('load', () => {
  setTimeout(() => {
    currentTime = new TimeCalculator(new Date());
    currentTime.result$.subscribe(time => {
      timeP.textContent = time;
    });
  }, 7500);

});
let moreActive = true;
showMoreBtn.addEventListener('click', () => {
  if (moreActive) {
    showMoreBtn.textContent = 'Hide';
    showMoreBtn.parentElement.children.item(0).innerHTML = '&Darr;';
  } else {
    showMoreBtn.textContent = 'More';
    showMoreBtn.parentElement.children.item(0).innerHTML = '&Uarr;';

  }
  timeP.classList.toggle('more');
  mainContent.classList.toggle('more');
  moreActive = !moreActive;
});
