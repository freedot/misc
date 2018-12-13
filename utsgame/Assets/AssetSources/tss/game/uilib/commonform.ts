import uts = require("../../uts/uts");
class CommonForm {
    protected _form: GameEngine.ui.Form = null;
    open() {
        if (this._form == null) {
            this.createForm();
        }
        else {
            this._form.show();
        }
    }

    close() {
        if (this._form != null) {
            this._form.hide();
        }
    }

    destory() {
        this.unInit();
    }

    protected get resPath(): string {
        return '';
    }

    protected initElements() {
    }

    protected addListeners() {
    }

    protected unAddListeners() {
        for (let k in this) {
            let elem = this[k];
            if (this.isElement(elem))
                elem.removeAllListeners();
        }
    }

    protected unInitElements() {
        for (let k in this) {
            let elem = this[k];
            if (this.isElement(elem))
                this[k] = null;
        }
    }

    private isElement(elem: any) {
        return (typeof (elem) === 'object') && (typeof (elem.isElement) === 'function') && elem.isElement();
    }

    private unInit() {
        this.unAddListeners();
        this.unInitElements();
        this._form = null;
    }

    private createForm() {
        GameEngine.ResLoader.load(this.resPath, uts.delegate(this, this.onLoadUIOk));
    }

    private onLoadUIOk(object) {
        this._form = GameEngine.GameObject.instantiate(object, "GameEngine.ui.Form");
        this._form.show();
        this.initElements();
        this.addListeners();
    }
}

export = CommonForm;

