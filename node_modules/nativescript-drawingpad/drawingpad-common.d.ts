import { View } from "ui/core/view";
export declare class DrawingPad extends View {
    static penColorProperty: any;
    static penWidthProperty: any;
    static pointsProperty: any;
    constructor();
    penColor: string;
    penWidth: any;
    points: any;
    clearDrawing(): void;
    getDrawing(): any;
    setPts(arr): any;
    setHrtMark(index, str): any;
    addPoint(point): any;
    update(): any;
}
