const commentsSection = document.querySelector(".comments-section");
const addNewCommentForm = document.getElementById("addCommentForm");

// Global Varaiables
let currentUser;
let currentUserAvatar;
let commentsId = [];
let replyCommentsId = [];
let commentsArray = [];
let repliesArray = [];


// Reading all the data from the data file (in JSON)
async function readData () {
    const request = await fetch('data.json');
    const data = await request.json();

    // Send every data came from data.json to global arrays
    data.comments.forEach(comment => {
        commentsArray.push(comment);
        if(comment.replies.length > 0) {
            const commentId = comment.id;
           comment.replies.forEach(reply => {
               repliesArray.push(reply);
               reply.parentId = commentId;
           })
        }
    })

    // Passing current User data
    currentUser = data.currentUser.username;
    currentUserAvatar = data.currentUser.image.png;
    // Insert current user data into the DOM
    document.querySelectorAll(".add-comment-section form img").forEach(img => {
        img.setAttribute("src",currentUserAvatar);
        img.setAttribute("alt",currentUser);
    });
}

// Passing data to global arrays after reading data from database
readData().then(() => {
    showComments(commentsArray);
    showReplies(repliesArray);
});

// Show comments into the DOM
 function showComments(array) {
    // Sorting comments array based on the scores (Descending)
    array.sort((a,b) => {
       return  parseFloat(a.score) - parseFloat(b.score);
    })

     array.forEach(comment => {
        const {id,content,createdAt,score,user:{image:{png},username}} = comment;
        commentsId.push(id);
        commentsSection.insertAdjacentHTML("afterbegin",`
        <!-- Comment Box -->
        <div class="comment-box" data-id=${id}> 
          <div class="comment-box__main">
            <div class="comment-box__user">
              <span class="user-avatar"><img src="${png}" alt="amyrobson" class="avatar"></span>
              <span class="username">${username}</span>
              <span class="user-comment-date">${createdAt}</span>
            </div> <!--End of user-->
            <div class="comment-box__comment">
              <p class="comment">${content}</p>
            </div> <!--End of comment-->
            <div class="comment-box__interact">
              <div class="comment-score">
                <span class="like" onclick="incrementScore(this)">+</span>
                <span class="score">${score}</span>
                <span class="dislike" onclick="decrementScore(this)">-</span>
              </div> <!--End of Scores-->
              <div class="reply" onclick="replyToComment(${id},'${username}')">
                <i class="fas fa-reply"></i>
                Reply
              </div> <!--End of Reply-->
            </div> <!--End of Interaction-->
          </div>
  
          <div class="reply-section"></div>
        </div> <!--End of Comment Box-->
        `);

    });
}

// Checking and exporting replies to their representative parent comment
// const checkCommentReplies = commentId => {
//     repliesArray.forEach(reply => {
//         if(reply.parentId == commentId) {
//             console.log("hello")
//             const newReply = new Array;
//             newReply.push({
//                 "id": reply.id,
//                 "content": `${reply.content}`,
//                 "createdAt": `${reply.createdAt}`,
//                 "score": reply.score,
//                 "replyingTo": `${reply.parentUser}`,
//                 "parentId" : `${reply.parentId}`,
//                 "user": {
//                   "image": { 
//                     "png": `${reply.image}`
//                   },
//                     "username": `${reply.username}`
//                 }
//             });
//             return newReply;
//         }
//     })
// }


