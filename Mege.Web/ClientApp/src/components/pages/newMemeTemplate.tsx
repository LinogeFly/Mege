import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from 'axios';
import { NewMemeTemplateResponse } from '../../types/api';
import { logError } from '../../services/logger';
import { alertService } from '../../services/alert';

type Inputs = {
    name: string,
    image: FileList
};

function NewMemeTemplate() {
    const history = useHistory();
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    const [disabled, setDisabled] = useState(false);

    function onSubmit(inputs: Inputs) {
        setDisabled(true);

        const abortController = new AbortController();
        const formData = new FormData();

        formData.append("name", inputs.name);
        formData.append("image", inputs.image.item(0)!, inputs.image.item(0)!.name);

        axios.post<NewMemeTemplateResponse>('/api/memetemplates', formData, { signal: abortController.signal })
            .then(response => {
                history.push(`/meme/${response.data.id}`);
            })
            .catch(error => {
                if (axios.isCancel(error))
                    return;

                logError(error);
                alertService.error("Unable to create new meme template. Try again later.");
                setDisabled(false);
            });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <fieldset disabled={disabled}>
                <div className="mb-3">
                    <label htmlFor="memeTemplateName" className="form-label">Meme template name</label>
                    <input type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        id="memeTemplateName"
                        placeholder="For example, Surprised Pikachu"
                        maxLength={64}
                        autoComplete="off"
                        {...register("name", { required: true })}
                    ></input>
                    {errors.name &&
                        <div className="invalid-feedback">
                            Please choose a meme template name.
                        </div>
                    }
                </div>
                <div className="mb-3">
                    <label htmlFor="memeTemplateImage" className="form-label">Meme template image</label>
                    <input type="file"
                        className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                        id="memeTemplateImage"
                        {...register("image", { required: true })}
                    ></input>
                    {errors.image &&
                        <div className="invalid-feedback">
                            Please choose a meme template image.
                        </div>
                    }
                </div>
                <button type="submit" className="btn btn-primary">Upload</button>
            </fieldset>
        </form>
    );
}

export default NewMemeTemplate;
