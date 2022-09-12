
exports.LoginResponse = function({ access_token, refresh_token }) {
    return {
        data: {
            type: "auth-tokens",
            attributes: {
                access: access_token,
                refresh: refresh_token
            }
        }
    }
}