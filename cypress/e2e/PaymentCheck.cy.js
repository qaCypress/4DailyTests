import '../support/commands.js';
import * as cur from '../support/data.js';


describe('AllRight', () => {
  beforeEach(() => {
    cy.visit('https://allrightcasino.com/en')
  })


  for(let j = 0; j < cur.AllRightData.currency.length; j++) {
    it(cur.AllRightData.currency[j],  () => {
      cy.get(`[data-href="/en/sign-in"][class="button white_button"]`).click()
      cy.get('input[type="email"]').type(cur.AllRightData.emails[j])
      cy.get('input[type="password"]').first().type(cur.AllRightData.passwords[j])
      cy.get('#form-signin-email > .submit_button > .button').click()
  
      cy.wait(5000)
      cy.get('.close > .icon-close').click()

      cy.visit('https://allrightcasino.com/en#cashbox-deposit')
      cy.wait(4000)
  
      cy.get(`[class="content"]`)
        .invoke('text').should('not.include', 't.payment')
        //Оп, якщо це бачиш в консолі, то знайдений ключ :)
  
  
        let depositFormsIds = [];


        cy.get('.content')
        .then((body) => {
            if(body.find('form').length > 0) {
              cy.log('Кіно буде')
              cy.get('.payment_forms')
              .find('form')            
              .each((form) => {           
                const formId = form.attr('id');  
                depositFormsIds.push(formId);            
              })
              .then(() => {
                cy.log(depositFormsIds.length);  
              
                if (depositFormsIds.length > 0) {
        
                  for(let i = 0; i < depositFormsIds.length; i++) {
                    cy.get(`[data-key="${i}"] > .payment_item > .footer`)
                    .click()       
                    cy.get(`#${depositFormsIds[i]}`).invoke('text')
                    .then(($text) => {
                      if ($text.includes('Santiago')) {
                        throw new Error('В Методі оплати присутній ключ t.payment!!!');
                      } else {
                        cy.log("✅В методі оплати ключ відсутній✅")
                      }
                    });

                    //Оп, якщо це бачиш в консолі, то знайдений ключ :)          
                    let minValue = 0;
                    let maxValue = 0;                   

                    
                    cy.get(`[data-key="${i}"] > .form_row > .limit`)
                    .invoke('text')
                    .then((amountText) => {
                      const regex = /(\d{1,3}(?:,\d{3})*)(?:\s*-\s*(\d{1,3}(?:,\d{3})*))?/;
                      const match = amountText.match(regex);
                      if (match) {
                        minValue = parseFloat(match[1].replace(/,/g, '').trim());
                        maxValue = match[2] ? parseFloat(match[2].replace(/,/g, '').trim()) : undefined;
                    
                        // Use the extracted numbers as needed
                        cy.log(`Min limit: ${minValue}`);
                        cy.log(`Max limit: ${maxValue}`);
                      } else {
                        // Handle the case when the regex doesn't match
                        cy.log('Failed to extract numbers');
                      }

                      let staticValue = [];
                      let customValue = 0;
                      
                      cy.get(`[data-key="${i}"]  > .form_row > .amount_variants`)
                       .find('.form-group.radio input[name="predefinedValue"]')
                       .each(($radio) => {
                         const value = parseInt($radio.attr('value'));
                    
                         if (!isNaN(value)) {
                           staticValue.push(value);
                          }
                        })
                        .then(() => {
                          cy.log(staticValue.length);
                          cy.log(`First Value: ${staticValue[0]}`);
                          cy.log(`Second Value: ${staticValue[1]}`);
                          cy.log(`Third Value: ${staticValue[2]}`);

                          cy.get(`[data-key="${i}"]  > .form_row > .amount_custom`)
                          .find(`input[name="amount"]`)
                          .then(($input) => {
                            const value = $input.attr('Value')
                            const parsedValue = parseFloat(value);
                        
                            if (!isNaN(parsedValue)) {
                              customValue = parsedValue;
                            }
                          })
                          .then(() => {
                            cy.log(`Custom value ${customValue}`);

                            function isAscending(staticValue) {
                              for (let i = 1; i < staticValue.length; i++) {
                                if (staticValue[i] < staticValue[i - 1]) {
                                  return false; // Array is not in ascending order
                                }
                              }
                              return true; // Array is in ascending order
                            }

                            
                            let lessLimit = minValue <= staticValue[0] && minValue <= staticValue[1] && minValue <= staticValue[2] && minValue <= customValue
                            && maxValue >= staticValue[0] && maxValue >= staticValue[1] && maxValue >= staticValue[2] && maxValue >= customValue
                            

                            if (lessLimit) {
                              cy.log('✅Ліміти сходяться✅')
                            } else {
                              cy.log('ЛІМІТИ НЕЕЕ СХОДЯТЬСЯ')
                              cy.fail(
                              `Ліміти не сходяться, одне із чотирьох значень не вписується в ліміт ${minValue} - ${maxValue}
                              \n1 значення - ${staticValue[0]}
                              \n2 значення - ${staticValue[1]}
                              \n3 значення - ${staticValue[2]}
                              \nЗначення плейсхолдера - ${customValue}`)
                              cy.get(`[data-key="${i}"]  > .form_row > .amount_custom`).screenshot("Sho")
                            }

                            if(isAscending(staticValue)) {
                              cy.log('✅Значення в зростаючому порядку✅')
                            } else {
                              cy.log('Значення НЕ в зростаючому порядку')
                              cy.fail(`Значення радіокнопок не в зростаючому порядку
                              \n1 значення - ${staticValue[0]}
                              \n2 значення - ${staticValue[1]}
                              \n3 значення - ${staticValue[2]}`)
                            }

                            



                          });

                        });
            
                    });










                    cy.get(`#${depositFormsIds[i]} > .header > .close > .icon`).click()
                  }
                        
                } else {
                  cy.log('sho')
                }
              
              })  
            } else {
                cy.log('НІЧОГО НЕМА')
                cy.get(`.content`).invoke('text').should('not.include', 't.payment')
                //Оп, якщо це бачиш в консолі, то знайдений ключ :)
            }
        })

        cy.visit('https://allrightcasino.com/en#cashbox-withdraw')
  
        cy.wait(5000)
  
        cy.get('.content')
        .invoke('text').should('not.include', 't.payment')
        //Оп, якщо це бачиш в консолі, то знайдений ключ :)
  
        let withdrawFormsIds = [];

        cy.get('.content')
        .then((body) => {
            if(body.find('form').length > 0) {
              cy.get('div.payment_forms')  
              .find('form')              
              .each((form) => {           
                const formId = form.attr('id');  
                withdrawFormsIds.push(formId);            
              })
              .then(() => {
                cy.log(withdrawFormsIds.length);  
              
                if (withdrawFormsIds.length > 0) {
        
                  for(let i = 0; i < withdrawFormsIds.length; i++) {
                    cy.get(`[data-key="${i}"] > .payment_item > .footer`)
                    .click()               
                    cy.get(`#${withdrawFormsIds[i]}`).invoke('text').should('not.include', 't.payment')
                    //Оп, якщо це бачиш в консолі, то знайдений ключ :)
                    cy.get(`#${withdrawFormsIds[i]}`).invoke('text').should('not.include', 't.withdraw')
                    //Оп, якщо це бачиш в консолі, то знайдений ключ :)
                    cy.get(`#${withdrawFormsIds[i]} > .header > .close > .icon`).click()
                  }
                  
              
                }
              
              });
            } else {
                cy.log('НІЧОГО НЕМА')
                cy.get(`.content`).invoke('text').should('not.include', 't.payment')
                //Оп, якщо це бачиш в консолі, то знайдений ключ :)
                cy.get(`.content`).invoke('text').should('not.include', 't.withdraw')
                //Оп, якщо це бачиш в консолі, то знайдений ключ :)
            }
        })
  
    })
  }
})

