import { User } from "./User";

const user = new User('海老原', '賢次', 44);

const contentsElem = document.getElementById('contents');
if(!!contentsElem) {
    contentsElem.innerText = `${user.familyName} ${user.givenName}`;
}
