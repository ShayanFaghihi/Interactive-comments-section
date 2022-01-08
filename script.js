const commentsSection = document.querySelector(".comments-section");
const addNewCommentForm = document.getElementById("addCommentForm");

// Global Varaiables
let currentUser;
let currentUserAvatar;
let commentsId = [];

// Reading all the data from the data file (in JSON)
async function readData () {
    const request = await fetch('data.json');
    const data = await request.json();
    showComments(data.comments);
    showReplies(data.comments);

    // Passing current User data
    currentUser = data.currentUser.username;
    currentUserAvatar = data.currentUser.image.png;
    // Insert current user data into the DOM
    document.querySelectorAll(".add-comment-section form img").forEach(img => {
        img.setAttribute("src",currentUserAvatar);
        img.setAttribute("alt",currentUser);
    });
}

// Reading data from data file function 
readData();


// Show comments into the DOM
const showComments = array => {
    array.forEach(comment => {
        const {id,content,createdAt,score,user:{image:{png},username}} = comment;
        commentsId.push(id);
        commentsSection.insertAdjacentHTML("afterbegin",`
        <!-- Comment Box -->
        <div class="comment-box" data-id=${id}>
          <div class="comment-box__interact">
            <div class="comment-score">
              <span class="like">+</span>
              <span class="score">${score}</span>
              <span class="dislike">-</span>
            </div> <!--End of Scores-->
          </div> <!--End of Interaction-->
  
          <div class="comment-box__main">
            <div class="comment-box__user">
              <span class="user-avatar"><img src="${png}" alt="amyrobson" class="avatar"></span>
              <span class="username">${username}</span>
              <span class="user-comment-date">${createdAt}</span>
            </div> <!--End of user-->
            <div class="comment-box__comment">
              <p class="comment">${content}</p>
            </div> <!--End of comment-->
          </div>
  
          <div class="comment-box__interact">
            <div class="reply" onclick="replyToComment(this)">
              <i class="fas fa-reply"></i>
              Reply
            </div> <!--End of Reply-->
          </div> <!--End of Interaction-->
        </div> <!--End of Comment Box-->
        `)
    });

    checkBrowserWidth();
}


// Show comments' Replies into the DOM from the data.json to be the future database
const showReplies = array => {
    array.forEach(comment => {
        const commentId = comment.id;
        const replies = comment.replies;
        if(replies.length > 0) {
            const parentComment = document.querySelector(`[data-id='${commentId}']`);
            // Creating the main reply section - this DIV contains a before psedu class drawing a line before
            const replySectionContainer = document.createElement("div");
            replySectionContainer.classList.add("reply-section");
            parentComment.insertAdjacentElement("afterend",replySectionContainer);

            // Deep into each reply
            replies.forEach(reply => {
                const {id,content,createdAt,score,user:{image:{png},username},replyingTo} = reply;
                replySectionContainer.insertAdjacentHTML("afterbegin", `
                    <!-- Replies Comment Box -->                   
                    <div class="comment-box">
                        <div class="comment-box__interact">
                        <div class="comment-score">
                            <span class="like">+</span>
                            <span class="score">${score}</span>
                            <span class="dislike">-</span>
                        </div> <!--End of Scores-->
                        </div> <!--End of Interaction-->
            
                        <div class="comment-box__main">
                        <div class="comment-box__user">
                            <span class="user-avatar"><img src="${png}" alt="${username}" class="avatar"></span>
                            <span class="username">${username}</span>
                            <span class="user-comment-date">${createdAt}</span>
                        </div> <!--End of user-->
                        <div class="comment-box__comment">
                            <p class="comment"><span class="reply-to">@${replyingTo}</span>${content}</p>
                        </div> <!--End of comment-->
                        </div>
            
                        <div class="comment-box__interact">
                        <div class="reply" onclick="replyToComment(this)">
                            <i class="fas fa-reply"></i>
                            Reply
                        </div> <!--End of Reply-->
                        </div> <!--End of Interaction-->
            
                    </div> <!--End of Replies Comment Box-->
                    
                    </div> <!--End of Replies Section-->
            
                `);
            });
        }
    });
}

