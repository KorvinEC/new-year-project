import { ChangeEvent, useState } from "react"
import { useRegister } from "../hooks/useRegister"

export const Register = () => {

  const [nickname, setNickname] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const { registerMutation } = useRegister()

  const handleOnSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    registerMutation.mutate({ nickname, username, password })
  }

  return <>
    <form onSubmit={handleOnSubmit}>
      <label htmlFor="nickname">nickname:</label>
      <input
        id="nickname"
        name="nickname"
        type="text"
        value={nickname}
        onChange={(e) => { setNickname(e.target.value) }}
      />
      <br />
      <label htmlFor="username">username:</label>
      <input
        id="username"
        name="username"
        type="text"
        value={username}
        onChange={(e) => { setUsername(e.target.value) }}
      />
      <br />
      <label htmlFor="password">password:</label>
      <input
        id="password"
        name="password"
        type="password"
        value={password}
        onChange={(e) => { setPassword(e.target.value) }}
      />
      <br />
      <button type="submit">
        {registerMutation.isPending ? "Registering ..." : "Submit"}
      </button>
      {registerMutation.isError && <p>Error</p>}
      {registerMutation.isSuccess && <p>Success</p>}
    </form>
  </>
}
