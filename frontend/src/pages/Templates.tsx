import styled from "styled-components"
import { useCardsTemplates } from "../hooks/useCards"
import { Link } from "@tanstack/react-router"

const TemplateDiv = styled.div`
  border: 2px solid;
`

const TemplatesList = () => {
  const { useCardsTemplatesQuery } = useCardsTemplates()

  const { data, error, isPending } = useCardsTemplatesQuery()

  if (isPending) {
    return <h1>Pending ...</h1>
  }

  if (error) {
    return <h1>Error: {JSON.stringify(error)}</h1>
  }

  return <>
    { data.map((cardTemplate, index) => 
      <TemplateDiv key={index}>
        { cardTemplate.structure.map((structure, index) => 
          <div key={index}>
            <p>Title: {structure.title}</p>
            <p>Subtitle: {structure.subtitle}</p>
          </div>
        ) }
      </TemplateDiv>
    ) }
  </>
}

export const Templates = () => {
  return <>
    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
      <h1 style={{display: "inline"}}>Templates</h1>
      <Link to="/templates/create">
        <h1 style={{display: "inline"}}>Create</h1>
      </Link>
    </div>
    <TemplatesList/>
  </>
}
