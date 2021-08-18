/// <reference types="jquery" />
export declare function setJQuery(jq: any): void;
export interface IDefaults {
    left: number;
    leftColumns?: number;
    right: number;
    rightColumns?: number;
}
export interface IS {
    barWidth: number;
    dt: any;
    rtl: boolean;
}
export interface IClasses {
    fixedLeft: string;
    fixedRight: string;
    leftBottomBlocker: string;
    leftTopBlocker: string;
    rightBottomBlocker: string;
    rightTopBlocker: string;
}
export interface IDOM {
    leftBottomBlocker: JQuery<HTMLElement>;
    leftTopBlocker: JQuery<HTMLElement>;
    rightBottomBlocker: JQuery<HTMLElement>;
    rightTopBlocker: JQuery<HTMLElement>;
}
export default class FixedColumns {
    private static version;
    private static classes;
    private static defaults;
    classes: IClasses;
    c: IDefaults;
    dom: IDOM;
    s: IS;
    constructor(settings: any, opts: IDefaults);
    private _addStyles;
    private _setKeyTableListener;
}
