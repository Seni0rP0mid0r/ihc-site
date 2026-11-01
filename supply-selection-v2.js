                                                       
                                                    
function initProductionSupply() {
 const root = document.querySelector             ('[data-supply-builder]');
 if (!root || root.dataset.ready) return;
 root.dataset.ready = 'true';
 let category                 = 'general';
 const drafts = {boards:{text:'',quantity:'',start:''               },modules:{text:'',quantity:'',start:''               },general:{text:'',quantity:'',start:'help'               }};
 const description = root.querySelector                     ('#supply-description') ;
 const quantity = root.querySelector                  ('#supply-quantity') ;
 const radios = Array.from(root.querySelectorAll                  ('[name="supply-start"]'));
 const buttons = Array.from(root.querySelectorAll                   ('[data-supply-category]'));
 const copy = {
  general:{title:'',exact:'Есть описание',quantity:'Например, 500 шт.',
   exactGuide:['Расскажите, что нужно поставить','Название товара или материала','Известные характеристики и требования','Описание и требования','Что нужно найти или привезти?'],
   analogGuide:['Поможем подобрать замену','Что используете сейчас','Какие характеристики нужно сохранить','Что нужно заменить','Текущий товар или материал и требования к замене…'],
   helpGuide:['Начнём с вашей задачи','Назначение изделия или компонента','Количество и требования к приёмке','Опишите задачу','Что нужно поставить или изготовить?']},
  boards:{title:'Электронные компоненты',exact:'Есть артикул',quantity:'Например, 500 шт.',
   exactGuide:['Укажите, что нужно найти','Артикул или обозначение на чертеже','Производитель и важные характеристики','Артикул и требования','Название, артикул, характеристики…'],
   analogGuide:['Поможем подобрать замену','Что используете сейчас и что нужно сохранить','Размеры, характеристики и ограничения по совместимости','Что нужно заменить','Текущий компонент и требования к замене…'],
   helpGuide:['Начнём с вашей задачи','Для какого оборудования нужен компонент','Что он должен делать и какие есть ограничения','Опишите задачу','Для чего нужен компонент? Что уже известно?']},
  modules:{title:'Готовые модули',exact:'Есть артикул',quantity:'Например, 500 шт.',
   exactGuide:['Укажите нужный модуль','Название, артикул или спецификация','Интерфейсы, питание и требования к совместимости','Модуль и требования','Название, артикул, характеристики…'],
   analogGuide:['Поможем подобрать замену','Какой модуль используете сейчас','Какие характеристики и интерфейсы нужно сохранить','Что нужно заменить','Текущий модуль и требования к замене…'],
   helpGuide:['Начнём с вашей задачи','Назначение изделия или компонента','Количество и требования к приёмке','Опишите задачу','Что нужно поставить или изготовить?']},
 };
 const update = () => {
  const data=copy[category], state=drafts[category];
  const guide=state.start==='exact'?data.exactGuide:state.start==='analog'?data.analogGuide:data.helpGuide;
  buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.supplyCategory===category)));
  radios.forEach(radio=>radio.checked=radio.value===state.start);
  root.querySelector('[data-supply-exact]') .textContent=data.exact;
  root.querySelector('[data-supply-prompt]') .textContent=guide[0];
  root.querySelector('[data-supply-input-label]') .textContent=guide[3];
  root.querySelector('[data-supply-checklist]') .replaceChildren(...guide.slice(1,3).map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
  description.placeholder=guide[4];quantity.placeholder=data.quantity;
  description.value=state.text;quantity.value=state.quantity;
 };
 buttons.forEach(button=>button.addEventListener('click',()=>{
  category=category===button.dataset.supplyCategory?'general':button.dataset.supplyCategory                  ;update();
  root.querySelector('[data-supply-status]') .textContent=category==='general'?'Выбор снят. Можно описать задачу без направления.':'Выбрано: '+copy[category].title;
 }));
 radios.forEach(radio=>radio.addEventListener('change',()=>{drafts[category].start=radio.value               ;update();}));
 description.addEventListener('input',()=>drafts[category].text=description.value);
 quantity.addEventListener('input',()=>drafts[category].quantity=quantity.value);
 root.querySelector('[data-supply-add]') .addEventListener('click',()=>{
  const state=drafts[category];
  if(category==='general'&&!state.text.trim()&&!state.quantity.trim()&&!state.start)return;
  const start=!state.start?'':state.start==='exact'?copy[category].exact:state.start==='analog'?'Нужен аналог':'Нужна помощь с подбором';
  document.dispatchEvent(new CustomEvent('ihc:supply-add',{detail:{category:copy[category].title,start,description:state.text.trim(),quantity:state.quantity.trim()}}));
 });
 update();
}

const root=document.querySelector('[data-supply-builder-pending]');if(root){root.removeAttribute('data-supply-builder-pending');root.setAttribute('data-supply-builder','');initProductionSupply();}