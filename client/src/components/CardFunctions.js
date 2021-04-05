class WhiteCards extends React.Component {
  render() {
    <div
      className="whiteContainer"
      style={{ backgroundColor: '#ffa0a0', overflow: 'hidden' }}
    >
      <WhiteCard />
      <WhiteCard />
    </div>;
  }
}

ReactDOM.render(<WhiteCards />, document.getElementByID('out'));