describe('LuckyBird', () => {
  beforeEach(() => {
    cy.visit('https://luckybirdcasino.com/en')
  })
  for(let i = 0; i < cur.LuckyBirdCurrinces.length; i++) {
    it(cur.LuckyBirdCurrinces[i],  () => {

      cy.visit('https://luckybirdcasino.com/en')
      cy.get(`[data-modal-id="login-modal"]`, { timeout: 10000 }).eq(1).click({ force: true })
      cy.get(`[class="content"]`).should('contain', 'Authorization')

      
      cy.get('input[type="email"]').type(cur.LuckyBirdEmails[i])
      cy.get('input[type="password"]').first().type(cur.LuckyBirdPasswords[i])
      cy.get(`[class="submit_button"]`).first().click()
  
      cy.wait(5000)
      cy.get(`[class="icon-close"]`).click()
      cy.visit('https://luckybirdcasino.com/en#cashbox-deposit')
  
      cy.get('.cashbox_content')
        .invoke('text').should('not.include', 't.payment')
        //Оп, якщо це бачиш в консолі, то знайдений ключ :)
  
  
      let depositFormsIds = [];


        cy.get('.cashbox_content')
        .then((body) => {
            if(body.find('form').length > 0) {
              cy.log('Кіно буде')
              cy.get('.payment__item')  
              .find('form')              
              .each((form) => {           
                const formId = form.attr('id');  
                depositFormsIds.push(formId);            
              })
              .then(() => {
                cy.log(depositFormsIds.length);  
              
                if (depositFormsIds.length > 0) {
        
                  for(let i = 0; i < depositFormsIds.length; i++) {
                    cy.get(`[data-key="${i}"] > .pay_image `)
                    .click()       
                    cy.get(`#${depositFormsIds[i]}`).invoke('text').should('not.include', 't.payment')        
                    //Оп, якщо це бачиш в консолі, то знайдений ключ :)      
                   
          
                  }
                        
                } else {
                  cy.log('sho')
                }
              
              })  
            } else {
                cy.log('НІЧОГО НЕМА')
                cy.get(`.cashbox_content`).invoke('text').should('not.include', 't.payment')
                //Оп, якщо це бачиш в консолі, то знайдений ключ :)
            }
        })

        cy.visit('https://luckybirdcasino.com/en#cashbox-withdraw')
  
        cy.wait(2000)
  
        cy.get('.cashbox_content')
        .invoke('text').should('not.include', 't.payment')
        //Оп, якщо це бачиш в консолі, то знайдений ключ :)
        cy.get('.cashbox_content')
        .invoke('text').should('not.include', 't.withdraw')
        //Оп, якщо це бачиш в консолі, то знайдений ключ :)
  
        let withdrawFormsIds = [];

        cy.get('.cashbox_content')
        .then((body) => {
            if(body.find('form').length > 0) {
              cy.get('div.payment__item')  
              .find('form')              
              .each((form) => {           
                const formId = form.attr('id');  
                withdrawFormsIds.push(formId);            
              })
              .then(() => {
                cy.log(withdrawFormsIds.length);  
              
                if (withdrawFormsIds.length > 0) {
        
                  for(let i = 0; i < withdrawFormsIds.length; i++) {
                    cy.get(`[data-key="${i}"] > .pay_image`)
                    .click()               
                    cy.get(`#${withdrawFormsIds[i]}`).invoke('text').should('not.include', 't.payment')
                    //Оп, якщо це бачиш в консолі, то знайдений ключ :)
                    cy.get(`#${withdrawFormsIds[i]}`).invoke('text').should('not.include', 't.withdraw')
                    //Оп, якщо це бачиш в консолі, то знайдений ключ :)
                  }
                }       
              });
            } else {
                cy.log('НІЧОГО НЕМА')
                cy.get(`.cashbox_content`).invoke('text').should('not.include', 't.payment')
                //Оп, якщо це бачиш в консолі, то знайдений ключ :)
                cy.get(`.cashbox_content`).invoke('text').should('not.include', 't.withdraw')
                //Оп, якщо це бачиш в консолі, то знайдений ключ :)
            }
        })
  
    })
  }
})

