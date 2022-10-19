const DataBase = require('../db')

class RefreshQ extends DataBase {
    constructor() {
        super('refresh_tokens');
        this.valideKeys = new Set(['token', 'due_date']);
    }

    WhereOwnerID(owner_id) {
        this.currentStmt.text = this.currentStmt.text + ' WHERE owner_id=$1';
        this.currentStmt.values = [owner_id];

        return this;
    }

    Insert({ token, owner_id, due_date }) {
        this.qInsertStmt.text += ` (token, owner_id, due_date) VALUES($1, $2, $3)`;
        this.qInsertStmt.values = [token, owner_id , due_date];
        this.currentStmt = {...this.qInsertStmt};

        return this;
    }
}

module.exports = RefreshQ;