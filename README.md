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

## 使い方

`ichd.js`を実行してください。

```console
$ node ichd.js
```

## 注意事項

- 動作チェックが完了したらデフォルトのパスワードは変更してください。
- 既存のテーブルは一旦削除されるので、更新の際はバックアップを忘れずにとってください。
