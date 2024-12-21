import { createFileRoute } from '@tanstack/react-router'
import { CreateTemplate } from '../../pages/CreateTemplate'

export const Route = createFileRoute('/templates/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CreateTemplate/>
}
