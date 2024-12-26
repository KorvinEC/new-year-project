import { useNavigate } from "@tanstack/react-router"
import { ChangeEvent } from "react"
import { useCreateTemplate } from "../hooks/useCreateTemplates"
import styled from "styled-components"
import { TemplateStructureType } from "../types/cardTemplate"


const NominationContainer = styled.div`
  border: 2px solid;
  margin: 0px 0px 5px 0px;
  padding: 5px 5px 5px 5px;
`

const Nomination = ({ templateField, index }: { templateField: TemplateStructureType, index: number }) => {
  const { removeTemplateStructure, changeTemplateStructure } = useCreateTemplate()

  return <NominationContainer>
    <div style={{ display: "flex" }}>
      <label>Title:</label>
      <input
        id="title"
        name="title"
        type="text"
        value={templateField.title}
        onChange={event => changeTemplateStructure(index, event.target.name, event.target.value)}
      />
    </div>
    <div style={{ display: "flex" }}>
      <label>Subtitle:</label>
      <input
        id="subtitle"
        name="subtitle"
        type="text"
        value={templateField.subtitle}
        onChange={event => changeTemplateStructure(index, event.target.name, event.target.value)}
      />
    </div>
    <button
      type="button"
      onClick={() => removeTemplateStructure(index)}
    >
      Remove
    </button>
  </NominationContainer>
}

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`

const Container = styled.div`
  border: 2px solid;
  margin: 0px 0px 5px 0px;
  padding: 5px 5px 5px 5px;
`

const CreateTemplateForm = () => {
  const navigate = useNavigate({ from: "/templates/create" })
  const { template, addTemplateField, createCardsTemplateMutation } = useCreateTemplate()

  const handleOnSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    createCardsTemplateMutation.mutate(template)
  }

  if (createCardsTemplateMutation.isSuccess) {
    navigate({ to: "/templates" })
  }

  return <>
    <form onSubmit={handleOnSubmit}>
      <Container>
        <ListContainer>
          {
            template.map(
              (templateField, index) => (
                <Nomination templateField={templateField} key={index} index={index} />
              )
            )
          }
        </ListContainer>
        <button type="button" onClick={addTemplateField}>Add</button>
      </Container>
      <button type="submit">
        {createCardsTemplateMutation.isPending ? "Submiting ..." : "Submit"}
      </button>
    </form>
  </>
}

export const CreateTemplate = () => {
  return <>
    <h1>Create template</h1>
    <CreateTemplateForm />
  </>
}
