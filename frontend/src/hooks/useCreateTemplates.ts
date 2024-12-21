import { useAtom } from "jotai"
import { useCreateCardsTemplate } from "../api/cardsTemplates"
import { createTemplateAtom } from "../state/atoms"
import { useMutation } from "@tanstack/react-query"

export const useCreateTemplate = () => {
  const createCardsTemplate = useCreateCardsTemplate()

  const [ template, setTemplate ] = useAtom(createTemplateAtom)

  const addTemplateField = () => {
    setTemplate([...template, {title: "", subtitle: ""}])
  }

  const removeTemplateStructure = (removeIndex: number) => {
    setTemplate(template.filter(( _, index ) => (index !== removeIndex)))
  }

  const changeTemplateStructure = (index: number, name: string, value: string) => {
    setTemplate(template.map((item, i) => i === index ? {...item, [name]: value} : item))
  }

  const createCardsTemplateMutation = useMutation({
    mutationFn: createCardsTemplate,
  })

  return {
    template,
    setTemplate,
    addTemplateField,
    removeTemplateStructure,
    changeTemplateStructure,
    createCardsTemplateMutation,
  }
}
