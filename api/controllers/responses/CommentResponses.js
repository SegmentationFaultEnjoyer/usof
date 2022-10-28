exports.CommentLikesListResponse = function(list, links = {}) {
    return {
        data: list.map(like => ({
            id: like.id,
            attributes: {
                publish_date: like.publish_date,
                liked_on: like.liked_on,
                is_dislike: like.is_dislike
            },
            relationships: {
                author: {
                    id: like.author,
                    type: 'user'
                },
                comment: {
                    id: like.comment_id,
                    type: 'comment'
                }
            }
            
        })),
        links
    }
}

exports.CommentLikeResponse = function ({ id, author, publish_date, liked_on, is_dislike, comment_id }) {
    return {
        data: {
            id,
            type: "like",
            attributes: {
                publish_date,
                liked_on,
                is_dislike
            },
            relationships: {
                author: {
                    id: author,
                    type: 'user'
                },
                comment: {
                    id: comment_id,
                    type: 'comment'
                }
            }
        }
    }
}

exports.CommentResponse = function ({ id, author, post, publish_date, content, is_edited}, include = null) {
    let response = {
        data: {
            id,
            type: "comment",
            attributes: {
                content,
                publish_date,
                is_edited,
            },
            relationships: {
                author: {
                    id: author,
                    type: 'user'
                },
                post: {
                    id: post,
                    type: 'post'
                }
            }
        }
    }

    if(include !== null)
        response.include = include

    return response;
}

exports.CommentsListResponse = function (commentsList, links = {}) {
    return {
        data: commentsList.map(comment => ({
            id: comment.id,
            type: "comment",
            attributes: {
                content: comment.content,
                publish_date: comment.publish_date,
                is_edited: comment.is_edited
            },
            relationships: {
                author: {
                    id: comment.author,
                    type: 'user'
                },
                post: {
                    id: comment.post,
                    type: 'post'
                }
            }
        })),
        links
    }
}