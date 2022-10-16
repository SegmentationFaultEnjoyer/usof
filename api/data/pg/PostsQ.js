const DataBase = require('../db');

class PostsQ extends DataBase {
    constructor() {
        super('posts');
        this.valideKeys = new Set(['title', 'status', 'content', 'categories', 'is_edited']);
    }

    WhereAuthor(author) {
        this.currentStmt.text = this.currentStmt.text + ' WHERE author=$1';
        this.currentStmt.values = [author];

        return this;
    }

    WhereID(id) {
        this.currentStmt.text = this.currentStmt.text + ' WHERE id=$1';
        this.currentStmt.values = [id];

        return this;
    }

    WhereCategory(category) {
        this.currentStmt.text = this.currentStmt.text + ' WHERE categories @> ARRAY[$1]::varchar[]'
        this.currentStmt.values = [category];

        return this;
    }

    WhereStatus(status) {
        let clause;

        if(this.currentStmt.text.includes('WHERE')) { 
            clause = ' and status=$2';
            this.currentStmt.values.push(status);
        }
        else {
            clause = ' WHERE status=$1';
            this.currentStmt.values = [status];
        }

        this.currentStmt.text = this.currentStmt.text + clause;

        return this;
    }
    //day, week, month, year
    WherePublishDateGreaterThan(date) {
        switch (date) {
            case 'day':
                this.currentStmt.values = ['1 day'];
                break;
            case 'week':
                this.currentStmt.values = ['1 week'];
                break;
            case 'month':
                this.currentStmt.values = ['1 month'];
                break;
            case 'year':
                this.currentStmt.values = ['1 year'];
                break;
            default:
                throw new Error('Invalid date filter');
        }

        this.currentStmt.text = this.currentStmt.text + ` WHERE publish_date >= (NOW() - $1::interval)`;

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

    OrderByStatus(orderType = "DESC") {
        this.currentStmt.text = this.currentStmt.text + ` ORDER BY status ${orderType}`;
        
        return this;
    }

    //FUCKIN HELL 
    OrderByNumberOfLikes(orderType = "DESC") {
        if(!this.currentStmt.values || this.currentStmt.values.length < 1)
            this.currentStmt.text = 'SELECT posts.*, count(case post_likes.is_dislike when false then 1 else null end)'
            + ` - count(case post_likes.is_dislike when true then 1 else null end) as count from ${this.table}`
            + ' LEFT JOIN post_likes on posts.id = post_likes.post_id GROUP BY posts.id ORDER BY count ' + orderType;
        else
            this.currentStmt.text = 'SELECT posts.*, count(case post_likes.is_dislike when false then 1 else null end)'
            + ` - count(case post_likes.is_dislike when true then 1 else null end) as count from ${this.table}`
            + ' LEFT JOIN post_likes on posts.id = post_likes.post_id WHERE status=$1 GROUP BY posts.id ORDER BY count ' + orderType;
        return this;
    }

    LeftJoinWithLikes() {
        this.currentStmt.text = this.currentStmt.text + ` LEFT JOIN post_likes on posts.id = post_likes.post_id GROUP BY posts.id`;

        return this;
    }

    Insert({ author, title, publish_date, status, content, categories }) {
        this.qInsertStmt.text += ` (author, title, publish_date, status, content, categories) VALUES($1, $2, $3, $4, $5, $6)`;
        this.qInsertStmt.values = [author, title , publish_date, status, content, categories];
        this.currentStmt = {...this.qInsertStmt};

        return this;
    }
}

module.exports = new PostsQ();