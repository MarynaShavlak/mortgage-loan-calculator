(() => {
  const refs = {
    openModalBtn: document.querySelector('[data-modal-open]'),
    closeModalBtn: document.querySelector('[data-modal-close]'),
    modal: document.querySelector('[data-modal]'),
    form: document.querySelector('.application'),
  };

  refs.openModalBtn.addEventListener('click', toggleModal);
  refs.closeModalBtn.addEventListener('click', (e) => {
    e.stopPropagation(); 
    toggleModal();
  });
  refs.modal.addEventListener('click', toggleModal);
  
  refs.form.addEventListener('click', (e) => {
    e.stopPropagation(); 
  });

  function toggleModal() {
    document.body.classList.toggle('modal-open');
    refs.modal.classList.toggle('backdrop--hidden');
  }
})();