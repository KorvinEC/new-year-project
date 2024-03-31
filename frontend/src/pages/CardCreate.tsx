import {useUnit} from "effector-react";
import {useNavigate} from "react-router-dom";

import {
    $createCardData,
    addCardSuggestion,
    removeCardSuggestion,
    submitCard,
    updateCardImage,
    updateCardNominationData,
    updateCardSuggestionData
} from "../stores/CardCreate.ts";
import {$template} from "../stores/Template.ts";
import React, {FormEvent} from "react";
import styled from "styled-components";

interface CardItemProps {
    structure: {
        title: string;
        subtitle: string;
        description: string;
    }
}

const CardItemContainer = styled.div`
    border: 1px solid black;
    padding: 10px;
    margin: 10px;
`

const CardNominationItem = ({structure, index}: CardItemProps & { index: number }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        updateCardNominationData({index, [name]: value});
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {files} = event.target;
        if (files) {
            updateCardImage({index, nomination: true, image: files[0]})
        }
    }

    return (
        <CardItemContainer>
            <label>Title: {structure.title}</label><br/>
            <label>Subtitle: {structure.subtitle}</label><br/>
            <label>Image: </label>
            <input
                type="file"
                name="image_url"
                onChange={handleImageChange}
            /><br/>
            <label>Description: </label>
            <input
                type="text"
                name="description"
                value={structure.description}
                onChange={handleChange}
            />
        </CardItemContainer>

    )
}

const CardSuggestionItem = ({structure, index}: CardItemProps) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        updateCardSuggestionData({index, name, value});
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {files} = event.target;
        if (files) {
            updateCardImage({index, nomination: false, image: files[0]})
        }
    }

    const handleRemove = () => {
        removeCardSuggestion(index);
    }

    return (
        <CardItemContainer>
            <label>Title:</label>
            <input
                type="text"
                name="title"
                value={structure.title}
                onChange={handleChange}
            />
            <br/>

            <label>Subtitle:</label>
            <input
                type="text"
                name="subtitle"
                value={structure.subtitle}
                onChange={handleChange}
            />
            <br/>

            <label>Image: </label>
            <input
                type="file"
                name="image_url"
                onChange={handleImageChange}
            />
            <br/>

            <label>Description: </label>
            <input
                type="text"
                name="description"
                value={structure.description}
                onChange={handleChange}
            />
            <br/>

            <button type="button" onClick={handleRemove}>Remove</button>
        </CardItemContainer>

    )
}

const CardNominationsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
`

const CardCreate = () => {
    const navigate = useNavigate();

    const template = useUnit($template);
    const createCardData = useUnit($createCardData);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Create Card');
        submitCard()
        navigate('/cards');
    }

    const handleAddSuggestion = () => {
        addCardSuggestion();
    }

    return (
        template && (
            <form onSubmit={handleSubmit}>
                <h3>Nominations</h3>
                <CardNominationsContainer>
                    {createCardData.card_nominations_data.map((structure, index) =>
                        <CardNominationItem key={index} index={index} structure={structure}/>
                    )}
                </CardNominationsContainer>

                <h3>Suggestions</h3>
                <CardNominationsContainer>
                    {createCardData.card_suggestions_data.map((structure, index) =>
                        <CardSuggestionItem key={index} index={index} structure={structure}/>
                    )}
                </CardNominationsContainer>
                <button type="button" onClick={handleAddSuggestion}>Add Suggestion</button>
                <button type="submit">Create Card</button>
            </form>
        )
    );
};

export default CardCreate;
