export const contact = function () {
    console.log('contact function called');

    let button = document.createElement("button");
    button.innerText = "Contact us";
    button.addEventListener("click", function () {
        let content = document.getElementById("content");
        content.innerHTML = button.innerText;
    });

    return button
}