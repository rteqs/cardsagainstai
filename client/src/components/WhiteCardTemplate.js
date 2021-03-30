import "../styles/gameScreen.css";

function WhiteCardTemplate(args)
{
	const outerDivStyle = {
		float: 'left',
		margin: '20px',
  		height: '250px',
  		width: '200px',
  		backgroundColor:"#fafafa",
		borderRadius: "10px",
		position: 'relative',
		transition: "rotation .1s ease-in-out",
  	}
  	const innerDivStyle = {
		marginRight: '10px',
		marginLeft: '10px',
  		width: '176px',
  	}

	const whiteCardText = {
		fontWeight: "bold",
		fontSize: "xlarge",
		fontFamily: 'Helvetica'
	}
	console.log(args)
	return (
    	<div className="gameWhiteCard" style={outerDivStyle}>
    		<div style = {innerDivStyle}>
	      		<header className="A card">
	        		<p>
	         			{args.text}
	        		</p>
	      		</header>
				<div style={{position: "absolute", bottom: 0, left: 0, margin: "13px"}}>
					<div style={whiteCardText}>Cards</div>
					<div style={whiteCardText}>Against</div>
					<div style={whiteCardText}>AI</div>
				</div>

	      	</div>
    	</div>
  	);
}

export default WhiteCardTemplate;
