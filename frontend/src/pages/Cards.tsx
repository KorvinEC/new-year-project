import styled from "styled-components";
import {Link} from "react-router-dom";
import {useGate, useUnit} from "effector-react";

import {CardInfo} from "./Card.tsx";
import {$cards, CardsGate, deleteCardEvent} from "../stores/Cards.ts";
import {CardData} from "../types";

const Container = styled.div`
    display: flex;
    outline: 1px solid black;
`

const CardContainer = styled.div`
    outline: 1px solid blue;
    padding: 10px;
    margin-bottom: 10px;
`

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
`

interface CardProps {
    data: CardData,
    id: number
}

const Card = ({data, id}: CardProps) => {
    const handleDelete = () => {
        deleteCardEvent(id);
    };

    return (
        <CardContainer>
            <CardHeader>
                <Link to={`/cards/${id}`}>
                    <h2>Card {id}</h2>
                </Link>
                <button onClick={handleDelete}>Delete</button>
            </CardHeader>
            {data.nominations.length > 0 && (
                <>
                    <h3>Nominations</h3>
                    <Container>
                        {data.nominations.map((data) => <CardInfo data={data} key={data.id}/>)}
                    </Container>
                </>
            )}
            {data.suggestions.length > 0 && (
                <>
                    <h3>Suggestions</h3>
                    <Container>
                        {data.suggestions.map((data) => <CardInfo data={data} key={data.id}/>)}
                    </Container>
                </>
            )}

        </CardContainer>
    )
}


const Cards = () => {
    useGate(CardsGate)
    const cards = useUnit($cards)

    console.log(cards)

    return (
        <div>
            <CardHeader>
                <h1>Cards</h1>
            </CardHeader>
            {
                cards.length ?
                    cards.map((card) => <Card data={card.data} id={card.id} key={card.id}/>) :
                    <h2>No cards</h2>
            }
        </div>
    )
}

export default Cards