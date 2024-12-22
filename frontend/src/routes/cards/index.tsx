import { createFileRoute } from '@tanstack/react-router'
import { Cards } from '../../pages/Cards'

export const Route = createFileRoute('/cards/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Cards />
}
