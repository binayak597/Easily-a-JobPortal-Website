import UserModel from "../models/users.model.js";

export default class UserController{

    //get signup page

    getRegisterForm = (req, res) => {
        return res.render("register", {errorMessages: null});
    }

    //get login page

    getLoginForm = (req, res) => {
        return res.render("login", {errorMessage: null});
    }

    //post signup form data

    postRegisterForm = (req, res) => {
        
        UserModel.addUser(req.body);
        return res.redirect("/login");
    }

    //post login form data

    postLoginForm = (req, res) => {
        const {email, password} = req.body;
        const userFound = UserModel.findUser(email, password);
        if(userFound){
            req.session.userEmail = email;
            req.session.userName = userFound.name;

            //create a custom cookie and send to client
            res.cookie("typeOfUser", userFound.type, {
                maxAge: 2 * 24 * 60 * 60 * 1000
            });
            return res.redirect("/");
        }
        return res.render("/login", {errorMessage: "Invalid Credientials"});
    }

    //logout
    
    logout = (req, res) => {

        //destory the session
        req.session.destroy(err => {
            if(err){
                console.log(err);
            }else{
                //clear the cookies
                res.clearCookie("typeOfUser");
                res.redirect("/login");  
            }
        });
    }
}