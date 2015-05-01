# imas_cg_hash_db

## 概要

ISA氏の[imas_cg_hash](https://github.com/isaisstillalive/imas_cg_hash)をデータベースにインポートするJavaScriptです。とりあえずMySQLのみ対応しています。

## 要件

- Node
- MySQL

## 準備

初めて使うときは、専用のデータベースとユーザを作成します。

```sql
CREATE DATABASE IF NOT EXISTS `imas_cg_hash`;
GRANT SELECT,INSERT,CREATE,DROP,LOCK TABLES ON imas_cg_hash.* TO ichd@localhost IDENTIFIED BY 'EEXvM/Yc';
```

パッケージをインストールします。

```console
$ npm i
```

## インポート

`ichd.js`を実行してください。

```console
$ node ichd.js
```

## テーブル構成

`ichd.js`を実行すると4つのテーブルが作成されます。

### cardsテーブル

id
: カードのID

hash
: カードのハッシュ値

name
: カードの名前

### nextテーブル

card_id
: カードのID

next_id
: 特訓後のカードのID

### prevテーブル

card_id
: カードのID

prev_id
: 特訓前のカードのID

### familyテーブル

id
: 行の一意なID（card_idとfamily_idを繋げたもの）

card_id
: カードのID

family_id
: 同系列のカードのID

## 使い方

例えば、次のクエリを実行してみます。

```sql
SELECT `id`,`name`,`hash` FROM `cards` AS `c`
INNER JOIN (
    SELECT `family_id` FROM `cards` AS `c`
    INNER JOIN `family` AS `f`
    ON (`c`.`id` = `f`.`card_id`)
    WHERE `c`.`id` = 3202801
) AS `j`
ON (`c`.`id` = `j`.`family_id`);
```

すると3202801と同系列のカードの情報を一覧で取得することができます。

```console
+---------+-----------------------------+----------------------------------+
| id      | name                        | hash                             |
+---------+-----------------------------+----------------------------------+
| 3202801 | [制服ｵﾚﾝｼﾞ]星井美希         | ebb522ecfbd377353069ebd81c91fb16 |
| 3202802 | [制服ﾚｯﾄﾞ]星井美希          | 6b3065f0a962d20cff5d955a3dbc4314 |
| 3202803 | [制服ﾌﾞﾙｰ]星井美希          | 04c878def0b7d2bb8dda5f2f756ab53d |
| 3202804 | [制服ｸﾞﾘｰﾝ]星井美希         | a79af47eae779e8bea9e4d779616fb2f |
| 3302805 | [ﾋﾟﾝｸﾀﾞｲﾔﾓﾝﾄﾞ765]星井美希+  | 5831bf84cae2c72d1e14475a3d10a4fd |
| 3302806 | [ｷﾞﾙﾃﾞｯﾄﾞﾏﾄﾞﾓｱｾﾞﾙ]星井美希+ | a9ed29a9f57923d25c99a7439136e26d |
| 3302807 | [ﾒｲﾃﾞﾝｲﾝﾌﾞﾗｯｸ]星井美希+     | 9ba2da0a155f2a20df7aa61826b2883c |
| 3302808 | [ﾍﾞｲﾋﾞｰﾌﾞﾙｰｼﾞｬｶﾞｰ]星井美希+ | ff56ed5787d63f5a6a73ab567452cd49 |
| 3302809 | [ﾄﾜｲﾗｲﾄｻﾌｧﾘ]星井美希+       | ff83137129b578d3c62b7fc2a984de58 |
| 3400710 | [才能無限大]星井美希        | 5ee38ca4a88f80c624feb7fb5cec0ba7 |
| 3500711 | [才能無限大]星井美希+       | 92102c96222350216184f02f45dc7d84 |
+---------+-----------------------------+----------------------------------+
```

## 注意事項

- 動作チェックが完了したらデフォルトのパスワードは変更してください。
- 既存のテーブルは一旦削除されるので、更新の際はバックアップを忘れずにとってください。
