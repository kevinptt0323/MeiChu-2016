/* jslint node: true, esnext: true */
import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import update from 'react-addons-update';
import injectTapEventPlugin from 'react-tap-event-plugin';

import AppBar           from 'material-ui/lib/app-bar';
import Colors           from 'material-ui/lib/styles/colors';
import Dialog           from 'material-ui/lib/dialog';
import Divider          from 'material-ui/lib/divider';
import FlatButton       from 'material-ui/lib/flat-button';
import GridList         from 'material-ui/lib/grid-list/grid-list';
import GridTile         from 'material-ui/lib/grid-list/grid-tile';
import IconButton       from 'material-ui/lib/icon-button';
import List             from 'material-ui/lib/lists/list';
import ListItem         from 'material-ui/lib/lists/list-item';
import Paper            from 'material-ui/lib/paper';
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
		this.state = {open: true, list: [], totalPrice: 0};
	}
	toggle() {
		this.setState({open: !this.state.open});
	}
	updatePrice() {
		this.setState({ totalPrice: this.state.list.reduce((a, b) => a+(b.special||b.price), 0) });
	}
	add(good) {
		this.setState({ list: update(this.state.list, {$push: [good]}) }, this.updatePrice);
	}
	remove(index) {
		this.setState({ list: update(this.state.list, {$splice: [[index, 1]]}) }, this.updatePrice);
	}
	render() {
		return (
			<SideNav width={300} openRight={true} open={this.state.open}>
				<AppBar
					iconElementLeft={<IconButton
						onTouchTap={this.toggle.bind(this)}
						><NavigationClose /></IconButton>}
					title="購物車" />
				<CartList list={this.state.list} handleRemove={this.remove.bind(this)} />
				<CartSummary totalPrice={this.state.totalPrice} />
			</SideNav>
		);
	}
}

export default class CartList extends React.Component {
	constructor(props) {
		super(props);
	}
	_onRemoveClick(index, e) {
		this.props.handleRemove(index);
		e.stopPropagation();
	}
	render() {
		let cartList = [];
		this.props.list.forEach((good, index) => {
			cartList.push(
				<ListItem
					key={index+".0"}
					rightIconButton={<IconButton onTouchTap={this._onRemoveClick.bind(this, index)}><ContentClear /></IconButton>}
					primaryText={good.name}
					secondaryText={good.special || good.price}
				/>
			);
			cartList.push(<Divider key={index+".1"}/>);
		});
		return (
			<List className="cart-list">
				{ cartList }
			</List>
		);
	}
}

export default class CartSummary extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<Paper zDepth={3} className="cart-summary">
				總價：<span style={{color: Colors.cyan500}}>{this.props.totalPrice}</span>
			</Paper>
		);
	}
}

export default class Goods extends React.Component {
	constructor(props) {
		super(props);
		this.state = {cols: 4, open: false, goods: []};

		$.ajax({
			url: props.goodsAPI,
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
	showDialog(e) {
		this.setState({open: true});
	}
	hideDialog() {
		this.setState({open: false});
	}
	_onAddClick(id, e) {
		let toAdd = this.state.goods.filter(good => (good.id==id));
		this.props.handleAdd(toAdd[0]);
		e.stopPropagation();
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
				<GridList cellHeight={270} cols={this.state.cols} padding={2}>
					{this.state.goods.map((good, index) => {
						let cols = 1, rows = 1;
						let gradientBg = 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)';
						if ([1, 2].indexOf(good.id)!=-1)
							rows = cols = 2;
						if ([5].indexOf(good.id)!=-1)
							cols = 2;
						if ([6].indexOf(good.id)!=-1)
							cols = 3;
						if ([8].indexOf(good.id)!=-1)
							rows = 2;
						return (
							<GridTile className="grid-tile" key={index}
								title={good.name}
								actionIcon={<IconButton onTouchTap={this._onAddClick.bind(this, good.id)}><ContentAdd color="white"/></IconButton>}
								cols={cols} rows={rows}
								titleBackground={gradientBg}
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
		this.refs.cart.toggle();
	}
	addToCart(good) {
		this.refs.cart.add(good);
	}
	render() {
		return (
			<div>
				<Cart ref="cart" />
				<div className="content">
					<AppBar iconElementRight={<IconButton onTouchTap={this.toggleCart.bind(this)}><ShoppingCart /></IconButton>} title="梅後商城" style={{position: "fixed"}} />
					<Goods className="Goods" goodsAPI={API.Goods} handleAdd={this.addToCart.bind(this)}/>
				</div>
			</div>
		);
	}
}

injectTapEventPlugin();
ReactDOM.render( <MyShop />, document.getElementById('shop') );
