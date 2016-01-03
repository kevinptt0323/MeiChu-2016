/* jslint node: true, esnext: true */
import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import update from 'react-addons-update';
import injectTapEventPlugin from 'react-tap-event-plugin';

import AppBar       from 'material-ui/lib/app-bar';
import Colors       from 'material-ui/lib/styles/colors';
import Dialog       from 'material-ui/lib/dialog';
import Divider      from 'material-ui/lib/divider';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import FlatButton   from 'material-ui/lib/flat-button';
import GridList     from 'material-ui/lib/grid-list/grid-list';
import GridTile     from 'material-ui/lib/grid-list/grid-tile';
import IconButton   from 'material-ui/lib/icon-button';
import List         from 'material-ui/lib/lists/list';
import ListItem     from 'material-ui/lib/lists/list-item';
import MenuItem     from 'material-ui/lib/menus/menu-item';
import Paper        from 'material-ui/lib/paper';
import SideNav      from 'material-ui/lib/left-nav';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField    from 'material-ui/lib/text-field';

import StarBorder      from 'material-ui/lib/svg-icons/toggle/star-border';
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import ContentAdd      from 'material-ui/lib/svg-icons/content/add';
import ContentClear    from 'material-ui/lib/svg-icons/content/clear';
import ShoppingCart    from 'material-ui/lib/svg-icons/action/shopping-cart';

const API = {
	Goods: "/shop/api/goods"
};


