import uts = require("../uts/uts");
import CommonForm = require("./uilib/commonform");

class LoginForm extends CommonForm {
    private _btn: GameEngine.ui.Button = null;
    private _text: GameEngine.ui.Text = null;

    protected get resPath() {
        return 'ui/login.prefab';
    }

    protected initElements() {
        super.initElements();
        this._btn = this._form.getButton('loginButton');
        this._text = this._form.getText('text');
    }

    protected addListeners() {
        super.addListeners();
        this._btn.addClickListener(uts.delegate(this, this.onClickBtn));
    }

    private onClickBtn() {
        this._text.setText('hello world');
        this._text.setColor(255, 0, 0, 255);
        uts.log('click');
    }
}

class App {
    run() {
        let form = new LoginForm();
        form.open();
    }
}

export = App;