const adminLoginBtn = document.getElementById("admin-login-btn")
const adminIdInput = document.getElementById("admin-id-input")
const adminPassInput = document.getElementById("admin-pass-input")
let adminId = ""
let adminPass = ""

adminLoginBtn.addEventListener("click", function(){
    adminId = adminIdInput.value
    adminPass = adminPassInput.value
    if(adminId && adminPass){
        location.href = "admin-page.html"
    }
})
console.log(adminId)