describe('Slottica', () => {

  beforeEach(() => {
    cy.visit('https://slottica.com/en')
  })

  for(let i = 0; i < cur.SlotticaCurrinces.length; i++) {
    it(cur.SlotticaCurrinces[i],  () => {
      cy.get('.extend > .button').click()
      cy.get('input[type="email"]').type(cur.SlotticaEmails[i])
      cy.get('input[type="password"]').first().type(cur.SlotticaPasswords[i])
      cy.get('#signinform_email > .form > :nth-child(4) > .button').click()
  
      cy.wait(5000)
      cy.get('.popup_close > .icon-close').click()
      cy.visit('https://slottica.com/en#cashbox-deposit')
  
      cy.get('.popup_content')
        .invoke('text').should('not.include', 't.payment')
      //Оп, якщо це бачиш в консолі, то знайдений ключ :)
  
      let depositFormsIds = [];


        cy.get('.payments_gallery_wrap')
        .then((body) => {
            if(body.find('form').length > 0) {
              cy.log('Кіно буде')
              cy.get('.item')  
              .find('form')              
              .each((form) => {           
                const formId = form.attr('id');  
                depositFormsIds.push(formId);            
              })
              .then(() => {
                cy.log(depositFormsIds.length);  
              
                if (depositFormsIds.length > 0) {
        
                  for(let i = 0; i < depositFormsIds.length; i++) {
                    cy.get(`[data-key="${i}"] > .payment_card `)
                    .click()       
                    cy.get(`#${depositFormsIds[i]}`).invoke('text').should('not.include', 't.payment')    
                    //Оп, якщо це бачиш в консолі, то знайдений ключ :)          
                   
          
                  }
                        
                } else {
                  cy.log('sho')
                }
              
              })  
            } else {
                cy.log('НІЧОГО НЕМА')
                cy.get(`.popup_content`).invoke('text').should('not.include', 't.payment')
            }
        })

        cy.visit('https://slottica.com/en#cashbox-withdraw')
  
        cy.wait(5000)
  
        cy.get('.popup_content')
        .invoke('text').should('not.include', 't.payment')
        //Оп, якщо це бачиш в консолі, то знайдений ключ :)
        cy.get('.popup_content')
        .invoke('text').should('not.include', 't.withdraw')
        //Оп, якщо це бачиш в консолі, то знайдений ключ :)
  
        let withdrawFormsIds = [];

        cy.get('.payments_gallery_wrap')
        .then((body) => {
            if(body.find('form').length > 0) {
              cy.get('div.item')  
              .find('form')              
              .each((form) => {           
                const formId = form.attr('id');  
                withdrawFormsIds.push(formId);            
              })
              .then(() => {
                cy.log(withdrawFormsIds.length);  
              
                if (withdrawFormsIds.length > 0) {
        
                  for(let i = 0; i < withdrawFormsIds.length; i++) {
                    cy.get(`[data-key="${i}"] > .payment_card`)
                    .click()               
                    cy.get(`#${withdrawFormsIds[i]}`).invoke('text').should('not.include', 't.payment')
                    //Оп, якщо це бачиш в консолі, то знайдений ключ :)
                    cy.get(`#${withdrawFormsIds[i]}`).invoke('text').should('not.include', 't.withdraw')
                    //Оп, якщо це бачиш в консолі, то знайдений ключ :)
                  }
                }       
              });
            } else {
                cy.log('НІЧОГО НЕМА')
                cy.get(`.popup_content`).invoke('text').should('not.include', 't.payment')
                //Оп, якщо це бачиш в консолі, то знайдений ключ :)
                cy.get(`.popup_content`).invoke('text').should('not.include', 't.withdraw')
                //Оп, якщо це бачиш в консолі, то знайдений ключ :)
            }
        })
  
    })
  }

})

