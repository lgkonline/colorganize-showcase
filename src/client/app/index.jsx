import React from "react";
import {render} from "react-dom";
import Superagent from "superagent";

// require("bootstrap/dist/css/bootstrap.css");

import "./bootstrap/css/bootstrap.css";
import "./main.css";

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            paletteId: location.hash && location.hash.indexOf("#") > -1 ? location.hash.replace("#", "") : "default",
            palette: null,
            renderedColorOptions: null
        };

        this.options = [
            "headlineColor", 
            "textColor", 
            "backgroundColor",
            "linkColor",
            "buttonColor",
            "buttonBackgroundColor"
        ];

        // TO DO!!
        // this.fonts = [
        //     {
        //         "label": "Rubik",
        //         "code": "'Rubik', sans-serif"
        //     }
        // ];

        this.options.map((option) => {
            this.state[option] = "";
        });

        this.state.currentOption = this.options[0];

        console.log(location.hash);
    }

    unCamelCase(str) {
        return str
            // insert a space between lower & upper
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            // space before last upper in a sequence followed by lower
            .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
            // uppercase the first character
            .replace(/^./, function(str){ return str.toUpperCase(); })
    }    

    componentDidMount() {
        this.receivePalette();
    }

    receivePalette() {
        const me = this;
        Superagent
        .get("https://colorganize.com/css-generate/?palette=" + this.state.paletteId + "&format=json")
        .then((error, response) => {
            if (error && error.statusCode === 200) {
                response = error;
            }
            else throw error;
            me.setState({palette: JSON.parse(response.text)});
        });
    }

    handleChange(event) {
        this.state.palette.map((color) => {
            if (color.title.indexOf(event.target.value) > -1) {
                this.setState({[event.target.name]: color.code});
            }
        });
    }

    chooseOption(option) {
        this.setState({currentOption: option});
    }

    chooseColor(color) {
        this.setState({[this.state.currentOption]: color.code});
    }

    choosePaletteId(event) {
        this.setState({paletteId: event.target.value});
    }

    render() {
        return (
            <div id="appContent">
                <div id="top" style={{backgroundColor: this.state.backgroundColor}}>
                    <header>
                        <div className="container">
                            <div className="row">
                                <div className="col-md-4 col-md-offset-8">
                                    <form className="input-group" onSubmit={(event) => { event.preventDefault(); this.receivePalette();}}>
                                        <input type="text" className="form-control" value={this.state.paletteId} onChange={(event) => this.choosePaletteId(event)}/>
                                        <span className="input-group-btn">
                                            <button type="submit" className="btn btn-primary">
                                                <span className="icon-checkmark"/>
                                            </button>
                                        </span>
                                    </form>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-4">
                                    <ul className="nav nav-pills nav-stacked">
                                        {this.options.map((option) => 
                                            <li key={option} className={this.state.currentOption == option ? "active" : ""}>
                                                <a href="javascript:void(0)" onClick={(event) => this.chooseOption(option)}>
                                                    {this.unCamelCase(option)}
                                                </a>
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                <div className="col-md-8">
                                    <div className="palette row row-2px">
                                        {this.state.palette && this.state.palette.map((color, index) => 
                                            <div key={index} className="col-sm-6 col-md-3 row-2px-col">
                                                <button type="button" className="color btn btn-default btn-block" style={{backgroundColor: color.code}}
                                                    onClick={() => this.chooseColor(color)}>
                                                    <div className="color-label">{color.title}</div>
                                                    <div className="color-label">{color.code}</div>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </header>

                    <main style={{color: this.state.textColor}}>
                        <div className="container">
                            <h1 className="page-header" style={{color: this.state.headlineColor}}>Hello World</h1>

                            <p>
                                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.<br/>
                                Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet,
                            </p>
                            <p>
                                <a href="javascript:void(0)" style={{color: this.state.linkColor}}>This is a hyperlink</a>
                            </p>

                            <button type="button" className="btn btn-default" style={{color: this.state.buttonColor, backgroundColor: this.state.buttonBackgroundColor}}>
                                Hey, it's a button
                            </button>
                        </div>
                    </main>
                </div>

                <footer>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-4">
                                &copy; 2017 LGK
                            </div>
                            <div className="col-md-4">
                                <a href="https://lgk.io" id="lgkLogo"><span className="icon-lgk-filled"/></a>
                            </div>
                            <div className="col-md-4">
                                <a href="https://colorganize.com">Colorganize</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }
}

render(<App/>, document.getElementById("app"));