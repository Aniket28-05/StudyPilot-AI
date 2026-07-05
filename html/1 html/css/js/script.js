// Search functionality (basic demo)
const searchBox = document.querySelector(".search");

searchBox.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        let query = searchBox.value.trim();

        if (query !== "") {
            alert("Searching for: " + query);
        } else {
            alert("Please enter something!");
        }
    }
});

// Navbar scroll effect
window.addEventListener("scroll", function () {
    const header = document.querySelector("header");

    if (window.scrollY > 50) {
        header.style.backgroundColor = "#fff";
        header.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
    } else {
        header.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
    }
});

// Fade-in animation on load
window.addEventListener("load", () => {
    document.body.classList.add("loaded");
});