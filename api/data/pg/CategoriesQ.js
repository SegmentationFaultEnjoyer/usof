const DataBase = require('../db');

class CategoriesQ extends DataBase {
    constructor() {
        super('categories');
        this.valideKeys = new Set(['title', 'description']);
    }

    Insert({ title, description }) {
        this.qInsertStmt.text += ` (title, description) VALUES($1, $2)`;
        this.qInsertStmt.values = [title, description];
        this.currentStmt = {...this.qInsertStmt};

        return this;
    }

    WhereID(id) {
        this.currentStmt.text = this.currentStmt.text + ' WHERE id=$1';
        this.currentStmt.values = [id];

        return this;
    }

    WhereTitle(title) {
        this.currentStmt.text = this.currentStmt.text + ' WHERE title=$1';
        this.currentStmt.values = [title];

        return this;
    }

    OrderByID(orderType = "DESC") {
        this.currentStmt.text = this.currentStmt.text + ` ORDER BY id ${orderType}`;
        
        return this;
    }

    OrderByTitle(orderType = "DESC") {
        this.currentStmt.text = this.currentStmt.text + ` ORDER BY title ${orderType}`;
        
        return this;
    }
}

module.exports = CategoriesQ;