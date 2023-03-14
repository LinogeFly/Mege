import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { alertService } from "../../services/alert";
import auth from "../../services/auth";
import { logError } from "../../services/logger";
import styles from './login.module.css';

type Inputs = {
    email: string,
    password: string
};

function Login() {
    const history = useHistory();
    const { register, handleSubmit, resetField, setError, formState: { errors } } = useForm<Inputs>();
    const [disabled, setDisabled] = useState(false);

    function onSubmit(inputs: Inputs) {
        setDisabled(true);

        auth.login(inputs.email, inputs.password)
            .then(() => history.push('/'))
            .catch((error) => {
                setDisabled(false);
                resetField("password");

                if (axios.isAxiosError(error) && error.response?.status === 400) {
                    setError("password", { type: "invalidCredentials" });
                    setError("email", { type: "invalidCredentials" });

                    return;
                }

                alertService.error("Unable to sign in. Try again later.");
                logError(error);
            });
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
            <fieldset disabled={disabled}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" id="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        {...register("email", { required: true })}>
                    </input>
                    {errors.email && errors.email.type === "required" &&
                        <div className="invalid-feedback">
                            Please enter your email address.
                        </div>
                    }
                    {errors.email && errors.email.type === "invalidCredentials" &&
                        <div className="invalid-feedback">
                            Invalid credentials.
                        </div>
                    }
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" id="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        {...register("password", { required: true })}>
                    </input>
                    {errors.password && errors.password.type === "required" &&
                        <div className="invalid-feedback">
                            Please enter your password.
                        </div>
                    }
                    {errors.password && errors.password.type === "invalidCredentials" &&
                        <div className="invalid-feedback">
                            Invalid credentials.
                        </div>
                    }
                </div>
                <button type="submit" className="btn btn-primary w-100">Sign in</button>
            </fieldset>
        </form>
    );
}

export default Login;