setInterval(function () {
    let optionsElement = document.querySelector("body#home div.options");

    let aec = (optionsElement.children.length + 1) / 2;
    let hrec = (optionsElement.children.length - 1) / 2;

    let fae = optionsElement.children[0];
    let fhre = optionsElement.children[1];

    if (optionsElement.children.length > 0) {
        optionsElement.style.height = `${(fae?.offsetHeight || 0) * aec + (fhre?.offsetHeight || 0) * hrec + 2.5}px`;
        optionsElement.style.padding = "0 5px";
        optionsElement.style.border = "var(--b2p)";
    } else {
        optionsElement.style.height = "0px";
        optionsElement.style.padding = "0px";
        optionsElement.style.border = "unset";
    }
}, 100);

let unce = new Map();
let lastInput = "";

async function updateOptions(input) {
    let optionsElement = document.querySelector("body#home .options");
    let username = input?.value?.toLowerCase();
    lastInput = username;
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            if (lastInput == username) {
                resolve();
            } else { reject(); }
        }, 500);
    });
    // Show Loading Icon
    input.style.backgroundSize = "30px";
    input.style.paddingRight = "32px";
    // Get users data from API or from Cache
    let res = !username ? null : unce.get(username) ? { data: unce.get(username) } : await fetch(`/api/v1/search?username=${username}`).then(res => res.json()).catch(() => null);
    if (username != input?.value?.toLowerCase()) return;
    // Hide Loading Icon
    input.style.backgroundSize = "0px";
    input.style.paddingRight = "2px";
    // Empties the options list
    optionsElement.innerHTML = "";
    if (!res) return;
    if (Array.isArray(res.data)) {
        unce.set(username, res.data.slice(0, 5));
        for (di in res.data.slice(0, 5)) {
            optionsElement.insertAdjacentHTML(
                "beforeend",
                `<a href="/${res.data[di].username}"><img src="${res.data[di].avatar || res.data[di].url}">${res.data[di].username}</a>`
            );
            if (Number(di) + 1 != res.data.slice(0, 5).length) {
                optionsElement.insertAdjacentHTML("beforeend", "<hr>");
            }
        }
    }
}