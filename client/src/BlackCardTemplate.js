function BlackCardTemplate(text)
{
	const holdText = "The greatest accomplisment DG has is ______."
	const outerDivStyle = {
    float: 'left',
		margin: '40px',
  		border: '2px solid pink',
  		height: '300px',
  		width: '200px',
  		backgroundColor:"#050505",
  	}
	const innerDivStyle = {
    marginRight: '10px',
    marginLeft: '10px',
      width: '176px',
      color: 'white',
    }
  console.log(text)
  return (
      <div className="Card" style={outerDivStyle}>
        <div style = {innerDivStyle}>
            <header className="A card">
              <p>
                {holdText}
              </p>
            </header>
          </div>
      </div>
    );
}

export default BlackCardTemplate;
