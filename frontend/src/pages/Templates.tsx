import { useGate, useUnit } from "effector-react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { $templates, deleteTemplateEvent, selectTemplateEvent, TemplatesGate } from "../stores/Templates.ts";
import { TemplateStructureType, TemplateType } from "../types";


const TemplateStructureContainer = styled.div`
  outline: 1px solid red;
  padding: 10px;
  margin: 10px;
`

const TemplateListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  outline: 1px solid black;
  padding: 10px;
`

const TemplateItemContainer = styled.div`
  outline: 1px solid blue;
  padding: 10px;
  margin: 10px;
`

const TemplateHeader = styled.div`
  display: flex;
  justify-content: space-between;
`

const SpacerDiv = styled.div`
  flex-grow: 1;
`

interface TemplateStructureProps {
    structure: TemplateStructureType
}

const TemplateStructure = ({structure}: TemplateStructureProps) => {
    return (
        <TemplateStructureContainer>
            <p>Title: {structure.title}</p>
            <p>Subtitle: {structure.subtitle}</p>
        </TemplateStructureContainer>
    )
}

interface TemplateItemProps {
    template: TemplateType,
}

const TemplateItem = ({template}: TemplateItemProps) => {

    const navigate = useNavigate();

    const handleDeleteTemplate = (selectedId: number) => {
        deleteTemplateEvent(selectedId)
    }

    const handleCreateCard = (selectedId: number) => {
        selectTemplateEvent(selectedId);
        navigate('/cards/create');
    };

    return (
        <TemplateItemContainer>
            <TemplateHeader>
                <h2>Template {template.id}</h2>
                <SpacerDiv/>
                <button onClick={() => handleDeleteTemplate(template.id)}>Delete</button>
                <button onClick={() => handleCreateCard(template.id)}>Create Card</button>
            </TemplateHeader>
            <TemplateListContainer>
                {
                    template.structure.map(
                        (structure, index) =>
                            <TemplateStructure key={index} structure={structure}/>
                    )
                }
            </TemplateListContainer>
        </TemplateItemContainer>
    )
}

const TemplatesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  outline: 1px solid black;
  padding: 10px;
`

const Templates = () => {
    useGate(TemplatesGate)
    const templates = useUnit($templates)

    return (
        <>
            <TemplateHeader>
                <h1>Templates</h1>
                <h1><Link to={'/templates/create'}>Create</Link></h1>
            </TemplateHeader>
            <TemplatesContainer>
                {templates.length ? templates.map((template) => <TemplateItem template={template} key={template.id}/>) :
                    <h2>No templates</h2>}
            </TemplatesContainer>
        </>
    )
}

export default Templates