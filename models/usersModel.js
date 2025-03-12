const bcrypt = require('bcryptjs');

class User {
    constructor(name, email, password, profile_picture = null, account_created_date = new Date()) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.profile_picture = profile_picture;
        this.account_created_date = account_created_date;
    }

    static fromRow(row) {
        return new User(
            row.id,
            row.email,
            row.password,
            row.name,
            row.profile_picture,
            row.account_created_date
        );
    }

    static async hashPassword(password) {
        return await bcrypt.hash(password, 10);  
    }

    async checkPassword(password) {
        return bcrypt.compare(password, this.user_password);  
    }

    validate() {
        if (!this.username || !this.email || !this.password) {
            throw new Error('Missing required fields');
        }
    }

}

module.exports = User;