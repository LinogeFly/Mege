import React from 'react';
import { Rect } from '../../types/rect';
import { Spacing, SpacingType } from '../../types/spacing';
import styles from './canvas.module.css';

export interface CanvasProps {
    memeTemplateUrl: string,
    textLines: TextLine[]
    spacing: Spacing
}

interface TextLine {
    text: string,
    color: string,
    rect: Rect
}

interface WrappedText {
    fontSize: number,
    lines: string[]
}

class Canvas extends React.Component<CanvasProps> {
    image: HTMLImageElement;
    canvasRef: React.RefObject<HTMLCanvasElement>;

    constructor(props: CanvasProps) {
        super(props);

        this.canvasRef = React.createRef();
        this.image = new Image();
    }

    get maxFontSize() {
        return 30;
    }

    componentDidMount() {
        this.image.src = this.props.memeTemplateUrl;
        this.image.onload = () => {
            this.updateCanvas();
        };
    }

    lineHeightFor(fontSize: number, scaleFactor: number) {
        return (fontSize * scaleFactor | 0) + (fontSize / 4 * scaleFactor | 0);
    };

    getWrappedText(textLine: TextLine, maxFontSize: number): WrappedText {
        const canvas = this.canvasRef.current!;
        const context = canvas.getContext('2d')!;
        const { rect, text } = textLine;
        const words = text.split(' ');
        const scaleFactor = canvas.width / canvas.clientWidth;
        const fontSize = (maxFontSize * scaleFactor | 0);
        const rectWidth = (rect.width * scaleFactor | 0);
        const rectHeight = (rect.height * scaleFactor | 0);
        const lineHeight = this.lineHeightFor(maxFontSize, scaleFactor);

        context.textAlign = "left";
        context.textBaseline = "top";
        context.font = `${fontSize}pt Arial`;

        let lines = [text];
        let line = '';

        for (let i = 0; i < words.length; i++) {
            // There is single word that is wider than the rectangle and it doesn't fit.
            // We need to reduce the font size and try to fit it again.
            const wordWidth = context.measureText(words[i]).width;
            if (wordWidth > rectWidth) {
                return this.getWrappedText(textLine, --maxFontSize);
            }

            // If the text is wider than the rectangle we need to break it down to multiple lines.
            const testLine = line + words[i];
            const testLineWidth = context.measureText(testLine).width;
            if (testLineWidth > rectWidth) {
                lines[lines.length - 1] = line;
                line = words[i] + ' ';
                lines.push(line);
            } else {
                line = testLine + ' ';
                lines[lines.length - 1] = line;
            }

            // The text broken down to multiple lines is taller that the rectangle and it doesn't fit.
            // We need to reduce the font size and try to fit it again.
            const textHeight = lines.length * lineHeight;
            if (textHeight > rectHeight) {
                return this.getWrappedText(textLine, --maxFontSize);
            }
        }

        return {
            fontSize: maxFontSize,
            lines: lines.map(line => line.trim())
        }
    }

    drawWrappedText(textLine: TextLine, maxFontSize: number) {
        const canvas = this.canvasRef.current!;
        const context = canvas.getContext('2d')!;
        const { rect, color } = textLine;
        const scaleFactor = canvas.width / canvas.clientWidth;
        const rectTop = (rect.top * scaleFactor | 0);
        const rectLeft = (rect.left * scaleFactor | 0);
        const wrappedText = this.getWrappedText(textLine, maxFontSize);
        const fontSize = (wrappedText.fontSize * scaleFactor | 0);
        const lineHeight = this.lineHeightFor(wrappedText.fontSize, scaleFactor);

        context.fillStyle = color;
        context.textAlign = "left";
        context.textBaseline = "top";
        context.font = `${fontSize}pt Arial`;

        for (let i = 0; i < wrappedText.lines.length; i++) {
            context.fillText(wrappedText.lines[i], rectLeft, rectTop + lineHeight * i);
        }
    }

    getNumberOfSpaces(): number {
        switch (this.props.spacing.type) {
            case SpacingType.None:
                return 0;
            case SpacingType.TopAndBottom:
                return 2;
            case SpacingType.Top:
            case SpacingType.Bottom:
            default:
                return 1;
        }
    }

    getCanvasHeight() {
        const heightFactor = (this.props.spacing.sizePercentage * this.getNumberOfSpaces() + 100) / 100;

        return Math.round(this.image.naturalHeight * heightFactor);
    }

    getImageY(): number {
        switch (this.props.spacing.type) {
            case SpacingType.Top:
            case SpacingType.TopAndBottom:
                const spacingHeight = this.getCanvasHeight() - this.image.naturalHeight;
                return Math.round(spacingHeight / this.getNumberOfSpaces());
            default:
                return 0;
        }
    }

    drawBackgroundImage() {
        const { spacing } = this.props;
        const canvas = this.canvasRef.current!;
        const context = canvas.getContext('2d')!;

        canvas.width = this.image.naturalWidth;
        canvas.height = this.getCanvasHeight();

        // Drawing a rectangle with spacing color as a background for the image.
        // It's only needed when there is spacing to add.
        if (spacing.isNotNone()) {
            context.beginPath();
            context.rect(0, 0, canvas.width, canvas.height);
            context.fillStyle = spacing.color;
            context.fill();
        }

        context.drawImage(this.image, 0, this.getImageY());
    }

    updateCanvas() {
        if (!this.canvasRef.current)
            return;

        this.drawBackgroundImage();

        this.props.textLines.forEach(textLine => {
            this.drawWrappedText(textLine, this.maxFontSize);
        });
    }

    render() {
        this.updateCanvas();

        return (
            <canvas ref={this.canvasRef} className={styles.canv}></canvas>
        );
    }
}

export default Canvas;