import { send } from "../utilities";

let historyDiv = document.querySelector("#historyDiv") as HTMLDivElement;
let messageTextarea = document.querySelector("#messageTextarea") as HTMLTextAreaElement;
let sendButton = document.querySelector("#sendButton") as HTMLButtonElement;
let messageDiv = document.querySelector("#messageDiv") as HTMLDivElement;
let warningDiv = document.querySelector("#warningDiv") as HTMLDivElement;
let userDiv = document.querySelector("#userDiv") as HTMLDivElement;
let usernameDiv = document.querySelector("#usernameDiv") as HTMLDivElement;
let logoutButton = document.querySelector("#logoutButton") as HTMLButtonElement;


let userId = localStorage.getItem("userId");

let userExists = false;
if (userId != null) {
  userExists = await send("userExists", userId) as boolean;
}

if (userExists) {
  userDiv.style.display = "block";
  messageDiv.style.display = "block";

  let username = await send("getUsername", userId)
  usernameDiv.innerText = "Logged In as " + username;
}
else {
  localStorage.removeItem("userId");
  warningDiv.style.display = "block";
}

sendButton.onclick = async function () {
  await send("sendMessage", [localStorage.getItem("userId"), messageTextarea.value]);

  messageTextarea.value = "";

  await getMessages();
}

logoutButton.onclick = async function () {
  localStorage.removeItem("userId");

  location.reload();
}

let getMessages = async function () {
  let [messages, names, colors] = await send("getMessages", null) as [string[], string[], string[]];

  historyDiv.innerHTML = "";

  for (let i = 0; i < messages.length; i++) {
    let entry = document.createElement("div");
    entry.classList.add("entry");
    historyDiv.appendChild(entry);

    let nameCircle = document.createElement("div");
    nameCircle.classList.add("nameCircle");
    nameCircle.innerText = names[i][0];
    nameCircle.style.backgroundColor = colors[i];
    entry.appendChild(nameCircle);

    let bobble = document.createElement("div");
    bobble.classList.add("bobble");
    bobble.innerText = names[i] + ": " + messages[i];
    entry.appendChild(bobble);
  }
}

getMessages();

setInterval(() => {
  getMessages();
}, 5000);
