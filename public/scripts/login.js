const form = document.getElementById("authForm");

const title = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const toggleMessage = document.getElementById("toggleMessage");
const toggleBtn = document.getElementById("toggleBtn");

let isLogin = true;

function updateFormMode() {
    if (isLogin) {
        title.textContent = "Login";
        submitBtn.textContent = "Login";
        toggleMessage.textContent = "Don't have an account?";
        toggleBtn.textContent = "Sign up";
    } else {
        title.textContent = "Sign Up";
        submitBtn.textContent = "Create Account";
        toggleMessage.textContent = "Already have an account?";
        toggleBtn.textContent = "Login";
    }
}

toggleBtn.addEventListener("click", () => {
    isLogin = !isLogin;
    updateFormMode();
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Username and password are required.");
        return;
    }

    const endpoint = isLogin ? "/api/user/login" : "/api/user/register";

    try {
        const res = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Something went wrong");
            return;
        }

        localStorage.setItem("user", JSON.stringify(data));

        alert(isLogin ? "Logged in!" : "Account created!");

        window.location.href = "index.html";

    } catch (err) {
        console.error("Auth error:", err);
        alert("Server error");
    }
});

function goHome() {
    window.location.href = "index.html";
}

window.goHome = goHome;

updateFormMode();