// Add a new Comment from the form
const addNewComment = (e) => {
    // calculating the comment ID
    const id = commentsId.length + 1;
    commentsId.push(id);

    e.preventDefault();
    const content = e.srcElement[0].value;
    commentsSection.insertAdjacentHTML('beforeend',`
    <div class="comment-box self-comment" data-id=${id}>
        <div class="comment-box__interact">
            <div class="comment-score">
                <span class="like">+</span>
                <span class="score">0</span>
                <span class="dislike">-</span>
            </div> <!--End of Scores-->
        </div> <!--End of Interaction-->

        <div class="comment-box__main">
            <div class="comment-box__user">
                <!-- My Comment Details -->
                <span class="user-avatar"><img src="${currentUserAvatar}" alt="${currentUser}" class="avatar"></span>
                <span class="username">${currentUser}</span>
                <span class="you-tag">you</span>
                <span class="user-comment-date">2 Days ago</span>
                <div class="comment-box__interact">
                    <div class="comment-box__interact--self">
                        <span class="delete" onclick="deleteMyComment(this)" title="Delete this comment"><i class="fas fa-trash"></i> Delete</span>
                        <span class="edit" onclick="editMyComment(this)" title="Edit this comment"><i class="fas fa-pen"></i> Edit</span>
                    </div>
                    </div> <!--End of Interaction-->
            </div> <!--End of user-->

            <div class="comment-box__comment">
                <p class="comment">${content}</p>
            </div> <!--End of comment-->
        </div>

        <div class="comment-box__interact">
            <div class="comment-box__interact--self">
                <span class="delete" onclick="deleteMyComment(this)" ><i class="fas fa-trash"></i> Delete</span>
                <span class="edit" onclick="editMyComment(this)"><i class="fas fa-pen"></i> Edit</span>
            </div>
        </div> <!--End of Interaction-->

    </div> <!--End of My Reply Comment Box-->
    `);

    checkBrowserWidth();
    // Clearing textarea after sending the comment
    e.srcElement[0].value = '';
}


// Reply to a comment
const replyToComment = e => {
    const replyingTo = e.closest(".comment-box").querySelector(".username").textContent;
    const replyingToId = e.closest(".comment-box").getAttribute('data-id');

    // Check if other reply box is already open
    let hasReplyBox = false;
    if(e.closest(".comment-box").nextElementSibling) {
        if(e.closest(".comment-box").nextElementSibling.classList.contains("add-reply")) {

            hasReplyBox = true;
        }
    }

    if(!hasReplyBox) {
        e.closest(".comment-box").insertAdjacentHTML("afterend",`
            <!-- Add a reply section -->
            <div class="add-comment-section add-reply">
                <textarea name="add-comment" id="replyCommentBox" placeholder="Reply to ${replyingTo}"></textarea>
                <img src="${currentUserAvatar}" class="avatar">
                <div class="add-comment__trigger">
                    <button class="btn btn-blue" onclick="addReply(this,'${replyingTo}','${replyingToId}')">Reply</button>
                </div>
            </div> <!--End of Add reply Section -->
        `)
    } 
}

