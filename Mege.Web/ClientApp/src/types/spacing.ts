export enum SpacingType {
    None,
    Top,
    Bottom,
    TopAndBottom
}

export class Spacing {
    color: string;
    sizePercentage;
    type: SpacingType;

    constructor();
    constructor(type: SpacingType);
    constructor(type: SpacingType, sizePercentage: number, color: string);
    constructor(type?: SpacingType, sizePercentage?: number, color?: string) {
        this.color = color ?? '#ffffff';
        this.sizePercentage = sizePercentage ?? 25;
        this.type = type ?? SpacingType.Top;
    }


    isNone() {
        if (this.type === SpacingType.None)
            return true;

        if (this.sizePercentage === 0)
            return true;

        return false;
    }

    isNotNone() {
        return !this.isNone();
    }

    static None() {
        return new Spacing(SpacingType.None);
    }
}
