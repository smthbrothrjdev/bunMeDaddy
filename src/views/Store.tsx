import React from "react";
import {Stores} from "../models/Item.ts";

export type StoreProps={
    principle:string
    store: Stores
}
export default function Store({principle, store}:StoreProps){
    return (
        <>
            {store.list().map(item=>{
                return <h1 > {item.item_name} eee</h1>
            })}

            {principle =='parents' && <button >Add</button>}
        </>
    )
}
