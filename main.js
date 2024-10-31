import './style.scss';

const inputs = document.querySelectorAll('.modal__input input');
const phoneInput = document.getElementById('phone');
const checkbox = document.querySelector('.modal__checkbox-input');
const button = document.querySelector('.button--modal-submit');
const form = document.querySelector('.modal__form');
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('modal__button__close');
const leaveRequestButtons = document.querySelectorAll('.button--leave-request');
const videoModal = document.getElementById('videoModal');
const videoFrame = document.getElementById('videoFrame');

function toggleError(field, hasError) {
  field.classList.toggle('error_border', hasError);
  const errorElement = field.nextElementSibling;
  if (errorElement) {
    errorElement.style.display = hasError ? 'block' : 'none';
    errorElement.textContent = hasError ? 'Неверный формат' : '';
  }
}

let getInputNumbersValue = function (input) {
  return input.value.replace(/\D/g, '');
};

let onPhonePaste = function (event) {
  let input = event.target,
    inputNumbersValue = getInputNumbersValue(input);
  const pasted = event.clipboardData || window.clipboardData;
  if (pasted) {
    const pastedText = pasted.getData('Text');
    if (/\D/g.test(pastedText)) {
      input.value = inputNumbersValue;
      return;
    }
  }
};

let onPhoneInput = function (event) {
  let input = event.target,
    inputNumbersValue = getInputNumbersValue(input),
    selectionStart = input.selectionStart,
    formattedInputValue = '';

  if (!inputNumbersValue) {
    return (input.value = '');
  }

  if (input.value.length != selectionStart) {
    if (event.data && /\D/g.test(event.data)) {
      input.value = inputNumbersValue;
    }
    return;
  }

  if (['7', '8', '9'].indexOf(inputNumbersValue[0]) > -1) {
    if (inputNumbersValue[0] == '9')
      inputNumbersValue = '7' + inputNumbersValue;
    const firstSymbols = inputNumbersValue[0] == '8' ? '8' : '+7';
    formattedInputValue = input.value = firstSymbols + ' ';
    if (inputNumbersValue.length > 1) {
      formattedInputValue += '(' + inputNumbersValue.substring(1, 4);
    }
    if (inputNumbersValue.length >= 5) {
      formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);
    }
    if (inputNumbersValue.length >= 8) {
      formattedInputValue += '-' + inputNumbersValue.substring(7, 9);
    }
    if (inputNumbersValue.length >= 10) {
      formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
    }
  } else {
    formattedInputValue = '+' + inputNumbersValue.substring(0, 16);
  }
  input.value = formattedInputValue;
};
let onPhoneKeyDown = function (event) {
  let inputValue = event.target.value.replace(/\D/g, '');
  if (event.keyCode == 8 && inputValue.length == 1) {
    event.target.value = '';
  }
};

phoneInput.addEventListener('keydown', onPhoneKeyDown);
phoneInput.addEventListener('input', onPhoneInput, false);
phoneInput.addEventListener('paste', onPhonePaste, false);

function validatePhone(phoneValue) {
  const cleanedValue = phoneValue
    .split('')
    .filter((char) => !isNaN(char) && char !== ' ')
    .join('');
  return (
    cleanedValue.length === 11 &&
    (cleanedValue.startsWith('8') || cleanedValue.startsWith('7'))
  );
}

function validateInputs() {
  let allFilled = true;
  let phoneValid = true;

  inputs.forEach((input) => {
    const isEmpty = input.value.trim() === '';
    toggleError(input, isEmpty);
    if (isEmpty) allFilled = false;
  });

  const phoneValue = phoneInput.value.trim();
  phoneValid = validatePhone(phoneValue);
  toggleError(phoneInput, !phoneValid);

  const isCheckboxChecked = checkbox.checked;

  button.disabled = !(allFilled && phoneValid && isCheckboxChecked);
}

function resetForm() {
  inputs.forEach((input) => {
    input.value = '';
    toggleError(input, false);
  });
  phoneInput.value = '';
  toggleError(phoneInput, false);
  checkbox.checked = false;
  button.disabled = true;
}

function openModal() {
  resetForm();
  modal.style.display = 'flex';
}

function closeModal() {
  resetForm();
  modal.style.display = 'none';
}

function closeVideoModal() {
  videoFrame.src = '';
  videoModal.style.display = 'none';
}

function handleSubmit(event) {
  validateInputs();
  if (button.disabled) {
    event.preventDefault();
  } else {
    resetForm();
  }
}

inputs.forEach((input) => input.addEventListener('input', validateInputs));
checkbox.addEventListener('change', validateInputs);
phoneInput.addEventListener('input', validateInputs);
form.addEventListener('submit', handleSubmit);
closeBtn.addEventListener('click', closeModal);
document.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});

leaveRequestButtons.forEach((button) =>
  button.addEventListener('click', openModal)
);

document.getElementById('videoButton').addEventListener('click', () => {
  videoFrame.src =
    'https://rutube.ru/play/embed/0581f03c3611e5ee2587547ace1828e8/';
  videoModal.style.display = 'flex';
});

document
  .querySelector('.modal__close')
  .addEventListener('click', closeVideoModal);
document.addEventListener('click', (event) => {
  if (event.target === videoModal) closeVideoModal();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
    closeVideoModal();
  }
});

