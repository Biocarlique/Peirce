import { State } from "./state.js";

class View {
    formObservations = document.getElementById("observations");
    observationsList = document.getElementById("observations-list");

    formHypotheses = document.getElementById("hypotheses");
    linkedObsSelect = document.getElementById("linkedToObsID");
    hypothesesList = document.getElementById("hypotheses-list");

    minTestDuration = document.getElementById("minTestDuration");
    consecutiveFailsThreshold = document.getElementById(
        "consecutiveFailsThreshold"
    );
    weeklySkipsThreshold = document.getElementById("weeklySkipsThreshold");
    minSuccessRate = document.getElementById("minSuccessRate");

    formPracticeLog = document.getElementById("practice-log");
    linkedHypoSelect = document.getElementById("linkedToHypoID");
    practiceLogBody = document.getElementById("practice-log__body");

    // УДАЛИТЬ ПОЗЖЕ
    conditions() {
        this.minTestDuration.value = 7;
        this.consecutiveFailsThreshold.value = 2;
        this.weeklySkipsThreshold.value = 2;
        this.minSuccessRate.value = 80;
    }

    // Проверить, отмечен ли чекбокс
    checkDependency() {
        const elCheckbox = this.formPracticeLog.attemptMade;
        const elOutcome = this.formPracticeLog.outcome;

        if (elCheckbox.checked === false) elOutcome.disabled = true;
        else elOutcome.disabled = false;
    }

    // Задать сегодняшнюю дату по дефолту
    setDefaultDate() {
        const today = new Date();
        const formattedDate = today.toISOString().split("T")[0];
        this.formPracticeLog.date.value = formattedDate;
    }

    // Очистить инпуты форм
    clearInputs(formElement) {
        ["input", "textarea", "select"].forEach((tag) =>
            Array.from(formElement.getElementsByTagName(tag)).forEach((el) => {
                if (el.type === "checkbox") el.checked = false;
                else el.value = "";
            })
        );
        this.setDefaultDate();
        this.checkDependency();

        this.conditions();
    }

    // Обновить отображение списка наблюдений
    updateObservationsList() {
        let html = "";

        // Перебираем все Наблюдения, создаём разметку для каждого из них и обновляем переменную html
        for (const [id, observation] of State.observations) {
            html += `
            <li class="observation-item" data-id="${id}">
                <h3>Наблюдение #${id}</h3>
                <p><strong>Ситуация:</strong> ${observation.case}</p>
                <p><strong>Триггер:</strong> ${observation.trigger}</p>
                <p><strong>Мысли:</strong> ${observation.thoughts}</p>
                <p><strong>Эмоции:</strong> ${observation.emotions}</p>
                <p><strong>Действие:</strong> ${observation.action}</p>
                <p><strong>Последствия:</strong> ${observation.consequences}</p>
                <button class="btn-delete" data-id="${id}">Delete</button>
            </li>
        `;
        }
        this.observationsList.innerHTML = html;
    }

    // Обновить отображение опций выбора связанного Наблюдения
    updateObservationOptions(dataId = null) {
        const defaultOption =
            '<option value="">--- Выберите Наблюдение ---</option>';
        let html = "";

        if (!State.observations.size) {
            this.linkedObsSelect.innerHTML = defaultOption;
            return;
        }

        // Перебираем все Наблюдения, создаём опцию для каждого из них и обновляем переменную html
        for (const [id, observation] of State.observations) {
            html += `
        <option value="${id}">${id}: ${observation.case.substring(0, 20)}${
                observation.case.length > 20 ? "..." : ""
            }</option>
        `;
        }
        this.linkedObsSelect.innerHTML = defaultOption + html;

        if (!dataId) return;
        this.linkedObsSelect.value = dataId;
    }

    // Обновить отображение списка гипотез
    updateHypothesesList() {
        let html = "";

        // Перебираем все Гипотезы, создаём разметку для каждой из них и обновляем переменную html
        for (const [id, hypothesis] of State.hypotheses) {
            const linkedObsId = +hypothesis.linkedToObsID;
            const linkedObs = State.observations.get(linkedObsId);
            if (!linkedObs) continue;

            html += `
            <li class="hypothesis-item" data-id="${id}">
                <h3>Гипотеза №${id} к Наблюдению #${linkedObsId}</h3>
                <p><strong>Ситуация из Наблюдения:</strong> ${linkedObs.case}</p>
                <p><strong>Объяснение:</strong> ${hypothesis.explanation}</p>
                <p><strong>Решение:</strong> ${hypothesis.solution}</p>
                <p><strong>Критерий успешности:</strong> ${hypothesis.successCriterion}</p>
                <p><strong>Улучшить окружение:</strong> ${hypothesis.environmentSetup}</p>
                <p><strong>Эвристика:</strong> ${hypothesis.heuristic}</p>
                <button class="btn-delete" data-id="${id}">Delete</button>
            </li>
        `;
        }
        this.hypothesesList.innerHTML = html;
    }

    // Обновить отображение опций выбора связанной Гипотезы
    updateHypothesisOptions(dataId = null) {
        const defaultOption =
            '<option value="">--- Выберите Гипотезу ---</option>';
        let html = "";

        if (!State.hypotheses.size) {
            this.linkedHypoSelect.innerHTML = defaultOption;
            return;
        }

        // Перебираем все Гипотезы, создаём опцию для каждой из них и обновляем переменную html
        for (const [id, hypo] of State.hypotheses) {
            html += `
        <option value="${id}">${id}: ${hypo.solution.substring(0, 20)}${
                hypo.solution.length > 20 ? "..." : ""
            }</option>
        `;
        }
        this.linkedHypoSelect.innerHTML = defaultOption + html;

        if (!dataId) return;
        this.linkedHypoSelect.value = dataId;
    }

    // Обновить отображение таблицы
    updatePracticeLogTable() {
        let html = "";

        // 1. Проверка на пустой лог
        if (!State.practiceLog.size) {
            this.practiceLogBody.innerHTML =
                '<tr><td id="empty-table" colspan="8">Нет записей о практике!</td></tr>';
            return;
        }

        // 2. Перебор и генерация строк
        for (const [id, logEntry] of State.practiceLog) {
            // Логика для чекбокса
            const attemptDisplay = logEntry.attemptMade ? "✅" : "❌";

            html += `
            <tr data-id="${id}">
                <td>${id}</td>
                <td>${logEntry.linkedToHypoID}</td>
                <td>${logEntry.date}</td>
                <td>${logEntry.situationDetails}</td>
                <td>${attemptDisplay}</td>
                <td>${logEntry.outcome}</td>
                <td>${logEntry.relatedNotes}</td>
                <td><button class="btn-delete-log" data-id="${id}">Delete</button></td>
            </tr>
        `;
        }

        // 3. Обновление DOM
        this.practiceLogBody.innerHTML = html;
    }
}

export default new View();
