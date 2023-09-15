import React from "react";

export type UserNotFoundProps ={
    name: string
}
export default function UserNotFound({name} : UserNotFoundProps){
    return <h1>{name}</h1>

}
