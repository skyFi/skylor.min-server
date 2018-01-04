CREATE TABLE `blog`.`authorization` (
	`provider` varchar(20) DEFAULT NULL COMMENT 'provider name, like github, twitter, facebook, weibo and so on',
	`uid` int(11) NOT NULL COMMENT 'provider unique id',
	`user_id` int(11) NOT NULL COMMENT 'current application user id',
	`id` int(11) NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (`id`),
	UNIQUE `key_u_uid` USING BTREE (`uid`) comment '',
	INDEX `key_user_id` USING BTREE (`user_id`) comment '',
	INDEX `key_provider` USING BTREE (`provider`) comment ''
) ENGINE=`InnoDB` AUTO_INCREMENT=1 DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ROW_FORMAT=DYNAMIC COMMENT='' CHECKSUM=0 DELAY_KEY_WRITE=0;
