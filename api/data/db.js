require("dotenv").config();

const client = require('./connectionClient');

const DEFAULT_LIMIT_VALUE = 3;
const DEFAULT_PAGE_VALUE = 1;

//TODO all Q's must be refactored to new Q().new()... 

class DataBase {
    constructor(table) {
        this.table = table;
        this.client = client;
        this.selectStmt = {
            text: `SELECT * FROM ${this.table}`
        }
        this.insertStmt = {
            text: `INSERT INTO ${this.table}`
        }
        this.deleteStmt = {
            text: `DELETE FROM ${this.table}`
        }
        this.updateStmt = {
            text: `UPDATE ${this.table}`
        }
        this.New();
    }

    New() {
        this.qSelectStmt = {...this.selectStmt};
        this.qInsertStmt = {...this.insertStmt};
        this.qDeleteStmt = {...this.deleteStmt};
        this.qUpdateStmt = {...this.updateStmt};
        this.pgdbOffsetParams = {};

        return this;
    }

    Count(customStatement = null) { 
        this.currentStmt = {
            text: `SELECT COUNT(id) FROM ${this.table}`,
            values: []
        };

        if(customStatement !== null) {
            this.currentStmt.text += ` ${customStatement}`;
        }
        
        return this;
    }

    Paginate(limit, page) {
        if(limit === undefined) limit = DEFAULT_LIMIT_VALUE;
        if(page === undefined) page = DEFAULT_PAGE_VALUE;

        limit = Number(limit);
        page = Number(page);

        const offset = (page - 1) * limit;
        
        if(this.currentStmt.values) {
            this.currentStmt.text = this.currentStmt.text + ` LIMIT $${this.currentStmt.values.length + 1}`;
            this.currentStmt.values.push(limit);
        }

        else {
            this.currentStmt.text = this.currentStmt.text + ` LIMIT $1`;
            this.currentStmt.values = [limit];
        }

        this.currentStmt.text = this.currentStmt.text + ` OFFSET $${this.currentStmt.values.length + 1}`;
        this.currentStmt.values.push(offset);

        this.pgdbOffsetParams = {
            limit,
            offset, 
            page
        }

        return this;
    }

    async Transaction(callback) {
        try {
            await this.client.query('BEGIN');
            await callback();
            await this.client.query('COMMIT');
        } catch (error) {
            await this.client.query('ROLLBACK');
            throw error;
        }
    }

    Returning() {
        this.currentStmt.text = this.currentStmt.text + ' RETURNING *';
        
        return this;
    }

    Get() {
        this.currentStmt = {...this.qSelectStmt};

        return this;
    }

    Delete() {
        this.currentStmt = {...this.qDeleteStmt};

        return this;
    }

    Update(columns) {
        this.qUpdateStmt.text += ' SET';

        for (let [key, value] of Object.entries(columns)) {
            if(!this.ValidateColumn(key)) {
                throw new Error(`Key is not valid, no such column. Valid keys: ${Array.from(this.valideKeys.values()).join(', ')}`);
            }

            if (typeof(value) === 'string')
                this.qUpdateStmt.text += ` ${key}='${value}',`;
            else if(value instanceof Array)
                this.qUpdateStmt.text += ` ${key}='{${value}}',`;
            else
                this.qUpdateStmt.text += ` ${key}=${value},`;
        }

        this.qUpdateStmt.text = this.qUpdateStmt.text.slice(0, -1);
        this.currentStmt = {...this.qUpdateStmt};

        return this;
    }
    
    ValidateColumn(key) {
        return this.valideKeys.has(key);
    }

    async Execute(multiple = false) {
        this.currentStmt.text += ';'

        // console.log(this.currentStmt.text, this.currentStmt.values);
        
        try {
            let res = await this.client.query(this.currentStmt)

            if(res.rowCount === 0) throw new Error('No data found or affected');
            
            //if query returned some values 
            if(res.rows.length > 0) 
                return multiple ? res.rows : res.rows[0];
            
            return { error: false };
        } catch (error) {
            // console.log(`DB error ${error.message}`);
            return {
                error: true,
                error_message: error.message
            };
        }
    }

    async close() {
        await this.client.end();
    }
}


module.exports = DataBase;