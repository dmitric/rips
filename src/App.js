import React, { Component } from 'react'
import './App.css'
import Hammer from 'hammerjs'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dimension: 2,
      padding: 25,
      innerPadding: 1,
      width: 100,
      height: 100,
      lines: 50,
      density: 3,
      backgroundColor: "#fff",
      lineColor: "#111",
      shapeLineColor: "red",
      lineWidth: 0.002
    }
  }

  render() {
    const bgLines = []
    const shapes = []

    var between = function (min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
    
    for (let lineIndex = 0; lineIndex < this.state.lines + 1; lineIndex++) {
      let yValue = lineIndex * (this.state.dimension + 1) / this.state.lines
      
      bgLines.push(
        <line key={lineIndex} x1={0} y1={yValue}
              x2={this.state.dimension + 1} y2={yValue}
              strokeLinecap="round"
              strokeWidth={this.state.lineWidth}  stroke={this.state.lineColor} />
      )
    }

    let vertOffset = 0.3;
    
    if (this.state.dimension === 1) {
      vertOffset = 0.5;
    } else if (this.state.dimension === 2) {
      vertOffset = 0.40;
    }

    let horOffset = vertOffset;
    
    let totalSpacing = 1 - vertOffset - horOffset;
    let individualSpacing =  totalSpacing === 0 ? 0 : totalSpacing / (this.state.dimension - 1)


    for (let shapeIndex = 0; shapeIndex < Math.pow(this.state.dimension, 2); shapeIndex++) {
      let x = horOffset + (shapeIndex % this.state.dimension) * (1 + individualSpacing)
      let y = vertOffset + (Math.floor(shapeIndex/this.state.dimension) % this.state.dimension) * (1 + individualSpacing)

      let lines = []

      for (let innerLineIndex = 0; innerLineIndex < this.state.density * (this.state.lines / (this.state.dimension + 1)); innerLineIndex ++) {
        let yValue = y + (innerLineIndex * (this.state.dimension + 1)) / (this.state.density * this.state.lines);
        
        lines.push(
          <line key={innerLineIndex}
              x1={x} y1={yValue}
              x2={x+1} y2={yValue}
              strokeLinecap="round"
              strokeWidth={this.state.lineWidth * 2}  stroke={this.state.shapeLineColor} />
        )
      }

      shapes.push(
        <g key={shapeIndex} transform={`rotate(${between(-2, 2)} ${x + 0.5} ${y + 0.5})`}>
          <g>
            {lines}
          </g>
        </g>
      )
    }

    return (
      <div className="App" style={{ padding: this.state.padding }}>
        <svg viewBox={`0 0 ${this.state.dimension + 1} ${this.state.dimension + 1}`} width={this.state.width-2*this.state.padding} height={this.state.height-2*this.state.padding}>
          <rect width={this.state.dimension + 1 } height={this.state.dimension + 1} fill={this.state.backgroundColor} />
          <g>{bgLines}</g>
          <g>
            {shapes}
          </g>
        </svg>
      </div>
    );
  }

  componentWillMount () {
    this.updateDimensions()
  }

  componentDidMount () {
    window.addEventListener("resize", this.updateDimensions.bind(this), true)
    window.addEventListener('keydown', this.handleKeydown.bind(this), true)

    const mc = new Hammer(document, { preventDefault: true })

    mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL })
    mc.get('pinch').set({ enable: true })

    mc.on("swipedown", ev => this.increaseDimension())
      .on("swipeup", ev => this.decreaseDimension())
  }

  componentWillUnmount () {
    window.removeEventListener("resize", this.updateDimensions.bind(this), true)
    window.removeEventListener('keydown', this.handleKeydown.bind(this), true)
  }

  handleKeydown (ev) {
    if (ev.which === 67) {
      ev.preventDefault()
      this.setState({dimension: 2, lines: 1})
    } else if (ev.which === 82 && !(ev.metaKey || ev.ctrlKey)) {
      ev.preventDefault()
      this.forceUpdate()
    } else if (ev.which === 40 && (ev.metaKey || ev.ctrlKey)) {
      ev.preventDefault()
      this.removeLines()
    } else if (ev.which === 38 && (ev.metaKey || ev.ctrlKey)) {
      ev.preventDefault()
      this.addLines()
    } else if (ev.which === 40) {
      ev.preventDefault()
      this.decreaseDimension()
    } else if (ev.which === 38) {
      ev.preventDefault()
      this.increaseDimension()
    }
  }

  addLines () {
    this.setState({lines: Math.min(this.state.lines + 10, 5000) })
  }

  removeLines () {
    this.setState({lines: Math.max(this.state.lines - 10, 10) })
  }

  decreaseDimension () {
    this.setState({dimension: Math.max(this.state.dimension - 1, 1) })
  }

  increaseDimension () {
    this.setState({dimension: Math.min(this.state.dimension + 1, 10) })
  }

  updateDimensions () {
    const w = window,
        d = document,
        documentElement = d.documentElement,
        body = d.getElementsByTagName('body')[0]
    
    const width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
        height = w.innerHeight|| documentElement.clientHeight|| body.clientHeight

    const dim = Math.min(width, height)
    const settings = { width: dim , height: dim }

    this.setState(settings)
  }
}

export default App;
