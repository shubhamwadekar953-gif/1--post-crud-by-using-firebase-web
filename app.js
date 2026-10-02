const postForm = document.getElementById("postForm")
const postList = document.getElementById("postList")
const userId = document.getElementById("userId")
const title = document.getElementById("title")
const body = document.getElementById("body")
const submitBtn = document.getElementById("submitBtn")
const updateBtn = document.getElementById("updateBtn")
const spinner = document.getElementById("spinner")

const BASE_URL = "https://student-crud-26d0f-default-rtdb.firebaseio.com/tod%20crud%20by%20using%20firebase%20web/post%20crud";
const POST_URL = `${BASE_URL}/posts.json`;

function hidespinner() {
    spinner.classList.add("d-none")
}

function showspinner() {
    spinner.classList.remove("d-none")
}

//read-post
let xhr = new XMLHttpRequest();
xhr.open("GET", POST_URL)
xhr.send(null)
xhr.onload = function () {
    let data = JSON.parse(xhr.response);
    let result = ``;
    for (let key in data) {
        let post = data[key];
        result += `
            <tr id="${key}">
                <td>${post.userId}</td>
                <td>${post.title}</td>
                <td>${post.body}</td>
                <td><button onclick="onEdit(this)" class="btn btn-sm btn-warning"> Edit </button></td>
                <td><button onclick="onDelete(this)" class="btn btn-sm btn-danger"> Delete </button></td>
            </tr>
        `;
    }
    postList.innerHTML = result;
}

//create-post
function onCreate(eve){
    showspinner()
    eve.preventDefault();
    const postObj ={
        userId: userId.value,
        title: title.value,
        body: body.value
    }
    let xhr = new XMLHttpRequest();
    xhr.open("POST", POST_URL)
    xhr.send(JSON.stringify(postObj));
    xhr.onload = () => {
        let res = JSON.parse(xhr.response)
        if(xhr.status >= 200 && xhr.status <= 299){
            let createtr = document.createElement("tr")
            createtr.id = res.name
            createtr.innerHTML = `
                        <td>${postObj.userId}</td>
                        <td>${postObj.title}</td>
                        <td>${postObj.body}</td>
                        <td><button onclick="onEdit(this)" class="btn btn-sm btn-warning">Edit</button></td>
                        <td><button onclick="onDelete(this)" class="btn btn-sm btn-danger">Delete</button></td>
                        `
        postList.prepend(createtr)
        postForm.reset()
        Swal.fire({
            title: "Post Created Successfully!",
            icon: "success",
            timer: 2000
        })
    }
    hidespinner()
  }
}

//edit-post
function onEdit(ele){
    showspinner();
    let EDIT_ID = ele.closest('tr').id;
    let EDIT_URL = `${BASE_URL}/posts/${EDIT_ID}.json`;
    localStorage.setItem('EDIT_ID', EDIT_ID);
    let xhr = new XMLHttpRequest();
    xhr.open("GET", EDIT_URL);
    xhr.send(null);
    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res = JSON.parse(xhr.response);
            userId.value = res.userId;
            title.value = res.title;
            body.value = res.body;
            submitBtn.classList.add('d-none');
            updateBtn.classList.remove('d-none');
            Swal.fire({
                title: "Now You Can Edit Post",
                icon: "info",
                timer: 1500
            })
        }
        hidespinner();
    }
}

//update-post
function onUpdate(){
    showspinner();
    let update_Id = localStorage.getItem('EDIT_ID');
    let UPDATE_URL = `${BASE_URL}/posts/${update_Id}.json`;
    let updateObj={
        userId: userId.value,
        title: title.value,
        body: body.value
    };
    let xhr = new XMLHttpRequest();
    xhr.open("PATCH", UPDATE_URL);
    xhr.send(JSON.stringify(updateObj));
    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res = JSON.parse(xhr.response);
            let tr = document.getElementById(update_Id);
            tr.children[0].innerHTML = res.userId;
            tr.children[1].innerHTML = res.title;
            tr.children[2].innerHTML = res.body;
            postForm.reset();
            submitBtn.classList.remove('d-none');
            updateBtn.classList.add('d-none');
            localStorage.removeItem('EDIT_ID');
            Swal.fire({
                title: "Post Updated Successfully!",
                icon: "success",
                timer: 1500
            })
        }
        hidespinner();
    }
}

//delete-post 
function onDelete(ele){
    let DELETE_ID = ele.closest('tr').id;

    Swal.fire({
        title: `Are you sure you want to delete post ${DELETE_ID}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            showspinner()
            let DELETE_URL = `${BASE_URL}/posts/${DELETE_ID}.json`;
            let xhr = new XMLHttpRequest();
            xhr.open("DELETE", DELETE_URL);
            xhr.send(null);
            xhr.onload = function(){
                if(xhr.status >= 200 && xhr.status <= 299){
                    ele.closest('tr').remove();
                    Swal.fire({
                        title: "Post Deleted Successfully!",
                        icon: "success",
                        timer: 2000
                    })
                }
                hidespinner()
            }
            xhr.onerror = function(){
                hidespinner()
            }
        }
    })
}

postForm.addEventListener("submit", onCreate);
updateBtn.addEventListener('click', onUpdate);