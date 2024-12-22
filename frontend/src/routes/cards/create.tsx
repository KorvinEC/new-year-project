import { createFileRoute } from '@tanstack/react-router'
import { CreateCards } from '../../pages/CreateCard'

export const Route = createFileRoute('/cards/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CreateCards />
}
