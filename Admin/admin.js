// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAoe8rNw_Ti-StzB0ERzdsGpJ1CKjmiEMU",
  authDomain: "aether-sovereign.firebaseapp.com",
  projectId: "aether-sovereign",
  storageBucket: "aether-sovereign.firebasestorage.app",
  messagingSenderId: "461248328418",
  appId: "1:461248328418:web:1d767ddb136c2f6f7464bb",
  measurementId: "G-X7LBQST23N"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();



// Login Function
function login(){

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password)

.then(async (userCredential) => {

    const user =
    userCredential.user;

    // ambil data user dari firestore

    const userDoc =
    await db.collection("users")
    .doc(user.uid)
    .get();

    const userData =
    userDoc.data();

    // simpan localstorage

    localStorage.setItem(
        "uid",
        user.uid
    );

    localStorage.setItem(
        "role",
        userData.role
    );

    localStorage.setItem(
        "name",
        userData.name
    );

    // pindah dashboard

    window.location.href =
    "dashboard.html";

})
    .catch((error) => {

        document.getElementById("status").innerText =
        error.message;

    });

}
// Logout
function logout(){

    auth.signOut()

    .then(() => {

        window.location.href = "login.html";

    });

}

// Protect Dashboard
auth.onAuthStateChanged((user) => {

    if(
        !user &&
        window.location.pathname.includes("dashboard.html")
    ){

        window.location.href = "login.html";

    }

});
async function uploadBase(){

    const title =
    document.getElementById("title").value;

    const category =
    document.getElementById("category").value;

    const layoutLink =
    document.getElementById("layoutLink").value;

    const imageFile =
    document.getElementById("imageFile").files[0];

    if(!imageFile){
        alert("Select image first");
        return;
    }

    try{

        // Upload image
        const storageRef =
        storage.ref("bases/" + imageFile.name);

        await storageRef.put(imageFile);

        const imageUrl =
        await storageRef.getDownloadURL();

        // Save database
            await db.collection("bases").add({

                title: title,

                category: category,

                layoutLink: layoutLink,

                imageUrl: imageUrl,

                uploadedBy:
                localStorage.getItem("uid"),

                uploaderRole:
                localStorage.getItem("role"),

                copyCount: 0,

                createdAt: new Date()

            });


        alert("Base uploaded!");

    }

    catch(error){

        alert(error.message);

    }

}

function loadBases(){

    const role =
    localStorage.getItem("role");

    const uid =
    localStorage.getItem("uid");

    db.collection("bases")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {

        const baseList =
        document.getElementById("baseList");

        if(!baseList) return;

        baseList.innerHTML = "";

        snapshot.forEach(doc => {

            const base = doc.data();

            let buttons = "";

            // MEMBER

            if(
                role === "member" &&
                base.uploadedBy === uid
            ){

                buttons = `

                <button
                class="delete-btn"
                onclick="deleteBase('${doc.id}')">

                Delete

                </button>

                `;

            }

            // ADMIN / SUPERADMIN

            else if(
                role === "admin" ||
                role === "superadmin"
            ){

                buttons = `

                <button
                class="delete-btn"
                onclick="deleteBase('${doc.id}')">

                Delete

                </button>

                `;

            }

            const html = `

            <div class="base-item">

                <div class="base-left">

                    <img src="${base.imageUrl}">

                    <div>

                        <h3>
                            ${base.title}
                        </h3>

                        <p>
                            ${base.category}
                        </p>

                        <small>

                        Upload by:
                        ${base.uploaderName || "Unknown"}

                        </small>

                        <br>

                        <small>

                        Copies:
                        ${base.copyCount || 0}

                        </small>

                    </div>

                </div>

                <div class="base-actions">

                    <button
                    class="copy-btn"
                    onclick="copyBase(
                    '${doc.id}',
                    '${base.layoutLink}'
                    )">

                    Copy Layout

                    </button>

                    ${buttons}

                </div>

            </div>

            `;



               

        });

    });

}


async function copyBase(id, link){

    navigator.clipboard.writeText(link);

    await db.collection("bases")
    .doc(id)
    .update({

        copyCount:
        firebase.firestore.FieldValue.increment(1)

    });

    alert("Layout copied!");

}

loadBases();

const role =
localStorage.getItem("role");

if(role !== "superadmin"){

    const createUserCard =
    document.getElementById(
        "createUserCard"
    );

    if(createUserCard){

        createUserCard.style.display =
        "none";

    }

}


