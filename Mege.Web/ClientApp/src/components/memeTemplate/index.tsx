import React from 'react';
import { RouteComponentProps } from 'react-router-dom'
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import Canvas from './canvas';
import styles from './index.module.css';
import TextRect, * as TextRectModule from './textRect';
import TextSettings, * as TextSettingsModule from './textSettings';
import { Rect } from "../../types/rect";
import { MemeTemplateResponse, MemeTemplateSpacing, UpdateMemeTemplateRequest } from '../../types/api';
import { logError } from '../../services/logger';
import { alertService } from '../../services/alert';
import auth from '../../services/auth';
import { Spacing, SpacingType } from '../../types/spacing';
import SpacingSettings, * as SpacingSettingsModule from './spacingSettings';
import { mapping } from './index.mapping';

interface MemeTemplateProps extends RouteComponentProps<MemeTemplateRouteMatchParams> {
}

interface MemeTemplateRouteMatchParams {
    id: string;
}

interface MemeTemplateState {
    isLoading: boolean,
    isAuthenticated: boolean,
    textLines: TextLine[],
    name: string,
    url: string,
    spacing: Spacing,
    isSpacingVisible: boolean,
    isPreviewFocused: boolean
}

interface TextLine {
    id: string,
    text: string,
    color: string,
    rect: Rect,
    textRect: React.RefObject<TextRect>
}

class MemeTemplate extends React.Component<MemeTemplateProps, MemeTemplateState> {
    abortController = new AbortController();

    constructor(props: MemeTemplateProps) {
        super(props);

        this.handleTextSettingsChange = this.handleTextSettingsChange.bind(this);
        this.handleTextRectChange = this.handleTextRectChange.bind(this);
        this.handleTextLineRemove = this.handleTextLineRemove.bind(this);
        this.handleTextLineAdd = this.handleTextLineAdd.bind(this);
        this.handleToggleSpacing = this.handleToggleSpacing.bind(this);
        this.handleSpacingChange = this.handleSpacingChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);

