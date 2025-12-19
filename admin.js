
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js"
import { getAuth,
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        signOut,
        onAuthStateChanged} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js"
import { getFirestore, 
         collection, 
         addDoc, 
         doc, 
         setDoc,
         onSnapshot,
         getDoc,} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js" 

const firebaseConfig = {
    apiKey: "AIzaSyDrA_yYmQJNEgyWO0yJLoRVxBydmSuiP_4",
    authDomain: "easy-voting-fd3ad.firebaseapp.com",
    databaseURL: "https://easy-voting-fd3ad-default-rtdb.firebaseio.com",
    projectId: "easy-voting-fd3ad",
    storageBucket: "easy-voting-fd3ad.firebasestorage.app"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app) 

//const adminCreateAccountBtn = document.getElementById("admin-create-account-btn")
const adminLoginBtn = document.getElementById("admin-login-btn")
const adminIdInput = document.getElementById("admin-id-input")
const adminPassInput = document.getElementById("admin-pass-input")

//adminCreateAccountBtn.addEventListener("click", authCreateAccount)
adminLoginBtn.addEventListener("click", authSignIn)

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const docRef = doc(db, "admin", user.uid)
        try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data()
                if (data.role === "admin") {
                    console.log("Admin verified. Redirecting...")
                    location.href = "admin-page.html"
                } 
                else {
                    console.error("Access denied: User is not an admin.")
                    alert("Access denied: You are not an admin.")
                    await signOut(auth)
                }
            } 
            else {
                console.error("No admin record found in Firestore for this user.")
                alert("No admin profile found.")
            }
        } 
        catch (error) {
            console.error("Error fetching admin data:", error)
        }
    }
    else {
        console.log("No user is signed in")
    }
})
// async function authCreateAccount(){
//     const email = adminIdInput.value
//     const password = adminPassInput.value
//     try{
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password)
//         const uid = userCredential.user.uid
//         await addNewAdminToDB(uid) 
//         adminIdInput.value = ""
//         adminPassInput.value = ""
//         console.log("Admin added to DB successfully")
//         location.href = "admin-page.html"
//     }
//     catch (error) {
//         console.error("Something went wrong:", error)
//     }
// }
async function authSignIn(){
    const email = adminIdInput.value
    const password = adminPassInput.value
    try{
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const uid = userCredential.user.uid    
        // await getAdminInformation(uid)
        adminIdInput.value = ""
        adminPassInput.value = ""
    }
    catch (error) {
        console.error("Something went wrong:", error)
    }
}
// async function addNewAdminToDB(uid){
//     await setDoc(doc(db, "admin", uid), {
//         adminId: uid,
//         role: "admin"
//     })
//     console.log("Document written with ID: ", uid)
// }
// async function getAdminInformation(uid) {
//     const docRef = doc(db, "admin", uid)
//     const docSnap = await getDoc(docRef)
//     if (docSnap.exists() && docSnap.data().role === "admin") {
//         console.log("you're an admin")
//         location.href = "admin-page.html"
//     } else {
//         console.log("You're not an admin")
//         signOut(auth)
//     }
// }

