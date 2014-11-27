/**
 * @jsx React.DOM
 */
'use strict';


var React       = require('react');
var ReactAsync  = require('react-async');
var ReactRouter = require('react-router-component');
var superagent  = require('superagent');

var Pages       = ReactRouter.Pages;
var Page        = ReactRouter.Page;
var NotFound    = ReactRouter.NotFound;
var Link        = ReactRouter.Link;

var _ = require('lodash');

var MainPage = React.createClass({
    mixins: [ReactAsync.Mixin],
    statics: {
        getPodcasts: function(cb) {
            superagent.get(
                'http://localhost:8888/podcasts',
                function(err, res) {
                    cb(err, res ? { items: res.body }: null)
                }
            )
        }
    },
    getInitialStateAsync: function(cb) {
        this.type.getPodcasts(cb);
    },
    render: function() {
        var items = [];
        _.each(this.state.items, function(item){
            items.push(
                <li key={item._id} className="Podcast"><Link href={"/podcasts/" + item._id}>{item.name}</Link></li>
            );
        });

        return (
            <div className="PodcastListPage">
                <ul className="PodcastList">{items}</ul>
                <p><Link href="/podcasts/off-the-crossbar">Login</Link></p>
            </div>
            );
    }
});
var PodcastPage = React.createClass({
    mixins: [ReactAsync.Mixin],

    statics: {
        getPodcastInfo: function(podcast, cb) {
            superagent.get(
                'http://localhost:8888/podcasts/' + podcast,
                function(err, res) {
                    cb(err, res ? res.body : null);
                });
        }
    },

    getInitialStateAsync: function(cb) {
        this.type.getPodcastInfo(this.props.podcast, cb);
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.props.podcast !== nextProps.podcast) {
            this.type.getPodcastInfo(nextProps.podcast, function(err, info) {
                if (err) {
                    throw err;
                }
                this.setState(info);
            }.bind(this));
        }
    },

    render: function() {
        var otherUser = this.props.podcast === 'off-the-crossbar' ? 'off-the-crossbar-2' : 'off-the-crossbar';
        return (
            <div className="PodcastPage">
                <h1>Hello, {this.state.name}!</h1>
                <p>
                Go to <Link href={"/podcasts/" + otherUser}>/users/{otherUser}</Link>
                </p>
                <p><Link href="/">Logout</Link></p>
            </div>
            );
    }
});

var NotFoundHandler = React.createClass({

    render: function() {
        return (
            <p>Page not found</p>
            );
    }
});

var App = React.createClass({

    render: function() {
        return (
            <html>
                <head>
                    <link rel="stylesheet" href="/node_modules/normalize.css/normalize.css" />
                    <link rel="stylesheet" href="/assets/style.css" />
                    <script src="/assets/bundle.js" />
                </head>
                <Pages className="App" path={this.props.path}>
                    <Page path="/" handler={MainPage} />
                    <Page path="/podcasts" handler={MainPage} />
                    <Page path="/podcasts/:podcast" handler={PodcastPage} />
                    <NotFound handler={NotFoundHandler} />
                </Pages>
            </html>
            );
    }
});

module.exports = App;

if (typeof window !== 'undefined') {
    window.onload = function() {
        React.renderComponent(App(), document);
    }
}