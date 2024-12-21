import { atom, useAtom } from "jotai"

type CreateTemplateType = {
  title: string
  subtitle: string
}

const createTemplateAtom = atom<CreateTemplateType[]>([{title: "", subtitle: ""}])

const useCreateTemplate = () => {
  const [ template, setTemplate ] = useAtom(createTemplateAtom)

  const addTemplateField = () => {
    setTemplate([...template, {title: "", subtitle: ""}])
  }

  const removeTemplateField = (removeIndex: number) => {
    setTemplate(template.filter(( _, index ) => (index !== removeIndex)))
  }

  const changeTemplateField = (index: number, name: string, value: string) => {
    setTemplate(template.map((item, i) => i === index ? {...item, [name]: value} : item))
  }

  return {
    template,
    setTemplate,
    addTemplateField,
    removeTemplateField,
    changeTemplateField,
  }
}

const CreateTemplateForm = () => {
  const { template, addTemplateField, removeTemplateField, changeTemplateField } = useCreateTemplate()

  return <>
    <form>
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
                onChange={event => changeTemplateField(index, event.target.name, event.target.value)}
              />
              <br/>

              <label>Subtitle:</label>
              <input 
                id="subtitle"
                name="subtitle"
                type="text"
                value={templateField.subtitle}
                onChange={event => changeTemplateField(index, event.target.name, event.target.value)}
              />
              <br/>

              <button 
                type="button" 
                onClick={() => removeTemplateField(index)}
              >
                Remove
              </button>
            </div>
          ) 
        ) 
      }
      <button type="button" onClick={addTemplateField}>Add</button>
      <button type="submit">Submit</button>
    </form>
  </>
}

export const CreateTemplate = () => {
  return <>
    <h1>Create template</h1>
    <CreateTemplateForm/>
  </>
}
