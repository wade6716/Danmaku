export interface Comment {
  text?: string;
  /**
   * @default rtl
   */
  mode?: 'ltr' | 'rtl' | 'top' | 'bottom';
  /**
   * Specified in seconds. Not required in live mode.
   * @default media?.currentTime
   */
  time?: number;
  style?: Partial<CSSStyleDeclaration> | CanvasRenderingContext2D;
  /**
   * A custom render to draw comment.
   * When it exist, `text` and `style` will be ignored.
   */
  render?(): HTMLElement | HTMLCanvasElement;
}

export interface DanmakuMediaAdapter extends EventTarget {
  readonly currentTime: number;
  readonly paused: boolean;
  readonly playbackRate: number;
}

export interface DanmakuOption {
  /**
   * The stage to display comments will be appended to container.
   */
  container: HTMLElement;
  /**
   * If it's not provided, Danmaku will be in live mode.
   * Supports standard HTMLMediaElement or virtual DanmakuMediaAdapter (e.g. MpvDanmakuBridge).
   */
  media?: HTMLMediaElement | DanmakuMediaAdapter;
  /**
   * Preseted comments, used in media mode
   */
  comments?: Comment[];
  /**
   * Canvas engine may more efficient than DOM however it costs more memory.
   * @default dom
   */
  engine?: 'dom' | 'canvas';
  /**
   * The speed of comments in `ltr` and `rtl` mode.
   */
  speed?: number;
  /**
   * Display area ratio: 0.25 | 0.5 | 0.75 | 1.0 (default: 1.0)
   */
  area?: number;
  /**
   * Bottom margin in px to avoid subtitles (default: 48)
   */
  bottomMargin?: number;
  /**
   * Global opacity: 0.1 ~ 1.0 (default: 1.0)
   */
  opacity?: number;
  /**
   * Global timeline offset in seconds (default: 0)
   */
  offset?: number;
  /**
   * Maximum lines displayed on stage simultaneously (0 for unlimited)
   */
  maxLines?: number;
}

declare class Danmaku {
  constructor(option: DanmakuOption);
  /**
   * The speed of comments in `ltr` and `rtl` mode.
   */
  get speed(): number;
  set speed(s: number);
  /**
   * Display area ratio (0.25 ~ 1.0).
   */
  get area(): number;
  set area(a: number);
  /**
   * Bottom margin in px to avoid subtitles.
   */
  get bottomMargin(): number;
  set bottomMargin(m: number);
  /**
   * Global opacity of comments (0.1 ~ 1.0).
   */
  get opacity(): number;
  set opacity(o: number);
  /**
   * Global time offset in seconds.
   */
  get offset(): number;
  set offset(o: number);
  /**
   * Maximum lines displayed on stage simultaneously (0 for unlimited).
   */
  get maxLines(): number;
  set maxLines(l: number);

  /**
   * Destroy the instance and release memory.
   */
  destroy(): Danmaku;
  emit(comment: Comment): Danmaku;
  show(): Danmaku;
  hide(): Danmaku;
  /**
   * Clear current stage.
   */
  clear(): Danmaku;
  /**
   * Do it when you resize container.
   */
  resize(): Danmaku;
}

export default Danmaku;
