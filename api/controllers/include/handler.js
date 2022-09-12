const includeType = require('../../helpers/types/include');

const commentsQ = require('../../data/pg/CommentsQ');
const likesQ = require('../../data/pg/PostLikesQ');
const commentLikesQ = require('../../data/pg/CommentLikesQ');
const postsQ = require('../../data/pg/PostsQ');

const { CommentsListResponse, PostLikesListResponse, PostListResponse } = require('../responses/PostsResponses');
const { CommentLikesListResponse } = require('../responses/CommentResponses');

async function IncludeHandler(include, additionalData) {
    let includeResp;

    switch (include) {
        case includeType.POST_COMMENTS:
            includeResp = await commentsQ.New().Get().WherePostID(additionalData.post_id).Execute(true);

            if(includeResp.error) 
                break
            
            includeResp = CommentsListResponse(includeResp).data;
            break;
        case includeType.POST_LIKES:
            includeResp = await likesQ.New().Get().WherePostID(additionalData.post_id).Execute(true);

            if(includeResp.error)
                break;

            includeResp = PostLikesListResponse(includeResp).data;
            break;
        case includeType.POSTS: 
            includeResp = await postsQ.New().Get().WhereAuthor(additionalData.user_id).Execute(true);

            if(includeResp.error)
                break;

            includeResp = PostListResponse(includeResp).data;

            break;

        case includeType.USER_COMMENTS:
            includeResp = await commentsQ.New().Get().WhereAuthor(additionalData.user_id).Execute(true);

            if(includeResp.error)
                break;
            
            includeResp = CommentsListResponse(includeResp).data;

            break;
        //TODO returns only likes under the posts; must fix;
        case includeType.USER_LIKES:
            includeResp = await likesQ.New().Get().WhereAuthor(additionalData.user_id).Execute(true);

            if(includeResp.error)
                break;

            includeResp = PostLikesListResponse(includeResp).data;

            break;
        
        case includeType.COMMENT_LIKES:
            includeResp = await commentLikesQ.New().Get().WhereCommentID(additionalData.comment_id).Execute(true);

            if(includeResp.error)
                break;

            includeResp = CommentLikesListResponse(includeResp).data;

            break;

        default:
            break;
    }

    return includeResp;
}

module.exports = IncludeHandler;