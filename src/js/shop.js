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
import IconMenu     from 'material-ui/lib/menus/icon-menu';
import List         from 'material-ui/lib/lists/list';
import ListItem     from 'material-ui/lib/lists/list-item';
import MenuItem     from 'material-ui/lib/menus/menu-item';
import Paper        from 'material-ui/lib/paper';
import SideNav      from 'material-ui/lib/left-nav';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField    from 'material-ui/lib/text-field';

import Close        from 'material-ui/lib/svg-icons/navigation/close';
import MoreVert     from 'material-ui/lib/svg-icons/navigation/more-vert';
import ContentAdd   from 'material-ui/lib/svg-icons/content/add';
import ContentClear from 'material-ui/lib/svg-icons/content/clear';
import ShoppingCart from 'material-ui/lib/svg-icons/action/shopping-cart';

const API = {
	Goods: "/shop/api/goods"
};


export default class Cart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
				navOpen: !props.mobile,
				dialogOpen: false,
				list: [],
				totalPrice: 0,
				errorText: {},
				sendable: false,
				inputData: {}
			};
	}
	toggle(val, e) {
		if (val!=null)
			this.setState({navOpen: val});
		else
			this.setState({navOpen: !this.state.navOpen});
	}
	add(good, typeSelected) {
		let newGood = update(good, {$merge: {typeSelected: typeSelected}});
		let newList = update(this.state.list, {$push: [newGood]});
		let newPrice = newList.reduce((a, b) => a+(b.special||b.price), 0)
		this.setState({list: newList, totalPrice: newPrice});
	}
	remove(index) {
		let newList = update(this.state.list, {$splice: [[index, 1]]});
		let newPrice = newList.reduce((a, b) => a+(b.special||b.price), 0)
		this.setState({list: newList, totalPrice: newPrice});
	}
	checkout(e) {
		this.showDialog();
	}
	showDialog(id) {
		this.setState({dialogOpen: true});
	}
	hideDialog() {
		this.setState({dialogOpen: false});
	}
	clearList(e) {
		this.setState({list: [], totalPrice: 0});
	}
	_checkEmpty(key, e) {
		let errorText2 = {}, inputData2 = {};
		errorText2[key] = e.target.value ? '' : '不可為空白',
		inputData2[key] = e.target.value;
		errorText2 = update(this.state.errorText, {$merge: errorText2});
		inputData2 = update(this.state.inputData, {$merge: inputData2});
		this.setState({
			errorText: errorText2,
			inputData: inputData2,
			sendable: inputData2.name && inputData2.studentID && inputData2.phone && inputData2.email
		});
	}
	render() {
		let actions = [
			<FlatButton
				label="送出訂單"
				disabled={!this.state.sendable}
				secondary={true}
				 />,
			<FlatButton
				label="取消"
				onTouchTap={this.hideDialog.bind(this)} />,
		];
		return (
			<SideNav
				width={300}
				openRight={true} open={this.state.navOpen}
				docked={!this.props.mobile}
				onRequestChange={navOpen => this.setState({navOpen})}>
				<AppBar
					iconElementLeft={<IconButton onTouchTap={this.toggle.bind(this, null)}><Close /></IconButton>}
					iconElementRight={
						<IconMenu
							iconButtonElement={
								<IconButton><MoreVert /></IconButton>
							}
							targetOrigin={{horizontal: 'right', vertical: 'top'}}
							anchorOrigin={{horizontal: 'right', vertical: 'top'}}
						>
							<MenuItem primaryText="立即結帳" onTouchTap={this.checkout.bind(this)} />
							<MenuItem primaryText="清空購物車" onTouchTap={this.clearList.bind(this)} />
						</IconMenu>
					}
					title="購物車" />
				<CartList list={this.state.list} handleRemove={this.remove.bind(this)} />
				<CartSummary totalPrice={this.state.totalPrice} />
				<Dialog
					className="cart-dialog"
					title="結帳"
					width="85%"
					actions={actions}
					open={this.state.dialogOpen}
					autoScrollBodyContent={true}
					onRequestClose={this.hideDialog.bind(this)}>
					<div style={{display: this.props.mobile?"block":"flex"}}>
						<TextField
							className="input"
							fullWidth={true}
							errorText={this.state.errorText.name||""}
							floatingLabelText="姓名"
							onChange={this._checkEmpty.bind(this, 'name')} />
						<TextField
							className="input"
							fullWidth={true}
							errorText={this.state.errorText.studentID||""}
							floatingLabelText="學號"
							onChange={this._checkEmpty.bind(this, 'studentID')} />
						<TextField
							className="input"
							fullWidth={true}
							errorText={this.state.errorText.phone||""}
							floatingLabelText="電話"
							onChange={this._checkEmpty.bind(this, 'phone')} />
						<TextField
							className="input"
							fullWidth={true}
							errorText={this.state.errorText.email||""}
							floatingLabelText="email"
							onChange={this._checkEmpty.bind(this, 'email')} />
					</div>
				</Dialog>
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
			let price = (good.special) ? (
				<div className="special price">
					<span className="retail" style={{color: Colors.grey500}}>{good.price}</span>&nbsp;
					<span className="special" style={{color: Colors.pink300}}>{good.special}</span>
				</div>
			) : (
				<div className="price">
					<span className="retail">{good.price}</span>
				</div>
			);
			let getName = (good) => {
				let typeStr = Object.keys(good.typeSelected||{}).map(t_type => good.types[t_type].filter(tt => tt.id==good.typeSelected[t_type])[0].type).join(",");
				return good.name + (typeStr.length ? "(" + typeStr + ")" : "");
			}
			if (good.childObj) {
				cartList.push(
					<ListItem
						key={index+".0"}
						rightIconButton={<IconButton onTouchTap={this._onRemoveClick.bind(this, index)}><ContentClear /></IconButton>}
						primaryText={getName(good)}
						secondaryText={price}
						initiallyOpen={true}
						nestedItems={good.childObj.map((sub_good, sub_index) => (
							<ListItem key={index+".0."+sub_index} primaryText={getName(sub_good)} />
						))}
					/>
				);
			} else {
				cartList.push(
					<ListItem
						key={index+".0"}
						rightIconButton={<IconButton onTouchTap={this._onRemoveClick.bind(this, index)}><ContentClear /></IconButton>}
						primaryText={getName(good)}
						secondaryText={price}
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
		toAdd.childObj = toAdd.child ? toAdd.child.map(id => {
			let obj = update(this._add(this.getGoodByID(id), true), {$merge: {typeSelected: this.state.typeSelected[id]}});
			return obj;
		}) : [];
		if (toAdd.types) {
			this.confirm_queue.push(toAdd);
		}
		if (!isChild) {
			let func = this.props.handleAdd.bind(this, toAdd, this.state.typeSelected[toAdd.id]);
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
		let currGood = this.state.goods.filter(good => (good.id==this.state.showID))[0];
		let dropdown =
			Object.keys(currGood.types||{}).map(t_type => (
				<DropDownMenu
					key={currGood.id + "." + t_type}
					maxHeight={220}
					value={this.state.typeSelected[currGood.id][t_type]}
					onChange={this._onDDChange.bind(this, currGood.id, t_type)}>
					{currGood.types[t_type].map((type,index) => (
						<MenuItem key={currGood.id + "." + t_type + "." + index} value={type.id} primaryText={type.type} />
				))}
				</DropDownMenu>
			));
		let actions = dropdown.concat([
			<FlatButton
				label="加入購物車"
				secondary={true}
				onTouchTap={this._onAddClick.bind(this, this.state.showID)} />,
			<FlatButton
				label="關閉"
				onTouchTap={this.hideDialog.bind(this)} />,
		]);
		let price = (currGood.special) ? (
			<span className="special price">
				<span className="retail" style={{color: Colors.grey500}}>{currGood.price}</span>&nbsp;
				<span className="special" style={{color: Colors.pink300}}>{currGood.special}</span>
			</span>
		) : (
			<span className="price">
				<span className="retail">{currGood.price}</span>
			</span>
		);
		return (
			<div className={this.props.className}>
				<GridList cellHeight={238} cols={this.props.mobile?1:4} padding={5}>
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
						let price = (good.special) ? (
							<span className="special price">
								<span className="retail" style={{color: Colors.grey400}}>{good.price}</span>&nbsp;
								<span className="special" style={{color: Colors.pink300}}>{good.special}</span>
							</span>
						) : (
							<span className="price">
								<span className="retail" style={{color: Colors.grey200}}>{good.price}</span>
							</span>
						);
						return (
							<GridTile className="grid-tile" key={index}
								title={good.name}
								subtitle={price}
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
					open={this.state.open}
					autoScrollBodyContent={true}
					onRequestClose={this.hideDialog.bind(this)}>
					<div className="flex-box">
						<div className="flex-item one"> <img src={currGood.src} /> </div>
						<div className="flex-item one">
							<div dangerouslySetInnerHTML={{__html: currGood.description}}></div>
							<div style={{textAlign: "right"}}>售價：{price}</div>
						</div>
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
	addToCart(good, typeSelected, e) {
		this.refs.cart.add(good, typeSelected);
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
