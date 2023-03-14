import { Rect } from "./rect";

export interface MemeTemplateListResponse {
    status?: number,
    isLastPage: boolean,
    memeTemplates: MemeTemplateListItemResponse[]
}

export interface MemeTemplateListItemResponse {
    id: string,
    name: string
}

export interface MemeTemplateResponse {
    id: string,
    name: string,
    url: string,
    textLines: MemeTemplateTextLine[],
    spacing?: MemeTemplateSpacing
}

export interface NewMemeTemplateResponse {
    id: string,
}

export interface UpdateMemeTemplateRequest {
    id: string,
    name: string,
    textLines: MemeTemplateTextLine[],
    spacing?: MemeTemplateSpacing
}

export interface MemeTemplateTextLine {
    text: string,
    color: string,
    rect: Rect
}

export interface MemeTemplateSpacing {
    color: string,
    size: number,
    type: string
}