describe('SlottyWay', () => { 
  beforeEach(() => {
    cy.visit('https://slottyway.com/en')
  })

  for(let i = 0; i < cur.SlottyWayCurrinces.length; i++) {
    it(cur.SlottyWayCurrinces[i],  () => {
      cy.get('.login > :nth-child(2) > .button').click()
      cy.get('input[type="email"]').type(cur.SlottyWayEmails[i])
      cy.get('input[type="password"]').first().type(cur.SlottyWayPasswords[i])
      cy.get(':nth-child(8) > .button').click()
  
      cy.wait(5000)
      cy.get('.close > .icon-close2').click()
      cy.visit('https://slottyway.com/en#cashbox-deposit')
  
      cy.get('.popup')
        .invoke('text').should('not.include', 't.payment')
      //Оп, якщо це бачиш в консолі, то знайдений ключ :)
  
      let depositFormsIds = [];


        cy.get('.payment__gallery')
        .then((body) => {
            if(body.find('form').length > 0) {
              cy.log('Кіно буде')
              cy.get('.item')  
              .find('form')              
              .each((form) => {           
                const formId = form.attr('id');  
                depositFormsIds.push(formId);            
              })
              .then(() => {
                cy.log(depositFormsIds.length);  
              
                if (depositFormsIds.length > 0) {
        
                  for(let i = 0; i < depositFormsIds.length; i++) {
                    cy.get(`[data-key="${i}"] > .pay_image `)
                    .click()       
                    cy.get(`#${depositFormsIds[i]}`).invoke('text').should('not.include', 't.payment')              
                   //Оп, якщо це бачиш в консолі, то знайдений ключ :)
          
                  }
                        
                } else {
                  cy.log('sho')
                }
              
              })  
            } else {
                cy.log('НІЧОГО НЕМА')
                cy.get(`.popup`).invoke('text').should('not.include', 't.payment')
            }
        })

        cy.visit('https://slottyway.com/en#cashbox-withdraw')
  
        cy.wait(2000)
  
        cy.get('.popup')
        .invoke('text').should('not.include', 't.payment')
        //Оп, якщо це бачиш в консолі, то знайдений ключ :)
        cy.get('.popup')
        .invoke('text').should('not.include', 't.withdraw')
        //Оп, якщо це бачиш в консолі, то знайдений ключ :)
  
        let withdrawFormsIds = [];

        cy.get('.payment__gallery')
        .then((body) => {
            if(body.find('form').length > 0) {
              cy.get('div.payment__item')  
              .find('form')              
              .each((form) => {           
                const formId = form.attr('id');  
                withdrawFormsIds.push(formId);            
              })
              .then(() => {
                cy.log(withdrawFormsIds.length);  
              
                if (withdrawFormsIds.length > 0) {
        
                  for(let i = 0; i < withdrawFormsIds.length; i++) {
                    cy.get(`[data-key="${i}"] > .pay_image`)
                    .click()               
                    cy.get(`#${withdrawFormsIds[i]}`).invoke('text').should('not.include', 't.payment')
                    //Оп, якщо це бачиш в консолі, то знайдений ключ :)
                    cy.get(`#${withdrawFormsIds[i]}`).invoke('text').should('not.include', 't.withdraw')
                    //Оп, якщо це бачиш в консолі, то знайдений ключ :)
                  }
                }       
              });
            } else {
                cy.log('НІЧОГО НЕМА')
                cy.get(`.popup`).invoke('text').should('not.include', 't.payment')
                //Оп, якщо це бачиш в консолі, то знайдений ключ :)
                cy.get(`.popup`).invoke('text').should('not.include', 't.withdraw')
                //Оп, якщо це бачиш в консолі, то знайдений ключ :)
            }
        })
  
    })
  }
})