export default class Cart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {open: !props.mobile, list: [], totalPrice: 0};
	}
	toggle(val, e) {
		if (val!=null)
			this.setState({open: val});
		else
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
			<SideNav
				width={300}
				openRight={true} open={this.state.open}
				docked={!this.props.mobile}
				onRequestChange={open => this.setState({open})}>
				<AppBar
					iconElementLeft={<IconButton
						onTouchTap={this.toggle.bind(this, null)}
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
		let getNestedList = (arr) => {
		};
		this.props.list.forEach((good, index) => {
			if (good.childObj) {
				cartList.push(
					<ListItem
						key={index+".0"}
						rightIconButton={<IconButton onTouchTap={this._onRemoveClick.bind(this, index)}><ContentClear /></IconButton>}
						primaryText={good.name}
						secondaryText={good.special || good.price}
						initiallyOpen={true}
						nestedItems={good.childObj.map((sub_good, sub_index) => (
							<ListItem key={index+".0."+sub_index} primaryText={sub_good.name} />
						))}
					/>
				);
			} else {
				cartList.push(
					<ListItem
						key={index+".0"}
						rightIconButton={<IconButton onTouchTap={this._onRemoveClick.bind(this, index)}><ContentClear /></IconButton>}
						primaryText={good.name}
						secondaryText={good.special || good.price}
					/>
				);
			}
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
		this.state = {open: false, showID: 1, goods: [{id: 1, name: "", src: "", description: ""}], typeSelected: {}};

		this.confirm_queue = [];
		$.ajax({
			url: props.goodsAPI,
			dataType: 'json',
			success: function(data) {
				let typeSelected = {};
				data.forEach(good => {
					typeSelected[good.id] = {};
					for(let key in good.types) {
						typeSelected[good.id][key] = good.types[key][0].id;
					}
				});
				this.setState({goods: data, typeSelected: typeSelected});
			}.bind(this),
			error: function(xhr, status, err) {
				//console.error(this.props.resultUrl, status, err.toString());
			}.bind(this),
			complete: function(a, b) {
			}.bind(this)
		});
	}
	getGoodByID(id) {
		let ret = this.state.goods.filter(good => (good.id==id));
		return ret ? ret[0] : {};
	}
	showDialog(id) {
		this.setState({open: true, showID: id});
	}
	hideDialog() {
		this.setState({open: false});
	}
	_confirm(good, cb) {
		//console.log(good);
		cb();
	}
	_add(toAdd, isChild) {
		toAdd.childObj = toAdd.child ? toAdd.child.map(id => this._add(this.getGoodByID(id), true)) : [];
		if (toAdd.types) {
			this.confirm_queue.push(toAdd);
		}
		if (!isChild) {
			let func = this.props.handleAdd.bind(this, toAdd);
			while (this.confirm_queue && this.confirm_queue.length) {
				func = this._confirm.bind(this, this.confirm_queue.pop(), func);
			}
			func();
		}
		return toAdd;
	}
	_onAddClick(id, e) {
		this.confirm_queue = [];
		this._add(this.getGoodByID(id), false);
		e.stopPropagation();
	}
	_onDDChange(id, t_type, e, index, value) {
		let obj = {}, data = {};
		data[t_type] = value;
		obj[id] = update(this.state.typeSelected[id], {$merge: data});
		this.setState({ typeSelected: update(this.state.typeSelected, {$merge: obj}) });
	}
	render() {
		let actions = [
			<FlatButton
				label="加入購物車"
				secondary={true}
				onTouchTap={this._onAddClick.bind(this, this.state.showID)} />,
			<FlatButton
				label="關閉"
				onTouchTap={this.hideDialog.bind(this)} />,
		];
		let currGood = this.state.goods.filter(good => (good.id==this.state.showID))[0];
		return (
			<div className={this.props.className}>
				<GridList cellHeight={238} cols={this.props.mobile?1:4} padding={2}>
					{this.state.goods.map((good, index) => {
						let cols = 1, rows = 1;
						let gradientBg = 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)';
						if (!this.props.mobile) {
							if ([1, 2].indexOf(good.id)!=-1)
								rows = cols = 2;
							if ([5].indexOf(good.id)!=-1)
								cols = 2;
							if ([6].indexOf(good.id)!=-1)
								cols = 3;
						}
						if ([8].indexOf(good.id)!=-1)
							rows = 2;
						return (
							<GridTile className="grid-tile" key={index}
								title={good.name}
								actionIcon={<IconButton onTouchTap={this._onAddClick.bind(this, good.id)}><ContentAdd color="white"/></IconButton>}
								cols={cols} rows={rows}
								titleBackground={gradientBg}
								onTouchTap={this.showDialog.bind(this, good.id)}
								>
								<div className="img" style={{backgroundImage: "url(" + good.src + ")"}}></div>
							</GridTile>
						);
					})}
				</GridList>
				<Dialog
					className="dialog"
					title={currGood.name}
					width="85%"
					actions={actions}
					modal={false}
					open={this.state.open}
					autoScrollBodyContent={true}
					onRequestClose={this.hideDialog.bind(this)}>
					<div className="flex-box">
						<div className="flex-item one"> <img src={currGood.src} /> </div>
						<div className="flex-item one" dangerouslySetInnerHTML={{__html: currGood.description}}></div>
						<div className="flex-item full">{
							Object.keys(currGood.types||{}).map(t_type => (
								<DropDownMenu
									value={this.state.typeSelected[currGood.id][t_type]}
									onChange={this._onDDChange.bind(this, currGood.id, t_type)}>
									{currGood.types[t_type].map(type => (
										<MenuItem value={type.id} primaryText={type.type} />
								))}
								</DropDownMenu>
							))
						}</div>
					</div>
				</Dialog>
			</div>
		);
	}
}

export default class MyShop extends React.Component {
	constructor(props) {
		super(props);
		this.state = {mobile: true};
	}
	componentDidMount() {
		window.addEventListener('resize', this._resize_mixin_callback.bind(this));
		this._resize_mixin_callback();
	}
	_resize_mixin_callback() {
		let val = document.documentElement.clientWidth<960;
		if (this.state.mobile!=val)
			this.setState({mobile: val}, () => this.refs.cart.toggle(!this.state.mobile));
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this._resize_mixin_callback.bind(this));
	}
	toggleCart(e) {
		this.refs.cart.toggle(null, e);
	}
	addToCart(good, e) {
		this.refs.cart.add(good);
	}
	render() {
		return (
			<div>
				<Cart ref="cart" mobile={this.state.mobile} />
				<div className="content">
					<AppBar iconElementRight={<IconButton onTouchTap={this.toggleCart.bind(this)}><ShoppingCart /></IconButton>} title="梅後商城" style={{position: "fixed"}} />
					<Goods className="Goods" goodsAPI={API.Goods} handleAdd={this.addToCart.bind(this)} mobile={this.state.mobile} />
				</div>
			</div>
		);
	}
}

injectTapEventPlugin();
ReactDOM.render( <MyShop />, document.getElementById('shop') );
