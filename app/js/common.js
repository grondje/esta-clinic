$(function() {

	const _debounce = (fn, time) => {
		let timeout;
		return function () {
			const functionCall = () => fn.apply(this, arguments);
			clearTimeout(timeout);
			timeout = setTimeout(functionCall, time);
		}
	};

	const _isInViewport = elem => {
		const bounding = elem.getBoundingClientRect();
		return (
			bounding.top >= 0 &&
			bounding.bottom <= (window.innerHeight + bounding.height / 2 || document.documentElement.clientHeight + bounding.height / 2)
		);
	};

	const _removeClassFromAllNodes = (nodeArray) => {
		[...nodeArray].forEach((nodeArray) => {
			nodeArray.classList.remove('active');
		});
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
			autoplay: true,

			responsive: {
				0: {
					items: 2
				},
				667: {
					items: 3
				},
				1060: {
					items: 4
				}
			}
		};

		$owl = $('body').find(sliderName);

		owlPrevButton.addEventListener('click', function() {
			$owl.trigger('prev.owl.carousel');
		});

		owlNextButton.addEventListener('click', function() {
			$owl.trigger('next.owl.carousel');
		});

		$owl.owlCarousel(carouselSettings).addClass('owl-carousel owl-theme');
	};

	const docPopupsInit = () => {
		const popupButtonsOpeners = document.querySelectorAll('.doc-openers');

		const docPopupSettings = (docPopupMarkup) => {
			return {
				items: {
					type: 'inline',
					src: docPopupMarkup
				},
				midClick: true, // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
				removalDelay: 500,
				callbacks: {
					beforeOpen: function () {
						this.st.mainClass = 'mfp-zoom-in';
					},
				},
			} 
		};

		const docPopupGenerateMarkup = (markupInfo) => {
			const { docName: name, docImage: imagePath, docProf: prof, docDescription: desc, docListDescription: listDesc} = markupInfo;
			return `
			<div id='docpopup' class='doc-popup mfp-with-anim'>
				<div class='doc-popup__container'>
					<div class='doc-popup__image'>
						<img src=${imagePath}>
					</div>
					
					<div class='doc-popup__info'>
						<div class="staff-section-list__info">
							<div class="staff-section-list__name">${name}</div>
							<div class="staff-section-list__prof">${prof}</div>
						</div>
						<div class='doc-popup__desc'>${desc}</div>
						<div class='popup-doc-list'>${listDesc}</div>
					</div>
				</div>
				<button type='button' class='mfp-close'></button>
			</div>	
		`;
		}

		const docPopupGenerateSettings = (popupTriggerNode) => {
			const docName = popupTriggerNode.parentNode.querySelector('.staff-section-list__name').textContent;
			const docImage = popupTriggerNode.parentNode.querySelector('.staff-section-list__img').getAttribute('src');
			const docProf = popupTriggerNode.parentNode.querySelector('.popup-doc-prof').textContent;
			const docDescription = popupTriggerNode.parentNode.querySelector('.popup-doc-description').textContent;
			const docListDescription = popupTriggerNode.parentNode.querySelector('.popup-doc-list').innerHTML;

			const docInformation = { docName, docImage, docProf, docDescription, docListDescription };
			return docPopupSettings(docPopupGenerateMarkup(docInformation))
		}

		const docPopupsOpen = (popupSettings) => {
			$.magnificPopup.open(popupSettings);
		}

		[...popupButtonsOpeners].forEach((popupButtonsOpener) => {
			popupButtonsOpener.addEventListener('click', () => {
				const finalSettings = docPopupGenerateSettings(popupButtonsOpener);
				docPopupsOpen(finalSettings);
			});
		});
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
							$(form).html("<div class='form__success-message'>Ваша заявка принята и будет рассмотрена в ближайшее время. <br> Спасибо!</div>");
						}
					});
					return false;
				}
			}

			$('.js-form-1').validate(validateConfig);
		}

		inputBlur();
		inputValidation();
	};

	const visualInit = () => {
		const photoElems = [
			document.querySelector('.trust-section__photo')
		];

		const photoElemMain = document.querySelector('.main-section__photo')

		const handlePhotoSections = () => {
			[...photoElems].forEach((photoElem) => {
				if (_isInViewport(photoElem)) {
					photoElem.classList.add('activate');
				}
			})
		};

		const handleActiveFirstPhoto = () => {
			photoElemMain.classList.add('activate');
		}

		window.addEventListener('scroll', _debounce(handlePhotoSections, 100));

		setTimeout(() => {
			handleActiveFirstPhoto();
		}, 500);
	};
	
	const navigationInit = () => {
		const headerElement = document.querySelector('.page-header');

		const firstLink = document.querySelector('.main-section__anchor');

		firstLink.addEventListener('click', e => {
			const anchorOffset = document.querySelector('.trust-section').offsetTop - headerElement.offsetHeight;
			$("html, body").animate({ scrollTop: anchorOffset }, 666);
		})
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
		sliderInit('.slider', '.staff-section-list-slider__arrow--left', '.staff-section-list-slider__arrow--right');
		const containerWidth = $(window).width();
		if (containerWidth > 1060) {
			// initialize owl-carousel if window screensize is less the 767px
			scrollrInit();
		}
		docPopupsInit();
		formInit();
		visualInit();
		navigationInit();
		headerMenuInit();
	}
});
