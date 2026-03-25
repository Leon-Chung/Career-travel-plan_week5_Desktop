document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menuBtn');
  const menu = document.getElementById('navbarSupportedContent');
  const closeCollapse = document.querySelector('#closeCollapse');

  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => {
      menu.classList.toggle('is-open');
      menuBtn.classList.toggle('active');
    });
  }

  if(closeCollapse){
    closeCollapse.addEventListener('click', ()=>{
      menu.classList.toggle('is-open');
      menuBtn.classList.toggle('active');
    })
  }

});