describe('Spinamba', () => { 
  beforeEach(() => {
    cy.visit('https://spinamba.com/en')
  })

  for(let i = 0; i < cur.SpinambaCurrinces.length; i++) {
    it(cur.SpinambaCurrinces[i],  () => {
      cy.get('.row > .login > :nth-child(2) > .button').click()
      cy.get('#form-signin-email > .group-name-login > .control-label').type(cur.SpinambaEmails[i])
      cy.get('#form-signin-email > .group-name-password > .control-label').type(cur.SpinambaPasswords[i])
      cy.get('#form-signin-email > .submit_button > .button').click()
  
      cy.wait(5000)
      cy.get('.icon-close').click()
      cy.visit('https://spinamba.com/en#cashbox-deposit')
  
      cy.get('.popup')
        .invoke('text').should('not.include', 't.payment')
      //Оп, якщо це бачиш в консолі, то знайдений ключ :)
  
      let depositFormsIds = [];


        cy.get('.payment__gallery')
        .then((body) => {
            if(body.find('form').length > 0) {
              cy.log('Кіно буде')
              cy.get('.item')  
              .find('form')              
              .each((form) => {           
                const formId = form.attr('id');  
                depositFormsIds.push(formId);            
              })
              .then(() => {
                cy.log(depositFormsIds.length);  
              
                if (depositFormsIds.length > 0) {
        
                  for(let i = 0; i < depositFormsIds.length; i++) {
                    cy.get(`[data-key="${i}"] > .pay_image `)
                    .click()       
                    cy.get(`#${depositFormsIds[i]}`).invoke('text').should('not.include', 't.payment')              
                   //Оп, якщо це бачиш в консолі, то знайдений ключ :)
                   
          
                  }
                        
                } else {
                  cy.log('sho')
                }
              
              })  
            } else {
                cy.log('НІЧОГО НЕМА')
                cy.get(`.popup`).invoke('text').should('not.include', 't.payment')
            }
        })

        cy.visit('https://spinamba.com/en#cashbox-withdraw')
  
        cy.wait(4000)
  
        cy.get('.popup')
        .invoke('text').should('not.include', 't.payment')
  
        let withdrawFormsIds = [];

        cy.get('.payment__gallery')
        .then((body) => {
            if(body.find('form').length > 0) {
              cy.get('div.payment__item')  
              .find('form')              
              .each((form) => {           
                const formId = form.attr('id');  
                withdrawFormsIds.push(formId);            
              })
              .then(() => {
                cy.log(withdrawFormsIds.length);  
              
                if (withdrawFormsIds.length > 0) {
        
                  for(let i = 0; i < withdrawFormsIds.length; i++) {
                    cy.get(`[data-key="${i}"] > .pay_image`)
                    .click()               
                    cy.get(`#${withdrawFormsIds[i]}`).invoke('text').should('not.include', 't.payment')
                    //Оп, якщо це бачиш в консолі, то знайдений ключ :)
                    cy.get(`#${withdrawFormsIds[i]}`).invoke('text').should('not.include', 't.withdraw')
                    //Оп, якщо це бачиш в консолі, то знайдений ключ :)
                  }
                }       
              });
            } else {
                cy.log('НІЧОГО НЕМА')
                cy.get(`.popup`).invoke('text').should('not.include', 't.payment')
                //Оп, якщо це бачиш в консолі, то знайдений ключ :)
                cy.get(`.popup`).invoke('text').should('not.include', 't.withdraw')
                //Оп, якщо це бачиш в консолі, то знайдений ключ :)
            }
        })
  
    })
  }
})

