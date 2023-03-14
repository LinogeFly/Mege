import { SpacingType } from "../../types/spacing";

export const mapping = {
    spacingTypeFromResponse(type: string): SpacingType {
        switch (type) {
            case "top":
                return SpacingType.Top;
            case "bottom":
                return SpacingType.Bottom;
            case "topAndBottom":
                return SpacingType.TopAndBottom;
            default:
                return SpacingType.None;
        }
    },
    spacingTypeForRequest(type: SpacingType) {
        switch (type) {
            case SpacingType.Top:
                return "top";
            case SpacingType.Bottom:
                return "bottom";
            case SpacingType.TopAndBottom:
                return "topAndBottom";
            default:
                return "";
        }
    }
}