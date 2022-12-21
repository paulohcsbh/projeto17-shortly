import { signUpSchema, signInSchema } from "../schemas/signSchema.js";

export function signUpValidation(req, res, next){
    const { name, email, password } = req.body;    

    const validation = signUpSchema.validate({
        name,
        email,
        password
    }, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message)
        return res.status(422).send(errors);
    }
    next();
};

export function signInValidation(req, res, next){
    const { email, password } = req.body;

    const validation = signInSchema.validate({
        email,
        password
    }, { abortEarly: false });
    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message)
        return res.status(422).send(errors);
    }
    next();
};