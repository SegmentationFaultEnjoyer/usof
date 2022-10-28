const DataBase = require('../db');

class PostLikesQ extends DataBase {
    constructor() {
        super('post_likes');
        this.valideKeys = new Set(['is_dislike', 'publish_date']);
    }

    Insert({ author, publish_date, post_id, liked_on, is_dislike }) {
        this.qInsertStmt.text += ` (author, publish_date, post_id, liked_on, is_dislike) VALUES(${new Array(5).fill('').map((_, i) => `$${i + 1}`).join(', ')})`;
        this.qInsertStmt.values = [author, publish_date, post_id, liked_on, is_dislike];
        this.currentStmt = {...this.qInsertStmt};

        return this;
    }

    WhereID(id) {
        this.currentStmt.text = this.currentStmt.text + ' WHERE id=$1';
        this.currentStmt.values = [id];

        return this;
    }

    WhereAuthor(author) {
        let clause;

        if(this.currentStmt.text.includes('WHERE')) {
            clause = ' and author=$2';
            this.currentStmt.values.push(author);
        }
            
        else {
            clause = ' WHERE author=$1';
            this.currentStmt.values = [author];
        }

        this.currentStmt.text = this.currentStmt.text + clause;

        return this;
    }

    WherePostID(post_id) {
        let clause;

        if(this.currentStmt.text.includes('WHERE')) {
            clause = ' and post_id=$2';
            this.currentStmt.values.push(post_id);
        }
            
        else {
            clause = ' WHERE post_id=$1';
            this.currentStmt.values = [post_id];
        }
           
        this.currentStmt.text = this.currentStmt.text + clause;
        
        return this;
    }

    WhereDislike() {
        this.currentStmt.text = this.currentStmt.text + ' WHERE is_dislike=$1';
        this.currentStmt.values = [true];

        return this;
    }

    WhereLike() {
        this.currentStmt.text = this.currentStmt.text + ' WHERE is_dislike=$1';
        this.currentStmt.values = [false];

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
    
}

module.exports = PostLikesQ;