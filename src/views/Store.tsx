import React from "react";
import {Stores, type Item} from "../models/Item.ts";
export type StoreProps={
    principle:string
    store: Stores
}
export default function Store({principle, store}:StoreProps){
    return (<>
            <h1 className="text-purple-700 text-8xl font-semibold mb-10">Buy Something!</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 pb-10" >
                {store.list().map(item=>{
                console.log(item)
                return <StoreItem item={item} key={item.id} />
            })}
        </div>
            <p id="results">
l
            </p>
            <button className="h-fit text-3xl text-white rounded-3xl w-1/3 h-1/6 border-2 bg-red-400 justify-center "> Submit</button>
            {principle =='parents' && <button >Add</button>}

        </>
    )
}

type StoreItemProps = {
    item: Item
    key: number
}
function StoreItem({item}:StoreItemProps){
    return(

        <div hyperscript-header={item.id} _="on click toggle .selected" className='text-center justify-items-center my-3 mx-4 bg-purple-600 px-4 border-solid border border-white text-white rounded-3xl'>

            <div className="text-3xl">{item.item_name}</div>
            <hr className="flex w-1/2 m-auto"/>
            <div className="text-xl">${item.price}</div>
        </div>

    )
}
