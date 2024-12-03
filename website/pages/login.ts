import { send } from "../utilities";

let usernameInput = document.querySelector("#usernameInput") as HTMLInputElement;
let passwordInput = document.querySelector("#passwordInput") as HTMLInputElement;
let submitButton = document.querySelector("#submitButton") as HTMLButtonElement;
let messageDiv = document.querySelector("#messageDiv") as HTMLDivElement;

submitButton.onclick = async function() {
  let userId = await send("login", [usernameInput.value, passwordInput.value]) as string | null;

  if (userId != null) {
    localStorage.setItem("userId", userId);

    location.href = "/website/pages/index.html";
  }
  else {
    messageDiv.innerText = "User does not exist.";
  }
}