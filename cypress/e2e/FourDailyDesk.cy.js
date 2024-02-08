import '../support/commands.js';

describe('AllRight', () => {
  var languagesAllright = ["ru", "en", "de", "es", "pl", "no", "pt", "fi", "ja", "sv", "fr", "tr"];

  function loginAllright() {
    cy.visit(`https://allrightcasino.com`);
    cy.get('.hamburger_icon > .icon').click({ force: true });
    cy.get('.actions > .secondary_new').click({ force: true });
    cy.get('#form-signin-email > .group-name-login').type("new_test_eur@gmail.com");
    cy.get('#form-signin-email > .group-name-password').type("new_test_eur@gmail.com");
    cy.wait(500);
    cy.get('#form-signin-email > .submit_button > .button').click({ force: true });
    cy.wait(500);
    cy.get('.close > .icon-close').click({ force: true });
  }

  for (let lang of languagesAllright) {
    it(`AllRight Desk ${lang}`, () => {
      cy.viewport(1920, 1080);
      loginAllright();
      cy.wait(1000);
      cy.visit(`https://allrightcasino.com/${lang}`);
      cy.get('[id^=slick-slide-control0]').each(($element, index, $list) => {
        cy.get(`#slick-slide-control0${index}`).click({ force: true });
        cy.get('.your-loading-element-selector', { timeout: 10000 }).should('not.exist');
        cy.wait(500);
        cy.screenshot(`AllRightDesk/slide_${index + 1}_language_${lang}`, {
          capture: 'viewport',
        });

        cy.wait(500);

        cy.get(`#slick-slide0${index} > .item > .overlay > .banner_content > .text > .desktop`)
          .invoke('text')
          .then((text) => {
            const paragraphCount = text.split('\n').filter(Boolean).length;
            cy.log(paragraphCount);
            if (paragraphCount !== 3) {
              cy.fail(`Ошибка: Некорректное количество абзацев на ${lang} языке`);
            }
            cy.wait(500);
            cy.get(`#slick-slide0${index} > .item > .overlay > .banner_content > .button`).click({ force: true });
            cy.go(-1)
          });
      });
    });
  }
});

describe('LuckyBird', () => {
  function loginLuckyBird() {
    cy.visit(`https://luckybirdcasino.com`);
    cy.get(':nth-child(3) > .column > .button').click({ force: true });
    cy.get('#form-signin-email > .group-name-login').type("new_test_eur@gmail.com");
    cy.get('#form-signin-email > .group-name-password').type("new_test_eur@gmail.com");
    cy.wait(500);
    cy.get('#form-signin-email > .submit_button > .button').click({ force: true });
    cy.wait(500);
    cy.get('.header > .close > .icon-close').click({ force: true });
  }

  var languagesLuckyBird = ["ru", "en", "de", "es", "pl", "no", "fi", "pt", "tr"];

  for (let lang of languagesLuckyBird) {
    it(`LuckyBird Desk ${lang}`, () => {
      cy.viewport(1920, 1080);
      loginLuckyBird();
      cy.visit(`https://luckybirdcasino.com/${lang}`);
      const elementSelector = "[id^=slick-slide-control0]";
      cy.get(elementSelector).each(($element, index, $list) => {
        cy.get(`#slick-slide-control0${index}`).click({ force: true });
        cy.wait(500);
        cy.screenshot(`LuckyBirdDesk/slide_${index + 1}_language_${lang}`, {
          capture: 'runner',
        });
        cy.wait(500);
        cy.get(`#slick-slide0${index} > .item > .overlay > .text > .desktop`)
          .invoke('text')
          .then((text) => {
            const paragraphCount = text.split('\n').filter(Boolean).length;
            if (paragraphCount < 3) {
              cy.fail(`Ошибка: Некорректное количество абзацев на ${lang} языке`);
            }
            cy.wait(500);
            cy.get(`#slick-slide0${index} > .item > .overlay > .button_container > .transparent`).click({ force: true });
            cy.go(-1);
          });
      });
    });
  }
});

