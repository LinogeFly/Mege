import React, { useLayoutEffect, useRef, useState } from "react";
import { Spacing, SpacingType } from "../../types/spacing";

export interface SpacingSettingsProps {
    spacing: Spacing,
    onChange(args: OnChangeEventArgs): any
}

export interface OnChangeEventArgs {
    spacing: Spacing
}

function SpacingSettings(props: SpacingSettingsProps) {
    const { onChange } = props;
    const [color, setColor] = useState(props.spacing.color);
    const [type, setType] = useState(props.spacing.type);
    const [sizePercentage, setSizePercentage] = useState(props.spacing.sizePercentage);
    const isFirstUpdate = useRef(true);

    function handleTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setType(parseInt(e.target.value));
    }

    function handleColorChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setColor(e.target.value);
    }

    function handleSizeChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSizePercentage(parseInt(e.target.value));
    }

    useLayoutEffect(() => {
        if (isFirstUpdate.current) {
            isFirstUpdate.current = false;
            return;
        }

        onChange({
            spacing: new Spacing(type, sizePercentage, color)
        });
    }, [onChange, color, type, sizePercentage]);

    return (
        <div className="d-flex flex-row">
            <select className="form-select" value={type} onChange={handleTypeChange}>
                <option value={SpacingType.None}>None</option>
                <option value={SpacingType.TopAndBottom}>Top and bottom</option>
                <option value={SpacingType.Top}>Top</option>
                <option value={SpacingType.Bottom}>Bottom</option>
            </select>
            <select className="form-select" value={color} onChange={handleColorChange}>
                <option value="#ffffff">White</option>
                <option value="#000000">Black</option>
            </select>
            <input type="range" className="form-range" min="0" max="100" step="5" value={sizePercentage} onChange={handleSizeChange}></input>
            <span className="form-label">{sizePercentage}%</span>
        </div>
    );
}

export default SpacingSettings;