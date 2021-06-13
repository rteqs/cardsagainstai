/* eslint-disable */
function BlackCardTemplate(args)
{
	const outerDivStyle = {
		float: 'left',
		margin: '20px',
		height: '250px',
		width: '200px',
		backgroundColor:"#050505",
		borderRadius: "10px",
		position: 'relative',
		color: "#fafafa"
	}

	const innerDivStyle = {
		marginRight: '10px',
		marginLeft: '10px',
		width: '176px',
	}

	const blackCardText = {
		fontWeight: "bold",
		fontSize: "xlarge",
		fontFamily: 'Helvetica'
	}

	console.log(args)
	return (
		<div className="gameCards" style={outerDivStyle}>
			<div style = {innerDivStyle}>
				<header>
					<p>
						{args.text}
					</p>
				</header>
				<div style={{position: "absolute", bottom: 0, left: 0, margin: "13px"}}>
					<div style={blackCardText}>Cards</div>
					<div style={blackCardText}>Against</div>
					<div style={blackCardText}>AI</div>
				</div>
			</div>
		</div>
	);
}

export default BlackCardTemplate;
/* eslint-enable */
