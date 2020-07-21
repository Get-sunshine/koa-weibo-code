const Koa = require('koa')
const app = new Koa();
const path = require('path');
const static = require('koa-static');
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-generic-session');
const redisStore = require('koa-redis');

const { REDIS_CONF } = require('./conf/db');
const { isProd } = require('./utils/env');
const {SESSION_SECRET_KEY}=require('./conf/secretKeys');

//blog 路由
const blogSquareApiRouter=require('./routes//api/blog-square');
const blogProfileApiRouter=require('./routes/api/blog-profile');
const blogViewRouter=require('./routes/view/blog');
const blogIndexApiRouter=require('./routes/api/blog-index');
const atMeApiRouter=require('./routes/api/blog-at');
//utils 路由
const utilsApiRouter=require('./routes/api/utils');
// user 路由
const userViewRouter = require('./routes/view/user');
const userApiRouter=require('./routes/api/user');
const errorViewRouter = require('./routes/view/error');

// error handler
let onErrorConf = {};
if (isProd) {
  onErrorConf = {
    redirect: '/error'
  }
}
onerror(app, onErrorConf);

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger());
app.use(static(__dirname + '/public'));
app.use(static(path.join(__dirname,'../uploadFiles')));
// app.use(require('koa-static')(__dirname + '/public'));
// app.use(require('koa-static')(__dirname + '../uploadFiles'));

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))
//session的配置
app.keys = [SESSION_SECRET_KEY];
app.use(session({
  key: 'weibo.sid', // cookie name 默认是 'koa.sid'
  prefix: 'weibo:sess:', // 默认是 'koa:sess:'
  cookie: {
    path: '/',
    httpOnly: true, // 仅服务端可以更改
    maxAge: 24 * 60 * 60 * 1000  //设置过期时间
  },
  // ttl:24*60*60*1000, //设置Redis的过期时间 不用写 默认和maxAge一样
  store: redisStore({
    all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
  })
}));


// routes
app.use(atMeApiRouter.routes(),atMeApiRouter.allowedMethods());
app.use(blogSquareApiRouter.routes(),blogSquareApiRouter.allowedMethods());
app.use(blogProfileApiRouter.routes(),blogProfileApiRouter.allowedMethods());
app.use(blogIndexApiRouter.routes(),blogIndexApiRouter.allowedMethods());
app.use(blogViewRouter.routes(),blogViewRouter.allowedMethods());
app.use(utilsApiRouter.routes(), utilsApiRouter.allowedMethods())
app.use(userViewRouter.routes(),userViewRouter.allowedMethods());
app.use(userApiRouter.routes(),userApiRouter.allowedMethods());
app.use(errorViewRouter.routes(), errorViewRouter.allowedMethods()); //404 的路由应该是兜底的

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
