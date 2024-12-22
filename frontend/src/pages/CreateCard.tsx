import { useNavigate } from "@tanstack/react-router"
import { ChangeEvent } from "react"
import { useCreateCard } from "../hooks/useCreateCard"
import styled from "styled-components"

interface NominationProps {
  index: number
  title: string
  subtitle: string
  description: string
}

const NominationContainer = styled.div`
  border: 2px solid;
  margin: 0px 0px 5px 0px;
  padding: 5px 5px 5px 5px;
`

const Nomination = (props: { structure: NominationProps }) => {
  const { changeCreateCard } = useCreateCard()

  return <NominationContainer>
    <p>Title: {props.structure.title}</p>
    <p>Subtitle: {props.structure.subtitle}</p>
    <label htmlFor="description">Description: </label>
    <input
      type="description"
      name="description"
      value={props.structure.description}
      onChange={event => changeCreateCard(
        "card_nominations_data",
        props.structure.index,
        "description",
        event.target.value
      )}
    />
  </NominationContainer>
}

const NominationsContainer = styled.div`
  border: 2px solid;
  margin: 0px 0px 5px 0px;
  padding: 5px 5px 5px 5px;
`

const Nominations = () => {
  const { createCard } = useCreateCard()

  return <NominationsContainer>
    <h2>Nominations:</h2>
    {
      createCard
        ? createCard.card_nominations_data.map((value, index) => <Nomination key={index} structure={{ ...value, index }} />)
        : <p>No items</p>
    }
  </NominationsContainer>
}

const Suggestions = () => {
  return <>
    <h2>Suggestions:</h2>
  </>
}

export const CreateCards = () => {
  const navigate = useNavigate({ from: "/cards/create" })
  const { createCard, createCardMutation } = useCreateCard()

  if (!createCard) {
    navigate({ to: "/templates" })
    return
  }

  const handleOnSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    createCardMutation.mutate(createCard)
    navigate({ to: "/cards" })
  }

  return <>
    <h1>Create card</h1>
    <form onSubmit={handleOnSubmit}>
      <Nominations />
      <Suggestions />
      <button type="submit">Submit</button>
    </form>
  </>
}