describe('SpinBounty', () => {
  beforeEach(() => {
    cy.visit('https://spinbounty.com/en')
  })

  for(let i = 0; i < cur.SpinBountyCurrinces.length; i++) {
    it(cur.SpinBountyCurrinces[i],  () => {
      cy.get('.actions > .primary').click()
      cy.get('input[type="email"]').type(cur.SpinBountyEmails[i])
      cy.get('input[type="password"]').first().type(cur.SpinBountyPasswords[i])
      cy.get('#signinform > .submit').click()
  
      cy.wait(5000)
      cy.visit('https://spinbounty.com/en#cashbox-deposit')
  
      cy.get('.content')
        .invoke('text').should('not.include', 't.payment')
      //Оп, якщо це бачиш в консолі, то знайдений ключ :)
  
      let depositFormsIds = [];


        cy.get('.payments_gallery_wrap')
        .then((body) => {
            if(body.find('form').length > 0) {
              cy.log('Кіно буде')
              cy.get('.item')  
              .find('form')              
              .each((form) => {           
                const formId = form.attr('id');  
                depositFormsIds.push(formId);            
              })
              .then(() => {
                cy.log(depositFormsIds.length);  
              
                if (depositFormsIds.length > 0) {
        
                  for(let i = 0; i < depositFormsIds.length; i++) {
                    cy.get(`[data-key="${i}"] > .payment_item  `)
                    .click()       
                    cy.get(`#${depositFormsIds[i]}`).invoke('text').should('not.include', 't.payment')              
                   //Оп, якщо це бачиш в консолі, то знайдений ключ :)

                   cy.get(`[class="action left close toggle_btn"]`).first().click({force: true})
          
                  }
                        
                } else {
                  cy.log('sho')
                }
              
              })  
            } else {
                cy.log('НІЧОГО НЕМА')
                cy.get(`.content`).invoke('text').should('not.include', 't.payment')
            }
        })

        cy.visit('https://spinbounty.com/en#cashbox-withdraw')
  
        cy.wait(2000)
  
        cy.get('.content')
        .invoke('text').should('not.include', 't.payment')
  
        let withdrawFormsIds = [];

        cy.get('.payments_gallery_wrap')
        .then((body) => {
            if(body.find('form').length > 0) {
              cy.get('div.item')  
              .find('form')              
              .each((form) => {           
                const formId = form.attr('id');  
                withdrawFormsIds.push(formId);            
              })
              .then(() => {
                cy.log(withdrawFormsIds.length);  
              
                if (withdrawFormsIds.length > 0) {
        
                  for(let i = 0; i < withdrawFormsIds.length; i++) {
                    
                    cy.get(`[data-key="${i}"] > .payment_item`)
                    .click()               
                    cy.get(`#${withdrawFormsIds[i]}`).invoke('text').should('not.include', 't.payment')
                    //Оп, якщо це бачиш в консолі, то знайдений ключ :)
                    cy.get(`#${withdrawFormsIds[i]}`).invoke('text').should('not.include', 't.withdraw')
                    //Оп, якщо це бачиш в консолі, то знайдений ключ :)

                    cy.get(`[class="action left close toggle_btn"]`).first().click({force: true})
                  }
                }       
              });
            } else {
                cy.log('НІЧОГО НЕМА')
                cy.get(`.content`).invoke('text').should('not.include', 't.payment')
                //Оп, якщо це бачиш в консолі, то знайдений ключ :)
                cy.get(`.content`).invoke('text').should('not.include', 't.withdraw')
                //Оп, якщо це бачиш в консолі, то знайдений ключ :)
            }
        })
  
    })
  }
})

