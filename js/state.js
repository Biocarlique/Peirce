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

    addHypothesis(hypothesisData) {
        const newHypoId = this.hypoIdCreator();
        this.hypotheses.set(newHypoId, hypothesisData);
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

        let consecutiveFailures = 0;
        const maxFailures = 2;
        for (let i = 0; i < relevantLogs.length; i++) {
            const log = relevantLogs[i];
            if (!log.attemptMade) continue;
            // if (log.outcome)
        }
    },
};

export { State };
