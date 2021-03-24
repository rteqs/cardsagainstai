function WhiteCardTemplate(text)
{
	const holdText = "Tal and his emoji scheduling."
	const outerDivStyle = {
		float: 'left',
		margin: '40px',
  		border: '2px solid pink',
  		height: '300px',
  		width: '200px',
  		backgroundColor:"#fafafa",
  	}
  	const innerDivStyle = {
		marginRight: '10px',
		marginLeft: '10px',
  		width: '176px',
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

export default WhiteCardTemplate;
