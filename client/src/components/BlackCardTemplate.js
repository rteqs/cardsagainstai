function BlackCardTemplate(args)
{
	const outerDivStyle = {
    float: 'left',
		margin: '20px',
  	height: '250px',
  	width: '200px',
  	backgroundColor:"#050505",
     borderRadius: "10px"
  	}
	const innerDivStyle = {
    marginRight: '10px',
    marginLeft: '10px',
      width: '176px',
      color: 'white',
    }
  console.log(args)
  return (
      <div className="Card" style={outerDivStyle}>
        <div style = {innerDivStyle}>
            <header className="A card">
              <p>
                {args.text}
              </p>
            </header>
          </div>
      </div>
    );
}

export default BlackCardTemplate;