// Show comments' Replies into the DOM from the data.json to be the future database
const showReplies = array => {
    // Sorting replies based on the number of the score
    array.sort((a,b) => {
        return parseFloat(a.score) - parseFloat(b.score);
    })
    array.forEach(reply => {
        const {id,content,createdAt,score,user:{image:{png},username},replyingTo,parentId} = reply;
        replyCommentsId.push(id);
        const parentComment = document.querySelector(`[data-id='${parentId}'] .reply-section`);
        parentComment.insertAdjacentHTML("afterbegin", `
            <!-- Replies Comment Box -->                   
            <div class="comment-box" data-reply-id=${id}>  
                <div class="comment-box__main">
                    <div class="comment-box__user">
                        <span class="user-avatar"><img src="${png}" alt="${username}" class="avatar"></span>
                        <span class="username">${username}</span>
                        <span class="user-comment-date">${createdAt}</span>
                    </div> <!--End of user-->
                    <div class="comment-box__comment">
                        <p class="comment"><span class="reply-to">@${replyingTo}</span>${content}</p>
                    </div> <!--End of comment-->
                    <div class="comment-box__interact">
                        <div class="comment-score">
                            <span class="like" onclick="incrementScore(this)">+</span>
                            <span class="score">${score}</span>
                            <span class="dislike" onclick="decrementScore(this)">-</span>
                        </div> <!--End of Scores-->
                        <div class="reply" onclick="replyToComment(${parentId},'${username}',${id})">
                            <i class="fas fa-reply"></i>
                            Reply
                        </div> <!--End of Reply-->
                    </div> <!--End of Interaction-->
                </div>

            </div> <!--End of Replies Comment Box-->
        
        `);
        
        
    });
}

// Add a new Comment from the form
const addNewComment = (e) => {
    // calculating the comment ID
    const id = commentsId.length + 1;
    commentsId.push(id);

    e.preventDefault();
    const content = e.srcElement[0].value;

    // Push the new comment from current user to the global array
    commentsArray.push({
        "id": id,
        "content": `${content}`,
        "createdAt": "Right Now",
        "score": 0,
        "user": {
            "image": { 
            "png": `${currentUserAvatar}`            
            },
            "username": `${currentUser}`,
        },
        "replies": []
    });

    commentsSection.insertAdjacentHTML('beforeend',`
        <!--  Comment Box -->                   
        <div class="comment-box self-comment" data-id=${id}>  
            <div class="comment-box__main">
                <div class="comment-box__user">
                    <span class="user-avatar"><img src="${currentUserAvatar}" alt="${currentUser}" class="avatar"></span>
                    <span class="username">${currentUser}</span>
                    <span class="you-tag">You</span>
                    <span class="user-comment-date">Just Now</span>
                </div> <!--End of user-->
                <div class="comment-box__comment">
                    <p class="comment">${content}</p>
                </div> <!--End of comment-->
                <div class="comment-box__interact">
                    <div class="comment-score">
                        <span class="like" onclick="incrementScore(this)">+</span>
                        <span class="score">0</span>
                        <span class="dislike" onclick="decrementScore(this)">-</span>
                    </div> <!--End of Scores-->
                    <div class="comment-box__interact--self">
                        <span class="delete" onclick="deleteMyComment(${id},${null})" title="Delete this comment"><i class="fas fa-trash"></i> Delete</span>
                        <span class="edit" onclick="editMyComment(${id},${null})" title="Edit this comment"><i class="fas fa-pen"></i> Edit</span>
                    </div>
                </div> <!--End of Interaction-->
            </div>

        </div> <!--End of Replies Comment Box-->
    `);

    checkBrowserWidth();
    // Clearing textarea after sending the comment
    e.srcElement[0].value = '';
}


// Reply to a comment
const replyToComment = (commentId,replyTo,replyId = null) => {
    const replyBoxContent = `
    <!-- Add a reply section -->
    <div class="add-comment-section add-reply">
        <img src="${currentUserAvatar}" class="avatar">
        <textarea name="add-comment" id="replyCommentBox" placeholder="Reply to ${replyTo}"></textarea>
        <div class="add-comment__trigger">
            <button class="btn btn-blue" onclick="addReply('${replyTo}','${commentId}',${replyId})">Reply</button>
        </div>
    </div> <!--End of Add reply Section -->
    `;

    if(replyId) {
        document.querySelector(`[data-reply-id='${replyId}']`).insertAdjacentHTML("beforeend",replyBoxContent)
    } else {
        document.querySelector(`[data-id='${commentId}'] .reply-section`).insertAdjacentHTML("afterbegin",replyBoxContent)
    }
     
}


