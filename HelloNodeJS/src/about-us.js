export const about = function () {
    console.log('about function called');

    let button = document.createElement("button");
    button.innerText = "About";
    button.addEventListener("click", function () {
        let content = document.getElementById("content");
        content.innerHTML = button.innerText;
    });

    return button
}