import { body, validationResult } from "express-validator";

const userValidation = async (req, res, next) => {

    //set up the rules
    const rules = [
        body("name").trim().notEmpty().withMessage("Name is Required"),
        body("email").isEmail().withMessage("Email is Required"),
        body("password").trim().notEmpty().withMessage("Password is Required")
    ];

    //run those rules
    await Promise.all(rules.map(rule => rule.run(req)));

    //check if there are any errors after running those rules
    let validationErrors = validationResult(req);


    if(!validationErrors.isEmpty()){

        return res.render("register", {errorMessages: validationErrors.array().errors});
    }

    next();

}

export default userValidation;