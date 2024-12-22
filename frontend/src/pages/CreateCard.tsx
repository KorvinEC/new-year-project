import { useAtom } from "jotai"
import { useNavigate } from "@tanstack/react-router"
import { createCardAtom } from "../state/atoms"

type CardType = "card_nominations_data" | "card_suggestions_data"

export const useCreateCard = () => {
  const [createCard, setCreateAtom] = useAtom(createCardAtom)

  const changeCreateCard = (fieldType: CardType, index: number, name: string, value: string) => {
    // TODO change to use of Atom in Atom
    const newCreateCard = Object.create(createCard)
    newCreateCard[fieldType][index][name] = value
    setCreateAtom(newCreateCard)
  }

  return {
    createCard,
    setCreateAtom,
    changeCreateCard,
  }
}

interface NominationProps {
  index: number
  title: string
  subtitle: string
  description: string
}

const Nomination = (props: { structure: NominationProps }) => {
  const { changeCreateCard } = useCreateCard()

  return <div key={props.structure.index}>
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
        event.target.name,
        event.target.value
      )}
    />
  </div>
}

const Nominations = () => {
  const navigate = useNavigate({ from: "/cards/create" })
  const { createCard } = useCreateCard()

  if (!createCard) {
    navigate({ to: "/templates" })
  }

  return <>
    <h2>Nominations</h2>
    {
      createCard?.card_nominations_data.map((value, index) =>
        <Nomination structure={{ ...value, index }} />
      )
    }
  </>
}

const Suggestions = () => {
  return <>
    <h2>Suggestions</h2>
  </>
}

export const CreateCards = () => {
  return <>
    <h1>Create card</h1>
    <Nominations />
    <Suggestions />
  </>
}
