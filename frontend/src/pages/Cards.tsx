import { useCards } from "../hooks/useCards"
import { CardFieldsType, CardType } from "../types/card"
import styled from "styled-components"
import { UserType } from "../types/user"

const UserContainerStyle = styled.div`
  border: 2px solid;
  padding: 5px 5px 5px 5px;
  margin: 0px 0px 5px 0px;

  .no-margin {
    margin: 0px 0px 0px 0px;
  }

  .icon-image {
    display: inline-block;
    width: 64px;
    height: 64px;
  }
`

export const UserContainer = ({ user }: { user: UserType }) => {
  return <UserContainerStyle>
    {
      user.image &&
      <img src={user.image.url} alt="Users icon" className="icon-image" />
    }
    <span className="no-margin"> User: {user.nickname}</span>
  </UserContainerStyle>
}


const CardFieldsContainer = styled.div`
  border: 2px solid;
  margin: 0px 0px 5px 0px;
  padding: 5px 5px 5px 5px;
`

const TextField = styled.p`
  margin: 0px 0px 0px 0px;
`

const CardFields = (props: { field: CardFieldsType }) => {
  const { field } = props

  return <CardFieldsContainer>
    <TextField>Title: {field.title}</TextField>
    {
      field.image_url &&
      <img src={field.image_url} style={{ width: "100%" }} />
    }
    <TextField>Subtitle: {field.subtitle}</TextField>
    <TextField>Description: {field.description}</TextField>
  </CardFieldsContainer>
}

const CardContainer = styled.div`
  border: 2px solid;
  margin: 0px 0px 10px 0px;
  padding: 5px 10px 10px 10px;
`

const CardListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`

const Card = (props: { card: CardType }) => {
  const { card } = props
  const { nominations, suggestions } = card.data
  const { removeCardMutation } = useCards()

  return <CardContainer>
    <UserContainer user={card.user} />
    <h2>Nominations:</h2>
    <CardListContainer>
      {nominations.map(field => <CardFields key={field.id} field={field} />)}
    </CardListContainer>
    {
      suggestions.length > 0 &&
      <div>
        <h2>Suggestions:</h2>
        <CardListContainer>
          {suggestions.map(field => <CardFields key={field.id} field={field} />)}
        </CardListContainer>
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
