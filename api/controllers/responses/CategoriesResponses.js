exports.CategoryResponse = function ({ title, description, id }) {
    return {
        data: {
            id,
            type: 'category',
            attributes: {
                title,
                description
            }
        }
    }
}

exports.CategoriesListResponse = function (list, links = {}) {
    return {
        data: list.map(category => ({
            id: category.id,
            type: 'category',
            attributes: {
                title: category.title,
                description: category.description
            }
        })),
        links
    }
}