describe('Viks', () => {

  beforeEach(() => {
    cy.visit('https://viks.com/en/games')
  })

  for(let i = 0; i < cur.ViksCurrinces.length; i++) {
    it(cur.ViksCurrinces[i],  () => {
      cy.get('.extend > .button').click()
      cy.get('[data-tab="email"] > .label').click()
      cy.get('input[type="email"]').type(cur.ViksEmails[i])
      cy.get('input[type="password"]').first().type(cur.ViksPasswords[i])
      cy.get('#signinform_email > .form > :nth-child(4) > .button').click()
  
      cy.wait(5000)
      cy.visit('https://viks.com/en/games#cashbox-deposit')
      cy.wait(5000)
      cy.get('.popup_content')
        .invoke('text').should('not.include', 't.payment')
      //Оп, якщо це бачиш в консолі, то знайдений ключ :)
  
      let depositFormsIds = [];


        cy.get('.payments_gallery')
        .then((body) => {
            if(body.find('form').length > 0) {
              cy.log('Кіно буде')
              cy.get('.item')  
              .find('form')              
              .each((form) => {           
                const formId = form.attr('id');  
                depositFormsIds.push(formId);            
              })
              .then(() => {
                cy.log(depositFormsIds.length);  
              
                if (depositFormsIds.length > 0) {
        
                  for(let i = 0; i < depositFormsIds.length; i++) {
                    cy.get(`:nth-child(${i + 1}) > .payment_item `)
                    .click()       
                    cy.get(`#${depositFormsIds[i]}`).invoke('text').should('not.include', 't.payment')    
                    //Оп, якщо це бачиш в консолі, то знайдений ключ :)          
                    cy.get(`[data-trigger="cashbox.close"]`).first().click({force: true})
                   
          
                  }
                        
                } else {
                  cy.log('sho')
                }
              
              })  
            } else {
                cy.log('НІЧОГО НЕМА')
                cy.get(`.popup_content`).invoke('text').should('not.include', 't.payment')
            }
        })

        cy.visit('https://viks.com/en/games#cashbox-withdraw')
  
        cy.wait(2000)
  
        cy.get('.popup_content')
        .invoke('text').should('not.include', 't.payment')
        //Оп, якщо це бачиш в консолі, то знайдений ключ :)
  
        let withdrawFormsIds = [];

        cy.get('.payments_gallery')
        .then((body) => {
            if(body.find('form').length > 0) {
              cy.get('.payments_gallery')  
              .find('.payment_item')              
              .each((form) => {           
                const formId = form.attr('id');  
                withdrawFormsIds.push(formId);            
              })
              .then(() => {
                cy.log(withdrawFormsIds.length);  
              
                if (withdrawFormsIds.length > 0) {
        
                  for(let i = 0; i < withdrawFormsIds.length; i++) {
                    cy.get(`.payments_gallery > :nth-child(${i + 1}) > .payment_item `).first()
                    .click({force: true})       
                    cy.get(`[class="popup_card"]`).invoke('text').should('not.include', 't.payment')    
                    //Оп, якщо це бачиш в консолі, то знайдений ключ :)          
                    cy.get(`[class="popup_card"]`).invoke('text').should('not.include', 't.withdraw')    
                    //Оп, якщо це бачиш в консолі, то знайдений ключ :)          
                    cy.get(`[data-trigger="cashbox.close"]`).first().click({force: true})
                   
                  }
                }       
              });
            } else {
                cy.log('НІЧОГО НЕМА')
                cy.get(`.popup_content`).invoke('text').should('not.include', 't.payment')
                //Оп, якщо це бачиш в консолі, то знайдений ключ :)
                cy.get(`.popup_content`).invoke('text').should('not.include', 't.withdraw')
                //Оп, якщо це бачиш в консолі, то знайдений ключ :)
            }
        })
  
    })
  }

}) 