async function createUser(){

    const name =
    document.getElementById("newName").value;

    const email =
    document.getElementById("newEmail").value;

    const password =
    document.getElementById("newPassword").value;

    const role =
    document.getElementById("newRole").value;

    try{

        const result =
        await auth.createUserWithEmailAndPassword(
            email,
            password
        );

        const uid =
        result.user.uid;

        await db.collection("users")
        .doc(uid)
        .set({

            name: name,

            email: email,

            role: role,

            createdAt: new Date()

        });

        alert("User created!");

    }

    catch(error){

        alert(error.message);

    }

}
function showSection(section){

    // SEMBUNYIKAN SEMUA SECTION

    document.getElementById(
        "dashboardSection"
    ).style.display = "none";

    document.getElementById(
        "basesSection"
    ).style.display = "none";

    document.getElementById(
        "usersSection"
    ).style.display = "none";

    // HAPUS ACTIVE MENU

    document.getElementById(
        "menuDashboard"
    ).classList.remove("active");

    document.getElementById(
        "menuBases"
    ).classList.remove("active");

    document.getElementById(
        "menuUsers"
    ).classList.remove("active");

    // TAMPILKAN SECTION

    if(section === "dashboard"){

        document.getElementById(
            "dashboardSection"
        ).style.display = "block";

        document.getElementById(
            "menuDashboard"
        ).classList.add("active");

    }

    if(section === "bases"){

        document.getElementById(
            "basesSection"
        ).style.display = "block";

        document.getElementById(
            "menuBases"
        ).classList.add("active");

    }

    if(section === "users"){

        document.getElementById(
            "usersSection"
        ).style.display = "block";

        document.getElementById(
            "menuUsers"
        ).classList.add("active");

    }

}
async function loadStats(){

    // TOTAL BASES

    const basesSnapshot =
    await db.collection("bases").get();

    document.getElementById(
        "totalBases"
    ).innerText =
    basesSnapshot.size;

    // TOTAL USERS

    const usersSnapshot =
    await db.collection("users").get();

    document.getElementById(
        "totalUsers"
    ).innerText =
    usersSnapshot.size;

    // TRENDING CATEGORY

    const categoryCount = {};

    // MOST COPIED

    let topBaseName = "-";
    let topCopy = 0;

    basesSnapshot.forEach(doc => {

        const base = doc.data();

        // CATEGORY COUNT

        const category =
        base.category || "Unknown";

        if(!categoryCount[category]){

            categoryCount[category] = 0;

        }

        categoryCount[category]++;

        // MOST COPIED

        const copies =
        base.copyCount || 0;

        if(copies > topCopy){

            topCopy = copies;

            topBaseName =
            base.title;

        }

    });

    // TRENDING CATEGORY

    let topCategory = "-";
    let highest = 0;

    for(const category in categoryCount){

        if(categoryCount[category] > highest){

            highest =
            categoryCount[category];

            topCategory =
            category;

        }

    }

    document.getElementById(
        "trendingCategory"
    ).innerText =
    topCategory;

    // TOP BASE

    document.getElementById(
        "topBase"
    ).innerText =
    topBaseName;

}

function loadUsers(){

    db.collection("users")
    .onSnapshot(snapshot => {

        const usersList =
        document.getElementById(
            "usersList"
        );

        if(!usersList) return;

        usersList.innerHTML = "";

        snapshot.forEach(doc => {

            const user = doc.data();

            const html = `

            <div class="base-item">

                <div class="base-left">

                    <div>

                        <h3>
                            ${user.name}
                        </h3>

                        <p>
                            ${user.email}
                        </p>

                        <small>

                        Role:
                        ${user.role}

                        </small>

                    </div>

                </div>

                <div class="base-actions">

                    <button
                    class="delete-btn"
                    onclick="deleteUser('${doc.id}')">

                    Delete

                    </button>

                </div>

            </div>

            `;

            usersList.innerHTML += html;

        });

    });

}

async function deleteUser(id){

    const confirmDelete =
    confirm("Delete this user?");

    if(!confirmDelete) return;

    await db.collection("users")
    .doc(id)
    .delete();

}
async function loadTrendingBases(){

    const container =
    document.getElementById(
        "trendingBases"
    );

    if(!container) return;

    const snapshot =
    await db.collection("bases")
    .orderBy("copyCount", "desc")
    .limit(5)
    .get();

    container.innerHTML = "";

    snapshot.forEach(doc => {

        const base = doc.data();

        const html = `

        <div class="base-item">

            <div class="base-left">

                <img src="${base.imageUrl}">

                <div>

                    <h3>
                        ${base.title}
                    </h3>

                    <p>
                        ${base.category}
                    </p>

                    <small>

                    Copies:
                    ${base.copyCount || 0}

                    </small>

                </div>

            </div>

        </div>

        `;

        container.innerHTML += html;

    });

}

db.collection("bases")
.onSnapshot(() => {

    loadStats();

});

db.collection("users")
.onSnapshot(() => {

    loadStats();

});

showSection("dashboard");

loadStats();

loadUsers();

loadTrendingBases();