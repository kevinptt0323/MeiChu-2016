/* jslint node: true, esnext: true */
import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import AppBar           from 'material-ui/lib/app-bar';
import CircularProgress from 'material-ui/lib/circular-progress';
import Dialog           from 'material-ui/lib/dialog';
import FlatButton       from 'material-ui/lib/flat-button';
import StarBorder       from 'material-ui/lib/svg-icons/toggle/star-border';
import GridList         from 'material-ui/lib/grid-list/grid-list';
import GridTile         from 'material-ui/lib/grid-list/grid-tile';
import IconButton       from 'material-ui/lib/icon-button';
import SideNav          from 'material-ui/lib/left-nav';
import Paper            from 'material-ui/lib/paper';
import RaisedButton     from 'material-ui/lib/raised-button';
import TextField        from 'material-ui/lib/text-field';
import injectTapEventPlugin from 'react-tap-event-plugin';

export default class Cart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {open: true};
	}
	render() {
		return <SideNav width={300} openRight={true} open={this.state.open}></SideNav>;
	}
}

export default class Goods extends React.Component {
	constructor(props) {
		super(props);
		this.state = {cols: 4}
	}
	render() {
		let data = [1,2,3,4,5,6,7,8,9,10];
		return (
			<GridList cellHeight={300} cols={this.state.cols}>
				{data.map(tile => (
					<GridTile title={tile} subtitle="by kevinptt"
						actionIcon={<IconButton><StarBorder color="white"/></IconButton>}
						></GridTile>
				))}
			</GridList>
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
					<AppBar title="梅後商城" />
					<Goods />
				</div>
			</div>
		);
	}
}

ReactDOM.render( <MyShop />, document.getElementById('shop') );
