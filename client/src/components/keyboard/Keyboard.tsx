import React from 'react';
import './Keyboard.scss';

let keyboard: string[][] = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
];

function Keyboard() {

    function keyMap(row: string[]) {
        return row.map((key, i) => {
            let id: string = "";
            if (key === 'ENTER') {
                id = 'enter';
            } else if (key === '⌫') {
                id = 'delete'
            }
            return(
                <button key={i} id={id} onClick={() => console.log(key)}>{key}</button>
            );
        })
    }


    return (
        <div className="keyboardWrapper">
            <div className="buttonDiv">{keyMap(keyboard[0])}</div>
            <div className="buttonDiv">{keyMap(keyboard[1])}</div>
            <div className="buttonDiv">{keyMap(keyboard[2])}</div>
        </div>
    )
}


export default Keyboard;