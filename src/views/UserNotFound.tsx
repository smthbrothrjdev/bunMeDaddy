import React from "react";

export type UserNotFoundProps = {
  name: string
}
export default function UserNotFound({name}: UserNotFoundProps) {
  const newPasswordString = `{name:${name}}`
  return (
      <>
        <h1 className="text-purple-700 text-8xl font-semibold mb-10">First Time Login</h1>
        <h2 className="text-purple-700 text-4xl font-semibold mb-10">Please enter a password</h2>
        <label className="w-full mb-4 shadow-inner">
          <input name="newPassword" type="password"
                 className=" border-none outline-purple-500 shadow-inner w-full text-5xl mb-20 pl-5"/>
        </label>
        <button hx-post="/new-password" hx-ext="json-enc" hx-vals={newPasswordString} hx-target="#main" hx-include="[name='newPassword]"
                className=" shadow-2xl rounded-3xl w-1/3 h-1/6 border-2 bg-purple-500 justify-center">
          ENTER!
        </button>
      </>
  )

}
