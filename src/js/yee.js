/* jslint node: true, esnext: true */
import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import update from 'react-addons-update';
import injectTapEventPlugin from 'react-tap-event-plugin';

import AppBar             from 'material-ui/lib/app-bar';
import FlatButton         from 'material-ui/lib/flat-button';
import IconButton         from 'material-ui/lib/icon-button';
import IconMenu           from 'material-ui/lib/menus/icon-menu';
import MenuItem           from 'material-ui/lib/menus/menu-item';
import Table              from 'material-ui/lib/table/table';
import TableBody          from 'material-ui/lib/table/table-body';
import TableFooter        from 'material-ui/lib/table/table-footer';
import TableHeader        from 'material-ui/lib/table/table-header';
import TableHeaderColumn  from 'material-ui/lib/table/table-header-column';
import TableRow           from 'material-ui/lib/table/table-row';
import TableRowColumn     from 'material-ui/lib/table/table-row-column';

import Close        from 'material-ui/lib/svg-icons/navigation/close';
import ExpandMore   from 'material-ui/lib/svg-icons/navigation/expand-more';

const API = {
	Goods: "/shop/api/goods",
	Orders: "/shop/api/orders"
};

export default class MyTableRow extends React.Component {
	constructor(props) {
		super(props);
	}
	shouldComponentUpdate(nextProps, nextState) {
		if ( nextProps.order === null || this.props.order === null
			|| nextProps.order.id !== this.props.order.id
			|| nextProps.order.paid_at !== this.props.order.paid_at
			|| nextProps.order.picked_at !== this.props.order.picked_at
			|| nextProps.order.deleted_at !== this.props.order.deleted_at) {
			console.log("rerender");
			return true;
		} else
			return false;
	}
	render() {
		return this.props.order&&!this.props.order.deleted_at ? (
			<TableRow>{ this.props.children }</TableRow>
		) : (
			<TableRow style={{display: "none"}}>{ this.props.children }</TableRow>
		);
	}
}

export default class OrderList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {orders: [], sending: false, showIndex: 0, showList: true};

		$.ajax({
			url: props.ordersAPI,
			dataType: 'json',
			success: function(data) {
				this.setState({orders: data.data});
			}.bind(this),
			error: function(xhr, status, err) {
				//console.error(this.props.resultUrl, status, err.toString());
			}.bind(this),
			complete: function(a, b) {
			}.bind(this)
		});
	}
	action(id, index, action, e) {
		this.setState({sending: true});
		let sendData = { id: id, action: action };
		$.ajax({
			url: this.props.ordersAPI + "/" + id,
			type: 'post',
			contentType: "application/json",
			dataType: 'json',
			data: JSON.stringify(sendData),
			success: function(data) {
				this.setState({ orders: update(this.state.orders, {$splice: [[index, 1, data.data]]}) });
			}.bind(this),
			error: function(data, status, err) {
			}.bind(this),
			complete: function(a, b) {
				this.setState({sending: false});
			}.bind(this)
		});
	}
  showList(index, e) {
    this.setState({showIndex: index, showList: true});
  }
	render() {
		let textCenter = {textAlign: "center"};
		let getName = good => {
				let typeStr = good.types.map(type => type.type.name).join(",");
				return good.good.name + (good.types.length ? "(" + typeStr + ")" : "");
		};
		return (
			<div style={{marginTop: "64px"}}>
				<Table selectable={false} fixedHeader={true}>
					<TableHeader>
						<TableRow>
							<TableHeaderColumn style={textCenter}>訂單編號</TableHeaderColumn>
							<TableHeaderColumn style={textCenter}>姓名</TableHeaderColumn>
							<TableHeaderColumn style={textCenter}>學號</TableHeaderColumn>
							<TableHeaderColumn style={textCenter}>手機</TableHeaderColumn>
							<TableHeaderColumn style={textCenter}>email</TableHeaderColumn>
							<TableHeaderColumn style={textCenter}>總額</TableHeaderColumn>
							<TableHeaderColumn style={textCenter}>下單時間</TableHeaderColumn>
							<TableHeaderColumn style={textCenter}>繳費時間</TableHeaderColumn>
							<TableHeaderColumn style={textCenter}>領貨時間</TableHeaderColumn>
							<TableHeaderColumn style={textCenter}>購買商品</TableHeaderColumn>
							<TableHeaderColumn style={textCenter}>刪除</TableHeaderColumn>
						</TableRow>
					</TableHeader>
					<TableBody showRowHover={true} preScanRows={false}>{
						this.state.orders.map((order,index) => (
							<MyTableRow key={index} order={order}>
								<TableRowColumn style={textCenter}>{order.id}</TableRowColumn>
								<TableRowColumn style={textCenter}>{order.name}</TableRowColumn>
								<TableRowColumn style={textCenter}>{order.studentID}</TableRowColumn>
								<TableRowColumn style={textCenter}>{order.phone}</TableRowColumn>
								<TableRowColumn style={textCenter}>{order.email}</TableRowColumn>
								<TableRowColumn style={textCenter}>{order.total}</TableRowColumn>
								<TableRowColumn style={textCenter}>{order.created_at}</TableRowColumn>
								<TableRowColumn style={textCenter}>{order.paid_at?order.paid_at:
									<FlatButton
										label="登記繳費"
										secondary={true}
										onTouchTap={this.action.bind(this, order.id, index, "paid")} />
								}</TableRowColumn>
								<TableRowColumn style={textCenter}>{order.picked_at?order.picked_at:
									<FlatButton
										label="登記取貨"
										secondary={true}
										onTouchTap={this.action.bind(this, order.id, index, "picked")} />
								}</TableRowColumn>
								<TableRowColumn style={textCenter}>{
									<IconMenu
										iconButtonElement={<ExpandMore />}
										desktop={!this.props.mobile}
										maxHeight={300}
										targetOrigin={{horizontal: 'right', vertical: 'top'}}
										anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
										{order.goods.map((good,index) => (
											<MenuItem key={index} primaryText={getName(good)} />
										))}
									</IconMenu>
								}</TableRowColumn>
								<TableRowColumn style={textCenter}>{
									<FlatButton
										label="刪除"
										primary={true}
										onTouchTap={this.action.bind(this, order.id, index, "deleted")} />
								}</TableRowColumn>
							</MyTableRow>
						))
					}</TableBody>
				</Table>
			</div>
		);
	}
}

export default class MyShopAdmin extends React.Component {
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
			this.setState({mobile: val});
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this._resize_mixin_callback.bind(this));
	}
	render() {
		return (
			<div>
				<AppBar title="梅後商城管理系統" style={{position: "fixed", top: "0"}} />
				<OrderList ordersAPI={API.Orders} mobile={this.state.mobile} />
			</div>
		);
	}
}

injectTapEventPlugin();
ReactDOM.render( <MyShopAdmin />, document.getElementById('admin') );
