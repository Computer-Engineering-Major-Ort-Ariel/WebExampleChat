import { send } from "../utilities";

let usernameInput = document.querySelector("#usernameInput") as HTMLInputElement;
let passwordInput = document.querySelector("#passwordInput") as HTMLInputElement;
let colorInput = document.querySelector("#colorInput") as HTMLInputElement;
let submitButton = document.querySelector("#submitButton") as HTMLButtonElement;

submitButton.onclick = async function() {
  let userId = await send("signup", [usernameInput.value, passwordInput.value, colorInput.value]);

  localStorage.setItem("userId", userId);

  location.href = "/website/pages/index.html";
}