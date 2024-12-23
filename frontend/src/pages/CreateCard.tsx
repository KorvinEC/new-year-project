import { useNavigate } from "@tanstack/react-router"
import { ChangeEvent } from "react"
import { useCreateCard } from "../hooks/useCreateCard"
import styled from "styled-components"

interface FieldProps {
  index: number
  title: string
  subtitle: string
  description: string
}

const CardFieldContainer = styled.div`
  border: 2px solid;
  margin: 0px 0px 5px 0px;
  padding: 5px 5px 5px 5px;
`

const Nomination = (props: { structure: FieldProps }) => {
  const { changeCreateCard, addImageToCard } = useCreateCard()

  const handleImageFile = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length != 1) { return }
    addImageToCard(index, "nominations", event.target.files[0])
  }

  return <CardFieldContainer>
    <div style={{ display: "flex" }}>
      <p style={{ margin: "0px 0px 0px 0px" }}>title: {props.structure.title}</p>
    </div>
    <div style={{ display: "flex" }}>
      <input 
        type="file"
        datatype="image"
        onChange={(e) => handleImageFile(props.structure.index, e)}
      />
    </div>
    <div style={{ display: "flex" }}>
      <p style={{ margin: "0px 0px 0px 0px" }}>subtitle: {props.structure.subtitle}</p>
    </div>
    <div style={{ display: "flex" }}>
      <label htmlFor="description">description: </label>
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
    </div>
  </CardFieldContainer>
}

const Suggestion = (props: { structure: FieldProps }) => {
  const { changeCreateCard, removeSuggestionField, addImageToCard } = useCreateCard()

  const handleImageFile = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length != 1) { return }
    addImageToCard(index, "suggestions", event.target.files[0])
  }

  return <CardFieldContainer>
    <div style={{ display: "flex" }}>
      <label htmlFor="title">title: </label>
      <input
        type="text"
        name="title"
        value={props.structure.title}
        onChange={event => changeCreateCard(
          "card_suggestions_data",
          props.structure.index,
          "title",
          event.target.value
        )}
      />
    </div>
    <div style={{ display: "flex" }}>
      <input 
        type="file"
        datatype="image"
        onChange={(e) => handleImageFile(props.structure.index, e)}
      />
    </div>
    <div style={{ display: "flex" }}>
      <label htmlFor="subtitle">subtitle: </label>
      <input
        type="text"
        name="subtitle"
        value={props.structure.subtitle}
        onChange={event => changeCreateCard(
          "card_suggestions_data",
          props.structure.index,
          "subtitle",
          event.target.value
        )}
      />
    </div>
    <div style={{ display: "flex" }}>
      <label htmlFor="description">description: </label>
      <input
        type="text"
        name="description"
        value={props.structure.description}
        onChange={event => changeCreateCard(
          "card_suggestions_data",
          props.structure.index,
          "description",
          event.target.value
        )}
      />
    </div>
    <button type="button" onClick={() => removeSuggestionField(props.structure.index)}>Remove</button>
  </CardFieldContainer>
}

const FieldContainer = styled.div`
  border: 2px solid;
  margin: 0px 0px 5px 0px;
  padding: 5px 5px 5px 5px;
`

const FieldListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`

const Nominations = () => {
  const { createCard } = useCreateCard()

  return <FieldContainer>
    <h2>Nominations:</h2>
    <FieldListContainer>
      {
        createCard
          ? createCard.card_nominations_data.map((value, index) => <Nomination key={index} structure={{ ...value, index }} />)
          : <p>No items</p>
      }
    </FieldListContainer>
  </FieldContainer>
}

const Suggestions = () => {
  const { createCard, addSuggestionField } = useCreateCard()

  return <FieldContainer>
    <h2>Suggestions:</h2>
    <FieldListContainer>
      {
        createCard
          ? createCard.card_suggestions_data.map((value, index) => <Suggestion key={index} structure={{ ...value, index }} />)
          : <p>No items</p>
      }
    </FieldListContainer>
    <button type="button" onClick={addSuggestionField}>Add</button>
  </FieldContainer>
}

export const CreateCards = () => {
  const navigate = useNavigate({ from: "/cards/create" })
  const { createCard, createCardMutation } = useCreateCard()

  if (createCardMutation.isSuccess) {
    console.log("createCardMutation.isSuccess");
    navigate({ to: "/cards" })
  }

  if (!createCard && createCardMutation.isIdle) {
    console.log("/templates");
    navigate({ to: "/templates" })
  }

  const handleOnSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    createCardMutation.mutate()
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
