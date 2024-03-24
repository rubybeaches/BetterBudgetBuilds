import { useState } from "react"

const Slider = ({ min, max, position, index, positionSetter }: { min: number, max: number, index: number, position: number, positionSetter: (min: number, max: number, curr: number, identifier: number) => void }) => {

    return <input className="slider" type="range" min={min} max={max} value={position} onChange={(e) => positionSetter(min, max, e.target.valueAsNumber, index)}></input>
}

export default Slider;