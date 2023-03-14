import React from 'react';
import styles from './textSettings.module.css';

export interface TextSettingsProps {
    index: number,
    text: string,
    color: string,
    onRemove(): any,
    onChange(args: OnChangeEventArgs): any
}

export interface OnChangeEventArgs {
    text: string,
    color: string
}

interface TextSettingsState {
    text: string,
    color: string,
}

class TextSettings extends React.Component<TextSettingsProps, TextSettingsState> {
    constructor(props: TextSettingsProps) {
        super(props);

        this.state = {
            text: props.text,
            color: props.color,
        };

        this.onChange = this.onChange.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
    }

    onChange() {
        this.props.onChange({
            text: this.state.text,
            color: this.state.color
        });
    }

    handleRemove() {
        this.props.onRemove();
    }

    handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({
            text: e.target.value
        }, this.onChange);
    }

    handleColorChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            color: e.target.value
        }, this.onChange);
    }

    render() {
        const { text, color } = this.state;

        return (
            <div className={styles['text-editor']}>
                <textarea
                    className='form-control'
                    placeholder={"Text #" + (this.props.index + 1)}
                    onChange={this.handleTextChange}
                    value={text}></textarea>
                <input
                    className='form-control form-control-color'
                    type="color"
                    value={color}
                    onChange={this.handleColorChange}></input>
                <button type="button" className="btn-close" aria-label="Close" onClick={this.handleRemove}></button>
            </div>
        );
    }
}

export default TextSettings;