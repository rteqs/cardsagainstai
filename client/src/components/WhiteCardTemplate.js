
function WhiteCardTemplate(args)
{
	const outerDivStyle = {
		float: 'left',
		margin: '20px',
  		height: '250px',
  		width: '200px',
  		backgroundColor:"#fafafa",
		borderRadius: "10px"
  	}
  	const innerDivStyle = {
		marginRight: '10px',
		marginLeft: '10px',
  		width: '176px',
  	}
	console.log(args)
	return (
    	<div className="gameCards" style={outerDivStyle}>
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

export default WhiteCardTemplate;
