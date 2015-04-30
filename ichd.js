var data = require('./id2hash.json');
var conf = require('./conf/mysql.json');
var extend = require('xtend');
var mysql = require('mysql');

var option = extend({
	multipleStatements: true
}, conf);

var con = mysql.createConnection(option);

var sql = "";
var insert_into_cards = [], insert_into_next = [], insert_into_prev = [], insert_into_family = [];

// 既存のcardsテーブルを削除
sql += "DROP TABLE IF EXISTS `cards`;";

// 既存のnextテーブルを削除
sql += "DROP TABLE IF EXISTS `next`;";

// 既存のprevテーブルを削除
sql += "DROP TABLE IF EXISTS `prev`;";

// 既存のfamilyテーブルを削除
sql += "DROP TABLE IF EXISTS `family`;";

// cardsテーブルの作成
sql += "CREATE TABLE `cards` (";
sql += "`id` int(7) unsigned NOT NULL,";
sql += "`hash` varchar(32) NOT NULL,";
sql += "`name` varchar(32) NOT NULL,";
sql += "PRIMARY KEY (`id`)";
sql += ") ENGINE=InnoDB DEFAULT CHARSET=utf8;";

// nextテーブルの作成
sql += "CREATE TABLE `next` (";
sql += "`card_id` int(7) unsigned NOT NULL,";
sql += "`next_id` int(7) unsigned NOT NULL,";
sql += "PRIMARY KEY (`card_id`)";
sql += ") ENGINE=InnoDB DEFAULT CHARSET=utf8;";

// prevテーブルの作成
sql += "CREATE TABLE `prev` (";
sql += "`card_id` int(7) unsigned NOT NULL,";
sql += "`prev_id` int(7) unsigned NOT NULL,";
sql += "PRIMARY KEY (`card_id`)";
sql += ") ENGINE=InnoDB DEFAULT CHARSET=utf8;";

// familyテーブルの作成
sql += "CREATE TABLE `family` (";
sql += "`id` varchar(15) NOT NULL,";
sql += "`card_id` int(7) unsigned NOT NULL,";
sql += "`family_id` int(7) unsigned NOT NULL,";
sql += "PRIMARY KEY (`id`)";
sql += ") ENGINE=InnoDB DEFAULT CHARSET=utf8;";

// INSERT処理
Object.keys(data).forEach(function(id){
	insert_into_cards.push("(" + data[id].id  + ",'" + data[id].hash + "','" + data[id].name + "')");
	if (data[id].hasOwnProperty('next_id')) {
		insert_into_next.push("(" + data[id].id +  "," +  data[id].next_id + ")");
	}
	if (data[id].hasOwnProperty('prev_id')) {
		insert_into_prev.push("(" + data[id].id +  "," +  data[id].prev_id + ")");
	}
	if (data[id].hasOwnProperty('id_family')) {
		data[id].id_family.forEach(function(family_id){
			insert_into_family.push("('" + data[id].id + "_" + family_id + "'," + data[id].id + "," + family_id + ")");
		});
	}
});

sql += "LOCK TABLES `cards` WRITE;";
sql += "INSERT INTO `cards` (`id`,`hash`,`name`) VALUES ";
sql += insert_into_cards.join(',') + ";";
sql += "UNLOCK TABLES;";

sql += "LOCK TABLES `next` WRITE;";
sql += "INSERT INTO `next` (`card_id`,`next_id`) VALUES ";
sql += insert_into_next.join(',') + ";";
sql += "UNLOCK TABLES;";

sql += "LOCK TABLES `prev` WRITE;";
sql += "INSERT INTO `prev` (`card_id`,`prev_id`) VALUES ";
sql += insert_into_prev.join(',') + ";";
sql += "UNLOCK TABLES;";

sql += "LOCK TABLES `family` WRITE;";
sql += "INSERT INTO `family` (`id`,`card_id`,`family_id`) VALUES ";
sql += insert_into_family.join(',') + ";";
sql += "UNLOCK TABLES;";

// DBへの接続
con.connect(function(e){

	// 失敗時
	if (e) {
		console.error('データベースの接続に失敗: ' + e.stack);
		return;
	}

	// クエリの実行
	var query = con.query(sql);
	console.log('クエリを実行しています...');
	query
		.on('error', function(e){
			console.error(e.stack);
		})
		.on('result', function(res){
		})
		.on('end', function(){
			console.log('クエリの実行が完了しました');
			con.destroy();
		});
});
