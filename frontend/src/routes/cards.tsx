import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cards')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Cards</div>
}
