const DataBase = require('../db')

class MediaQ extends DataBase {
    constructor() {
        super('media');
        this.valideKeys = new Set(['path']);
    }

    WhereID(id) {
        this.currentStmt.text = this.currentStmt.text + ' WHERE id=$1';
        this.currentStmt.values = [id];

        return this;
    }

    WherePostID(post_id) {
        this.currentStmt.text = this.currentStmt.text + ' WHERE post_id=$1';
        this.currentStmt.values = [post_id];

        return this;
    }

    Insert({ post_id, path }) {
        this.qInsertStmt.text += ` (post_id, path) VALUES($1, $2)`;
        this.qInsertStmt.values = [post_id, path];
        this.currentStmt = {...this.qInsertStmt};

        return this;
    }
}

module.exports = MediaQ;