describe('Slottica', () => {

  function loginSlottica() {
    cy.visit(`https://slottica.com`);
    cy.get('.extend > .button').click({ force: true });
    cy.get('#signinform_email > .form > .group-name-login').type("new_test_eur@gmail.com");
    cy.get('#signinform_email > .form > .group-name-password').type("new_test_eur@gmail.com");
    cy.get('#signinform_email > .form > :nth-child(4) > .button').click({ force: true });
    cy.wait(500);
    cy.get('.close > .icon-close').click({ force: true });
  }

  var languagesSlottica = ["ru", "en", "de", "es", "pl", "pt", "fi", "no", "sv", "ja", "kk", "fr", "hi", "bn", "az", "tr"];
  
  for (let lang of languagesSlottica) {
    it.only(`Slottica Desk ${lang}`, () => {
      cy.viewport(1920, 1080);
      loginSlottica();
      cy.visit(`https://slottica.com/${lang}`);
      const elementSelectorSlott = "[id^=slick-slide-control0]";

      cy.get(elementSelectorSlott).each(($element, index, $list) => {
        cy.get(`#slick-slide-control0${index}`).click({ force: true });
        cy.wait(500);
        cy.screenshot(`SlotticaDesk/slide_${index + 1}_language_${lang}`, {
          capture: 'viewport',
        });
        cy.wait(500);
        cy.get(`#slick-slide0${index} > :nth-child(1) > .item > .text_block > .text_row > .desktop`)
          .invoke('text')
          .then((text) => {
            const paragraphCount = text.split('\n').filter(Boolean).length;
            if (paragraphCount > 3) {
              cy.fail(`Ошибка: Некорректное количество абзацов на ${lang} языке`);
            }
            cy.log(paragraphCount);
            cy.wait(500);
            cy.get(`#slick-slide0${index} > :nth-child(1) > .item > .text_block > .button_row > .desktop`).click({ force: true });
            cy.go(-1);
          });
      });
    });
  }
});

describe('SlottyWay', () => {
  function loginSlottyWay() {
    cy.visit(`https://slottyway.com`);
    cy.get('.login > :nth-child(2) > .button').click({ force: true });
    cy.get('.group-name-login').type("new_test_eur@gmail.com");
    cy.get('.group-name-password').type("new_test_eur@gmail.com");
    cy.wait(500);
    cy.get(':nth-child(8) > .button').click({ force: true });
    cy.wait(500);
    cy.get('.close > .icon-close2').click({ force: true });
  }

  var languagesSlottyway = ["ru", "en", "de", "es", "pl", "pt", "fi", "no", "sv", "tr"];

  for (let lang of languagesSlottyway) {
    it(`SlottyWay Desk ${lang}`, () => {
      cy.viewport(1920, 1080);
      loginSlottyWay();
      cy.visit(`https://slottyway.com/${lang}`);
      cy.get('[id^=slick-slide-control]').each(($element, index) => {
        const slideControlSelectors = [`#slick-slide-control2${index}`, `#slick-slide-control0${index}`, `#slick-slide-control1${index}`];

        // Click on the first available slide control
        cy.get(slideControlSelectors.join(', ')).first().click({ force: true });
        cy.wait(500);
        cy.screenshot(`SlottyWayDesk/slide_${index + 1}_language_${lang}.png`, {
          capture: 'viewport',
        });
        cy.wait(500);
        cy.get(`.item > .overlay > .banner_content > .text > .desktop`)
          .invoke('text')
          .then((text) => {
            const paragraphCount = text.split('\n').filter(Boolean).length;
            /*
            if (paragraphCount > 7) {
              cy.fail(`Ошибка: Некорректное количество абзацев на ${lang} языке`);
            }*/
          });
      });
    });
  }
});

describe('Spinamba', () => {
  function loginSpinamba() {
    cy.visit(`https://spinamba.com`);
    cy.get('.row > .login > :nth-child(2) > .button').click({ force: true });
    cy.get('#form-signin-email > .group-name-login').type("new_test_eur@gmail.com");
    cy.get('#form-signin-email > .group-name-password').type("new_test_eur@gmail.com");
    cy.get('#form-signin-email > .submit_button > .button').click({ force: true });
    cy.wait(500);
    cy.get('.header > .close > .icon-close').click({ force: true });
  }

  const languagesSpinamba = ["ru", "en", "de", "es", "pl", "pt", "fi", "no", "sv", "tr"];

  for (let lang of languagesSpinamba) {
    it(`Spinamba Desk ${lang}`, () => {
      cy.viewport(1920, 1080);
      loginSpinamba();
        cy.visit(`https://spinamba.com/${lang}`);
        const elementSelectorSpinamba = "[id^=slick-slide-control]";

        cy.get(elementSelectorSpinamba).each(($element, index, $list) => {
          cy.get(`#slick-slide-control2${index}, #slick-slide-control1${index}, #slick-slide-control0${index}`)
            .should('exist')
            .then(($el) => {
              console.log('Element found:', $el);
            })
            .click({ force: true });
          cy.wait(500);
          cy.screenshot(`SpinambaDesk/slide_${index + 1}_language_${lang}`, {
            capture: 'runner',
          });
          cy.wait(500);
          cy.get(`[id$=${index}] > .item > .overlay > :nth-child(1) > .text > .desktop`)
            .invoke('text')
            .then((text) => {
              const paragraphCount = text.split('\n').filter(Boolean).length;
              if (paragraphCount < 3) {
                cy.log(`Ошибка: Некорректное количество абзацев на ${lang} языке`);
              }
            });
        });
    });
  }
});