// Add the replied comment
const addReply = (e,replyingTo,replyingToId) => {
        // calculating the comment ID
    const id = commentsId.length + 1;
    commentsId.push(id);

    const parentReplyContainer = e.closest(".add-reply").nextElementSibling;
    const repliedContent = e.closest(".add-reply").querySelector("#replyCommentBox").value;

    // Check if the content is not empty
    if(repliedContent) {
        
        // Check if there are other replies sent to the comment by searching into the parantReplyContainer 
        if(parentReplyContainer !== null) {
            parentReplyContainer.insertAdjacentHTML("beforeend", `
            <div class="comment-box self-comment" data-id=${id}>
                <div class="comment-box__interact">
                    <div class="comment-score">
                        <span class="like">+</span>
                        <span class="score">0</span>
                        <span class="dislike">-</span>
                    </div> <!--End of Scores-->
                </div> <!--End of Interaction-->
    
                <div class="comment-box__main">
                    <div class="comment-box__user">
                        <!-- My Comment Details -->
                        <span class="user-avatar"><img src="${currentUserAvatar}" alt="${currentUser}" class="avatar"></span>
                        <span class="username">${currentUser}</span>
                        <span class="you-tag">you</span>
                        <span class="user-comment-date">2 Days ago</span>
                        <div class="comment-box__interact">
                            <div class="comment-box__interact--self">
                                <span class="delete" onclick="deleteMyComment(this)" title="Delete this comment"><i class="fas fa-trash"></i> Delete</span>
                                <span class="edit" onclick="editMyComment(this)" title="Edit this comment"><i class="fas fa-pen"></i> Edit</span>
                            </div>
                            </div> <!--End of Interaction-->
                    </div> <!--End of user-->
    
                    <div class="comment-box__comment">
                        <p class="comment"><span class="reply-to">@${replyingTo}</span>${repliedContent}</p>
                    </div> <!--End of comment-->
                </div>
    
                <div class="comment-box__interact">
                    <div class="comment-box__interact--self">
                        <span class="delete" onclick="deleteMyComment(this)" ><i class="fas fa-trash"></i> Delete</span>
                        <span class="edit" onclick="editMyComment(this)"><i class="fas fa-pen"></i> Edit</span>
                    </div>
                </div> <!--End of Interaction-->
    
            </div> <!--End of My Reply Comment Box-->
            `);
        } else {
            const mainParentContainer = document.querySelector(`.comment-box[data-id='${replyingToId}']`);
            mainParentContainer.insertAdjacentHTML("afterend", `
                <div class="reply-section">
                    <div class="comment-box self-comment" data-id=${id}>
                        <div class="comment-box__interact">
                            <div class="comment-score">
                                <span class="like">+</span>
                                <span class="score">0</span>
                                <span class="dislike">-</span>
                            </div> <!--End of Scores-->
                        </div> <!--End of Interaction-->
    
                        <div class="comment-box__main">
                            <div class="comment-box__user">
                                <!-- My Comment Details -->
                                <span class="user-avatar"><img src="${currentUserAvatar}" alt="${currentUser}" class="avatar"></span>
                                <span class="username">${currentUser}</span>
                                <span class="you-tag">you</span>
                                <span class="user-comment-date">2 Days ago</span>
                                <div class="comment-box__interact">
                                    <div class="comment-box__interact--self">
                                        <span class="delete" onclick="deleteMyComment(this)" title="Delete this comment"><i class="fas fa-trash"></i> Delete</span>
                                        <span class="edit" onclick="editMyComment(this)" title="Edit this comment"><i class="fas fa-pen"></i> Edit</span>
                                    </div>
                                    </div> <!--End of Interaction-->
                            </div> <!--End of user-->
    
                            <div class="comment-box__comment">
                                <p class="comment"><span class="reply-to">@${replyingTo}</span>${repliedContent}</p>
                            </div> <!--End of comment-->
                        </div>
    
                        <div class="comment-box__interact">
                            <div class="comment-box__interact--self">
                                <span class="delete" onclick="deleteMyComment(this)" ><i class="fas fa-trash"></i> Delete</span>
                                <span class="edit" onclick="editMyComment(this)"><i class="fas fa-pen"></i> Edit</span>
                            </div>
                        </div> <!--End of Interaction-->
    
                    </div> <!--End of My Reply Comment Box-->
                </div>
            `);
        }
    }

    // Remove the reply box
    e.closest(".add-reply").remove();
    
}


// Functions related to written comments by current user
// Delete my own comment
const deleteMyComment = e => {
    // Find the closest div with class of "self-comment"
    const closestSelfParent = e.closest(".self-comment");
    closestSelfParent.remove();
}

// Edit my own comment
const editMyComment = e => {
    // Find the closest div with class of "comment-box__main" and comment text cotentS
    const commentContentContainer = e.closest(".comment-box").querySelector(".comment-box__comment");
    const commentedContent = e.closest(".comment-box").querySelector(".comment").lastChild.textContent;
    
    let replyingTo = '';
    if(e.closest(".comment-box").querySelector(".reply-to")) {

        replyingTo = e.closest(".comment-box").querySelector(".reply-to").textContent;
    }
    // Turning the commented contetnt to a textarea holding content value
    commentContentContainer.innerHTML = '';
    commentContentContainer.insertAdjacentHTML('afterbegin',`
        <!-- Add a comment section -->
        <div class="edit-comment-section">
            <textarea name="edit-comment" id="editCommentBox">${commentedContent}</textarea>
            <div class="edit-comment__trigger">
                <button onclick="updateEditedComment(this,'${replyingTo}')" class="btn btn-blue">Update</button>
            </div>
        </div> <!--End of edit comment Section-->
    `)

    // Focusing on textarea
    
}


// Update Edited Comment
const updateEditedComment = (e,replyingTo) => {
    const contentToUpdate = e.closest(".edit-comment-section").querySelector("#editCommentBox").value;
    const commentContainer = e.closest(".comment-box").querySelector(".comment-box__comment");

    // Clearing the cedit section and add new updated comment
    commentContainer.innerHTML = '';
    console.log(replyingTo)
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

// Adding "large" class to comment box when the window size is larger than 700p
const checkBrowserWidth = () => {
    const commentBoxes = document.querySelectorAll(".comment-box");
    if(window.innerWidth > 700) {
        commentBoxes.forEach(commentBox => {
            commentBox.classList.add("large")
        });
    } else {
        commentBoxes.forEach(commentBox => {
            commentBox.classList.remove("large")
        })
    }
}


// Event Listeners
window.addEventListener("resize", checkBrowserWidth);
addNewCommentForm.addEventListener("submit",addNewComment);