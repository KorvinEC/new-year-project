import React from "react";
import { useUnit } from 'effector-react';
import { useNavigate } from "react-router-dom";

import {
    $structure,
    addFieldEvent,
    changeFieldEvent,
    removeFieldEvent,
    submitEvent
} from '../stores/TemplateCreate.ts';

const TemplateCreate = () => {
    const structure = useUnit($structure);
    const navigate = useNavigate();

    const handleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        changeFieldEvent({index, name: event.target.name, value: event.target.value});
    };

    const handleAddFields = () => {
        addFieldEvent();
    };

    const handleRemoveFields = (index: number) => {
        removeFieldEvent(index);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        submitEvent();
        navigate('/templates');
    };

    return (
        <form onSubmit={handleSubmit}>
            {structure.map((item, index) => (
                <div key={index}>
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={item.title}
                        onChange={event => handleChange(index, event)}
                    />
                    <label htmlFor="subtitle">Subtitle</label>
                    <input
                        type="text"
                        name="subtitle"
                        value={item.subtitle}
                        onChange={event => handleChange(index, event)}
                    />
                    <button type="button" onClick={() => handleRemoveFields(index)}>Remove</button>
                </div>
            ))}
            <button type="button" onClick={handleAddFields}>Add</button>
            <button type="submit">Submit</button>
        </form>
    );
};

export default TemplateCreate;
