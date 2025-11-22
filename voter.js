const voterLoginBtn = document.getElementById("voter-login-btn")
const voterIdInput = document.getElementById("voter-id-input")
const voterPassInput = document.getElementById("voter-pass-input")
voterLoginBtn.addEventListener("click", function(){
    voterId = voterIdInput.value
    voterPass = voterPassInput.value
    if(voterId && voterPass){
        location.href = "voter-page.html"
    }

})