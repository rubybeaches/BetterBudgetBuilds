import { useState } from "react"

const Slider = ({ min, max, position }: { min: number, max: number, position: number }) => {
    const [sliderPosition, setSliderPosition] = useState(position);

    return <input className="slider" type="range" min={min} max={max} value={sliderPosition} onChange={(e) => setSliderPosition(Number(e.target.value))}></input>
}

export default Slider;