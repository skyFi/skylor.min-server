'use strict';

module.exports = app => {
  console.log('use', app.view.use);
  app.passport.verify(async (ctx, user) => {
    const profile = user.profile;
    const existsUser = await ctx.service.user.findOrCreateOrUpdate(Object.assign({}, user, profile, profile._json));
    await ctx.service.authorization.findOrCreate({
      uid: user.id,
      provider: user.provider,
      user_id: existsUser.id,
    });
    return existsUser;
  });

  // 将用户信息序列化后存进 session 里面，一般需要精简，只保存个别字段
  app.passport.serializeUser(async (ctx, user) => {
    return user;
  });

  // 反序列化后把用户信息从 session 中取出来，反查数据库拿到完整信息
  app.passport.deserializeUser(async (ctx, user) => {
    return user;
  });
};
