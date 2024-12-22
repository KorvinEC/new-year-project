import { useCards } from "../hooks/useCards"
import { CardFieldsType } from "../types/card"
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

const Card = (props: { nominations: CardFieldsType[], suggestions: CardFieldsType[] }) => {
  const { nominations, suggestions } = props

  return <CardContainer>
    <h1>Nominations:</h1>
    {nominations.map(field => <CardFields key={field.id} field={field} />)}
    {
      suggestions.length > 0 &&
      <div>
        <h1>Suggestions:</h1>
        {suggestions.map(field => <CardFields key={field.id} field={field} />)}
      </div>
    }
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
      <h1>Error:</h1>
      <p>{JSON.stringify(error)}</p>
    </>
  }

  return <>
    {
      data.map(({ id, data }) => <Card
        key={id}
        nominations={data.nominations}
        suggestions={data.suggestions}
      />)
    }
  </>
}

export const Cards = () => {
  return <>
    <h1>Cards</h1>
    <CardsList />
  </>
}
