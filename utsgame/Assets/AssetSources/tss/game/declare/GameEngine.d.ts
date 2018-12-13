declare module GameEngine{
    export class GameObject {
        static instantiate(object, toType: string): any;
    }
    export module ui {
        export class Element {
            isElement(): boolean;
            elementType(): string;
            removeAllListeners(): void;
        }
        export class Button extends Element {
            addClickListener(callback: () => void): void;
        }
        export class Text extends Element {
            setText(text: string): void;
            setColor(r:number, g:number, b:number, a:number): void;
        }
        export class Form {
            show(): void;
            hide(): void;
            getElement(elem: string): Element;
            getButton(elem: string): Button;
            getText(elem: string): Text;
        }
    }
    export class ResLoader {
        static load(res: string, callback: (object) => void);
    }
}

