import { State } from "./state.js";
import View from "./View.js";

const appAddObservation = function (e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(View.formObservations));
    const dataId = State.addObservation(data);

    console.log("Observations:", State.observations);

    View.clearInputs(View.formObservations);
    View.updateObservationsList();
    View.updateObservationOptions(dataId);
};

const appDeleteObservation = function (e) {
    const btnDeleteClicked = e.target.closest(".btn-delete");
    if (!btnDeleteClicked) return;

    const idToDelete = +btnDeleteClicked.dataset.id;
    State.deleteObservation(idToDelete);

    console.log("Observations:", State.observations);
    View.updateObservationsList();
    View.updateObservationOptions();
    View.updateHypothesesList();
};

const appAddHypothesis = function (e) {
    e.preventDefault();

    // 1. Собираем данные с формы
    const data = Object.fromEntries(new FormData(View.formHypotheses));
    if (data.linkedToObsID === "") return;

    // 2. Заносим данные в Map с гипотезами
    const dataId = State.addHypothesis(data);

    console.log("Hypotheses:", State.hypotheses);

    // 3. Очищаем инпуты
    View.clearInputs(View.formHypotheses);

    // 4. Обновляем отображение списка гипотез
    View.updateHypothesesList();
    View.updateHypothesisOptions(dataId);
};

const appDeleteHypothesis = function (e) {
    const btnDeleteClicked = e.target.closest(".btn-delete");
    if (!btnDeleteClicked) return;

    const idToDelete = +btnDeleteClicked.dataset.id;
    State.deleteHypothesis(idToDelete);

    console.log("Hypotheses:", State.hypotheses);

    View.updateHypothesesList();
    View.updateHypothesisOptions();
};

const appAddPracticeLog = function (e) {
    e.preventDefault();

    // 1. Собираем данные с формы
    const data = Object.fromEntries(new FormData(View.formPracticeLog));
    if (data.linkedToHypoID === "" || data.date === "") return;
    if (data.attemptMade && !data.outcome) return;

    // 2. Заносим данные в Map с Логом Практики
    State.addLogEntry(data);

    console.log("Practice Table:", State.practiceLog);

    // 3. Очищаем инпуты
    View.clearInputs(View.formPracticeLog);

    View.updatePracticeLogTable();
};

const appDeletePracticeLog = function (e) {
    // 1. Определяем нажатую кнопку в таблице
    const btnDelete = e.target.closest(".btn-delete-log");
    if (!btnDelete) return;

    // 2. Узнаём ID соответствующей записи
    const dataId = +btnDelete.dataset.id;

    // 3. Удаляем запись с этим ID
    State.deleteLogEntry(dataId);

    console.log("Practice Table:", State.practiceLog);
    // 4. Обновляем рендер таблицы
    View.updatePracticeLogTable();
};

/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////

const init = function () {
    // Добавить новое Наблюдение
    View.formObservations.addEventListener("submit", function (e) {
        appAddObservation(e);
    });

    // Удалить Наблюдение из памяти и интерфейса
    View.observationsList.addEventListener("click", function (e) {
        appDeleteObservation(e);
    });

    // Добавить новую гипотезу
    View.formHypotheses.addEventListener("submit", function (e) {
        appAddHypothesis(e);
    });

    // Удалить Гипотезу из памяти и интерфейса
    View.hypothesesList.addEventListener("click", function (e) {
        appDeleteHypothesis(e);
    });

    // Добавить новую запись в Лог Практики
    View.formPracticeLog.addEventListener("submit", function (e) {
        appAddPracticeLog(e);
    });

    // Удалить Запись из памяти и интерфейса
    View.practiceLogBody.addEventListener("click", function (e) {
        appDeletePracticeLog(e);
    });

    View.formPracticeLog.attemptMade.addEventListener(
        "change",
        View.checkDependency.bind(View)
    );

    View.updateObservationOptions();
    View.updateHypothesisOptions();
    View.updatePracticeLogTable();
    View.setDefaultDate();
    View.checkDependency();
};
init();
