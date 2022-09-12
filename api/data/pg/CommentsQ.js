const DataBase = require('../db');

class CommentsQ extends DataBase {
    constructor() {
        super('comments');
        this.valideKeys = new Set(['content', 'is_edited']);
    }

    WhereAuthor(author) {
        this.currentStmt.text = this.currentStmt.text + ' WHERE author=$1';
        this.currentStmt.values = [author];

        return this;
    }

    WherePostID(post_id) {
        this.currentStmt.text = this.currentStmt.text + ' WHERE post=$1';
        this.currentStmt.values = [post_id];

        return this;
    }

    WhereID(id) {
        this.currentStmt.text = this.currentStmt.text + ' WHERE id=$1';
        this.currentStmt.values = [id];

        return this;
    }

    OrderByID(orderType = "DESC") {
        this.currentStmt.text = this.currentStmt.text + ` ORDER BY id ${orderType}`;
        
        return this;
    }

    OrderByPublishDate(orderType = "DESC") {
        this.currentStmt.text = this.currentStmt.text + ` ORDER BY publish_date ${orderType}`;
        
        return this;
    }

    OrderByAuthor(orderType = "DESC") {
        this.currentStmt.text = this.currentStmt.text + ` ORDER BY author ${orderType}`;
        
        return this;
    }

    Insert({ author, publish_date, content, post_id }) {
        this.qInsertStmt.text += ` (author, publish_date, content, post) VALUES($1, $2, $3, $4)`;
        this.qInsertStmt.values = [author, publish_date, content, post_id];
        this.currentStmt = {...this.qInsertStmt};

        return this;
    }
}

module.exports = new CommentsQ();