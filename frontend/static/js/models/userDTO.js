export default class UserDTO {
    constructor(id, username, password, name, isAdmin) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.name = name;
        this.isAdmin = isAdmin;
    }
}