// Add the replied comment
const addReply = (replyTo,commentId,replyId) => {
    // calculating the comment ID
    const id = replyCommentsId.length + 1;
    replyCommentsId.push(id);

    // Main comment box
    const parentReplyContainer = document.querySelector(`[data-id='${commentId}'] .reply-section`);

    let repliedContent = '';

    // Check if we are replying to a comment or a reply
    if(replyId == null) {
        repliedContent = document.querySelector(`[data-id='${commentId}'] .add-reply textarea`).value;
    } else {
        repliedContent = document.querySelector(`[data-reply-id='${replyId}'] .add-reply textarea`).value;
    }

    // Push replies into the global replies array
    repliesArray.push({
        "id": id,
        "content": `${repliedContent}`,
        "createdAt": `Just Now`,
        "score": 0,
        "replyingTo": `${replyTo}`,
        "parentId" : commentId,
        "user": {
          "image": { 
            "png": `${currentUserAvatar}`
          },
            "username": `${currentUser}`
        }
    })

    // Check if the content is not empty
    if(repliedContent) {
        parentReplyContainer.insertAdjacentHTML("beforeend", `
            <!-- Replies Comment Box -->                   
            <div class="comment-box self-comment" data-reply-id=${id}>  
                <div class="comment-box__main">
                    <div class="comment-box__user">
                        <span class="user-avatar"><img src="${currentUserAvatar}" alt="${currentUser}" class="avatar"></span>
                        <span class="username">${currentUser}</span>
                        <span class="user-comment-date">Just Now</span>
                    </div> <!--End of user-->
                    <div class="comment-box__comment">
                        <p class="comment"><span class="reply-to">@${replyTo}</span>${repliedContent}</p>
                    </div> <!--End of comment-->
                    <div class="comment-box__interact">
                        <div class="comment-score">
                            <span class="like" onclick="incrementScore(this)">+</span>
                            <span class="score">0</span>
                            <span class="dislike" onclick="decrementScore(this)">-</span>
                        </div> <!--End of Scores-->
                        <div class="comment-box__interact--self">
                            <span class="delete" onclick="deleteMyComment(${null},${id})" title="Delete this comment"><i class="fas fa-trash"></i> Delete</span>
                            <span class="edit" onclick="editMyComment(${null},${id})" title="Edit this comment"><i class="fas fa-pen"></i> Edit</span>
                        </div>
                    </div> <!--End of Interaction-->
                </div>

            </div> <!--End of Replies Comment Box-->
        `);   
    }

    // Remove the reply box
    document.querySelector(`[data-id='${commentId}'] .add-reply`).remove();

}


// Functions related to written comments by current user
// Delete my own comment and reply having class of "self-comment"
const deleteMyComment = (commentId,replyId) => {
    // Removing the comment or reply from the global arrays
    // Check if it was a comment
    if(commentId) {
        const found = commentsArray.find(object => object.id == commentId);
        commentsArray.splice(commentsArray.indexOf(found),1);
        document.querySelector(`[data-id='${commentId}']`).remove();
    } else {
        const found = repliesArray.find(object => object.id == replyId);
        repliesArray.splice(repliesArray.indexOf(found),1);
        document.querySelector(`[data-reply-id='${replyId}']`).remove();
    }
}

