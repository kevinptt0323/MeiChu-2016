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
import ShoppingCart     from 'material-ui/lib/svg-icons/action/shopping-cart';

const API = {
	Goods: "/shop/api/goods"
};


export default class Cart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {open: true};
	}
	toggle() {
		this.setState({open: !this.state.open});
	}
	render() {
		return (
			<SideNav width={300} openRight={true} open={this.state.open}>
				<AppBar
					iconElementLeft={<IconButton
						onTouchTap={this.toggle.bind(this)}
						><NavigationClose /></IconButton>}
					title="購物車" />
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
		this.state = {cols: 4, open: false, goods: []};

		$.ajax({
			url: this.props.goodsAPI,
			dataType: 'json',
			success: function(data) {
				this.setState({goods: data});
			}.bind(this),
			error: function(xhr, status, err) {
				//console.error(this.props.resultUrl, status, err.toString());
			}.bind(this),
			complete: function(a, b) {
			}.bind(this)
		});
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
			<div className={this.props.className}>
				<GridList cellHeight={300} cols={this.state.cols} padding={2}>
					{this.state.goods.map(good => {
						let cols = 1, rows = 1;
						if (good.id===3)
							cols = 2;
						if (good.id==4)
							rows = 2;
						return (
							<GridTile className="grid-tile" title={good.name} subtitle={good.description}
								actionIcon={<IconButton><ContentAdd color="white"/></IconButton>}
								cols={cols} rows={rows}
								onTouchTap={this.showDialog.bind(this)}
								>
								<div className="img" style={{backgroundImage: "url(" + good.src + ")"}}></div>
							</GridTile>
						);
					})}
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
	toggleCart() {
		this.refs.cartNav.toggle();
	}
	render() {
		return (
			<div>
				<Cart ref="cartNav" />
				<div className="content">
					<AppBar iconElementRight={<IconButton onTouchTap={this.toggleCart.bind(this)}><ShoppingCart /></IconButton>} title="梅後商城" style={{position: "fixed"}} />
					<Goods className="Goods" goodsAPI={API.Goods} />
				</div>
			</div>
		);
	}
}

injectTapEventPlugin();
ReactDOM.render( <MyShop />, document.getElementById('shop') );
