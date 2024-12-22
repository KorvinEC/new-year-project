import { useCards } from "../hooks/useCards"
import { CardFieldsType, CardType } from "../types/card"
import styled from "styled-components"

const CardFieldsContainer = styled.div`
  border: 2px solid;
  margin: 0px 0px 5px 0px;
  padding: 5px 5px 5px 5px;
`

const CardFields = (props: { field: CardFieldsType }) => {
  const { field } = props

  return <CardFieldsContainer>
    <p>Title: {field.title}</p>
    <p>Subtitle: {field.subtitle}</p>
    <p>Description: {field.description}</p>
  </CardFieldsContainer>
}

const CardContainer = styled.div`
  border: 2px solid;
  margin: 0px 0px 10px 0px;
  padding: 5px 10px 10px 10px;
`

const Card = (props: { card: CardType }) => {
  const { card } = props
  const { nominations, suggestions } = card.data
  const { removeCardMutation } = useCards()

  return <CardContainer>
    <h2>Nominations:</h2>
    {nominations.map(field => <CardFields key={field.id} field={field} />)}
    {
      suggestions.length > 0 &&
      <div>
        <h2>Suggestions:</h2>
        {suggestions.map(field => <CardFields key={field.id} field={field} />)}
      </div>
    }
    <button type="submit" onClick={() => removeCardMutation.mutate(props.card.id)}>Remove</button>
  </CardContainer>
}

const CardsList = () => {
  const { useCardsQuery } = useCards()

  const { data, isPending, isError, error } = useCardsQuery()

  if (isPending) {
    return <h1>Pending ...</h1>
  }

  if (isError) {
    return <>
      <h2>Error:</h2>
      <p>{JSON.stringify(error)}</p>
    </>
  }

  return <>
    {
      data.length > 0 
      ? data.map(value => <Card key={value.id} card={value} />)
      : <h2>No cards</h2>
    }
  </>
}

export const Cards = () => {
  return <>
    <h1>Cards</h1>
    <CardsList />
  </>
}