        this.state = {
            isLoading: true,
            isAuthenticated: false,
            name: "",
            url: "",
            textLines: [],
            spacing: new Spacing(),
            isSpacingVisible: false,
            isPreviewFocused: false
        }
    }

    componentDidMount() {
        const url = `/api/memetemplates/${this.memeTemplateId}`;

        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mouseup', this.handleMouseUp);

        axios.get<MemeTemplateResponse>(url, { signal: this.abortController.signal })
            .then((response) => {
                this.setStateFromResponse(response.data);
            })
            .catch(error => {
                if (axios.isCancel(error))
                    throw error;

                if (axios.isAxiosError(error) && error.response?.status === 404) {
                    this.props.history.push('/404');
                    return;
                }

                logError(error);
                alertService.error("Unable to load meme template. Try again later.");
            })
            .then(() => auth.isAuthenticated({ signal: this.abortController.signal }))
            .then(value => this.setState({
                isLoading: false,
                isAuthenticated: value
            }))
            .catch(error => {
                if (axios.isCancel(error))
                    return;

                logError(error);
                this.setState({ isLoading: false });
            });
    }

    componentWillUnmount() {
        window.removeEventListener('mousemove', this.handleMouseMove)
        window.removeEventListener('mouseup', this.handleMouseUp);

        this.abortController.abort();
    }

    get memeTemplateId() {
        const { id } = this.props.match.params;

        return id;
    }

    setStateFromResponse(response: MemeTemplateResponse) {
        const { name, url, textLines } = response;
        const spacing = this.getSpacingFromResponse(response.spacing);

        this.setState({
            name,
            url,
            textLines: textLines.map(line => {
                const { text, color, rect } = line;

                return {
                    id: uuid(),
                    text,
                    color,
                    rect,
                    textRect: React.createRef()
                }
            }),
            spacing: spacing || new Spacing(),
            isSpacingVisible: spacing ? true : false
        });
    }

    getSpacingFromResponse(spacing?: MemeTemplateSpacing): Spacing | undefined {
        if (spacing == null)
            return undefined;

        return new Spacing(mapping.spacingTypeFromResponse(spacing.type), spacing.size, spacing.color);
    }

    getUpdateRequest(): UpdateMemeTemplateRequest {
        return {
            id: this.memeTemplateId,
            name: this.state.name,
            textLines: this.state.textLines.map(line => {
                const { text, color, rect } = line;

                return {
                    text,
                    color,
                    rect
                }
            }),
            spacing: this.getSpacingForRequest()
        }
    }

    getSpacingForRequest(): MemeTemplateSpacing | undefined {
        const { spacing, isSpacingVisible } = this.state;

        if (spacing.isNone())
            return undefined;

        if (!isSpacingVisible)
            return undefined;

        return {
            color: spacing.color,
            size: spacing.sizePercentage,
            type: mapping.spacingTypeForRequest(spacing.type)
        }
    }

    getSpacingForCanvas(): Spacing {
        const { isSpacingVisible } = this.state;

        if (!isSpacingVisible)
            return Spacing.None();

        return this.state.spacing
    }

    handleMouseMove(e: MouseEvent) {
        this.state.textLines.forEach(line => {
            line.textRect.current?.handleMouseMove(e);
        });
    }

    handleMouseUp() {
        this.state.textLines.forEach(line => {
            line.textRect.current?.handleMouseUp();
        });
    }

    handleMouseLeave() {
        this.setState({ isPreviewFocused: false });
    }

    handleMouseEnter() {
        this.setState({ isPreviewFocused: true });
    }

    handleTextRectChange(id: string, args: TextRectModule.OnChangeEventArgs) {
        let textLine = this.state.textLines.find(item => item.id === id);

        textLine!.rect = args.rect;

        this.setState({});
    }

    handleTextSettingsChange(id: string, args: TextSettingsModule.OnChangeEventArgs) {
        let textLine = this.state.textLines.find(item => item.id === id);

        textLine!.text = args.text;
        textLine!.color = args.color;

        this.setState({});
    }

    handleSpacingChange(args: SpacingSettingsModule.OnChangeEventArgs) {
        const { spacing } = args;

        if (spacing.type !== SpacingType.None) {
            this.setState({
                spacing: args.spacing
            });

            return;
        }

        this.setState({
            isSpacingVisible: false,
            spacing: new Spacing(SpacingType.Top, spacing.sizePercentage, spacing.color)
        });
    }

    handleTextLineRemove(id: string) {
        this.setState(state => {
            return {
                textLines: state.textLines.filter(item => item.id !== id)
            };
        });
    }

    handleTextLineAdd() {
        const newTextLine = {
            id: uuid(),
            text: '',
            color: '#000000',
            rect: {
                top: 10,
                left: 10,
                width: 200,
                height: 100
            },
            textRect: React.createRef<TextRect>()
        } as TextLine;

        this.setState(state => ({
            textLines: state.textLines.concat(newTextLine)
        }));
    }

    handleToggleSpacing() {
        this.setState(state => {
            return {
                isSpacingVisible: !state.isSpacingVisible
            }
        });
    }

    handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            name: e.target.value
        });
    };

    handleUpdate(e: React.SyntheticEvent) {
        e.preventDefault();

        axios.put<any, any, UpdateMemeTemplateRequest>('/api/memetemplates', this.getUpdateRequest())
            .then(() => {
                alertService.success("The meme template is updated.");
            })
            .catch(error => {
                if (axios.isCancel(error))
                    return;

                logError(error);
                alertService.error("Unable to save the meme template. Try again later.");
            });
    }

    render() {
        const { isLoading, isAuthenticated, name, url, spacing, isSpacingVisible, isPreviewFocused } = this.state;

        return (
            <div className={styles.index}>
                {isLoading && <div>Loading...</div>}
                {!isLoading && <>
                    {isAuthenticated &&
                        <form onSubmit={this.handleUpdate} noValidate>
                            <fieldset className='d-flex flex-row mb-3'>
                                <input type="text"
                                    className={`form-control pr-1`}
                                    id="memeTemplateName"
                                    placeholder="For example, Surprised Pikachu"
                                    maxLength={64}
                                    autoComplete="off"
                                    value={name}
                                    onChange={this.handleNameChange}
                                ></input>
                                <button type="submit" className="btn btn-primary">Update</button>
                            </fieldset>
                        </form>
                    }
                    <div className='mb-3'>
                        {<button className={`btn btn-primary ${isSpacingVisible ? 'active' : ''}`} onClick={this.handleToggleSpacing}>Spacing</button>}
                        {isSpacingVisible && <div className='mt-3'>
                            <SpacingSettings spacing={spacing} onChange={this.handleSpacingChange} />
                        </div>}
                    </div>
                    <div className={`mb-3 ${styles.preview}`}
                        onMouseLeave={this.handleMouseLeave}
                        onMouseEnter={this.handleMouseEnter}>
                        <Canvas memeTemplateUrl={url} textLines={this.state.textLines} spacing={this.getSpacingForCanvas()} />
                        {
                            this.state.textLines.map((item) => {
                                return <TextRect
                                    ref={item.textRect}
                                    key={'text-rect-' + item.id}
                                    rect={item.rect}
                                    isHidden={!isPreviewFocused}
                                    onChange={this.handleTextRectChange.bind(this, item.id)} />
                            })
                        }
                    </div>
                    {
                        this.state.textLines.map((item, index) => {
                            return <TextSettings
                                key={'text-settings-' + item.id}
                                index={index}
                                text={item.text}
                                color={item.color}
                                onChange={this.handleTextSettingsChange.bind(this, item.id)}
                                onRemove={this.handleTextLineRemove.bind(this, item.id)} />
                        })
                    }
                    <div className='mt-3'>
                        <button className='btn btn-primary ' onClick={this.handleTextLineAdd}>Add text</button>
                    </div>
                </>}
            </div>
        );
    }
}

export default MemeTemplate;