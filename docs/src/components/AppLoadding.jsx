import React from "react"
import loadding from './../../public/loadding.gif'

export const AppLoadding = (props) => {
    const { isLoading } = props
    return (
        <>
            {isLoading ? <div style={{
                top: 0,
                backgroundColor: 'rgba(100, 100, 100, 0.3)',
                width: '100%',
                height: '100%',
                position: 'absolute',
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }} >
                <img src={loadding} width="80" height="80" className='rounded'></img>
            </div> : null}
            {props.children}
        </>

    )
}