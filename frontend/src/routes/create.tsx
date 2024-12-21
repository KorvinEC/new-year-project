import { createFileRoute } from '@tanstack/react-router'
import { Templates } from '../pages/Templates'

export const Route = createFileRoute('/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Templates />
}
