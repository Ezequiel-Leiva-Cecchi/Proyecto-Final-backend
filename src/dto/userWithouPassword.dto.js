export class UserWithoutPasswordDTO {
    constructor({ id, username, email, role }) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
    }

    static fromModel(user) {
        return new UserWithoutPasswordDTO({
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        });
    }
}
