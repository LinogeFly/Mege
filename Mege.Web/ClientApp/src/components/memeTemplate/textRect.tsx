import React from 'react';
import { Rect } from "../../types/rect";
import styles from './textRect.module.css';

export interface TextRectProps {
    rect: Rect;
    isHidden: boolean;
    onChange(args: OnChangeEventArgs): any;
}

export interface OnChangeEventArgs {
    rect: Rect
}

interface TextRectState {
    rect: Rect,
    isMouseDown: boolean,
    resizeDirection: string,
    beforeMouseUp: MouseEventSnapshot
}

interface MouseEventSnapshot {
    pageX: number,
    pageY: number,
    rect: Rect
}

class TextRect extends React.Component<TextRectProps, TextRectState> {
    constructor(props: TextRectProps) {
        super(props);

        this.state = {
            rect: props.rect,
            isMouseDown: false,
            resizeDirection: '',
            beforeMouseUp: {
                pageX: 0,
                pageY: 0,
                rect: {
                    top: 0,
                    left: 0,
                    height: 0,
                    width: 0
                }
            }
        };

        this.onChange = this.onChange.bind(this);
    };

    get boxStyle() {
        const { top, left, height, width } = this.state.rect;

        return {
            top: top + 'px',
            left: left + 'px',
            height: height + 'px',
            width: width + 'px',
        }
    };

    handleMouseDown(direction: string, e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        this.setState((state) => ({
            isMouseDown: true,
            resizeDirection: direction,
            beforeMouseUp: {
                pageX: e.pageX,
                pageY: e.pageY,
                rect: state.rect
            },
        }));
    }

    handleMouseUp() {
        this.setState({
            isMouseDown: false
        });
    }

    handleMouseMove(e: MouseEvent) {
        if (!this.state.isMouseDown) {
            return;
        }

        switch (this.state.resizeDirection) {
            case 'N':
                this.setState((state) => {
                    return {
                        rect: {
                            top: state.beforeMouseUp.rect.top + (e.pageY - state.beforeMouseUp.pageY),
                            left: state.rect.left,
                            height: state.beforeMouseUp.rect.height - (e.pageY - state.beforeMouseUp.pageY),
                            width: state.rect.width,
                        }
                    }
                }, this.onChange);
                break;
            case 'E':
                this.setState((state) => {
                    return {
                        rect: {
                            top: state.rect.top,
                            left: state.rect.left,
                            height: state.rect.height,
                            width: state.beforeMouseUp.rect.width + (e.pageX - state.beforeMouseUp.pageX),
                        }
                    }
                }, this.onChange);
                break;
            case 'S':
                this.setState((state) => {
                    return {
                        rect: {
                            top: state.rect.top,
                            left: state.rect.left,
                            height: state.beforeMouseUp.rect.height + (e.pageY - state.beforeMouseUp.pageY),
                            width: state.rect.width,
                        }
                    }
                }, this.onChange);
                break;
            case 'W':
                this.setState((state) => {
                    return {
                        rect: {
                            top: state.rect.top,
                            left: state.beforeMouseUp.rect.left + (e.pageX - state.beforeMouseUp.pageX),
                            height: state.rect.height,
                            width: state.beforeMouseUp.rect.width - (e.pageX - state.beforeMouseUp.pageX),
                        }
                    }
                }, this.onChange);
                break;
            case 'NW':
                this.setState((state) => {
                    return {
                        rect: {
                            top: state.beforeMouseUp.rect.top + (e.pageY - state.beforeMouseUp.pageY),
                            left: state.beforeMouseUp.rect.left + (e.pageX - state.beforeMouseUp.pageX),
                            height: state.beforeMouseUp.rect.height - (e.pageY - state.beforeMouseUp.pageY),
                            width: state.beforeMouseUp.rect.width - (e.pageX - state.beforeMouseUp.pageX),
                        }
                    }
                }, this.onChange);
                break;
            case 'NE':
                this.setState((state) => {
                    return {
                        rect: {
                            top: state.beforeMouseUp.rect.top + (e.pageY - state.beforeMouseUp.pageY),
                            left: state.rect.left,
                            height: state.beforeMouseUp.rect.height - (e.pageY - state.beforeMouseUp.pageY),
                            width: state.beforeMouseUp.rect.width + (e.pageX - state.beforeMouseUp.pageX),
                        }
                    }
                }, this.onChange);
                break;
            case 'SE':
                this.setState((state) => {
                    return {
                        rect: {
                            top: state.rect.top,
                            left: state.rect.left,
                            height: state.beforeMouseUp.rect.height + (e.pageY - state.beforeMouseUp.pageY),
                            width: state.beforeMouseUp.rect.width + (e.pageX - state.beforeMouseUp.pageX),
                        }
                    }
                }, this.onChange);
                break;
            case 'SW':
                this.setState((state) => {
                    return {
                        rect: {
                            top: state.rect.top,
                            left: state.beforeMouseUp.rect.left + (e.pageX - state.beforeMouseUp.pageX),
                            height: state.beforeMouseUp.rect.height + (e.pageY - state.beforeMouseUp.pageY),
                            width: state.beforeMouseUp.rect.width - (e.pageX - state.beforeMouseUp.pageX),
                        }
                    }
                }, this.onChange);
                break;
            default: // When there is no direction, it means we are moving the box itself
                this.setState((state) => {
                    return {
                        rect: {
                            top: state.beforeMouseUp.rect.top + (e.pageY - state.beforeMouseUp.pageY),
                            left: state.beforeMouseUp.rect.left + (e.pageX - state.beforeMouseUp.pageX),
                            height: state.rect.height,
                            width: state.rect.width,
                        }
                    }
                }, this.onChange);
        }
    }

    onChange() {
        const { rect } = this.state;

        this.props.onChange({ rect });
    }

    render() {
        const modifierClass = this.props.isHidden ? styles['drag-box--off'] : '';

        return (
            <div className={`${styles['drag-box']} ${modifierClass}`} style={this.boxStyle} onMouseDown={this.handleMouseDown.bind(this, '')}>
                <div className={styles.wrapN} onMouseDown={this.handleMouseDown.bind(this, 'N')}>
                    <div className={`${styles.resize} ${styles.N}`}></div>
                </div>
                <div className={styles.wrapE} onMouseDown={this.handleMouseDown.bind(this, 'E')}>
                    <div className={`${styles.resize} ${styles.E}`}></div>
                </div>
                <div className={styles.wrapS} onMouseDown={this.handleMouseDown.bind(this, 'S')}>
                    <div className={`${styles.resize} ${styles.S}`}></div>
                </div>
                <div className={styles.wrapW} onMouseDown={this.handleMouseDown.bind(this, 'W')}>
                    <div className={`${styles.resize} ${styles.W}`}></div>
                </div>
                <div className={`${styles.resize} ${styles.NW}`} onMouseDown={this.handleMouseDown.bind(this, 'NW')}></div>
                <div className={`${styles.resize} ${styles.NE}`} onMouseDown={this.handleMouseDown.bind(this, 'NE')}></div>
                <div className={`${styles.resize} ${styles.SE}`} onMouseDown={this.handleMouseDown.bind(this, 'SE')}></div>
                <div className={`${styles.resize} ${styles.SW}`} onMouseDown={this.handleMouseDown.bind(this, 'SW')}></div>
            </div>
        );
    }
}

export default TextRect;