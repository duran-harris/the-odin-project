export const home = function () {
    console.log('home function called');

    let button = document.createElement("button");
    button.innerText = "Home";
    button.addEventListener("click", function () {
        let content = document.getElementById("content");
        content.innerHTML = button.innerText;
    });

    return button
}