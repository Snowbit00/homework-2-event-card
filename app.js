const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

const showProgramButton = document.querySelector('#show-program');
const programBlock = document.querySelector('#program');
const dataError = document.querySelector('#data-error');
const serviceForm = document.querySelector('#service-form');
const guideCheckbox = document.querySelector('#guide');
const audioCheckbox = document.querySelector('#audio');
const catalogCheckbox = document.querySelector('#catalog');
const choiceError = document.querySelector('#choice-error');
const resultBlock = document.querySelector('#result');
const reportJsonBlock = document.querySelector('#report-json');

let data = null;

function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  const selected = {
    guide: guideChecked,
    audio: audioChecked,
    catalog: catalogChecked,
  };

  const items = services
    .filter((service) => selected[service.id] === true)
    .map((service) => {
      const { title, price } = service;

      return {
        title: title.trim(),
        price,
      };
    });

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return {
    count: items.length,
    total,
    items,
  };
}

function showProgram() {
  programBlock.innerHTML = data.event.meeting;
  programBlock.hidden = false;
}

function hideReport() {
  resultBlock.hidden = true;
  reportJsonBlock.hidden = true;
}

function showChoiceError() {
  choiceError.textContent = 'Выберите хотя бы одну услугу.';
  choiceError.hidden = false;
  hideReport();
}

function showReport(report) {
  let resultHtml = `Выбрано услуг: ${report.count}<br>Итого: ${report.total} руб.`;

  report.items.forEach((item) => {
    resultHtml += `<br>${item.title}`;
  });

  const reportString = JSON.stringify(report);

  try {
    JSON.parse(reportString);
  } catch (error) {
    choiceError.textContent = 'Ошибка формирования отчёта.';
    choiceError.hidden = false;
    hideReport();
    return;
  }

  choiceError.hidden = true;
  resultBlock.innerHTML = resultHtml;
  reportJsonBlock.textContent = reportString;
  resultBlock.hidden = false;
  reportJsonBlock.hidden = false;
}

function handleServiceSubmit(event) {
  event.preventDefault();

  const report = buildReport(
    data.services,
    guideCheckbox.checked,
    audioCheckbox.checked,
    catalogCheckbox.checked,
  );

  if (report.count === 0) {
    showChoiceError();
    return;
  }

  showReport(report);
}

try {
  data = JSON.parse(sourceJson);
} catch (error) {
  dataError.textContent = 'Ошибка данных.';
  dataError.hidden = false;
}

if (data !== null) {
  serviceForm.hidden = false;
  showProgramButton.addEventListener('click', showProgram);
  serviceForm.addEventListener('submit', handleServiceSubmit);
}
