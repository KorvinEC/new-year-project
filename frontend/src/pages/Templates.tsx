import styled from "styled-components"
import { useCardsTemplates } from "../hooks/useCardsTemplates"
import { Link, useNavigate } from "@tanstack/react-router"
import { useSetAtom } from "jotai"
import { createCardAtom } from "../state/atoms"

const TemplateDiv = styled.div`
  border: 2px solid;
`

const TemplatesList = () => {
  const navigate = useNavigate({ from: "/templates" })

  const setCreateAtom = useSetAtom(createCardAtom)

  const { useCardsTemplatesQuery, cardsTemplatesRemoveMutation } = useCardsTemplates()

  const { data, error, isPending } = useCardsTemplatesQuery()

  if (isPending) {
    return <h1>Pending ...</h1>
  }

  if (error) {
    return <>
      <h1>Error:</h1>
      <p>{JSON.stringify(error)}</p>
    </>
  }

  const handleRemoveTemplate = (templateId: number) => {
    cardsTemplatesRemoveMutation.mutate(templateId)
  }

  const handleCreateTemplate = (templateId: number) => {
    const item = data.find(item => item.id === templateId)
    if (item === undefined || item === null) {
      return
    }
    setCreateAtom({
      card_template_id: item.id,
      card_nominations_data: item.structure.map((structure => { return { ...structure, description: ""} })),
      card_suggestions_data: []
    })
    navigate({ to: "/cards/create" })
  }

  return <>
    {
      data.map(
        cardTemplate =>
          <TemplateDiv key={cardTemplate.id}>
            {cardTemplate.structure.map((structure, index) =>
              <div key={index}>
                <p>Title: {structure.title}</p>
                <p>Subtitle: {structure.subtitle}</p>
              </div>
            )}
            <button type="submit" onClick={() => handleRemoveTemplate(cardTemplate.id)}>Remove</button>
            <button type="submit" onClick={() => handleCreateTemplate(cardTemplate.id)}>Create Card</button>
          </TemplateDiv>
      )
    }
  </>
}

export const Templates = () => {
  return <>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h1 style={{ display: "inline" }}>Templates</h1>
      <Link to="/templates/create">
        <h1 style={{ display: "inline" }}>Create</h1>
      </Link>
    </div>
    <TemplatesList />
  </>
}
