import { createFileRoute } from '@tanstack/react-router'
import { Templates } from '../pages/Templates'

export const Route = createFileRoute('/templates')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Templates/>
}
