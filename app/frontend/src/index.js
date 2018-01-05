'use strict';

import log from 'rainbowlog';
import React from 'react';
import { renderToString } from 'react-dom/server';
import StaticRouter from 'react-router-dom/StaticRouter';
import { matchRoutes } from 'react-router-config';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Helmet } from 'react-helmet';
import config from './core/common/config';

// 无缓存加载文件
const reload = (requiredModulePath) => {
  const resolved = require.resolve(requiredModulePath);
  const cache = require.cache[resolved];
  delete require.cache[resolved];
  try {
    return require(requiredModulePath);
  } catch (err) {
    log.error('Error occurred while reloading module, rollback to cached one.\n =>', err.stack || err);
    require.cache[resolved] = cache || (() => {});
    return require(requiredModulePath);
  }
};

// 监听文件变换
let _routes = reload('./core/router/index');
let _reducers = reload('./core/reducer/index');
let _states = reload('./core/state/index');
let Entry = reload('./page/container/index').default;

// 延时
const timeout = (time) => new Promise((resolve, reject) => {
  setTimeout(() => reject(new Error('Timed out.')), time);
});

// 获取fetchData方法
const getFetchDataFunc = (Component) => {
  if (!Component) {
    return null;
  }

  if (Component.fetchData instanceof Function) {
    return Component.fetchData;
  }

  if (Component.WrappedComponent instanceof Function) {
    return new Component.WrappedComponent().fetchData;
  }

  if (Component.WrappedComponent) {
    return getFetchDataFunc(Component.WrappedComponent);
  }

  if (Component instanceof Function) {
    return new Component().fetchData;
  }

  return null;
};

module.exports = async(ctx, next) => {
  console.log('进来了!!...', ctx.url);
  try {
    // init state
    const initState = Object.assign({}, _states, {/* put init state here before fetch data */});
    let context = {};
    // create store
    const store = createStore(_reducers.default || _reducers, initState, applyMiddleware(thunk));
    // match routes, get pages
    const pages = matchRoutes(_routes.default || _routes, ctx.path);
    // ssr fetch data
    const promises = pages.map(({ route, match }) => {
      let _component = undefined;
      let fetchData = undefined;
      // when component is a function.
      if (route.component instanceof Function) {
        if (route.component.WrappedComponent instanceof Function) {
          _component = new route.component.WrappedComponent();
        } else {
          route.component().props.load((component) => {
            _component = component.default || component;
          });
        }

        fetchData = getFetchDataFunc(_component);
      }

      // do fetch data
      return fetchData instanceof Function ? fetchData({
        dispatch: store.dispatch, match, ctx
      }) : Promise.resolve(null);
    });

    // set timeout to fetch data
    try {
      await Promise.race([
        Promise.all(promises),
        timeout(config.apiTimeout || 10000)
      ]);
    } catch (error) {
      log.error(error);
    }

    // set some other init state after fetch data.
    const initStateAfterFetchData = {};
    initStateAfterFetchData['Skylor min'] = true;
    // todo: put you init state code here, if you need.

    // dispatch state after fetch data, all
    store.dispatch({
      type: 'server_side/init_state',
      ...initStateAfterFetchData
    });

    // render to string for html
    const html = renderToString(
      <Provider store={store}>
        <StaticRouter location={ctx.url} context={context}>
          <Entry />
        </StaticRouter>
      </Provider>
    );
    // smart header
    const helmet = Helmet.renderStatic();

    // handle the special characters that javascript can't parse.
    let stateString = JSON.stringify(store.getState());
    stateString = stateString.replace(/[\u00a0\ufeff]/g, '');
    stateString = stateString.replace(/[\u2028\u2029]/g, '\\n');

    // return data for ejs template.
    const data =  {
      html,
      helmet,
      hash: reload('../hash.json').hash,
      appVersion: reload('../../../package.json').version,
      __INITIAL_STATE__: stateString,
      cdn: config.cdn || '',
      dns: config.dns || [],
      bundlePostfix: process.env.NODE_ENV === 'development' ? `?timestamp=${Date.now()}` : '',
    };
    if (data.notFound) {
      data.number = ctx.path === '/error/ie.html' ? 403 : 404;
      await ctx.status(data.number).render('error.html', data);
    } else {
      await ctx.render('index.html', data);
    }
  } catch (err) {
    log.error(err.stack || err);
    await ctx.status(500).render('error.html', {
      number: 500,
      cdn: config.cdn || '',
      dns: config.dns || [],
    });
  }
};
