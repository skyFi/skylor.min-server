'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async findOne({ id }) {
    return await this.app.mysql.get('user', { id });
  }

  async findOrCreateOrUpdate(user) {
    const now = new Date();
    const newUser = {
      username: user.username,
      display_name: user.displayName,
      profile_url: user.profileUrl,
      photos: user.photos,
      provider: user.provider,
      photo: user.photo,
      access_token: user.accessToken,
      refresh_token: user.refreshToken,
      avatar_url: user.avatar_url,
      url: user.url,
      html_url: user.html_url,
      company: user.company,
      blog: user.blog,
      location: user.location,
      email: user.email,
      bio: user.bio,
      created_at: user.created_at,
      updated_at: user.updated_at,
      public_repos: user.public_repos,
      followers: user.followers,
      public_gists: user.public_gists,
      following: user.following,
      update_time: now,
    };
    let _user = await this.app.mysql.get('user', { username: user.username });
    if (!_user) {
      newUser.create_time = now;
      _user = await this.app.mysql.insert('user', newUser);
    } else {
      _user = Object.assign(_user, newUser);
      await this.app.mysql.update('user', _user);
    }
    return _user;
  }
}

module.exports = UserService;