let slider = document.querySelector('.slider'),
  sliderList = slider.querySelector('.slider__list'),
  sliderTrack = slider.querySelector('.slider-track'),
  slides = slider.querySelectorAll('.slide'),
  arrows = slider.querySelector('.slider-arrows'),
  prev = arrows.children[0],
  next = arrows.children[1],
  slideWidth = slides[0].offsetWidth,
  slideIndex = 0,
  posInit = 0,
  posX1 = 0,
  posX2 = 0,
  posY1 = 0,
  posY2 = 0,
  posFinal = 0,
  isSwipe = false,
  isScroll = false,
  allowSwipe = true,
  transition = true,
  nextTrf = 0,
  prevTrf = 0,
  lastTrf = (slides.length - 1) * slideWidth,
  posThreshold = slides[0].offsetWidth * 0.35,
  trfRegExp = /([-0-9.]+(?=px))/,
  swipeStartTime,
  swipeEndTime,
  getEvent = function () {
    return event.type.search('touch') !== -1 ? event.touches[0] : event;
  },
  slide = function () {
    slides.forEach((slide) => {
      slide.classList.add('blur');
    });

    slides[slideIndex].classList.remove('blur');

    if (transition) {
      sliderTrack.style.transition = 'transform .5s';
    }
    sliderTrack.style.transform = `translate3d(-${
      slideIndex * slideWidth
    }px, 0px, 0px)`;

    prev.classList.toggle('disabled', slideIndex === 0);
    next.classList.toggle('disabled', slideIndex === slides.length - 1);
  },
  swipeStart = function () {
    let evt = getEvent();

    if (allowSwipe) {
      swipeStartTime = Date.now();

      transition = true;

      nextTrf = (slideIndex + 1) * -slideWidth;
      prevTrf = (slideIndex - 1) * -slideWidth;

      posInit = posX1 = evt.clientX;
      posY1 = evt.clientY;

      sliderTrack.style.transition = '';

      document.addEventListener('touchmove', swipeAction);
      document.addEventListener('mousemove', swipeAction);
      document.addEventListener('touchend', swipeEnd);
      document.addEventListener('mouseup', swipeEnd);

      sliderList.classList.remove('grab');
      sliderList.classList.add('grabbing');
    }
  },
  swipeAction = function () {
    let evt = getEvent(),
      style = sliderTrack.style.transform,
      transform = +style.match(trfRegExp)[0];

    posX2 = posX1 - evt.clientX;
    posX1 = evt.clientX;

    posY2 = posY1 - evt.clientY;
    posY1 = evt.clientY;

    if (!isSwipe && !isScroll) {
      let posY = Math.abs(posY2);
      if (posY > 7 || posX2 === 0) {
        isScroll = true;
        allowSwipe = false;
      } else if (posY < 7) {
        isSwipe = true;
      }
    }

    if (isSwipe) {
      if (slideIndex === 0) {
        if (posInit < posX1) {
          setTransform(transform, 0);
          return;
        } else {
          allowSwipe = true;
        }
      }

      if (slideIndex === slides.length - 1) {
        if (posInit > posX1) {
          setTransform(transform, lastTrf);
          return;
        } else {
          allowSwipe = true;
        }
      }

      if (
        (posInit > posX1 && transform < nextTrf) ||
        (posInit < posX1 && transform > prevTrf)
      ) {
        reachEdge();
        return;
      }

      sliderTrack.style.transform = `translate3d(${
        transform - posX2
      }px, 0px, 0px)`;
    }
  },
  swipeEnd = function () {
    posFinal = posInit - posX1;

    isScroll = false;
    isSwipe = false;

    document.removeEventListener('touchmove', swipeAction);
    document.removeEventListener('mousemove', swipeAction);
    document.removeEventListener('touchend', swipeEnd);
    document.removeEventListener('mouseup', swipeEnd);

    sliderList.classList.add('grab');
    sliderList.classList.remove('grabbing');

    if (allowSwipe) {
      swipeEndTime = Date.now();
      if (
        Math.abs(posFinal) > posThreshold ||
        swipeEndTime - swipeStartTime < 300
      ) {
        if (posInit < posX1) {
          slideIndex--;
        } else if (posInit > posX1) {
          slideIndex++;
        }
      }

      if (posInit !== posX1) {
        allowSwipe = false;
        slide();
      } else {
        allowSwipe = true;
      }
    } else {
      allowSwipe = true;
    }
  },
  setTransform = function (transform, comapreTransform) {
    if (transform >= comapreTransform) {
      if (transform > comapreTransform) {
        sliderTrack.style.transform = `translate3d(${comapreTransform}px, 0px, 0px)`;
      }
    }
    allowSwipe = false;
  },
  reachEdge = function () {
    transition = false;
    swipeEnd();
    allowSwipe = true;
  };

sliderTrack.style.transform = 'translate3d(0px, 0px, 0px)';
sliderList.classList.add('grab');

sliderTrack.addEventListener('transitionend', () => (allowSwipe = true));
slider.addEventListener('touchstart', swipeStart);
slider.addEventListener('mousedown', swipeStart);

arrows.addEventListener('click', function () {
  let target = event.target;

  if (target.classList.contains('next')) {
    slideIndex++;
  } else if (target.classList.contains('prev')) {
    slideIndex--;
  } else {
    return;
  }

  slide();
});
