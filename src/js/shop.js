/* jslint node: true, esnext: true */
import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import AppBar           from 'material-ui/lib/app-bar';
import Dialog           from 'material-ui/lib/dialog';
import Divider          from 'material-ui/lib/divider';
import FlatButton       from 'material-ui/lib/flat-button';
import GridList         from 'material-ui/lib/grid-list/grid-list';
import GridTile         from 'material-ui/lib/grid-list/grid-tile';
import IconButton       from 'material-ui/lib/icon-button';
import List             from 'material-ui/lib/lists/list';
import ListItem         from 'material-ui/lib/lists/list-item';
import SideNav          from 'material-ui/lib/left-nav';
import RaisedButton     from 'material-ui/lib/raised-button';
//import TextField        from 'material-ui/lib/text-field';

import StarBorder       from 'material-ui/lib/svg-icons/toggle/star-border';
import NavigationClose  from 'material-ui/lib/svg-icons/navigation/close';
import ContentAdd       from 'material-ui/lib/svg-icons/content/add';
import ContentClear     from 'material-ui/lib/svg-icons/content/clear';


export default class Cart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {open: true};
	}
	render() {
		return (
			<SideNav width={300} openRight={true} open={this.state.open}>
				<AppBar iconElementLeft={<IconButton><NavigationClose /></IconButton>} title="購物車" />
				<CartList />
				<CartSummary />
			</SideNav>
		);
	}
}

export default class CartList extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<List>
				<ListItem
					rightIcon={<ContentClear />}
					primaryText="商品一"
					secondaryText="$100"
				/>
				<Divider />
				<ListItem
					rightIcon={<ContentClear />}
					primaryText="商品二"
					secondaryText="$200"
				/>
				<Divider />
				<ListItem
					rightIcon={<ContentClear />}
					primaryText="商品三"
					secondaryText="$300000000"
				/>
			</List>
		);
	}
}

export default class CartSummary extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (<div></div>);
	}
}

export default class Goods extends React.Component {
	constructor(props) {
		super(props);
		this.state = {cols: 4, open: false};
	}
	showDialog() {
		this.setState({open: true});
	}
	hideDialog() {
		this.setState({open: false});
	}
	render() {
		let data = [1,2,3,4,5,6,7,8,9,10];
		const actions = [
			<FlatButton
				label="Cancel"
				secondary={true}
				onTouchTap={this.hideDialog.bind(this)} />,
			<FlatButton
				label="Submit"
				primary={true}
				keyboardFocused={true}
				onTouchTap={this.hideDialog.bind(this)} />,
		];
		return (
			<div>
				<GridList cellHeight={300} cols={this.state.cols} padding={2}>
					<GridTile title="7122" subtitle="by kevinptt"
						actionIcon={<IconButton><ContentAdd color="white"/></IconButton>}
						cols={2} rows={2}
					></GridTile>
					{data.map(tile => (
						<GridTile title={tile} subtitle="by kevinptt"
							actionIcon={<IconButton><ContentAdd color="white"/></IconButton>}
							onTouchTap={this.showDialog.bind(this)}
							></GridTile>
					))}
				</GridList>
				<Dialog
					title="Dialog With Actions"
					actions={actions}
					modal={false}
					open={this.state.open}
					onRequestClose={this.hideDialog.bind(this)}>
					The actions in this window were passed in as an array of react objects.
				</Dialog>
			</div>
		);
	}
}

export default class MyShop extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div>
				<Cart />
				<div className="content">
					<AppBar title="梅後商城" style={{position: "fixed"}} />
					<Goods />
				</div>
			</div>
		);
	}
}

injectTapEventPlugin();
ReactDOM.render( <MyShop />, document.getElementById('shop') );
