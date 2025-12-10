const State = {
    // 1. Учёт ID
    obsLastId: 0,
    hypoLastId: 0,
    logLastId: 0,

    // 2. Хранилище данных
    observations: new Map(), // для наблюдений

    hypotheses: new Map(), // для гипотез

    practiceLog: new Map(), // для записей

    // 3. Методы
    obsIdCreator() {
        this.obsLastId += 1;
        return this.obsLastId;
    },

    hypoIdCreator() {
        this.hypoLastId += 1;
        return this.hypoLastId;
    },

    logIdCreator() {
        this.logLastId += 1;
        return this.logLastId;
    },

    addObservation(observationData) {
        const newObsId = this.obsIdCreator();
        this.observations.set(newObsId, observationData);
        return newObsId;
    },

    deleteObservation(id) {
        this.observations.delete(id);

        const hyposToDelete = [];
        this.hypotheses.forEach((hypo, key) => {
            if (hypo.linkedToObsID === id) hyposToDelete.push(key);
        });
        hyposToDelete.forEach((key) => this.hypotheses.delete(key));
    },

    _cleanHypoData(hypoData) {
        const newHypoData = {
            linkedToObsID: hypoData.linkedToObsID,
            explanation: hypoData.explanation,
            solution: hypoData.solution,
            successCriterion: hypoData.successCriterion,
            environmentSetup: hypoData.environmentSetup,
            heuristic: hypoData.heuristic,
            conditions: {
                minTestDuration: hypoData.minTestDuration,
                consecutiveFailsThreshold: hypoData.consecutiveFailsThreshold,
                weeklySkipsThreshold: hypoData.weeklySkipsThreshold,
                minSuccessRate: hypoData.minSuccessRate,
            },
        };
        return newHypoData;
    },

    addHypothesis(crudeHypoData) {
        const hypoData = this._cleanHypoData(crudeHypoData);
        const newHypoId = this.hypoIdCreator();
        this.hypotheses.set(newHypoId, hypoData);
        return newHypoId;
    },

    deleteHypothesis(id) {
        this.hypotheses.delete(id);
    },

    _cleanLogData(logData) {
        logData.linkedToHypoID = +logData.linkedToHypoID;
        console.log(logData.attemptMade);
        logData.attemptMade = !!logData.attemptMade;
        console.log(logData.attemptMade);
        if (!logData.attemptMade) logData.outcome = null;
        return logData;
    },

    addLogEntry(crudeLogData) {
        const logData = this._cleanLogData(crudeLogData);
        const newLogId = this.logIdCreator();
        this.practiceLog.set(newLogId, logData);
        return newLogId;
    },

    deleteLogEntry(logId) {
        this.practiceLog.delete(logId);
    },

    analyzeHypothesis(id) {
        const relevantLogs = [];
        this.practiceLog.forEach((log) => {
            if (log.linkedToHypoID === id) relevantLogs.push(log);
        });
    },
};

export { State };
