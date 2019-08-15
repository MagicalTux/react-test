import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import Helmet from 'react-helmet';

const middlewares = [];

export default function (options, cbk) {
	cbk = global[cbk];
	let result = {
		uuid: options.uuid,
		app: null, // HTML of app tag
		title: null,
		meta: null,
		initial: {},
		error: null,
		redirect: null
	};

	const store = createStore(
		{}, // reducers
		{}, // state
		applyMiddleware.apply(null, middlewares)
	);

	try {
		match({ routes: createRoutes({store, first: { time: false }}), location: options.url }, (error, redirectLocation, renderProps) => {
			try {
				if (error) {
					result.error = error;
				} else if (redirectLocation) {
					result.redirect = redirectLocation.pathname + redirectLocation.search;
				} else {
					result.app = renderToString(
						<Provider store={store}>
							<RouterContext {...renderProps} />
						</Provider>
					);
					const { title, meta } = Helmet.rewind();
					result.title = title.toString();
					result.meta = meta.toString();
					result.initial["--app-initial"] = JSON.stringify(store.getState());
				}
			} catch(e) {
				result.error = e;
			}
			return cbk(result);
		});
	} catch(e) {
		result.error = e;
		return cbk(result);
	}
}
