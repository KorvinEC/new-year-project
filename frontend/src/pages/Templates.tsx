import styled from "styled-components"
import { useCardsTemplates } from "../hooks/useCardsTemplates"
import { Link, useNavigate } from "@tanstack/react-router"
import { useSetAtom } from "jotai"
import { createCardAtom } from "../state/atoms"
import { TemplateStructureType } from "../types/cardTemplate"
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

const UserContainer = ({ user }: { user: UserType }) => {
  return <UserContainerStyle>
    {
      user.image &&
      <img src={user.image.url} alt="Users icon" className="icon-image" />
    }
    <span className="no-margin"> User: {user.nickname}</span>
  </UserContainerStyle>
}

const TemplateFieldsContainer = styled.div`
  border: 2px solid;
  margin: 0px 0px 5px 0px;
  padding: 5px 5px 5px 5px;
`

const TextField = styled.p`
  margin: 0px 0px 0px 0px;
`

const TemplateFields = ({ structure }: { structure: TemplateStructureType }) => {

  return <TemplateFieldsContainer>
    <TextField>Title: {structure.title}</TextField>
    <TextField>Subtitle: {structure.subtitle}</TextField>
  </TemplateFieldsContainer>
}

const TemplateContainer = styled.div`
  border: 2px solid;
  margin: 0px 0px 10px 0px;
  padding: 5px 10px 10px 10px;
`

const TemplateListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
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
      card_nominations_data: item.structure.map((structure => { return { ...structure, description: "" } })),
      card_suggestions_data: []
    })
    navigate({ to: "/cards/create" })
  }

  return <>
    {
      data.map(
        cardTemplate =>
          <TemplateContainer key={cardTemplate.id}>
            <UserContainer user={cardTemplate.user} />
            <TemplateListContainer>
              {cardTemplate.structure.map((structure, index) => <TemplateFields key={index} structure={structure} />)}
            </TemplateListContainer>
            <button type="submit" onClick={() => handleRemoveTemplate(cardTemplate.id)}>Remove</button>
            <button type="submit" onClick={() => handleCreateTemplate(cardTemplate.id)}>Create Card</button>
          </TemplateContainer>
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
