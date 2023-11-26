setupModal();

function setupModal() {
  const refs = {
    openModalBtn: document.querySelector('[data-modal-open]'),
    closeModalBtn: document.querySelector('[data-modal-close]'),
    modal: document.querySelector('[data-modal]'),
    form: document.querySelector('.application'),
  };

  refs.openModalBtn.addEventListener('click', toggleModal);
  refs.closeModalBtn.addEventListener('click', handleModalClose);
  refs.modal.addEventListener('click', toggleModal);

  refs.form.addEventListener('click', stopPropagation);

  function toggleModal() {
    document.body.classList.toggle('modal-open');
    refs.modal.classList.toggle('backdrop--hidden');
  }
  function handleModalClose(e) {
    e.stopPropagation();
    toggleModal();
  }
  function stopPropagation(e) {
    e.stopPropagation();
  }

  const myForm = document.querySelector('.application');
  myForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (validation(this) == true) {
      const formData = getFormData(this);
      console.log('formData: ', formData);
      this.reset();
      toggleModal();
    }
  });

  function getFormData(form) {
    const elements = form.elements;
    const formData = {};
    for (let i = 0; i < elements.length; i++) {
      const input = elements[i];
      if (input.nodeName === "INPUT" && (input.type === "text" || input.type === "tel")) {
        formData[input.name] = input.value;
      }
    }
    return formData;
  }


  function removeError(input) {
    const parent = input.parentNode;
    if (parent.classList.contains('error')) {
      parent.querySelector('.error-text').remove();
      parent.classList.remove('error');
      input.classList.remove('input--error');
      const icon = parent.querySelector('.application__icon');
      icon.classList.remove('application__icon--error');
    }
  }

  function createError(input, text) {
    const parent = input.parentNode;
    input.classList.add('input--error');
    const errorText = document.createElement('p');
    errorText.classList.add('error-text');
    const icon = parent.querySelector('.application__icon');
    icon.classList.add('application__icon--error');
    errorText.textContent = text;
    parent.classList.add('error');
    parent.append(errorText);
  }

  function validateInput(input) {
    removeError(input);
    if (input.dataset.required === 'true' && input.value === '') {
      createError(input, 'Поле не заповнене');
      return false;
    }
    if (
      input.dataset.minLength &&
      input.value.length < input.dataset.minLength
    ) {
      createError(
        input,
        `Мінімальна к-ть символів: ${input.dataset.minLength}`,
      );
      return false;
    }

    if (
      input.dataset.maxLength &&
      input.value.length > input.dataset.maxLength
    ) {
      createError(
        input,
        `Максимальна к-ть символів: ${input.dataset.maxLength}`,
      );
      return false;
    }

    return true;
  }

  function validation(form) {
    let result = true;
    const allInputs = form.querySelectorAll('input');
    for (let input of allInputs) {
      result = validateInput(input) && result;
    }
    return result;
  }
}
