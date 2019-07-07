$(function () {

  const _debounce = (fn, time) => {
    let timeout;
    return function () {
      const functionCall = () => fn.apply(this, arguments);
      clearTimeout(timeout);
      timeout = setTimeout(functionCall, time);
    }
  };

  const _isFirstScreenInViewport = elem => {
    const bounding = elem.getBoundingClientRect();
    return bounding.bottom >= 0;
  }

  const scrollrInit = () => {
    skrollr.init({
      smoothScrollingDuration: '1000'
    });
  };

  const sliderInit = (sliderName, prevButton, nextButton) => {
    const owlPrevButton = document.querySelector(prevButton);
    const owlNextButton = document.querySelector(nextButton);

    const carouselSettings = {
      loop: true,
      dots: false,
      nav: false,
      items: 1,
    };

    $owl = $('body').find(sliderName);

    owlPrevButton.addEventListener('click', function () {
      $owl.trigger('prev.owl.carousel');
    });

    owlNextButton.addEventListener('click', function () {
      $owl.trigger('next.owl.carousel');
    });

    $owl.owlCarousel(carouselSettings).addClass('owl-carousel owl-theme');
  };

  const formInit = () => {
    const inputBlur = () => {
      const inputs = document.querySelectorAll('.form-input');

      [...inputs].forEach((elem) => {
        elem.addEventListener('blur', () => {
          checkInputEmptiness(elem);
        })
      });

      const checkInputEmptiness = (input) => {
        const inputLabelEmulator = input.parentNode;
        const formInputCurrentValue = input.value;

        formInputCurrentValue ? inputLabelEmulator.classList.add('not-empty') : inputLabelEmulator.classList.remove('not-empty')
      }
    };

    const inputValidation = () => {
      $.validator.setDefaults({
        errorClass: 'help-block',
        highlight: function (element) {
          $(element).addClass('has-error');
        },
        unhighlight: function (element) {
          $(element).removeClass('has-error');
        }
      });

      const validateConfig = {
        errorElement: 'span',
        errorClass: 'form__error',
        rules: {
          userphone: {
            required: true,
            digits: true
          },
          username: {
            required: true
          }
        },
        messages: {
          userphone: {
            required: 'Ошибка! Вы не ввели телефон',
            digits: 'Ошибка! Введите только числовые значения без "+"'
          },
          username: {
            required: 'Ошибка! Вы не ввели имя'
          }
        },
        submitHandler: function (form) {
          $.ajax({
            type: "POST",
            url: "mail.php", //Change
            data: $(form).serialize(),
            success: function () {
              $(`${form} .form__container`).html("<div class='form__success-message'>Ваша заявка принята и будет рассмотрена в ближайшее время. <br> Спасибо!</div>");
            }
          });
          return false;
        }
      }

      $('.js-form-1').validate(validateConfig);
      $('.js-form-2').validate(validateConfig);
      $('.js-form-3').validate(validateConfig);
    }

    inputBlur();
    inputValidation();
  };

  const navigationInit = () => {
    const navigationLinks = document.querySelectorAll('.burger-list__link');
    const headerElement = document.querySelector('.page-header');

    const onNavigationLinkClick = (e) => {
      const anchor = e.target.getAttribute('href');
      const anchorOffset = document.querySelector(`.${anchor}`).offsetTop - headerElement.offsetHeight;

      e.preventDefault();

      $("html, body").animate({ scrollTop: anchorOffset }, 666);
    };

    [...navigationLinks].forEach((navigationLink) => {
      navigationLink.addEventListener('click', event => {
        onNavigationLinkClick(event);
      });
    });
  }
  
  const visualInit = () => {
    const showHideLinks = document.querySelectorAll('.full-doc-list__link');

    const onShowLinkClick = (e) => {
      e.preventDefault();
      const _this = e.currentTarget;

      if ($(_this).siblings('.hidden-list').hasClass('active')) {
        $(_this).siblings('.hidden-list').removeClass('active');
        _this.querySelector('.link-text').textContent = 'Посмотреть все'
      } else {
        $(_this).siblings('.hidden-list').addClass('active');
        _this.querySelector('.link-text').textContent = 'Свернуть'
      }
    }

    [...showHideLinks].forEach( el => {
      el.addEventListener('click', e => {
        e.stopPropagation();
        onShowLinkClick(e);
      })
    })
  }

  const menuInit = () => {
    const menuContainer = document.querySelector('.burger');
    const menuButton = menuContainer.querySelector('.burger__button');
    const menuList = menuContainer.querySelector('.burger-list__container');

    const onBurgerButtonClick = (e) => {
      let timeout;
      const currentTarget = e.currentTarget;
      currentTarget.classList.toggle('open');
      menuList.classList.toggle('active');
      
      if (currentTarget.classList.contains('open') && menuList.classList.contains('active')) {
        setTimeout(() => {
          currentTarget.classList.remove('open');
          menuList.classList.remove('active');
        }, 5000);
      } else {
        clearTimeout(timeout);
      }
    }

    const showBurgerOnScroll = () => {
      const firstScreen = document.querySelector('.main-section');

      _isFirstScreenInViewport(firstScreen)
        ? menuContainer.classList.remove('active')
        : menuContainer.classList.add('active');
    };

    menuButton.addEventListener('click', e => {
      onBurgerButtonClick(e);
    });

    window.addEventListener('scroll', _debounce(showBurgerOnScroll, 100));
  }

  const headerMenuInit = () => {
    const headerBurgerElement = document.querySelector('.page-header-menu');
    const headerBurgerMenu = document.querySelector('.page-header-menu .navigation');

    headerBurgerElement.addEventListener('click', e => {
      headerBurgerElement.classList.toggle('active');
      headerBurgerMenu.classList.toggle('active');
    });
  }

  // set the owl-carousel otions
  initialize();

  function initialize() {
    sliderInit('.resume-slider', '.resume-slider__arrow--left', '.resume-slider__arrow--right');
    const containerWidth = $(window).width();
    if (containerWidth > 1060) {
      // initialize owl-carousel if window screensize is less the 767px
      scrollrInit();
    }

    if (containerWidth < 736) {
      sliderInit('.full-doc-list', '.full-doc-list__arrow--left', '.full-doc-list__arrow--right');
    }
    formInit();
    navigationInit();
    visualInit();
    menuInit();
    headerMenuInit();
  }
});
