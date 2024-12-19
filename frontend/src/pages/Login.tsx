import { ChangeEvent, useState } from "react";

export const Login = () => {
  const [ username, setUsername ] = useState("")
  const [ password, setPassword ] = useState("")

  const handleOnSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(username, password);
  }

  return <>
    <form onSubmit={handleOnSubmit}>
      <label htmlFor="username">username:</label>
      <input 
        id="username" 
        name="username" 
        value={username} 
        onChange={(e) => {setUsername(e.target.value)}}
        / >
      <label htmlFor="password">password:</label>
      <input 
        id="password" 
        name="password" 
        value={password}
        onChange={(e) => {setPassword(e.target.value)}}
        />
      <button type="submit">submit</button>
    </form>
  </>
}
