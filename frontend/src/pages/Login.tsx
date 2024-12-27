import { ChangeEvent, useState } from "react";
import { useAuth } from "../auth";

export const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const { loginMutation } = useAuth()

  if (loginMutation.isPending) {
    return <h1>Logging ...</h1>
  }

  const handleOnSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    loginMutation.mutate({ username, password })
  }

  return <>
    <form onSubmit={handleOnSubmit}>
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
        {loginMutation.isPending ? "Logging in ..." : "Submit"}
      </button>
      {loginMutation.isError && <p>Error</p>}
      {loginMutation.isSuccess && <p>Success</p>}
    </form>
  </>
}