describe('SuperCat', () => {
  beforeEach(() => {
    cy.visit('https://supercatcasino.com/en')
  })


  for(let i = 0; i < cur.SuperCatCurrinces.length; i++) {
    it(cur.SuperCatCurrinces[i],  () => {
      cy.get('.guest-header > .button-outlined').click()
      cy.get('input[type="email"]').type(cur.SuperCatEmails[i])
      cy.get('input[type="password"]').first().type(cur.SuperCatPasswords[i])
      cy.get('.sign-in-form > .button').click()
  
      cy.wait(5000)
      cy.visit('https://supercatcasino.com/en/player/cashbox/deposit')
      cy.wait(10000)
      cy.get('.cashbox-content')
        .invoke('text').should('not.include', 't.payment')
        //Оп, якщо це бачиш в консолі, то знайдений ключ :)
  
  
        let depositFormsIds = [];


        cy.get('.cashbox-content')
        .then((body) => {
            if(body.find('.cash-item').length > 0) {
              cy.log('Кіно буде')
              cy.get('.cash-item')  
              .find('.cash-item__logo')              
              .each((form) => {           
                const formId = form.attr('alt');  
                depositFormsIds.push(formId);            
              })
              .then(() => {
                cy.log(depositFormsIds.length);  
              
                if (depositFormsIds.length > 0) {
        
                  for(let i = 0; i < depositFormsIds.length; i++) {

                    cy.log(depositFormsIds[i])


                    //Два костиля, оскільки деякі платіжні методи пишуться якось унікально, постараюсь виправити
                    if(depositFormsIds[i] == `bank transfer token`) {
                      depositFormsIds[i] = 'bank transfer token';

                      cy.get(`#cash-item-${depositFormsIds[i].replace(/\s/g, '\\\ ')} > .cash-item`) // Add the necessary backslashes for spaces
                      .click();
                      cy.get('.player-modal__content').invoke('text').should('not.include', 't.payment') 

                    } else if(depositFormsIds[i] == `bank transfer voucher`) {
                      depositFormsIds[i] = 'bank transfer voucher';

                      cy.get(`#cash-item-${depositFormsIds[i].replace(/\s/g, '\\\ ')} > .cash-item`) // Add the necessary backslashes for spaces
                      .click();
                      cy.get('.player-modal__content').invoke('text').should('not.include', 't.payment') 

                    }
                      else{

                      cy.get(`#cash-item-${depositFormsIds[i]} > .cash-item`)
                      .click()       
                      cy.get('.player-modal__content').invoke('text').should('not.include', 't.payment') 
                      //Оп, якщо це бачиш в консолі, то знайдений ключ :)       
                    }

                       
     
          
                  }
                        
                } else {
                  cy.log('sho')
                }
              
              })  
            } else {
                cy.log('НІЧОГО НЕМА')
                cy.get(`.cashbox-content`).invoke('text').should('not.include', 't.payment')
                //Оп, якщо це бачиш в консолі, то знайдений ключ :)
            }
        })

        cy.visit('https://supercatcasino.com/en/player/cashbox/withdraw')
  
        cy.wait(7000)
  
        cy.get('.cashbox-content')
        .invoke('text').should('not.include', 't.payment')
        //Оп, якщо це бачиш в консолі, то знайдений ключ :)
  
        let withdrawFormsIds = [];

        cy.get('.cashbox-content')
        .then((body) => {
            if(body.find('.cash-item').length > 0) {
              cy.get('.cash-item')  
              .find('.cash-item__logo')              
              .each((form) => {           
                const formId = form.attr('alt');  
                withdrawFormsIds.push(formId);            
              })
              .then(() => {
                cy.log(withdrawFormsIds.length);  
              
                if (withdrawFormsIds.length > 0) {
        
                  for(let i = 0; i < withdrawFormsIds.length; i++) {
                    cy.get(`#cash-item-${withdrawFormsIds[i]} > .cash-item`)
                      .click()       
                      cy.get('.player-modal__content').invoke('text').should('not.include', 't.payment') 
                      //Оп, якщо це бачиш в консолі, то знайдений ключ :)
                      cy.get('.player-modal__content').invoke('text').should('not.include', 't.withdraw') 
                      //Оп, якщо це бачиш в консолі, то знайдений ключ :)
                  }
                  
              
                }
              
              });
            } else {
                cy.log('НІЧОГО НЕМА')
                cy.get(`.cashbox-content`).invoke('text').should('not.include', 't.payment')
                //Оп, якщо це бачиш в консолі, то знайдений ключ :)
                cy.get(`.cashbox-content`).invoke('text').should('not.include', 't.withdraw')
                //Оп, якщо це бачиш в консолі, то знайдений ключ :)
            }
        })
  
    })
  }
})