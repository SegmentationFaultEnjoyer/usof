
exports.UserResponse = function({ id, role, rating, email, name, profile_picture }, include = null) {
    let response = {
        data: {
            id,
            type: 'user',
            attributes: {
                role,
                rating,
                email,
                name,
                profile_picture
            }
        }
    }

    if(include !== null)
        response.include = include

    return response;
}

exports.UsersListResponse = function(usersList, links = {}) {
    return {
        data: usersList.map(user => ({
            id: user.id,
            type: 'user',
            attributes: {
                role: user.role,
                rating: user.rating,
                email: user.email,
                name: user.name,
                profile_picture: user.profile_picture
            }
        })),
        links
    }
}