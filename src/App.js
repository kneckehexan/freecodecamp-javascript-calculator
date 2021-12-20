import React from "react";
import "./App.css";
import { evaluate, round } from "mathjs";

const BUTTONS = [
  { display: "0", type: "number", key: "0", name: "zero" },
  { display: "1", type: "number", key: "1", name: "one" },
  { display: "2", type: "number", key: "2", name: "two" },
  { display: "3", type: "number", key: "3", name: "three" },
  { display: "4", type: "number", key: "4", name: "four" },
  { display: "5", type: "number", key: "5", name: "five" },
  { display: "6", type: "number", key: "6", name: "six" },
  { display: "7", type: "number", key: "7", name: "seven" },
  { display: "8", type: "number", key: "8", name: "eight" },
  { display: "9", type: "number", key: "9", name: "nine" },
  { display: "+", type: "operator", key: "+", name: "add" },
  { display: "-", type: "operator", key: "-", name: "subtract" },
  { display: "×", type: "operator", key: "*", name: "multiply" },
  { display: "/", type: "operator", key: "/", name: "divide" },
  { display: "=", type: "evaluate", key: "=", name: "equals" },
  { display: "del", type: "delete", key: "del", name: "clear" },
  { display: ".", type: "decimal", key: ".", name: "decimal" }
];

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expressionHistory: [],
      resultHistory: [],
      mainDisplay: ["0"],
      historyDisplay: [],
      evaluated: false,
      decimalBlocked: false,
      operatorsLocked: true // Operators are locked (except "-") in the beginning until a number type button is pressed.
    };
    this.renderButtons = this.renderButtons.bind(this);
  }

  // General function to update the display values.
  updateDisplays = (value, type) => {
    if (type === "operator") {
      this.setState({
        decimalBlocked: false // Unblock the decimal button.
      });
    }
    if (
      value !== "." &&
      ((this.state.mainDisplay[0] === "0" &&
        this.state.mainDisplay.length === 1) ||
        this.state.evaluated)
    ) {
      this.setState({
        mainDisplay: [value],
        historyDisplay: [value],
        evaluated: false
      });
    } else {
      this.setState((prevState) => ({
        mainDisplay: [...prevState.mainDisplay, value],
        historyDisplay: [...prevState.historyDisplay, value]
      }));
    }
  };

  handleClick = (value, type) => {
    // Get the last object from BUTTONS that relate to the last character in the mainDisplay.
    let last = BUTTONS.find(
      (t) => t.key === this.state.mainDisplay[this.state.mainDisplay.length - 1]
    );
    if (last !== undefined) {
      var lastType = last.type;
    }
    switch (value) {
      // Reset the displays when pressing the "del" button
      case "del":
        this.setState({
          mainDisplay: ["0"],
          historyDisplay: [],
          evaluated: false,
          decimalBlocked: false,
          operatorsLocked: true
        });
        break;
      case "=":
        // Make sure the last pressed button was of a number type. No evaluation performed otherwise.
        if (lastType !== "number") {
          break;
        }
        let expression = this.state.mainDisplay.join(""); // Convert the mainDisplay array to a string.
        let result = round(evaluate(expression), 4); // Use mathjs function to evaluate the string expression.
        this.setState((prevState) => ({
          mainDisplay: [result],
          historyDisplay: [...prevState.historyDisplay, "=" + result],
          expressionHistory: [...prevState.expressionHistory, expression],
          resultHistory: [...prevState.resultHistory, result],
          evaluated: true,
          decimalBlocked: false,
          operatorsLocked: false
        }));
        break;
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        this.updateDisplays(value, type);
        this.setState({
          operatorsLocked: false // Unlock the operators ("-" excluded) once a "number" type button has been pressed.
        });
        break;
      case "+":
      case "*":
      case "/":
        // Exit switch if no number type button has been pressed before any of the operators above.
        if (this.state.operatorsLocked) {
          break;
        }

        // Get the index of the last entered digit.
        let lastNum;
        let re = /\d/;
        for (let i = this.state.mainDisplay.length - 1; i >= 0; i--) {
          if (re.test(this.state.mainDisplay[i])) {
            lastNum = i;
            break;
          }
        }

        // Remove all operators in the array after the index of the last digit if the previously entered key was of operator type.
        if (lastType === "operator") {
          this.state.mainDisplay.splice(lastNum + 1);
        } else if (this.state.historyDisplay.length === 0) {
          break;
        }

        // # 1 - If result is currently displayed, add the operator to a new expression to be evaluated.
        if (this.state.evaluated) {
          this.setState((prevState) => ({
            mainDisplay: [...prevState.mainDisplay, value],
            historyDisplay: ["(", ...prevState.historyDisplay, ")", value],
            evaluated: false // Render the displayed expression as un-evaluated.
          }));
        } else {
          this.updateDisplays(value, type);
        }
        break;
      case "-":
        // Same as # 1 above.
        if (this.state.evaluated) {
          this.setState((prevState) => ({
            mainDisplay: [...prevState.mainDisplay, value],
            historyDisplay: ["(", ...prevState.historyDisplay, ")", value],
            evaluated: false
          }));
        } else {
          this.updateDisplays(value, type);
        }
        break;
      case ".":
        // Add a decimal if the button hasn't been blocked. Once added, the decimal remains blocked until an operator button has been pressed.
        if (!this.state.decimalBlocked) {
          this.updateDisplays(value, type);
          this.setState({
            decimalBlocked: true
          });
        }
        break;
      default:
        break;
    }
  };

  renderButtons = () => {
    return BUTTONS.map((butObj, index) => {
      return (
        <button
          key={index}
          className="but"
          id={butObj.name}
          onClick={() => this.handleClick(butObj.key, butObj.type)}
        >
          {butObj.display}
        </button>
      );
    });
  };

  render() {
    return (
      <div className="Calc">
        <div id="history">
          <code>{this.state.historyDisplay}</code>
        </div>
        <div id="display">
          <code>{this.state.mainDisplay}</code>
        </div>
        {this.renderButtons()}
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Calculator />
      </header>
    </div>
  );
}

export default App;
