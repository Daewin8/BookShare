const currentUser = JSON.parse(localStorage.getItem("user")) || null;

function getUserId() {
    return currentUser?.id || null;
}

async function api(url, options = {}) {
    const res = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        ...options
    });

    return res.json();
}