describe('SpinBounty', () => {
  function loginSpinBounty() {
    cy.visit(`https://spinbounty.com`);
    cy.get('#sidebar-main > .actions > .primary').click({ force: true });
    cy.get('.group-name-login > .control-label').type("v.pupkin.eur@gmail.com");
    cy.get('.group-name-password > .control-label').type("JTFN3W9JM4");
    cy.get('.submit').click({ force: true });
    cy.wait(1000);
    cy.get('.action > .icon').click({ force: true });
  }

  var languagesSpinBounty = ["ru", "en", "pl", "de", "fr"];

  for (let lang of languagesSpinBounty) {
    it(`SpinBounty Desk ${lang}`, () => {
      cy.viewport(1920, 1080);
      loginSpinBounty();
        cy.visit(`https://spinbounty.com/${lang}`);

        cy.get('.item_banner > .game_info > .btn_block > .button').its("length").then((length) => {
          var expectedCount = length;

          const scrollDistance = 810; // Расстояние свайпа
          const captureInterval = 1000; // Интервал между скриншотами в миллисекундах
          let currentScrollLeft = 0;

          for (let swipeCount = 0; swipeCount < expectedCount; swipeCount++) {
            cy.get(`.ds-track:first`).scrollTo(currentScrollLeft, 0, { duration: 250 });
            cy.wait(captureInterval);
            cy.wait(500);
            cy.screenshot(`SpinBountyDesk/slide_swipe_${swipeCount + 1}_language_${lang}`, {
              capture: 'viewport',
            });
            currentScrollLeft += scrollDistance; // Обновляем currentScrollLeft с учетом scrollDistance
          }
        });
    });
  }
});

describe('SuperCat', () => {
  function loginSuperCat() {
    cy.visit(`https://supercatcasino67.com`);
    cy.get('.guest-header > .button-outlined').click({ force: true });
    cy.get(':nth-child(1) > .form-control').type("new_test_eur@gmail.com");
    cy.get(':nth-child(2) > .form-control').type("new_test_eur@gmail.com");
    cy.get('.sign-in-form > .button').click({ force: true });
    cy.wait(1000);
  }

  var languagesSuperCat = ["ru", "en", "de", "es", "pl", "pt", "fi", "no", "tr"];

  for (let lang of languagesSuperCat) {
    it(`SuperCat Desk ${lang}`, () => {
      loginSuperCat();
      cy.viewport(1920, 1080);
      cy.visit(`https://supercatcasino67.com/${lang}`);

      cy.get('.slider-dots button').each(($button, index) => {
        cy.wrap($button).click({ force: true });
        cy.wait(500);
        cy.screenshot(`SuperCatDesk/slide_${index + 1}_language_${lang}`, {
          capture: 'viewport',
        });

        cy.wait(500);

        cy.get('[tabindex="-1"] > .slider-item > .slider-item__header')
          .invoke('text')
          .then((text) => {
            const paragraphCount = text.split('\n').filter(Boolean).length;
            if (paragraphCount < 3) {
              cy.log(`Ошибка: Некорректное количество абзацев на ${lang} языке`);
            }
          });

        cy.wait(500);
      });
    });
  }
});

