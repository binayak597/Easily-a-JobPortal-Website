
export default class UserModel{

    constructor(_id, _name, _email, _password, _type){

        this.id = _id;
        this.name = _name;
        this.email = _email;
        this.password = _password;
        this.type = _type;
    }

    static addUser = (userData) => {
        const {name, email, password, type} = userData;

        const newUser = new UserModel(users.length + 1, name, email, password, type);
        users.push(newUser);
    }

    static findUser = (email, password) => {

        return users.find(user => user.email === email && user.password === password);
    }

    static findByEmail = (email) => {
        return users.find(user => user.email === email);
    }
}

let users = [
    {
        id: 1,
        name: "xyz",
        email: "xyz@gmail.com",
        password: "12345",
        type: "Recruiter"
    },
    {
        id: 2,
        name: "abc",
        email: "abc@gmail.com",
        password: "12345",
        type: "Seeker" 
    }
];