// Edit my own comment
const editMyComment = (commentId,replyId) => {
    // Selecting the content box container based on the comment or reply we are editing
    let commentContentContainer = '';
    let commentedContent = '';
    let replyingTo = '';

    if(commentId) {
         commentContentContainer = document.querySelector(`[data-id='${commentId}'] .comment-box__comment`);
         commentedContent = document.querySelector(`[data-id='${commentId}'] .comment`).lastChild.textContent;
         replyingTo = '';
        //  Remove Edit Button
        document.querySelector(`[data-id='${commentId}'] .edit`).hidden = true;
    } else {
         commentContentContainer = document.querySelector(`[data-reply-id='${replyId}'] .comment-box__comment`);
         commentedContent = document.querySelector(`[data-reply-id='${replyId}'] .comment`).lastChild.textContent;
         replyingTo = document.querySelector(`[data-reply-id='${replyId}'] .reply-to`).textContent;
        //  Remove Edit Button
        document.querySelector(`[data-reply-id='${replyId}'] .edit`).hidden = true;
    }

    // Turning the commented contetnt to a textarea holding content value
    commentContentContainer.innerHTML = '';
    commentContentContainer.insertAdjacentHTML('afterbegin',`
        <!-- Add a comment section -->
        <div class="edit-comment-section">
            <textarea name="edit-comment" id="editCommentBox">${commentedContent}</textarea>
            <div class="edit-comment__trigger">
                <button onclick="updateEditedComment('${replyingTo}',${commentId}, ${replyId})" class="btn btn-blue">Update</button>
            </div>
        </div> <!--End of edit comment Section-->
    `)

    // Focusing on textarea
    
}


// Update Edited Comment
const updateEditedComment = (replyingTo,commentedId,replyId) => {
    let contentToUpdate = '';
    let commentContainer;
    if(commentedId) {
        contentToUpdate = document.querySelector(`[data-id='${commentedId}'] #editCommentBox`).value;
        commentContainer = document.querySelector(`[data-id='${commentedId}'] .comment-box__comment`)
        // Changing the content in the global comments array
        commentsArray.filter(object => object.id == commentedId)[0].content = contentToUpdate;

        // Get Back edit button
        document.querySelector(`[data-id='${commentedId}'] .edit`).hidden = false;
    } else {
        contentToUpdate = document.querySelector(`[data-reply-id='${replyId}'] #editCommentBox`).value;
        commentContainer = document.querySelector(`[data-reply-id='${replyId}'] .comment-box__comment`)
        // Changing the content in the global replies array
        repliesArray.filter(object => object.id == replyId)[0].content = contentToUpdate;

        // Get Back edit button
        document.querySelector(`[data-reply-id='${replyId}'] .edit`).hidden = false;
    }

    // Clearing the cedit section and add new updated comment
    commentContainer.innerHTML = '';
    if(!replyingTo) {
        commentContainer.insertAdjacentHTML("afterbegin", `
        <p class="comment">${contentToUpdate}</p>
    `)
    } else {

        commentContainer.insertAdjacentHTML("afterbegin", `
        <p class="comment"><span class="reply-to">${replyingTo}</span>${contentToUpdate}</p>
        `)
    }
}


// Scoring System
// Incerment
const incrementScore = (e) => {
    const scoreContainer = e.nextElementSibling;
    const commentId = scoreContainer.closest(".comment-box").getAttribute("data-id");
    const replyId = scoreContainer.closest(".comment-box").getAttribute("data-reply-id");
    let score = e.nextElementSibling.textContent;

    score++;
    scoreContainer.innerText = score;

    // Updating the global comments and replies arrays based on the id
    if(commentId) {
        // If it is a comment
        commentsArray.filter(object => object.id == commentId)[0].score = score;
    } else {
        // If it is a reply
        repliesArray.filter(object => object.id == replyId)[0].score = score;
       
    }
}


// Decrement
const decrementScore = (e) => {
    const scoreContainer = e.previousElementSibling;
    const commentId = scoreContainer.closest(".comment-box").getAttribute("data-id");
    const replyId = scoreContainer.closest(".comment-box").getAttribute("data-reply-id");
    let score = e.previousElementSibling.textContent;

    score > 0 ? score-- : score == 0;
    scoreContainer.innerText = score;

    // Updating the global comments and replies arrays based on the id
    if(commentId) {
        // If it is a comment
        commentsArray.filter(object => object.id == commentId)[0].score = score;

    } else {
        // If it is a reply
        repliesArray.filter(object => object.id == replyId)[0].score = score;
    }
}




// Event Listeners
addNewCommentForm.addEventListener("submit",addNewComment);