import { useNavigate } from "@tanstack/react-router"
import { ChangeEvent } from "react"
import { useCreateTemplate } from "../hooks/useCreateTemplates"


const CreateTemplateForm = () => {
  const navigate = useNavigate({ from: "/templates/create" })
  const {
    template,
    addTemplateField,
    removeTemplateStructure,
    changeTemplateStructure,
    createCardsTemplateMutation } = useCreateTemplate()

  const handleOnSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    createCardsTemplateMutation.mutate(template)
  }

  if (createCardsTemplateMutation.isSuccess) {
    navigate({ to: "/templates" })
  }

  return <>
    <form onSubmit={handleOnSubmit}>
      {
        template.map(
          (templateField, index) => (
            <div key={index}>
              <label>Title:</label>
              <input
                id="title"
                name="title"
                type="text"
                value={templateField.title}
                onChange={event => changeTemplateStructure(index, event.target.name, event.target.value)}
              />
              <br />

              <label>Subtitle:</label>
              <input
                id="subtitle"
                name="subtitle"
                type="text"
                value={templateField.subtitle}
                onChange={event => changeTemplateStructure(index, event.target.name, event.target.value)}
              />
              <br />

              <button
                type="button"
                onClick={() => removeTemplateStructure(index)}
              >
                Remove
              </button>
            </div>
          )
        )
      }
      <button type="button" onClick={addTemplateField}>Add</button>
      <br/>
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