describe('Magic365', () => {
  function loginMagic365() {
    cy.visit(`https://magic365.com`);
    cy.get('#sidebar-main > .actions > .primary').click({ force: true });
    cy.get('.group-name-login > .control-label').type("v.pupkin.eur@gmail.com");
    cy.get('.group-name-password > .control-label').type("JTFN3W9JM4");
    cy.get('.submit').click({ force: true });
    cy.wait(1000);
    cy.get('.action > .icon').click({ force: true });
  }

  var languagesMagic365 = ["ru", "en", "pl"];

  for (let lang of languagesMagic365) {
    it(`Magic365 Desk ${lang}`, () => {
      loginMagic365();
      cy.viewport(1920, 1080);
      cy.visit(`https://magic365.com/${lang}`);
      
      cy.get('.item_banner > .game_info > .btn_block > .button').its("length").then((length) => {
        var expectedCount = length;

        const scrollDistance = 810; // Расстояние свайпа
        const captureInterval = 1000; // Интервал между скриншотами в миллисекундах
        let currentScrollLeft = 0;

        for (let swipeCount = 0; swipeCount < expectedCount; swipeCount++) {
          cy.get(`.ds-track:first`).scrollTo(currentScrollLeft, 0, { duration: 250 });
          cy.wait(captureInterval);
          cy.wait(500);
          cy.screenshot(`Magic365Desk/slide_swipe_${swipeCount + 1}_language_${lang}`, {
            capture: 'viewport',
          });
          cy.wait(500);
          currentScrollLeft += scrollDistance; // Обновляем currentScrollLeft с учетом scrollDistance
        }
      });
    });
  }
});

describe.only('Viks', () => {
  function loginViks() {
    cy.visit(`https://viks.com/casino`);
    cy.get('.extend > .button').click({ force: true });
    cy.get('[data-tab="email"] > .label').click({ force: true });
    cy.get('#signinform_email > .form > .group-name-login').type("v.pupkin.eur@gmail.com");
    cy.get('#signinform_email > .form > .group-name-password').type("JTFN3W9JM4");
    cy.get('#signinform_email > .form > :nth-child(4) > .button').click({ force: true });
    cy.wait(1000);
    cy.go(-1);
  }

  var languagesViks = ["ru", "en", "uz"];

  for (let lang of languagesViks) {
    it(`Viks Desk ${lang}`, () => {
      cy.viewport(1920, 1080);
      loginViks();
      cy.visit(`https://viks.com/${lang}/casino`);
      var elementSelectorViks = "[id^=slick-slide-control0]";

      cy.get(elementSelectorViks).each(($element, index, $list) => {
        cy.wait(500);
        cy.get(`#slick-slide-control0${index}`).click({ force: true });
        cy.screenshot(`ViksDesk/slide_${index + 1}_language_${lang}`, {
          capture: 'viewport',
        });
        cy.wait(500);
        cy.get(`#slick-slide0${index} > :nth-child(1) > .item > .text_block > .text_row > .desktop`)
          .invoke('text')
          .then((text) => {
            const paragraphCount = text.split('\n').filter(Boolean).length;
            if (paragraphCount < 3) {
              cy.log(`Ошибка: Некорректное количество абзацев на ${lang} языке`);
            }
          });
      });
    });
  }
});

describe('Spinado', () => {
  function loginSpinado() {
    cy.visit(`https://spinado.com`);
    cy.get('.extend > .button').click({ force: true });
    cy.get('#signinform_email > .form > .group-name-login').type("testmodal@gmail.com");
    cy.get('#signinform_email > .form > .group-name-password').type("@gmail.comM123");
    cy.get('#signinform_email > .form > :nth-child(4) > .button').click({ force: true });
    cy.wait(1000);
    cy.get('.close > .icon-close').click({ force: true });
  }

  var languagesSpinado = ["ru", "en", "es", "pl", "pt", "kk"];

  for (let lang of languagesSpinado) {
    it(`Spinado Desk ${lang}`, () => {
      loginSpinado();
      cy.viewport(1920, 1080);
      cy.visit(`https://spinado.com/${lang}`);
      var elementSelectorSpinado = "[id^=slick-slide-control0]";

      cy.get(elementSelectorSpinado).each(($element, index, $list) => {
        cy.get(`#slick-slide-control0${index}`).click({ force: true });
        cy.wait(500);
        cy.screenshot(`SpinadoDesk/slide_${index + 1}_language_${lang}`, {
          capture: 'viewport',
        });
        cy.wait(500);
        cy.get(`#slick-slide0${index} > :nth-child(1) > .item > .text_block > .text_row > .desktop`)
          .invoke('text')
          .then((text) => {
            const paragraphCount = text.split('\n').filter(Boolean).length;
            if (paragraphCount < 3) {
              cy.log(`Ошибка: Некорректное количество абзацев на ${lang} языке`);
            }
          });
      });
    });
  }
});
