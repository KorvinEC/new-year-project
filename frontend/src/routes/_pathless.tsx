import { createFileRoute } from '@tanstack/react-router'
import { Templates } from '../pages/Templates'

export const Route = createFileRoute('/_pathless')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Templates />
}
