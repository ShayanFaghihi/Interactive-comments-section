const commentsSection = document.querySelector(".comments-section");
const addNewCommentForm = document.getElementById("addCommentForm");

// Global Varaiables
let currentUser;
let currentUserAvatar;

// Reading all the data from the data file (in JSON)
async function readData () {
    const request = await fetch('data.json');
    const data = await request.json();
    // console.log(data.comments[0].content)
    showComments(data.comments);

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
        const {content,createdAt,score,user:{image:{png},username}} = comment;
        commentsSection.insertAdjacentHTML("afterbegin",`
        <!-- Comment Box -->
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
              <span class="user-avatar"><img src="${png}" alt="amyrobson" class="avatar"></span>
              <span class="username">${username}</span>
              <span class="user-comment-date">${createdAt}</span>
            </div> <!--End of user-->
            <div class="comment-box__comment">
              <p class="comment">${content}</p>
            </div> <!--End of comment-->
          </div>
  
          <div class="comment-box__interact">
            <div class="reply">
              <i class="fas fa-reply"></i>
              Reply
            </div> <!--End of Reply-->
          </div> <!--End of Interaction-->
        </div> <!--End of Comment Box-->
        `)
    });

    checkBrowserWidth();
}


// Add a new Comment from the form
const addNewComment = (e) => {
    e.preventDefault();
    const content = e.srcElement[0].value;
    commentsSection.insertAdjacentHTML('beforeend',`
    <div class="comment-box self-comment">
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
                    <span class="delete"><i class="fas fa-trash"></i> Delete</span>
                    <span class="edit"><i class="fas fa-pen"></i> Edit</span>
                </div>
                </div> <!--End of Interaction-->
            </div> <!--End of user-->

            <div class="comment-box__comment">
                <p class="comment">${content}</p>
            </div> <!--End of comment-->
        </div>

        <div class="comment-box__interact">
            <div class="comment-box__interact--self">
                <span class="delete"><i class="fas fa-trash"></i> Delete</span>
                <span class="edit"><i class="fas fa-pen"></i> Edit</span>
            </div>
        </div> <!--End of Interaction-->

    </div> <!--End of My Reply Comment Box-->
    `);

    checkBrowserWidth();
    // Clearing textarea after sending the comment
    e.srcElement[0].value = '';
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