import styled from "styled-components";
import {useParams} from "react-router-dom";
import {useGate, useUnit} from "effector-react";

import {$card, CardGate} from "../stores/Card.ts";
import {CardInfoType} from "../types";


const CardInfoContainer = styled.div`
    outline: 1px solid red;
    margin: 10px;
    padding: 10px;
`

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    outline: 1px solid black;
`

const CardContainer = styled.div`
    outline: 1px solid blue;
    padding: 10px;
    margin-bottom: 10px;
`

interface CardInfoProps {
    data: CardInfoType
}

export const CardInfo = ({data}: CardInfoProps) => {
    return (
        <CardInfoContainer>
            {data.title && <p>Title: {data.title}</p>}
            {data.subtitle && <p>Subtitle: {data.subtitle}</p>}
            {data.image_url && <img src={data.image_url} alt={data.title}/>}
            {data.description && <p>Description: {data.description}</p>}
        </CardInfoContainer>
    )
}

type CardProps = {
    cardId?: string
}

const Card = () => {
    const {cardId} = useParams<CardProps>()
    const cardIdNumber = Number(cardId)

    useGate(CardGate, cardIdNumber)

    const card = useUnit($card)

    return (
        card && <CardContainer>
            <h2>Card</h2>
            <h3>Nominations</h3>
            <Container>
                {card.data.nominations.map((data) => <CardInfo data={data} key={data.id}/>)}
            </Container>
            <h3>Suggestions</h3>
            <Container>
                {card.data.suggestions.map((data) => <CardInfo data={data} key={data.id}/>)}
            </Container>
            <button>Edit</button>
        </CardContainer>
    )
}

export default Card