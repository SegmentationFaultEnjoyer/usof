const reqTypes = Object.freeze({
    LOG_IN: 'login-data',
    REGISTER: 'register-data',
    REGISTER_ADMIN: 'register-admin-data',
    REFRESH_TOKEN: 'refresh-token',
    RESET_PASSWORD: 'password-reset',
    NEW_PASSWORD: 'password',
    CREATE_POST: 'create-post',
    CREATE_COMMENT: 'create-comment',
    CREATE_CATEGORY: 'create-category',
    CREATE_LIKE: 'create-like',
    UPDATE_POST: 'update-post',
    UPDATE_USER: 'update-user',
    UPDATE_COMMENT: 'update-comment',
    UPDATE_CATEGORY: 'update-category'
})

module.exports = reqTypes;